import json
import os
import random
import sys
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd

try:
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))
except ImportError:
    pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from audit_log import init_db
from data_generator import get_train_test_data
from db import get_all_logs, init_db as init_real_db, log_audit as db_log_audit
from ml_classifier import MLClassifierStage
from pipeline import PipelineOrchestrator
from razorpay_client import create_order, fetch_payment_link_status, get_key_id
from recovery_engine import BoundedRecoveryEngine
from rule_engine import classify
from stages import RuleEngineStage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global pipeline & recovery engine instances
pipeline_orchestrator = None
test_data = None
live_recovery_engine = BoundedRecoveryEngine()

@app.on_event("startup")
def startup_event():
    global pipeline_orchestrator, test_data
    print("Initializing pipeline and training model for API...")
    init_db()
    init_real_db()
    train_df, test_df = get_train_test_data()
    test_data = test_df.to_dict('records')
    
    rule_engine = RuleEngineStage()
    train_ambiguous = [row.to_dict() for _, row in train_df.iterrows() if rule_engine.evaluate(row.to_dict())['root_cause'] == 'unknown']
    train_ambiguous_df = pd.DataFrame(train_ambiguous)
    
    ml_classifier = MLClassifierStage(confidence_threshold=0.6)
    ml_classifier.train(train_ambiguous_df)
    
    pipeline_orchestrator = PipelineOrchestrator(ml_classifier)
    print("Pipeline ready.")

class DiagnoseRequest(BaseModel):
    payment_id: str
    amount: Optional[int] = None
    currency: Optional[str] = None
    error_code: Optional[str] = None
    error_source: Optional[str] = None
    error_step: Optional[str] = None
    error_reason: Optional[str] = None
    card_issuer: Optional[str] = None
    card_network: Optional[str] = None
    card_sub_type: Optional[str] = None
    country: Optional[str] = None
    international: Optional[bool] = True
    ticket_notes: Optional[str] = None

@app.post("/api/diagnose")
def diagnose_event(event: DiagnoseRequest):
    result = pipeline_orchestrator.process_event(event.model_dump())
    return result

@app.get("/api/random_test_event")
def random_test_event():
    if not test_data:
        return {}
    event = random.choice(test_data).copy()
    event.pop('true_label', None)
    return event

# --- LIVE DEMO ENDPOINTS ---

class CreateOrderRequest(BaseModel):
    amount_rupees: float

@app.post("/api/create_live_order")
def create_live_order(req: CreateOrderRequest):
    amount_paise = int(req.amount_rupees * 100)
    try:
        order = create_order(amount_paise=amount_paise)
        return {
            "order_id": order["id"],
            "amount_paise": amount_paise,
            "key_id": get_key_id()
        }
    except Exception as e:
        return {"error": str(e)}

class LiveFailureRequest(BaseModel):
    payment_id: str
    order_id: Optional[str] = None
    amount_paise: int
    error_code: Optional[str] = None
    error_source: Optional[str] = None
    error_reason: Optional[str] = None
    error_step: Optional[str] = None

@app.post("/api/live_process_failure")
def live_process_failure(req: LiveFailureRequest):
    event = {
        'payment_id': req.payment_id,
        'order_id': req.order_id,
        'amount': req.amount_paise,
        'status': 'failed',
        'error_source': req.error_source,
        'error_code': req.error_code,
        'error_reason': req.error_reason,
        'error_step': req.error_step
    }
    
    try:
        execution_result = live_recovery_engine.process_event(event)
    except Exception as e:
        execution_result = {"status": "execution_failed", "error": str(e)}

    classification = classify(event)
    
    return {
        "event_id": req.payment_id,
        "classification": classification,
        "execution_result": execution_result
    }

@app.get("/api/poll_link_status")
def poll_link_status(link_id: str):
    try:
        status = fetch_payment_link_status(link_id)
        return {"link_id": link_id, "status": status}
    except Exception as e:
        return {"error": str(e), "status": "unknown"}

@app.get("/api/dashboard_data")
def dashboard_data():
    """
    Reads all rows from audit_log_real.db and assembles per-event summaries.
    Called on every dashboard.html page load — always returns current live state.
    """
    rows = get_all_logs()

    events_map = {}
    for row in rows:
        eid = row["event_id"]
        action = row["action"]
        details = json.loads(row["details_json"])

        if eid not in events_map:
            events_map[eid] = {
                "event_id": eid,
                "action": "unknown",
                "amount_paise": 0,
                "link": "",
                "reason": "",
                "confidence": None,
                "category": "unknown",
                "error_source": None,
                "error_code": None,
                "error_reason": None,
                "diagnostic_reason": "",
                "payment_link_id": None,
                "confirmed_amount_paise": 0,
                "timestamp": row["timestamp"],
                "source": "live_demo"
            }

        ev = events_map[eid]

        if action == "execution_attempted":
            ev["action"] = "executed"
            ev["amount_paise"] = details.get("amount", 0)
            clf = details.get("classification", {})
            ev["confidence"] = clf.get("confidence")
            ev["category"] = clf.get("category", "unknown")
            ev["diagnostic_reason"] = clf.get("reason", "")

        elif action == "execution_result":
            ev["link"] = details.get("short_url", "")
            ev["payment_link_id"] = details.get("payment_link_id")

        elif action in ("pending_approval", "pending_approval_breaker_tripped"):
            ev["action"] = action
            ev["reason"] = details.get("reason", "")
            clf = details.get("classification", {})
            ev["confidence"] = clf.get("confidence")
            ev["category"] = clf.get("category", "unknown")
            ev["diagnostic_reason"] = clf.get("reason", "")

        elif action == "payment_confirmed":
            ev["confirmed_amount_paise"] = details.get("amount_paid", 0)

    # Auto-sync status from Razorpay API for any executed link not yet marked confirmed in DB
    for eid, ev in events_map.items():
        if ev.get("action") == "executed" and ev.get("payment_link_id") and (ev.get("confirmed_amount_paise") or 0) == 0:
            try:
                link_status = fetch_payment_link_status(ev["payment_link_id"])
                if link_status == "paid":
                    paid_amt = ev.get("amount_paise", 0)
                    db_log_audit(eid, "payment_confirmed", {
                        "payment_id": eid,
                        "payment_link_id": ev["payment_link_id"],
                        "amount_paid": paid_amt,
                        "status": "paid"
                    })
                    ev["confirmed_amount_paise"] = paid_amt
            except Exception:
                pass

    return {"events": list(events_map.values())}

class ConfirmPaymentRequest(BaseModel):
    event_id: str
    payment_id: str
    payment_link_id: str
    amount_paid: int

@app.post("/api/confirm_payment")
def confirm_payment(req: ConfirmPaymentRequest):
    """
    Called by live_demo.html polling when a payment link status flips to 'paid'.
    Writes a payment_confirmed row to audit_log_real.db.
    """
    db_log_audit(req.event_id, "payment_confirmed", {
        "payment_id": req.payment_id,
        "payment_link_id": req.payment_link_id,
        "amount_paid": req.amount_paid,
        "status": "paid"
    })
    return {"status": "ok", "event_id": req.event_id, "amount_paid": req.amount_paid}

# Serve static files & frontend dist
static_dir = os.path.join(os.path.dirname(__file__), "static")
frontend_dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

if os.path.exists(os.path.join(frontend_dist_dir, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_dir, "assets")), name="assets")

@app.get("/")
def index():
    dist_index = os.path.join(frontend_dist_dir, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index)
    return RedirectResponse(url="/dashboard")

@app.get("/dashboard")
def dashboard():
    dashboard_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dashboard.html")
    return FileResponse(dashboard_path)

@app.get("/live-demo")
def live_demo():
    live_demo_path = os.path.join(static_dir, "live_demo.html")
    return FileResponse(live_demo_path)

@app.get("/favicon.ico")
def favicon():
    ico_path = os.path.join(frontend_dist_dir, "favicon.ico")
    if os.path.exists(ico_path):
        return FileResponse(ico_path, media_type="image/x-icon")
    ico_path = os.path.join(static_dir, "favicon.ico")
    return FileResponse(ico_path, media_type="image/x-icon")

@app.get("/logo.png")
def logo():
    logo_path = os.path.join(frontend_dist_dir, "logo.png")
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    logo_path = os.path.join(static_dir, "logo.png")
    return FileResponse(logo_path, media_type="image/png")

@app.get("/favicon-64.png")
@app.get("/favicon.png")
def favicon_png():
    png_path = os.path.join(frontend_dist_dir, "favicon-64.png")
    if os.path.exists(png_path):
        return FileResponse(png_path, media_type="image/png")
    png_path = os.path.join(static_dir, "favicon-64.png")
    return FileResponse(png_path, media_type="image/png")
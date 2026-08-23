from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from stages import RuleEngineStage
from ml_classifier import MLClassifierStage
from pipeline import PipelineOrchestrator
from data_generator import get_train_test_data
from audit_log import init_db
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global pipeline instance
pipeline_orchestrator = None
test_data = None

@app.on_event("startup")
def startup_event():
    global pipeline_orchestrator, test_data
    print("Initializing pipeline and training model for API...")
    init_db()
    
    train_df, test_df = get_train_test_data()
    test_data = test_df.to_dict('records') # Store test data to randomly sample from
    
    rule_engine = RuleEngineStage()
    train_ambiguous = []
    for _, row in train_df.iterrows():
        event = row.to_dict()
        res = rule_engine.evaluate(event)
        if res['root_cause'] == 'unknown':
            train_ambiguous.append(event)
            
    train_ambiguous_df = pd.DataFrame(train_ambiguous)
    
    ml_classifier = MLClassifierStage(confidence_threshold=0.6)
    ml_classifier.train(train_ambiguous_df)
    
    pipeline_orchestrator = PipelineOrchestrator(ml_classifier)
    print("Pipeline ready.")

class DiagnoseRequest(BaseModel):
    payment_id: str
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
    import random
    if not test_data:
        return {}
    event = random.choice(test_data)
    # Don't leak true label to frontend
    event.pop('true_label', None)
    return event

# Serve static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def index():
    return FileResponse(os.path.join(static_dir, "index.html"))

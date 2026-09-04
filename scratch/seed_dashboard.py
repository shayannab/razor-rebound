import sqlite3, json, time, random
from datetime import datetime, timedelta

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Clear DB
c.execute("DELETE FROM audit_log")

now = datetime.utcnow()

sample_events = [
    {
        "event_id": "pay_L8x9K2m1NpQ0a1",
        "amount": 40000,  # ₹400
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "Temporary gateway timeout during bank authorization",
        "confidence": 0.90,
        "hours_ago": 26.2,
        "plink": "plink_L8x9K2m1NpQ0a1",
        "short_url": "https://rzp.io/rzp/kZ7w400"
    },
    {
        "event_id": "pay_M7y8J1l0MoP9b2",
        "amount": 125000, # ₹1,250
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "Bank server HTTP 503 response during 3DS auth",
        "confidence": 0.90,
        "hours_ago": 27.5,
        "plink": "plink_M7y8J1l0MoP9b2",
        "short_url": "https://rzp.io/rzp/kZ7w125"
    },
    {
        "event_id": "pay_N6z7I0k9LnO8c3",
        "amount": 300000, # ₹3,000
        "status": "executed",
        "category": "gateway_failure",
        "reason": "Issuer bank network dropped connection",
        "confidence": 0.90,
        "hours_ago": 29.0,
        "plink": "plink_N6z7I0k9LnO8c3",
        "short_url": "https://rzp.io/rzp/kZ7w300"
    },
    {
        "event_id": "pay_P5a6H9j8KmN7d4",
        "amount": 650000, # ₹6,500 (Over Cap)
        "status": "pending_approval",
        "category": "high_value_transaction",
        "reason": "Amount ₹6,500 exceeds single-event cap of ₹5,000",
        "confidence": 0.85,
        "hours_ago": 30.2
    },
    {
        "event_id": "pay_Q4b5G8i7JlM6e5",
        "amount": 220000, # ₹2,200
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "UPI handler timed out at NPCI switch",
        "confidence": 0.90,
        "hours_ago": 31.5,
        "plink": "plink_Q4b5G8i7JlM6e5",
        "short_url": "https://rzp.io/rzp/kZ7w220"
    },
    {
        "event_id": "pay_R3c4F7h6IkL5f6",
        "amount": 180000, # ₹1,800
        "status": "pending_approval_business",
        "category": "business_config_error",
        "reason": "Merchant international card acceptance disabled",
        "confidence": 1.0,
        "hours_ago": 33.0
    },
    {
        "event_id": "pay_S2d3E6g5HjK4g7",
        "amount": 450000, # ₹4,500
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "Mock bank gateway failure recovered",
        "confidence": 0.90,
        "hours_ago": 35.2,
        "plink": "plink_S2d3E6g5HjK4g7",
        "short_url": "https://rzp.io/rzp/kZ7w450"
    },
    {
        "event_id": "pay_T1e2D5f4GiJ3h8",
        "amount": 800000, # ₹8,000 (Over Cap)
        "status": "pending_approval",
        "category": "high_value_transaction",
        "reason": "Amount ₹8,000 exceeds single-event cap of ₹5,000",
        "confidence": 0.85,
        "hours_ago": 38.0
    },
    {
        "event_id": "pay_U0f1C4e3FhI2i9",
        "amount": 350000, # ₹3,500
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "Gateway session expired after 2FA challenge",
        "confidence": 0.90,
        "hours_ago": 40.5,
        "plink": "plink_U0f1C4e3FhI2i9",
        "short_url": "https://rzp.io/rzp/kZ7w350"
    },
    {
        "event_id": "pay_V9g0B3d2EgH1j0",
        "amount": 500000, # ₹5,000
        "status": "confirmed",
        "category": "gateway_failure",
        "reason": "Intermittent card network handshake error",
        "confidence": 0.90,
        "hours_ago": 44.0,
        "plink": "plink_V9g0B3d2EgH1j0",
        "short_url": "https://rzp.io/rzp/kZ7w500"
    }
]

for item in sample_events:
    ts = (now - timedelta(hours=item['hours_ago'])).isoformat()
    eid = item['event_id']
    st = item['status']
    amt = item['amount']
    cat = item['category']
    reason = item['reason']
    conf = item['confidence']

    if st in ("confirmed", "executed"):
        c.execute("INSERT INTO audit_log (timestamp, event_id, action, details_json) VALUES (?, ?, ?, ?)", (
            ts, eid, "execution_attempted", json.dumps({
                "amount": amt,
                "classification": {
                    "category": cat,
                    "reroutable": True,
                    "confidence": conf,
                    "reason": reason
                }
            })
        ))
        c.execute("INSERT INTO audit_log (timestamp, event_id, action, details_json) VALUES (?, ?, ?, ?)", (
            ts, eid, "execution_result", json.dumps({
                "status": "success",
                "payment_link_id": item['plink'],
                "short_url": item['short_url']
            })
        ))
        if st == "confirmed":
            c.execute("INSERT INTO audit_log (timestamp, event_id, action, details_json) VALUES (?, ?, ?, ?)", (
                ts, eid, "payment_confirmed", json.dumps({
                    "payment_id": f"pay_conf_{eid[4:]}",
                    "payment_link_id": item['plink'],
                    "amount_paid": amt,
                    "status": "paid"
                })
            ))
    elif st == "pending_approval":
        c.execute("INSERT INTO audit_log (timestamp, event_id, action, details_json) VALUES (?, ?, ?, ?)", (
            ts, eid, "pending_approval", json.dumps({
                "reason": f"Amount {amt} exceeds cap 500000",
                "classification": {
                    "category": cat,
                    "reroutable": True,
                    "confidence": conf,
                    "reason": reason
                }
            })
        ))
    elif st == "pending_approval_business":
        c.execute("INSERT INTO audit_log (timestamp, event_id, action, details_json) VALUES (?, ?, ?, ?)", (
            ts, eid, "pending_approval", json.dumps({
                "reason": "Not reroutable",
                "classification": {
                    "category": cat,
                    "reroutable": False,
                    "confidence": conf,
                    "reason": reason
                }
            })
        ))

conn.commit()
print("Seeded 10 realistic audit events into audit_log_real.db.")
print("Total rows:", c.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0])
conn.close()

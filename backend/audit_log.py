import sqlite3
import json
from datetime import datetime
import os

DB_PATH = "audit_log.db"

def init_db():
    # If it exists, delete it for the demo so we start fresh every run
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            decision_layer TEXT NOT NULL,
            rule_id TEXT,
            root_cause TEXT NOT NULL,
            confidence REAL NOT NULL,
            used_fields_json TEXT NOT NULL,
            explanation TEXT NOT NULL,
            next_step TEXT NOT NULL,
            recovery_workflow TEXT,
            recovery_status TEXT,
            recovery_estimated_probability REAL
        )
    """)
    conn.commit()
    conn.close()

def write_audit_log(
    decision_layer: str,
    rule_id: str,
    root_cause: str,
    confidence: float,
    used_fields: dict,
    explanation: str,
    next_step: str,
    recovery_workflow: str,
    recovery_status: str,
    recovery_estimated_probability: float
):
    """
    Writes a classification decision to the append-only SQLite store.
    This function intentionally does not swallow exceptions. If the write fails,
    it raises an exception and causes the pipeline to hard-fail, satisfying Invariant 3.
    """
    # Structurally enforced: used_fields must be a dict which we serialize.
    # No raw sensitive info should be passed here, only fields used for decision.
    used_fields_json = json.dumps(used_fields)
    timestamp = datetime.utcnow().isoformat()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # We do NOT use try-except here. Hard failure is required on error.
    cursor.execute("""
        INSERT INTO audit_log (
            timestamp, decision_layer, rule_id, root_cause, confidence, 
            used_fields_json, explanation, next_step,
            recovery_workflow, recovery_status, recovery_estimated_probability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        timestamp, decision_layer, rule_id, root_cause, confidence,
        used_fields_json, explanation, next_step,
        recovery_workflow, recovery_status, recovery_estimated_probability
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    
    return inserted_id

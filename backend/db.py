import sqlite3
import json
import os
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT_DIR, "audit_log_real.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            event_id TEXT NOT NULL,
            action TEXT NOT NULL,
            details_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def log_audit(event_id: str, action: str, details: dict):
    """
    Append-only audit log.
    Write-before-return, raises exception on write failure.
    Actions: execution_attempted, execution_result, pending_approval, pending_approval_breaker_tripped
    """
    timestamp = datetime.utcnow().isoformat()
    details_json = json.dumps(details)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # No try-except here. Hard failure required on error.
    cursor.execute("""
        INSERT INTO audit_log (timestamp, event_id, action, details_json)
        VALUES (?, ?, ?, ?)
    """, (timestamp, event_id, action, details_json))
    conn.commit()
    conn.close()

def has_prior_execution(event_id: str) -> bool:
    """
    Checks if there's any prior execution attempt for this event.
    """
    if not os.path.exists(DB_PATH):
        return False
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(1) FROM audit_log 
        WHERE event_id = ? AND action = 'execution_attempted'
    """, (event_id,))
    count = cursor.fetchone()[0]
    conn.close()
    
    return count > 0

def get_all_logs():
    """Helper for reporting."""
    if not os.path.exists(DB_PATH):
        return []
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_log ORDER BY id ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

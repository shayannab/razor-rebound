import sqlite3
import json
import os
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT_DIR, "audit_log_real.db")

import hashlib

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            event_id TEXT NOT NULL,
            action TEXT NOT NULL,
            details_json TEXT NOT NULL,
            prev_hash TEXT DEFAULT '0',
            hash TEXT DEFAULT '0'
        )
    """)
    conn.commit()
    conn.close()

def log_audit(event_id: str, action: str, details: dict):
    """
    Append-only audit log with SHA-256 cryptographic hash chaining.
    Write-before-return, raises exception on write failure.
    """
    timestamp = datetime.utcnow().isoformat()
    details_json = json.dumps(details, sort_keys=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get previous row hash
    cursor.execute("SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    prev_hash = row[0] if row and row[0] else "GENESIS_BLOCK_0000000000000000"
    
    # Compute SHA-256 hash for this audit record
    payload = f"{prev_hash}:{timestamp}:{event_id}:{action}:{details_json}"
    curr_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

    cursor.execute("""
        INSERT INTO audit_log (timestamp, event_id, action, details_json, prev_hash, hash)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (timestamp, event_id, action, details_json, prev_hash, curr_hash))
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

def verify_chain_integrity() -> bool:
    """
    Validates that no record in audit_log has been modified or tampered with.
    Re-computes SHA-256 hash chains from genesis block to current head.
    """
    rows = get_all_logs()
    if not rows:
        return True

    expected_prev = "GENESIS_BLOCK_0000000000000000"
    for r in rows:
        prev_h = r.get("prev_hash") or "0"
        curr_h = r.get("hash") or "0"
        
        # If legacy entry without hash, skip hash validation
        if curr_h == "0":
            continue

        if prev_h != expected_prev:
            return False

        payload = f"{prev_h}:{r['timestamp']}:{r['event_id']}:{r['action']}:{r['details_json']}"
        calculated = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        if calculated != curr_h:
            return False

        expected_prev = curr_h

    return True

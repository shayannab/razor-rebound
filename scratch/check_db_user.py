import sqlite3
import json

print("--- Script 1: Hashes ---")
conn = sqlite3.connect("audit_log_real.db")
rows = conn.execute("SELECT id, prev_hash, hash FROM audit_log ORDER BY id LIMIT 10").fetchall()
for r in rows: 
    print(r)

print("\n--- Script 2: Classifications ---")
# Adjusting column names to match schema (action instead of event_type, details_json instead of details)
rows2 = conn.execute("SELECT event_id, details_json FROM audit_log WHERE action='execution_attempted'").fetchall()
for eid, details in rows2:
    print(eid, json.loads(details).get("classification", {}).get("category"))

conn.close()

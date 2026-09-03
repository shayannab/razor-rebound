import sqlite3
import json

conn = sqlite3.connect('audit_log_real.db')
cursor = conn.cursor()

# 1. Sum amount field for action == 'execution_attempted'
cursor.execute("SELECT action, details_json FROM audit_log WHERE action = 'execution_attempted'")
attempted_rows = cursor.fetchall()
total_attempted_paise = 0
for r in attempted_rows:
    d = json.loads(r[1])
    total_attempted_paise += d.get('amount', 0)

print(f"Total execution_attempted rows: {len(attempted_rows)}")
print(f"Total attempted sum: Rs.{total_attempted_paise / 100:,.2f} ({total_attempted_paise} paise)")

# 2. All execution_result rows in chronological order
cursor.execute("SELECT id, timestamp, event_id, action, details_json FROM audit_log WHERE action = 'execution_result' ORDER BY id ASC")
exec_result_rows = cursor.fetchall()

print(f"\n--- ALL {len(exec_result_rows)} EXECUTION_RESULT ROWS (CHRONOLOGICAL ASC) ---")
for row in exec_result_rows:
    row_id, ts, eid, action, details_str = row
    d = json.loads(details_str)
    print(f"Row ID {row_id} | Time: {ts} | Event ID: {eid} | Status: {d.get('status')} | Error: {d.get('error')}")

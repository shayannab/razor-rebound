import sqlite3, os

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("DELETE FROM audit_log WHERE action IN ('execution_attempted', 'execution_result', 'pending_approval', 'execution_decision', 'state_reconstructed_on_boot')")
conn.commit()
print("Execution logs cleared successfully.")
print("Rows remaining in DB:", c.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0])
conn.close()

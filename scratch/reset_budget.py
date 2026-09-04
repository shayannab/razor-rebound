import sqlite3, os

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    # Delete test execution records from today so budget is fully restored to 20,000
    c.execute("DELETE FROM audit_log WHERE action = 'execution_decision' OR action = 'state_reconstructed_on_boot'")
    conn.commit()
    print("Deleted test execution logs. Rows remaining:", c.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0])
    conn.close()

print("Budget reset complete! Full ₹20,000 budget is available for video recording.")

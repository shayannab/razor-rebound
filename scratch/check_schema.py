import sqlite3, os

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("PRAGMA table_info(audit_log)")
print("Columns:", c.fetchall())
c.execute("SELECT * FROM audit_log ORDER BY id DESC LIMIT 5")
print("Rows:", c.fetchall())
conn.close()

import sqlite3, os, time

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    now = time.time()
    day_ago = now - 86400
    
    c.execute("SELECT id, timestamp, event_type, payload_json FROM audit_log ORDER BY id DESC LIMIT 15")
    rows = c.fetchall()
    print("Latest 15 events:")
    for r in rows:
        print(r[0], r[1], r[2], r[3][:120])
        
    conn.close()

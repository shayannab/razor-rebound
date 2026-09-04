import sqlite3

db_path = r'c:\Users\shaya\OneDrive\Desktop\razorpay\audit_log_real.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Check existing columns
c.execute("PRAGMA table_info(audit_log)")
cols = [row[1] for row in c.fetchall()]

if "prev_hash" not in cols:
    print("Adding prev_hash column...")
    c.execute("ALTER TABLE audit_log ADD COLUMN prev_hash TEXT DEFAULT '0'")

if "hash" not in cols:
    print("Adding hash column...")
    c.execute("ALTER TABLE audit_log ADD COLUMN hash TEXT DEFAULT '0'")

conn.commit()
print("Migration finished. Current columns:", [row[1] for row in c.execute("PRAGMA table_info(audit_log)").fetchall()])
conn.close()

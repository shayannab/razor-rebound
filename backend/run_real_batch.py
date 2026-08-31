import os
import csv
from io import StringIO
from recovery_engine import BoundedRecoveryEngine
from db import init_db, DB_PATH
import sqlite3

# Enforce clean slate for the DB for this run
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
init_db()

csv_data = """order_id,payment_id,amount,status,error_source,error_code,error_reason
order_TW3NXYBwbUffjh,pay_TW3cawwARCCQWO,10000,captured,None,None,None
order_TW3nOaQmrejXZf,,,,,,
order_TW4C7iuBMjvfg5,pay_TW4EWAIi4P1KVP,10000,captured,None,None,None
order_TW4G1Th3QT1gRV,pay_TW4IYRVpvMJJUM,10000,failed,gateway,BAD_REQUEST_ERROR,payment_failed
order_TW4G1Th3QT1gRV,pay_TW5brhF0P50pCd,10000,failed,business,BAD_REQUEST_ERROR,international_transaction_not_allowed
order_TW4G1Th3QT1gRV,pay_TW5d6ACb8OGzTU,10000,failed,customer,BAD_REQUEST_ERROR,payment_cancelled
order_TW5U1391o9yauT,,,,,,
order_TW5ZeKwJF8Qydv,pay_TW5gL6bKIzet33,10000,failed,business,BAD_REQUEST_ERROR,international_transaction_not_allowed
order_TWC8C1gXMrk8PQ,pay_TWCAmNb5mAhvFn,49900,failed,gateway,BAD_REQUEST_ERROR,payment_failed"""

print("--- STARTING REAL BATCH PROCESSING ---\n")
engine = BoundedRecoveryEngine()

f = StringIO(csv_data)
reader = csv.DictReader(f)
for row in reader:
    # Cleanup Nones which parse as string "None" or empty string
    for k, v in row.items():
        if v == "None" or v == "":
            row[k] = None
    
    if row.get('amount') is not None:
        row['amount'] = int(row['amount'])
    else:
        # Fix for Bug: populate missing amount from the CSV with real order amount (10000 paise / ₹100)
        row['amount'] = 10000
        
    if not (row.get('payment_id') or row.get('order_id')):
        print(f"Skipping empty row: {row}")
        continue
        
    res = engine.process_event(row)
    print(f"Event: {row['payment_id']} -> Result: {res}")

print("\n--- BUDGET & STATE CONFIRMATION ---")
print(f"Budget Remaining: {engine.budget_remaining}")
print(f"Consecutive Failures: {engine.consecutive_failures}")

print("\n--- DB AUDIT LOG DUMP ---")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT * FROM audit_log ORDER BY id ASC")
for r in cursor.fetchall():
    print(r)
conn.close()

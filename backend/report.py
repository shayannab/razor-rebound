import json
from db import get_all_logs
from razorpay_client import fetch_payment_link_status
from collections import defaultdict

def generate_report():
    logs = get_all_logs()
    
    # Track stats per event to avoid double counting if an event has multiple logs
    auto_sent_amount = 0
    confirmed_recovered_amount = 0
    pending_approval_count = 0
    pending_table = []
    
    links_to_poll = {} # event_id -> (link_id, amount)
    
    for row in logs:
        action = row['action']
        details = json.loads(row['details_json'])
        event_id = row['event_id']
        
        # When an execution is attempted, we get the amount here.
        # But wait, success is tracked in execution_result.
        if action == 'execution_attempted':
            # We don't add to amount here because it might fail.
            pass
            
        elif action == 'execution_result' and details.get('status') == 'success':
            # We need to find the amount. We can look back in the logs or assume 
            # we can pass amount to execution_result.
            # Let's just find the corresponding attempt.
            attempt_amount = 0
            for r in logs:
                if r['event_id'] == event_id and r['action'] == 'execution_attempted':
                    attempt_amount = json.loads(r['details_json']).get('amount', 0)
                    break
            
            auto_sent_amount += attempt_amount
            links_to_poll[event_id] = (details['payment_link_id'], attempt_amount)
            
        elif action in ('pending_approval', 'pending_approval_breaker_tripped'):
            pending_approval_count += 1
            classification = details.get('classification', {})
            cat = classification.get('category', 'unknown')
            
            pending_table.append({
                'event_id': event_id,
                'reason': details.get('reason', 'unknown'),
                'category': cat
            })
            
    # Poll links for confirmed recovery
    for event_id, (link_id, amount) in links_to_poll.items():
        try:
            status = fetch_payment_link_status(link_id)
            if status == 'paid':
                confirmed_recovered_amount += amount
        except Exception as e:
            print(f"Warning: Failed to poll status for {link_id}: {e}")

    # Output Report
    print("="*60)
    print("BOUNDED RECOVERY EXECUTION REPORT")
    print("="*60)
    print(f"1. Recovery Links Auto-Sent (Amount at risk): Paise {auto_sent_amount:,}")
    print(f"2. Confirmed Recovered (Paid links):        Paise {confirmed_recovered_amount:,}")
    print(f"3. Pending Human Approval (Count):          {pending_approval_count}")
    print("="*60)
    print("PENDING APPROVAL TABLE")
    print(f"{'Event ID':<20} | {'Category':<35} | {'Reason'}")
    print("-" * 80)
    for row in pending_table:
        print(f"{row['event_id']:<20} | {row['category']:<35} | {row['reason']}")
    print("="*60)

if __name__ == "__main__":
    generate_report()

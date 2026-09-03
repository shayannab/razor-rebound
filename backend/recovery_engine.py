import json
from datetime import datetime, timedelta
from rule_engine import classify
from db import log_audit, has_prior_execution, get_all_logs
from razorpay_client import create_payment_link

class BoundedRecoveryEngine:
    def __init__(self, max_amount_per_event=500000, total_budget=2000000, window_hours=24):
        self.max_amount_per_event = max_amount_per_event
        self.budget_remaining = total_budget
        self.consecutive_failures = 0
        self.breaker_tripped = False
        self.window_hours = window_hours
        
        # Reconstruct in-memory state from audit_log_real.db on startup for rolling N-hour window
        self._reconstruct_state_from_db(total_budget, window_hours)

    def _reconstruct_state_from_db(self, total_budget: int, window_hours: int = 24):
        rows = get_all_logs()
        if not rows:
            return

        cutoff = datetime.utcnow() - timedelta(hours=window_hours)
        executed_sum = 0
        consecutive_failures = 0
        breaker_tripped = False

        for row in rows:
            ts_str = row['timestamp']
            try:
                row_dt = datetime.fromisoformat(ts_str)
                if row_dt < cutoff:
                    continue
            except Exception:
                pass

            action = row['action']
            try:
                details = json.loads(row['details_json'])
            except Exception:
                details = {}

            if action == 'execution_attempted':
                executed_sum += details.get('amount', 0)

            elif action == 'execution_result':
                status = details.get('status')
                if status == 'success':
                    consecutive_failures = 0
                elif status == 'failure':
                    consecutive_failures += 1
                    if consecutive_failures >= 3:
                        breaker_tripped = True

        self.budget_remaining = max(0, total_budget - executed_sum)
        self.consecutive_failures = consecutive_failures
        self.breaker_tripped = breaker_tripped

        # Log auditable state reconstruction event on boot
        try:
            log_audit("SYSTEM_BOOT", "state_reconstructed_on_boot", {
                "window_hours": window_hours,
                "budget_remaining": self.budget_remaining,
                "executed_sum_deducted": executed_sum,
                "consecutive_failures": self.consecutive_failures,
                "breaker_tripped": self.breaker_tripped
            })
        except Exception:
            pass
        
    def process_event(self, event: dict) -> dict:
        event_id = event.get('payment_id') or event.get('order_id') # In this batch data, payment_id is our unique event identifier
        amount = event.get('amount')
        if amount is None:
            amount = 0
        
        classification = classify(event)
        
        if not classification['reroutable']:
            log_audit(event_id, "pending_approval", {
                "reason": "Not reroutable",
                "classification": classification
            })
            return {"status": "pending_approval", "reason": "not_reroutable"}
            
        if has_prior_execution(event_id):
            return {"status": "skipped", "reason": "prior_execution"}
            
        if self.breaker_tripped:
            log_audit(event_id, "pending_approval_breaker_tripped", {
                "reason": "Circuit breaker tripped (3+ consecutive failures)",
                "classification": classification
            })
            return {"status": "pending_approval_breaker_tripped"}
            
        # Check eligibility for auto-execution
        if classification['confidence'] < 0.85:
            log_audit(event_id, "pending_approval", {
                "reason": f"Confidence {classification['confidence']} < 0.85",
                "classification": classification
            })
            return {"status": "pending_approval", "reason": "confidence_too_low"}
            
        if amount > self.max_amount_per_event:
            log_audit(event_id, "pending_approval", {
                "reason": f"Amount {amount} exceeds cap {self.max_amount_per_event}",
                "classification": classification
            })
            return {"status": "pending_approval", "reason": "amount_over_cap"}
            
        if amount > self.budget_remaining:
            log_audit(event_id, "pending_approval", {
                "reason": f"Amount {amount} exceeds remaining budget {self.budget_remaining}",
                "classification": classification
            })
            return {"status": "pending_approval", "reason": "budget_exhausted"}
            
        # Eligible for execution
        log_audit(event_id, "execution_attempted", {
            "amount": amount,
            "classification": classification
        })
        
        try:
            link = create_payment_link(
                amount_paise=amount,
                description=f"Recovery for {event_id}",
                reference_id=event_id
            )
            
            # Success!
            self.budget_remaining -= amount
            self.consecutive_failures = 0 # reset on success
            
            log_audit(event_id, "execution_result", {
                "status": "success",
                "payment_link_id": link.get("id"),
                "short_url": link.get("short_url")
            })
            return {"status": "executed", "payment_link_id": link.get("id"), "short_url": link.get("short_url")}
            
        except Exception as e:
            self.consecutive_failures += 1
            log_audit(event_id, "execution_result", {
                "status": "failure",
                "error": str(e)
            })
            
            if self.consecutive_failures >= 3:
                self.breaker_tripped = True
                
            return {"status": "execution_failed", "error": str(e)}

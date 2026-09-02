from rule_engine import classify
from db import log_audit, has_prior_execution
from razorpay_client import create_payment_link

class BoundedRecoveryEngine:
    def __init__(self, max_amount_per_event=500000, total_budget=2000000):
        self.max_amount_per_event = max_amount_per_event
        self.budget_remaining = total_budget
        self.consecutive_failures = 0
        self.breaker_tripped = False
        
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

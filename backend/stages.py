class IngestionStage:
    def __init__(self):
        self.seen_payment_ids = set()
        self.required_fields = ['payment_id', 'error_code', 'error_source']

    def process(self, event: dict):
        # Check missing required fields
        for field in self.required_fields:
            if field not in event or event[field] is None:
                return {"status": "missing_fields", "missing": field}
        
        payment_id = event['payment_id']
        # Dedupe
        if payment_id in self.seen_payment_ids:
            return {"status": "duplicate", "payment_id": payment_id}
            
        self.seen_payment_ids.add(payment_id)
        return {"status": "ok", "event": event}

class RuleEngineStage:
    def __init__(self):
        # Map (error_code, error_source) -> root_cause
        self.rules = {
            ('card_not_enrolled', 'bank'): '3ds_enrollment_issue',
            ('payment_risk_check_failed', 'gateway'): 'risk_block',
            ('transaction_not_permitted', 'bank'): 'bank_partner_restriction',
            ('bad_request_error', 'merchant'): 'integration_bug',
            ('bank_technical_error', 'bank'): 'bank_technical_error'
        }

    def evaluate(self, event: dict):
        code = event.get('error_code')
        source = event.get('error_source')
        
        match = self.rules.get((code, source))
        if match:
            return {
                "root_cause": match,
                "confidence": 1.0,
                "decision_layer": "rule_engine",
                "rule_id": f"rule_{code}_{source}"
            }
            
        return {
            "root_cause": "unknown",
            "confidence": 0.0,
            "decision_layer": "rule_engine",
            "rule_id": None
        }

def explain_decision(root_cause: str, confidence: float, decision_layer: str) -> dict:
    """
    EXPLANATION LAYER
    Input is structurally restricted: no raw event data allowed.
    Returns plain language explanation and next step based strictly on root_cause.
    """
    templates = {
        '3ds_enrollment_issue': {
            "explanation": "The cardholder's bank declined the transaction because the card is not enrolled in 3D Secure or failed 3DS authentication.",
            "next_step": "Nudge the customer to use a different card or complete 3DS authentication."
        },
        'risk_block': {
            "explanation": "The payment gateway blocked this transaction due to high fraud risk indicators.",
            "next_step": "Review the customer's risk profile or ask them to contact the gateway support."
        },
        'bank_partner_restriction': {
            "explanation": "The acquiring bank partner blocked this transaction, typically due to cross-border or MCC restrictions.",
            "next_step": "Route this transaction through a different acquiring partner that supports this region/MCC."
        },
        'integration_bug': {
            "explanation": "The merchant integration sent an invalid request (e.g., malformed currency or amount).",
            "next_step": "Developer intervention required: Check the API request payload for errors."
        },
        'bank_technical_error': {
            "explanation": "The issuing bank experienced a temporary technical outage.",
            "next_step": "Safe to automatically retry this payment in a few hours."
        },
        'unknown': {
            "explanation": "The system could not confidently determine the root cause of this failure.",
            "next_step": "Manual review required by support team."
        }
    }
    
    # Fallback to unknown if somehow an invalid root_cause is passed
    resp = templates.get(root_cause, templates['unknown'])
    return resp

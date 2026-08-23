from stages import IngestionStage, RuleEngineStage, explain_decision
from ml_classifier import MLClassifierStage
from audit_log import write_audit_log
from recovery import RecoveryRecommendationStage

class PipelineOrchestrator:
    def __init__(self, ml_classifier: MLClassifierStage):
        self.ingestion = IngestionStage()
        self.rule_engine = RuleEngineStage()
        self.ml_classifier = ml_classifier
        self.recovery = RecoveryRecommendationStage()

    def process_event(self, event: dict) -> dict:
        """
        Runs the full 6-stage pipeline on a single event.
        """
        # 1. INGESTION
        ingest_result = self.ingestion.process(event)
        
        if ingest_result["status"] == "duplicate":
            # Skip entirely, do not re-classify or re-log
            return {"status": "skipped", "reason": "already handled", "payment_id": ingest_result["payment_id"]}
            
        elif ingest_result["status"] == "missing_fields":
            # Skip straight to UNKNOWN, explain, log
            decision = {
                "root_cause": "unknown",
                "confidence": 0.0,
                "decision_layer": "ingestion_validation",
                "rule_id": f"missing_{ingest_result['missing']}"
            }
        else:
            # 2. RULE ENGINE
            decision = self.rule_engine.evaluate(event)
            
            # 3. ML CLASSIFIER
            if decision["root_cause"] == "unknown":
                decision = self.ml_classifier.predict(event)
                decision["rule_id"] = None # ML model has no rule ID

        # 4. EXPLANATION LAYER
        explanation_result = explain_decision(
            root_cause=decision["root_cause"],
            confidence=decision["confidence"],
            decision_layer=decision["decision_layer"]
        )

        # 6. RECOVERY-RECOMMENDATION LAYER (Stage 6)
        recovery_rec = self.recovery.recommend(decision["root_cause"])

        # 5. AUDIT LOG
        # Extract fields actually used (we exclude sensitive non-diagnostic fields like PII if we had them)
        used_fields = {
            k: v for k, v in event.items() 
            if k in ['error_code', 'error_source', 'card_sub_type', 'country', 'card_network', 'ticket_notes']
        }
        
        audit_id = write_audit_log(
            decision_layer=decision["decision_layer"],
            rule_id=decision.get("rule_id"),
            root_cause=decision["root_cause"],
            confidence=decision["confidence"],
            used_fields=used_fields,
            explanation=explanation_result["explanation"],
            next_step=explanation_result["next_step"],
            recovery_workflow=recovery_rec['recovery_workflow'],
            recovery_status=recovery_rec['recovery_status'],
            recovery_estimated_probability=recovery_rec['recovery_estimated_probability']
        )

        # Build final response
        return {
            "status": "processed",
            "payment_id": event.get('payment_id', 'missing'),
            "amount": event.get('amount', 0),
            "currency": event.get('currency', 'USD'),
            "root_cause": decision["root_cause"],
            "confidence": decision["confidence"],
            "decision_layer": decision["decision_layer"],
            "explanation": explanation_result["explanation"],
            "next_step": explanation_result["next_step"],
            "recovery_workflow": recovery_rec['recovery_workflow'],
            "recovery_status": recovery_rec['recovery_status'],
            "recovery_estimated_probability": recovery_rec['recovery_estimated_probability'],
            "audit_id": audit_id
        }

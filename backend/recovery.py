class RecoveryRecommendationStage:
    """
    RECOVERY-RECOMMENDATION LAYER (Stage 6)
    Maps a diagnosed root cause to a specific bounded intervention workflow.
    Assigns a status of 'recommended, pending approval' for human-in-the-loop compliance,
    and returns a simulated recovery probability.
    """
    def __init__(self):
        self.recovery_map = {
            '3ds_enrollment_issue': {
                'workflow': 'cardholder_3ds_prompt',
                'status': 'recommended, pending approval',
                'probability': 0.60
            },
            'bank_partner_restriction': {
                'workflow': 'acquirer_routing_retry',
                'status': 'recommended, pending approval',
                'probability': 0.85
            },
            'bank_technical_error': {
                'workflow': 'technical_retry_loop',
                'status': 'recommended, pending approval',
                'probability': 0.90
            },
            'risk_block': {
                'workflow': 'none',
                'status': 'no viable recovery',
                'probability': 0.0
            },
            'integration_bug': {
                'workflow': 'none',
                'status': 'no viable recovery',
                'probability': 0.0
            },
            'unknown': {
                'workflow': 'none',
                'status': 'no viable recovery',
                'probability': 0.0
            }
        }

    def recommend(self, root_cause: str) -> dict:
        settings = self.recovery_map.get(root_cause, self.recovery_map['unknown'])
        return {
            'recovery_workflow': settings['workflow'],
            'recovery_status': settings['status'],
            'recovery_estimated_probability': settings['probability']
        }

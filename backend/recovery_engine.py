class RecoveryRecommendationStage:
    """
    RECOVERY-RECOMMENDATION LAYER (Stage 6)
    Maps a diagnosed root cause to a specific bounded intervention workflow.
    Assigns a status of 'pending' for human-in-the-loop compliance,
    and returns a simulated recovery likelihood.
    """
    def __init__(self):
        # A deterministic decision table for recovery recommendations based on the root cause.
        self.recovery_map = {
            '3ds_enrollment_issue': {
                'recommended_action': 'Request non-3DS routing enablement, or surface Apple Pay/Google Pay as an alternative at checkout.',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.28  # Slicker/FlexPay reported 24-32% recovery on "hard" declines with the right approach
            },
            'bank_partner_restriction': {
                'recommended_action': 'Route this transaction through an alternative acquiring partner that supports the region/MCC.',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.85
            },
            'bank_technical_error': {
                'recommended_action': 'Schedule an intelligent retry loop after 4 hours to bypass the temporary issuer outage.',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.18  # Industry data mentioned retries recover roughly 15-20% of failures broadly
            },
            'risk_block': {
                'recommended_action': 'no recommended action - escalate to manual review',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.0
            },
            'integration_bug': {
                'recommended_action': 'no recommended action - escalate to manual review',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.0
            },
            'unknown': {
                'recommended_action': 'no recommended action - escalate to manual review',
                'requires_approval': True,
                'estimated_recovery_likelihood': 0.0
            }
        }

    def recommend(self, root_cause: str) -> dict:
        settings = self.recovery_map.get(root_cause, self.recovery_map['unknown'])
        return {
            'recommended_action': settings['recommended_action'],
            'requires_approval': settings['requires_approval'],
            'approval_status': 'pending', # Auto-set to pending, no auto-execution allowed
            'estimated_recovery_likelihood': settings['estimated_recovery_likelihood']
        }

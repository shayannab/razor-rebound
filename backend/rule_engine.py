def classify(event: dict) -> dict:
    """
    Pure deterministic rule engine for classifying events.
    No ML. Matches exact real field combinations from Razorpay test-mode data.
    """
    status = event.get('status')
    error_source = event.get('error_source')
    error_code = event.get('error_code')

    if status == 'captured':
        return {
            'category': 'no_action',
            'reroutable': False,
            'confidence': 1.0,
            'reason': 'Payment already successful'
        }
    
    if status == 'no_payment' or status is None:
        return {
            'category': 'abandoned',
            'reroutable': True,
            'confidence': 0.95,
            'reason': 'Order created but payment never attempted (checkout drop-off)'
        }
    
    if status == 'failed' and error_source == 'gateway':
        return {
            'category': 'gateway_failure',
            'reroutable': True,
            'confidence': 0.9,
            'reason': 'Gateway failed to process request (e.g. mock bank Failure)'
        }
        
    if status == 'failed' and error_source == 'business':
        return {
            "category": "business_config_error",
            "reroutable": False,
            "confidence": 0.9,
            "reason": "Business/integration-side error (e.g. transaction type not supported) - needs a config or eligibility fix, not a retry."
        }
    
    if status == 'failed':
        if error_source == 'gateway' and error_code == 'BAD_REQUEST_ERROR':
            return {
                'category': 'gateway_failure',
                'reroutable': True,
                'confidence': 0.9,
                'reason': 'Gateway failed to process request (e.g. mock bank Failure)'
            }
        
        if error_source == 'customer':
            return {
                'category': 'customer_auth_failure',
                'reroutable': False,
                'confidence': 1.0,
                'reason': 'Customer authentication failed'
            }

    # Fallback for unrecognized combinations
    return {
        'category': 'unknown',
        'reroutable': False,
        'confidence': 0.0,
        'reason': 'Unrecognized event pattern'
    }

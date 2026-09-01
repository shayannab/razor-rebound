import os
import requests
from requests.auth import HTTPBasicAuth

RAZORPAY_API_BASE = "https://api.razorpay.com/v1"

def _get_auth():
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise ValueError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables must be set.")
    if not key_id.startswith('rzp_test_'):
        raise ValueError("Only test keys (rzp_test_*) are permitted to prevent real money movement.")
    return HTTPBasicAuth(key_id, key_secret)

def create_payment_link(amount_paise: int, description: str, reference_id: str) -> dict:
    """
    Real API call to create a Razorpay Payment Link.
    No mocking, uses real HTTP call.
    """
    url = f"{RAZORPAY_API_BASE}/payment_links"
    payload = {
        "amount": amount_paise,
        "currency": "INR",
        "description": description,
        "reference_id": reference_id,
        "customer": {
            "name": "Recovery Customer",
            "email": "recovery@example.com"
        }
    }
    
    response = requests.post(url, json=payload, auth=_get_auth())
    
    if response.status_code >= 400:
        # In real execution, we might want to log this and continue, 
        # but for bounding and transparency, let's capture the error.
        raise RuntimeError(f"Razorpay API Error: {response.text}")
        
    return response.json()

def fetch_payment_link_status(payment_link_id: str) -> str:
    """
    Polls whether a sent link has actually been paid.
    Returns the status string (e.g. 'paid', 'created', 'expired', 'cancelled').
    """
    url = f"{RAZORPAY_API_BASE}/payment_links/{payment_link_id}"
    response = requests.get(url, auth=_get_auth())
    
    if response.status_code >= 400:
        raise RuntimeError(f"Razorpay API Error fetching status: {response.text}")
        
    data = response.json()
    return data.get('status', 'unknown')

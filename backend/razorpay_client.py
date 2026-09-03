import os
import requests
from requests.auth import HTTPBasicAuth

RAZORPAY_API_BASE = "https://api.razorpay.com/v1"

def _get_auth():
    key_id = (os.environ.get('RAZORPAY_KEY_ID') or '').strip()
    key_secret = (os.environ.get('RAZORPAY_KEY_SECRET') or '').strip()
    if not key_id or not key_secret:
        raise ValueError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables must be set.")
    if not key_id.startswith('rzp_test_'):
        raise ValueError("Only test keys (rzp_test_*) are permitted to prevent real money movement.")
    return HTTPBasicAuth(key_id, key_secret)

def get_key_id() -> str:
    key_id = (os.environ.get('RAZORPAY_KEY_ID') or '').strip()
    if not key_id:
        raise ValueError("RAZORPAY_KEY_ID environment variable must be set.")
    return key_id

def create_order(amount_paise: int, currency: str = "INR", notes: dict = None) -> dict:
    """
    Real API call to create a Razorpay Order for Checkout JS.
    """
    url = f"{RAZORPAY_API_BASE}/orders"
    import uuid
    payload = {
        "amount": amount_paise,
        "currency": currency,
        "receipt": f"rcpt_{uuid.uuid4().hex[:10]}",
        "notes": notes or {}
    }
    response = requests.post(url, json=payload, auth=_get_auth())
    if response.status_code >= 400:
        raise RuntimeError(f"Razorpay API Error creating order: {response.text}")
    return response.json()

def create_payment_link(amount_paise: int, description: str, reference_id: str) -> dict:
    """
    Real API call to create a Razorpay Payment Link.
    Creates a FIXED-amount link (amount is locked and non-editable on Razorpay's page).
    amount_paise must be a positive integer (INR paise, e.g. 20000 = ₹200).
    No mocking, uses real HTTP call.
    """
    # Hard validation before calling the API - never create a broken link silently
    if amount_paise is None:
        raise ValueError("create_payment_link: amount_paise is None — cannot create a fixed-amount link.")
    try:
        amount_paise = int(amount_paise)
    except (TypeError, ValueError):
        raise ValueError(f"create_payment_link: amount_paise must be an integer, got {type(amount_paise).__name__}: {amount_paise!r}")
    if amount_paise <= 0:
        raise ValueError(f"create_payment_link: amount_paise must be > 0, got {amount_paise}")

    url = f"{RAZORPAY_API_BASE}/payment_links"
    payload = {
        "amount": amount_paise,      # integer paise, required for fixed-amount link
        "currency": "INR",
        "description": description,
        "reference_id": reference_id,
        "customer": {
            "name": "Recovery Customer",
            "email": "recovery@example.com",
            "contact": "+919876543210"
        },
        "notify": {
            "sms": True,
            "email": True
        }
    }
    
    response = requests.post(url, json=payload, auth=_get_auth())
    
    if response.status_code >= 400:
        raise RuntimeError(f"Razorpay API Error: {response.text}")
        
    result = response.json()
    # Confirm the returned amount matches what we sent
    returned_amount = result.get("amount")
    if returned_amount != amount_paise:
        raise RuntimeError(
            f"Razorpay returned amount {returned_amount} != requested {amount_paise}. "
            f"Link {result.get('id')} may be malformed."
        )
    return result

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

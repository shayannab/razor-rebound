import os
import unittest
from razorpay_client import create_payment_link

class TestRazorpayIntegrationLive(unittest.TestCase):
    @unittest.skipIf(not os.environ.get('RAZORPAY_KEY_ID'), "No real API credentials available")
    def test_live_create_payment_link(self):
        """
        Makes exactly ONE real API call to confirm create_payment_link works 
        end to end against the real Razorpay test-mode endpoint.
        """
        # Smallest amount possible in INR (100 paise = 1 INR)
        res = create_payment_link(
            amount_paise=100, 
            description="Live Integration Test", 
            reference_id="test_live_ref_1"
        )
        
        self.assertIn("id", res)
        self.assertIn("short_url", res)
        self.assertEqual(res.get("status"), "created")

if __name__ == '__main__':
    unittest.main()

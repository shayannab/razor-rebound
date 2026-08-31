import os
import unittest
from unittest.mock import patch
import db

# Override DB path for tests
db.DB_PATH = "test_audit_log.db"

from recovery_engine import BoundedRecoveryEngine

class TestRecoveryEngine(unittest.TestCase):
    def setUp(self):
        if os.path.exists(db.DB_PATH):
            os.remove(db.DB_PATH)
        db.init_db()
        
    def tearDown(self):
        if os.path.exists(db.DB_PATH):
            os.remove(db.DB_PATH)

    def _create_eligible_event(self, event_id, amount):
        return {
            'payment_id': event_id,
            'amount': amount,
            'status': 'no_payment', # confidence 0.95
            'error_source': None,
            'error_code': None
        }

    @patch('recovery_engine.create_payment_link')
    def test_amount_exactly_at_cap(self, mock_create):
        mock_create.return_value = {"id": "plink_123", "short_url": "http"}
        engine = BoundedRecoveryEngine(max_amount_per_event=500000, total_budget=2000000)
        
        event = self._create_eligible_event("evt_cap", 500000)
        res = engine.process_event(event)
        
        self.assertEqual(res['status'], 'executed')
        mock_create.assert_called_once()
        
        # Above cap should fail
        event_over = self._create_eligible_event("evt_over", 500001)
        res_over = engine.process_event(event_over)
        self.assertEqual(res_over['status'], 'pending_approval')
        self.assertEqual(res_over['reason'], 'amount_over_cap')

    @patch('recovery_engine.classify')
    @patch('recovery_engine.create_payment_link')
    def test_confidence_exactly_at_boundary(self, mock_create, mock_classify):
        mock_create.return_value = {"id": "plink_123"}
        mock_classify.return_value = {
            'category': 'test',
            'reroutable': True,
            'confidence': 0.85,
            'reason': 'test'
        }
        
        engine = BoundedRecoveryEngine()
        event = {'payment_id': 'evt_conf_85', 'amount': 10000}
        res = engine.process_event(event)
        
        self.assertEqual(res['status'], 'executed')
        
        # Below boundary should fail
        mock_classify.return_value['confidence'] = 0.84
        event_84 = {'payment_id': 'evt_conf_84', 'amount': 10000}
        res_84 = engine.process_event(event_84)
        
        self.assertEqual(res_84['status'], 'pending_approval')
        self.assertEqual(res_84['reason'], 'confidence_too_low')

    @patch('recovery_engine.create_payment_link')
    def test_prior_execution_dedupe(self, mock_create):
        mock_create.return_value = {"id": "plink_123"}
        engine = BoundedRecoveryEngine()
        
        event = self._create_eligible_event("evt_dup", 100000)
        
        # First time succeeds
        res1 = engine.process_event(event)
        self.assertEqual(res1['status'], 'executed')
        
        # Second time skips
        res2 = engine.process_event(event)
        self.assertEqual(res2['status'], 'skipped')
        self.assertEqual(res2['reason'], 'prior_execution')

    @patch('recovery_engine.create_payment_link')
    def test_circuit_breaker(self, mock_create):
        mock_create.side_effect = Exception("API Down")
        engine = BoundedRecoveryEngine()
        
        # 3 consecutive failures
        self.assertEqual(engine.process_event(self._create_eligible_event("e1", 10000))['status'], 'execution_failed')
        self.assertEqual(engine.process_event(self._create_eligible_event("e2", 10000))['status'], 'execution_failed')
        self.assertEqual(engine.process_event(self._create_eligible_event("e3", 10000))['status'], 'execution_failed')
        
        self.assertTrue(engine.breaker_tripped)
        
        # 4th eligible event routes to breaker tripped
        res4 = engine.process_event(self._create_eligible_event("e4", 10000))
        self.assertEqual(res4['status'], 'pending_approval_breaker_tripped')
        # create_payment_link shouldn't be called a 4th time
        self.assertEqual(mock_create.call_count, 3)

    @patch('recovery_engine.create_payment_link')
    def test_budget_exhaustion(self, mock_create):
        mock_create.return_value = {"id": "plink_123"}
        engine = BoundedRecoveryEngine(max_amount_per_event=500000, total_budget=600000)
        
        # 1st event takes 400000
        res1 = engine.process_event(self._create_eligible_event("e1", 400000))
        self.assertEqual(res1['status'], 'executed')
        self.assertEqual(engine.budget_remaining, 200000)
        
        # 2nd event takes 250000 -> exceeds budget!
        res2 = engine.process_event(self._create_eligible_event("e2", 250000))
        self.assertEqual(res2['status'], 'pending_approval')
        self.assertEqual(res2['reason'], 'budget_exhausted')
        
        # 3rd event takes 150000 -> fits remaining budget!
        res3 = engine.process_event(self._create_eligible_event("e3", 150000))
        self.assertEqual(res3['status'], 'executed')
        self.assertEqual(engine.budget_remaining, 50000)

if __name__ == '__main__':
    unittest.main()

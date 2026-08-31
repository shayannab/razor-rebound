import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, accuracy_score
from data_generator import get_train_test_data
from stages import RuleEngineStage
from ml_classifier import MLClassifierStage
from pipeline import PipelineOrchestrator
from audit_log import init_db
import warnings
warnings.filterwarnings('ignore')

def run_demo():
    print("--- RAZORPAY AI REVENUE RECOVERY DIAGNOSIS SYSTEM ---\n")
    
    print("1. Initializing Audit DB (SQLite)...")
    init_db()

    print("2. Generating synthetic dataset with separate seeds...")
    train_df, test_df = get_train_test_data()

    print("3. Isolating ambiguous subset for ML Training...")
    # The ML model should ONLY be trained on what the Rule Engine cannot classify.
    rule_engine = RuleEngineStage()
    
    # Filter train data to only those the rule engine fails on
    train_ambiguous = []
    for _, row in train_df.iterrows():
        event = row.to_dict()
        res = rule_engine.evaluate(event)
        if res['root_cause'] == 'unknown':
            train_ambiguous.append(event)
            
    train_ambiguous_df = pd.DataFrame(train_ambiguous)
    print(f"   -> Out of {len(train_df)} train records, {len(train_ambiguous_df)} are ambiguous.")
    
    print("4. Training ML Classifier...")
    ml_classifier = MLClassifierStage(confidence_threshold=0.6)
    ml_classifier.train(train_ambiguous_df)
    
    print("5. Evaluating ML Classifier on strictly held-out test set...")
    # Isolate ambiguous cases in the test set for ML eval
    test_ambiguous = []
    for _, row in test_df.iterrows():
        event = row.to_dict()
        res = rule_engine.evaluate(event)
        if res['root_cause'] == 'unknown':
            test_ambiguous.append(event)
            
    y_true_ambig = []
    y_pred_ambig = []
    escalated_count = 0
    
    for event in test_ambiguous:
        true_label = event['true_label']
        pred = ml_classifier.predict(event)
        
        y_true_ambig.append(true_label)
        if pred['root_cause'] == 'unknown':
            escalated_count += 1
            # We map unknown to a separate label so classification_report handles it
            y_pred_ambig.append('unknown')
        else:
            y_pred_ambig.append(pred['root_cause'])

    print(f"\n--- ML CLASSIFIER EVALUATION (Ambiguous Subset Only) ---")
    print(classification_report(y_true_ambig, y_pred_ambig, zero_division=0))
    print(f"Overall Accuracy: {accuracy_score(y_true_ambig, y_pred_ambig):.2f}")
    print(f"Escalation Rate (punted to unknown): {escalated_count / len(test_ambiguous) * 100:.1f}%\n")

    print("6. Running Full Pipeline on Test Set...")
    pipeline = PipelineOrchestrator(ml_classifier)
    
    results = []
    # Intentionally insert a duplicate to test dedupe
    test_events = test_df.to_dict('records')
    if len(test_events) > 0:
        test_events.insert(1, test_events[0].copy()) # duplicate
    
    # Intentionally insert a missing field record
    missing_record = test_events[2].copy()
    missing_record.pop('error_code')
    test_events.insert(3, missing_record)

    for event in test_events:
        res = pipeline.process_event(event)
        results.append(res)
        
    print("\n--- PIPELINE SUMMARY ---")
    processed = [r for r in results if r['status'] == 'processed']
    skipped = [r for r in results if r['status'] == 'skipped']
    
    total = len(processed)
    print(f"Total processed successfully: {total}")
    print(f"Total skipped (duplicates): {len(skipped)}")
    
    rule_count = sum(1 for r in processed if r['decision_layer'] == 'rule_engine')
    ml_count = sum(1 for r in processed if r['decision_layer'] == 'ml_classifier')
    esc_count = sum(1 for r in processed if 'escalated' in r['decision_layer'] or 'validation' in r['decision_layer'])
    
    print(f"Decided by Rule Engine: {rule_count} ({rule_count/total*100:.1f}%)")
    print(f"Decided by ML Model: {ml_count} ({ml_count/total*100:.1f}%)")
    print(f"Escalated (Unknown): {esc_count} ({esc_count/total*100:.1f}%)")
    
    avg_conf = np.mean([r['confidence'] for r in processed])
    print(f"Average Confidence: {avg_conf:.2f}")
    
    # --- RECOVERY SUMMARY ---
    print("\n--- RECOVERY RECOMMENDATION SUMMARY ---")
    total_volume = sum(r['amount'] for r in processed)
    recommended_runs = [r for r in processed if r.get('approval_status') == 'pending' and r.get('recommended_action') != 'no recommended action - escalate to manual review']
    expected_recovered = sum(r['amount'] * r['estimated_recovery_likelihood'] for r in recommended_runs)
    recovery_rate = expected_recovered / total_volume * 100 if total_volume > 0 else 0.0
    
    print(f"Total Failure Volume Processed: ${total_volume:,} USD")
    print(f"Recoveries Recommended (Pending Approval): {len(recommended_runs)} transactions")
    print(f"Expected Bounded Volume Recovered: ${expected_recovered:,.2f} USD")
    print(f"Simulated Revenue Recovery Rate: {recovery_rate:.1f}%")
    
    print("\nRoot Cause Breakdown:")
    causes = {}
    for r in processed:
        causes[r['root_cause']] = causes.get(r['root_cause'], 0) + 1
    for k, v in causes.items():
        print(f" - {k}: {v} ({v/total*100:.1f}%)")
        
    print("\n--- EXAMPLE DECISIONS (Audit Trail) ---")
    import random
    # Show 5 random processed examples
    samples = random.sample(processed, 5)
    for i, s in enumerate(samples, 1):
        print(f"Example {i}:")
        print(f" Payment ID: {s['payment_id']}")
        print(f" Amount: ${s['amount']} {s['currency']}")
        print(f" Root Cause: {s['root_cause']} (Confidence: {s['confidence']:.2f})")
        print(f" Layer: {s['decision_layer']}")
        print(f" Explanation: {s['explanation']}")
        print(f" Next Step: {s['next_step']}")
        print(f" Recovery Workflow: {s.get('recovery_workflow', 'N/A')} (Est. Prob: {s.get('recovery_estimated_probability', 0.0):.2f})")
        print(f" Recovery Status: {s.get('recovery_status', 'N/A')}")
        print(f" Audit Log ID: {s.get('audit_id', 'N/A')}")
        print("-" * 40)

if __name__ == "__main__":
    run_demo()

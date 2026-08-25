import pandas as pd
from pipeline import PipelineOrchestrator
from ml_classifier import MLClassifierStage
from stages import RuleEngineStage
from data_generator import get_train_test_data
from audit_log import init_db

def main():
    print("================================================================")
    print("   SIMULATED RECOVERY REPORT (BASED ON ESTIMATED LIKELIHOODS)   ")
    print("================================================================\n")
    print("NOTE: The figures below are a SIMULATION based on estimated")
    print("likelihoods grounded in general industry patterns. They do NOT")
    print("represent measured real-world results of this system, as no")
    print("live payment APIs are called and all recovery actions are")
    print("strictly approval-gated.\n")

    init_db()

    train_df, test_df = get_train_test_data()
    
    # Train ML Classifier on ambiguous training records
    rule_engine = RuleEngineStage()
    train_ambiguous = []
    for _, row in train_df.iterrows():
        event = row.to_dict()
        res = rule_engine.evaluate(event)
        if res['root_cause'] == 'unknown':
            train_ambiguous.append(event)
            
    train_ambiguous_df = pd.DataFrame(train_ambiguous)
    ml_classifier = MLClassifierStage(confidence_threshold=0.6)
    ml_classifier.train(train_ambiguous_df)
    
    pipeline = PipelineOrchestrator(ml_classifier)

    total_failures = len(test_df)
    failures_with_recommendation = 0
    
    total_failure_value_usd = 0.0
    simulated_recovered_value_usd = 0.0
    
    # Conversion rates just for the simulation
    fx_rates = {'USD': 1.0, 'EUR': 1.1, 'GBP': 1.25, 'INR': 0.012}

    print(f"Processing {total_failures} test records through the full pipeline...")

    for _, row in test_df.iterrows():
        event = row.to_dict()
        
        # Convert to USD roughly for aggregation
        amt = event['amount'] * fx_rates.get(event['currency'], 1.0)
        total_failure_value_usd += amt
        
        # Run pipeline
        result = pipeline.process_event(event)
        
        if result['recommended_action'] != 'no recommended action - escalate to manual review':
            failures_with_recommendation += 1
            likelihood = result['estimated_recovery_likelihood']
            simulated_recovered_value_usd += (amt * likelihood)
            
    pct_count = (failures_with_recommendation / total_failures) * 100 if total_failures > 0 else 0
    pct_value = (simulated_recovered_value_usd / total_failure_value_usd) * 100 if total_failure_value_usd > 0 else 0

    print("\n--- RESULTS ---")
    print(f"Total Test Failures: {total_failures}")
    print(f"Total Failure Value (USD equivalent): ${total_failure_value_usd:,.2f}")
    print(f"Failures with a Specific Recommended Action: {failures_with_recommendation} ({pct_count:.1f}%)")
    print("")
    print(f"SIMULATED Recoverable Value (USD): ${simulated_recovered_value_usd:,.2f}")
    print(f"SIMULATED Recoverable Percentage: {pct_value:.1f}% of total failure value")
    print("================================================================\n")

if __name__ == "__main__":
    main()

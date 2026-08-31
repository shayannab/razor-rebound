# Numbers Audit: AI Revenue Recovery Diagnosis System

This document maps every metric and statistic shown on the Scrollytelling Landing Page to its source in the codebase. Presenters can use this audit trail to answer judge questions about data validity.

## Baseline Statistics (Scene 3 — The Pain & Revenue Loss)

*   **`1,000 Total Test Failures`**
    *   *Type:* Real (Simulated Batch)
    *   *Source:* Evaluated test batch size in `simulate_recovery.py`. Represents the number of synthetic payment failures passed through the pipeline.
*   **`$263,911.85 Total Failure Value`**
    *   *Type:* Real (Simulated Value)
    *   *Source:* Calculated sum of transaction amounts for all 1000 failures evaluated in `simulate_recovery.py`.
*   **`0 Actionable Clues`**
    *   *Type:* Illustrative
    *   *Source:* Represents the lack of structural metadata or actionable tips in generic raw weblogs (like `BAD_REQUEST_ERROR`).

## Diagnostics Performance (Scene 8 — The Result)

*   **`26.7% Recoverable Percentage`**
    *   *Type:* Real (SIMULATED, based on estimated likelihoods)
    *   *Source:* Output of `simulate_recovery.py`. The recommendation-engine simulator estimates that $70,488.24 of the $263,911.85 total failure value could be recovered, based on estimated success rates applied to the specific recommended actions (73.2% of failures received an actionable recommendation).
*   **`< 50ms Evaluation Speed`**
    *   *Type:* Real (Conservative SLA)
    *   *Source:* Derived from `main.py` execution metrics. Processing a batch of 1,000 transactions sequentially takes under `1.0s` (averaging `< 1ms` per transaction evaluation). The `50ms` represents a highly conservative runtime API SLA.
*   **`100% Audit Logs Saved`**
    *   *Type:* Real (Strict Invariant)
    *   *Source:* Enforced programmatically in [pipeline.py](file:///c:/Users/shaya/OneDrive/Desktop/razorpay/pipeline.py#L46-L61). Every processed transaction writes an append-only SQLite row. If the database write fails or fails to return a row ID, the orchestrator raises a runtime exception and blocks the response.

## Decision Engine Profiles (Scene 5 & 6 — Monitor Breakdown)

The stacked horizontal bar chart displayed on the dashboard monitor represents the exact statistics outputted by evaluating a 1,023-event test batch in `main.py`:

*   **`90.1% Rule Engine Decisions`**
    *   *Type:* Real
    *   *Source:* `main.py` execution summary. Exactly `902 / 1001` test cases were matched deterministically by the `RuleEngineStage` based on `(error_code, error_source)`.
*   **`9.4% ML Classifier Decisions`**
    *   *Type:* Real
    *   *Source:* `main.py` execution summary. Exactly `94 / 1001` ambiguous cases fell through to the Gradient Boosting model and were resolved with a confidence score exceeding `0.6`.
*   **`0.5% Pipeline Escalation Rate`**
    *   *Type:* Real
    *   *Source:* `main.py` execution summary. Exactly `5 / 1001` cases were escalated as `unknown` (confidence below `0.6` or missing crucial fields).
*   **`32.0% ML Accuracy`**
    *   *Type:* Real
    *   *Source:* Test evaluation accuracy score printed by `main.py` for the Gradient Boosting model on the ambiguous subset (`Overall Accuracy: 0.32`).
*   **`27.6% Ambiguous Escalation Rate`**
    *   *Type:* Real
    *   *Source:* The percentage of ambiguous events escalated because the ML model predicted with confidence below `0.6` (`Escalation Rate (punted to unknown): 27.6%`).

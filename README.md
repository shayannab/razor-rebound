# Razorpay AI Revenue Recovery: Diagnosis System

## Overview
This is a read-only, diagnosis-only system for classifying the root cause of failed international card payments. It processes failed-payment events and classifies them into one of five root causes, providing a deterministic explanation, suggested next steps, and a full audit trail for every single decision.

## Hard Invariants Respected
1. **No Money Movement:** There is strictly no code path to retry, refund, or call any live payment API. 
2. **Data Safety in Explanations:** The explanation layer structurally accepts only a validated `root_cause` and confidence score. Raw event data (and any PII) cannot be leaked into explanations.
3. **Guaranteed Audit Log:** Every decision is logged to SQLite before it is returned. If the write fails, the pipeline raises an exception and aborts.
4. **Honest Escalation:** No guessing. The Rule Engine falls back to `unknown` on unmatched codes. The ML Classifier escalates to `unknown` if its confidence is below `0.6`.
5. **No Live LLMs:** Explanations are purely template-based mapped from the final root cause, ensuring zero API failure risk on demo day and preventing LLM hallucination in financial diagnostics.

## Architecture

```text
1. INGESTION (pipeline.py / stages.py)
   ├─ Deduplicates by payment_id
   └─ Fails early on missing fields -> UNKNOWN

2. RULE ENGINE (stages.py)
   ├─ Deterministic match on (error_code, error_source)
   └─ No match -> UNKNOWN

3. ML CLASSIFIER (ml_classifier.py)
   ├─ Runs ONLY on cases the Rule Engine marks UNKNOWN
   ├─ Scikit-learn GradientBoostingClassifier trained on weak signals
   └─ Score < 0.6 -> Escalates to UNKNOWN

4. EXPLANATION LAYER (stages.py)
   ├─ Strict template-based language lookup
   └─ Emits explanation + next step

5. AUDIT LOG (audit_log.py)
   ├─ Append-only SQLite write
   └─ Blocks returning response until write succeeds

6. PIPELINE ORCHESTRATOR (pipeline.py)
   └─ Wires all components together sequentially
```

## How to Run

1. Ensure requirements are installed:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the demo script (generates data, evaluates model, runs pipeline):
   ```bash
   python main.py
   ```
   
See `BUILD_LOG.md` for a comprehensive log of architectural and design decisions made during the hackathon.

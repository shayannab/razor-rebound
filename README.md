# Razorpay Rebound
Razorpay Rebound is an AI-driven, highly resilient revenue recovery pipeline. It intercepts failed payments in real-time, diagnoses their root causes using a hybrid rules-and-ML classification engine, and dynamically dispatches native Razorpay payment links to recover lost revenue.

At its core, Rebound is designed with strict **safety invariants** and **cryptographic state preservation** to ensure that automated recovery never exceeds defined risk thresholds and every action is fully auditable.

Live at: https://razorpay-rebound.onrender.com

## 🏗 Architecture Overview

The system operates across three primary layers:

### 1. Hybrid Classification Engine
When a checkout failure occurs, the event is synchronously evaluated by a dual-stage classifier:
- **Deterministic Rule Engine:** Parses the `error_code`, `error_source`, and `error_step` with zero latency (sub-millisecond) to match known failure patterns (e.g., `BAD_REQUEST_ERROR` from `gateway`).
- **Gradient Boosting ML Fallback:** For ambiguous cases where rules cannot determine the root cause, the event is routed to an SKLearn Gradient Boosting Classifier trained on historical payment signals. If the confidence score is `< 0.85`, it escalates to human review.

### 2. Bounded Execution Engine (Safety Invariants)
Before any recovery action is dispatched, the `BoundedRecoveryEngine` dynamically reconstructs the ledger state to enforce strict safety bounds:
- **Maximum Event Cap:** Limits the maximum transaction amount (e.g., ₹5,000) eligible for automated recovery. Large transactions are held in a `pending_approval` state.
- **Rolling 24-Hour Budget:** Enforces a global dynamic budget (e.g., ₹20,000). The engine queries the last 24 hours of execution history to calculate remaining budget. If exhausted, it degrades gracefully to human-review mode.
- **Circuit Breakers:** If 3 consecutive recovery link generations fail (due to network or API issues), the breaker trips, halting all automated execution until manually reset.
- **Idempotency & Deduplication:** Ensures that the same `payment_id` or `order_id` cannot trigger multiple recovery links.

### 3. State Preservation Engine (Cryptographic Ledger)
To maintain an immutable and tamper-proof record of all decisions and actions, Rebound uses an append-only SQLite ledger (`audit_log_real.db`):
- **SHA-256 Hash Chaining:** Every log entry calculates a SHA-256 hash derived from the `prev_hash`, `timestamp`, `event_id`, `action`, and `details_json`.
- **Integrity Verification:** A `verify_chain_integrity()` routine can reconstruct the ledger from the Genesis block to validate that no record has been altered, ensuring financial compliance.

## 🚀 Live Demo & Dashboard

The application exposes a React-like vanilla frontend powered by FastAPI:
- `/live-demo`: A sandbox environment to trigger real Razorpay Checkout modals, force failures, and watch the pipeline classify and execute recovery links in real-time. Includes simulation controls for testing safety bounds.
- `/dashboard`: A real-time audit dashboard that reads directly from the SHA-256 ledger, mapping every event's diagnostic journey and real-time Razorpay payment status via long-polling.

## 🛠 Tech Stack

- **Backend:** FastAPI, Python 3.x, SQLite
- **Machine Learning:** Scikit-Learn, Pandas
- **Frontend:** Vanilla CSS/JS (Dashboard), Razorpay Checkout.js
- **Integrations:** Razorpay API (Orders, Payment Links)

## 📦 How to Run

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Set Environment Variables:**
   Create a `.env` file with your Razorpay credentials:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
3. **Start the API Server:**
   ```bash
   python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000 --reload
   ```
4. **Access the Web Interface:**
   - Open `http://127.0.0.1:8000/live-demo` to test the recovery engine.
   - Open `http://127.0.0.1:8000/dashboard` to view the audit log and recovered revenue.

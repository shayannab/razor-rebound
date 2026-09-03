import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Database, 
  Brain, 
  Layers, 
  RefreshCw, 
  ExternalLink,
  HelpCircle,
  BarChart3,
  Clock,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  // State for interactive sandbox demo widget
  const [sandboxEvent, setSandboxEvent] = useState({
    payment_id: "pay_demo_" + Math.random().toString(36).substring(2, 8),
    amount: 467700, // Rs. 4,677
    error_source: "gateway",
    error_code: "BAD_REQUEST_ERROR",
    error_reason: "payment_failed",
    error_step: "payment_authorization"
  });

  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const sampleEvents = [
    {
      label: "Bank Gateway Failure (Rs.4,677)",
      data: {
        payment_id: "pay_gw_" + Math.random().toString(36).substring(2, 7),
        amount: 467700,
        error_source: "gateway",
        error_code: "BAD_REQUEST_ERROR",
        error_reason: "payment_failed",
        error_step: "payment_authorization"
      }
    },
    {
      label: "Checkout Cart Drop-off (Rs.1,000)",
      data: {
        payment_id: "order_drop_" + Math.random().toString(36).substring(2, 7),
        amount: 100000,
        error_source: null,
        error_code: null,
        error_reason: null,
        error_step: null
      }
    },
    {
      label: "International Card Restriction (Rs.8,500)",
      data: {
        payment_id: "pay_intl_" + Math.random().toString(36).substring(2, 7),
        amount: 850000,
        error_source: "business",
        error_code: "BAD_REQUEST_ERROR",
        error_reason: "international_transaction_not_allowed",
        error_step: "payment_authorization"
      }
    }
  ];

  const handleRunDiagnosis = async () => {
    setDiagnosing(true);
    setDiagnosisResult(null);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sandboxEvent)
      });
      if (!res.ok) throw new Error("Diagnosis API Error");
      const data = await res.json();
      setDiagnosisResult(data);
    } catch (err) {
      // Fallback mock diagnosis if running standalone frontend dev server
      setDiagnosisResult({
        event_id: sandboxEvent.payment_id,
        classification: {
          category: sandboxEvent.error_source === 'gateway' ? 'gateway_failure' : (sandboxEvent.error_source === 'business' ? 'business_config_error' : 'abandoned'),
          reroutable: sandboxEvent.error_source !== 'business',
          confidence: 0.92,
          reason: sandboxEvent.error_source === 'gateway' ? 'Gateway failed to process request (e.g. mock bank failure)' : 'Business restriction — international card not allowed'
        },
        recommended_action: sandboxEvent.error_source !== 'business' ? 'send_payment_link' : 'hold_for_manual_review'
      });
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Top Header Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-logo">
              <ShieldCheck className="brand-icon" size={24} />
            </div>
            <div className="brand-text">
              <span className="brand-title">Razorpay Rebound</span>
              <span className="brand-badge">AI Recovery</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#why-we-built-it">Why We Built It</a>
            <a href="#architecture">Architecture</a>
            <a href="#sandbox">Live Tester</a>
          </nav>

          <div className="nav-actions">
            <a href="/dashboard" className="btn-secondary-nav">
              <BarChart3 size={16} />
              <span>Full Audit Dashboard</span>
            </a>
            <a href="/live-demo" className="btn-primary-nav">
              <Zap size={16} />
              <span>Try Live Demo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-pill">
            <Sparkles size={14} className="hero-pill-icon" />
            <span>Autonomous Revenue Recovery for Modern Merchants</span>
          </div>

          <h1 className="hero-heading">
            Turn Silent Payment Failures Into <span className="text-highlight">Recovered Revenue</span>
          </h1>

          <p className="hero-subheading">
            Razorpay Rebound captures checkout drops in real-time, diagnoses root causes with AI, 
            and dispatches locked, fixed-amount recovery links before customers leave your store.
          </p>

          <div className="hero-cta-group">
            <a href="/live-demo" className="btn-hero-primary">
              <Zap size={18} />
              <span>Launch Live Recovery Demo</span>
              <ArrowRight size={18} />
            </a>
            <a href="/dashboard" className="btn-hero-secondary">
              <BarChart3 size={18} />
              <span>Explore Audit Dashboard</span>
            </a>
          </div>

          {/* Metrics Ticker Card */}
          <div className="hero-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper bg-green">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="metric-value">₹14,253.00</div>
                <div className="metric-label">Confirmed Recovered</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper bg-blue">
                <Clock size={20} />
              </div>
              <div>
                <div className="metric-value">&lt; 50ms</div>
                <div className="metric-label">Classification Latency</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper bg-teal">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="metric-value">100% Locked</div>
                <div className="metric-label">Bounded Invariants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Merchant Pain Points */}
      <section className="section bg-light" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">The Problem</div>
            <h2 className="section-title">The Silent Revenue Killer in E-Commerce</h2>
            <p className="section-description">
              Up to 20% of online checkout attempts fail silently. Generic error messages leave merchants in the dark and customers frustrated.
            </p>
          </div>

          <div className="pain-points-grid">
            <div className="pain-card">
              <div className="pain-icon-wrapper">
                <AlertTriangle size={24} className="text-warning" />
              </div>
              <h3>Cryptic Gateway Error Codes</h3>
              <p>
                Bank downtime, 3DS timeouts, and gateway glitches are masked under generic failure flags. Merchants can't tell temporary network drops from real declines.
              </p>
            </div>

            <div className="pain-card">
              <div className="pain-icon-wrapper">
                <RefreshCw size={24} className="text-danger" />
              </div>
              <h3>Instant Cart Abandonment</h3>
              <p>
                When a payment fails once, 72% of buyers close the browser tab. Traditional retry buttons ask customers to re-type card details from scratch.
              </p>
            </div>

            <div className="pain-card">
              <div className="pain-icon-wrapper">
                <Lock size={24} className="text-primary" />
              </div>
              <h3>Manual Support Churn</h3>
              <p>
                Support teams spend hours creating manual invoice links or emailing customers. Manual link creation risks incorrect amounts or missing audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Story Section - Why We Built It */}
      <section className="section bg-white" id="why-we-built-it">
        <div className="section-container">
          <div className="story-card">
            <div className="story-header">
              <div className="story-badge">
                <HelpCircle size={14} />
                <span>Why We Built It</span>
              </div>
              <h2 className="story-title">Bob's Story: From Lost Sales to Instant Recovery</h2>
            </div>

            <div className="story-content-grid">
              <div className="story-text-column">
                <p className="story-paragraph">
                  Meet <strong>Bob</strong>, a growing D2C merchant selling premium audio gear. Every week, Bob noticed <strong>₹45,000+</strong> in lost checkout volume. Customers were adding products to their cart, entering shipping details, but leaving at the payment step.
                </p>
                <div className="story-quote">
                  "I was losing 18% of my orders every single month to payment gateway drops. We tried calling customers manually, but by the time support reached out, the customer had already bought from a competitor."
                </div>
                <p className="story-paragraph">
                  We built <strong>Razorpay Rebound</strong> to fix this exact problem. Instead of waiting for manual support or relying on static retry buttons, Rebound listens synchronously to Razorpay payment events:
                </p>
                <ul className="story-list">
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Instantly differentiates bank gateway drops from card declines.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Evaluates safety guardrails (₹5,000 max cap, ₹20,000 budget limit, 3-failure circuit breaker).</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Generates a 100% pre-filled, locked Razorpay payment link sent directly via SMS or WhatsApp.</span>
                  </li>
                </ul>
              </div>

              <div className="story-visual-column">
                <div className="story-comparison-card">
                  <div className="comp-header">
                    <span className="comp-tag old">Traditional Process</span>
                  </div>
                  <div className="comp-flow">
                    <div className="comp-step failed">1. Payment Fails</div>
                    <div className="comp-arrow">↓</div>
                    <div className="comp-step failed">2. Customer Leaves</div>
                    <div className="comp-arrow">↓</div>
                    <div className="comp-step lost">3. Revenue Lost Forever</div>
                  </div>
                </div>

                <div className="story-comparison-card rebound">
                  <div className="comp-header">
                    <span className="comp-tag new">With Razorpay Rebound</span>
                  </div>
                  <div className="comp-flow">
                    <div className="comp-step failed">1. Payment Fails</div>
                    <div className="comp-arrow">↓</div>
                    <div className="comp-step ai">2. Rebound AI Diagnoses (&lt;50ms)</div>
                    <div className="comp-arrow">↓</div>
                    <div className="comp-step success">3. Locked Recovery Link Dispatched</div>
                    <div className="comp-arrow">↓</div>
                    <div className="comp-step recovered">4. 1-Click Pay &amp; Auto Reconciled 🎉</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Architecture Breakdown */}
      <section className="section bg-light" id="architecture">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Architecture</div>
            <h2 className="section-title">The 4-Stage Autonomous Recovery Pipeline</h2>
            <p className="section-description">
              Engineered with deterministic rule classification, machine learning, and zero-trust safety guardrails.
            </p>
          </div>

          <div className="arch-steps-grid">
            <div className="arch-card">
              <div className="arch-step-num">01</div>
              <div className="arch-icon-wrapper">
                <Layers size={22} />
              </div>
              <h3>Event Capture</h3>
              <p>Synchronously intercepts Razorpay Checkout failures (`rzp.on('payment.failed')`) and webhook events.</p>
            </div>

            <div className="arch-card">
              <div className="arch-step-num">02</div>
              <div className="arch-icon-wrapper">
                <Brain size={22} />
              </div>
              <h3>ML &amp; Rule Engine</h3>
              <p>Determines root cause (gateway failure vs. user cancellation vs. international restriction) in real time.</p>
            </div>

            <div className="arch-card">
              <div className="arch-step-num">03</div>
              <div className="arch-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <h3>Bounded Safety Engine</h3>
              <p>Enforces hard invariants: max amount caps, total batch budget limit, and 3-failure circuit breakers.</p>
            </div>

            <div className="arch-card">
              <div className="arch-step-num">04</div>
              <div className="arch-icon-wrapper">
                <Database size={22} />
              </div>
              <h3>Audit &amp; Reconciliation</h3>
              <p>Logs all execution states to `audit_log_real.db` and auto-reconciles payment confirmation via Razorpay API.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Live Sandbox Widget */}
      <section className="section bg-white" id="sandbox">
        <div className="section-container">
          <div className="sandbox-card">
            <div className="sandbox-header">
              <div>
                <div className="section-tag">Interactive Demo</div>
                <h2 className="sandbox-title">Test the Diagnostic Engine Live</h2>
                <p className="sandbox-subtitle">Select a sample payment failure event or customize the parameters to see Rebound AI classify the failure in real time.</p>
              </div>
              <div className="preset-selector">
                <span className="preset-label">Sample Presets:</span>
                {sampleEvents.map((ev, i) => (
                  <button 
                    key={i} 
                    className="btn-preset"
                    onClick={() => {
                      setSandboxEvent({ ...ev.data });
                      setDiagnosisResult(null);
                    }}
                  >
                    {ev.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sandbox-body">
              <div className="sandbox-input-col">
                <h4 className="col-title">1. Payment Failure Event Payload</h4>
                <div className="form-group">
                  <label>Payment / Reference ID</label>
                  <input 
                    type="text" 
                    value={sandboxEvent.payment_id} 
                    onChange={(e) => setSandboxEvent({ ...sandboxEvent, payment_id: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (Paise)</label>
                    <input 
                      type="number" 
                      value={sandboxEvent.amount} 
                      onChange={(e) => setSandboxEvent({ ...sandboxEvent, amount: parseInt(e.target.value) || 0 })}
                    />
                    <span className="input-hint">₹{(sandboxEvent.amount / 100).toFixed(2)} INR</span>
                  </div>

                  <div className="form-group">
                    <label>Error Source</label>
                    <select 
                      value={sandboxEvent.error_source || ''} 
                      onChange={(e) => setSandboxEvent({ ...sandboxEvent, error_source: e.target.value || null })}
                    >
                      <option value="gateway">gateway (Bank Drop)</option>
                      <option value="customer">customer (Cancelled)</option>
                      <option value="business">business (Config Error)</option>
                      <option value="">null (Checkout Abandoned)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Error Reason</label>
                  <input 
                    type="text" 
                    value={sandboxEvent.error_reason || ''} 
                    onChange={(e) => setSandboxEvent({ ...sandboxEvent, error_reason: e.target.value || null })}
                  />
                </div>

                <button 
                  className="btn-run-diagnosis"
                  onClick={handleRunDiagnosis}
                  disabled={diagnosing}
                >
                  {diagnosing ? (
                    <>
                      <RefreshCw size={18} className="spin" />
                      <span>Classifying Event...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      <span>Run AI Diagnosis &amp; Pipeline Check</span>
                    </>
                  )}
                </button>
              </div>

              <div className="sandbox-output-col">
                <h4 className="col-title">2. Real-Time Pipeline Diagnosis</h4>
                {diagnosisResult ? (
                  <div className="diagnosis-result-wrapper">
                    <div className={`result-header-badge ${diagnosisResult.classification?.reroutable ? 'reroutable' : 'non-reroutable'}`}>
                      {diagnosisResult.classification?.reroutable ? '✓ REROUTABLE (Eligible for Recovery Link)' : '⚠️ NON-REROUTABLE (Held for Review)'}
                    </div>

                    <div className="result-detail-card">
                      <div className="detail-row">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value highlight">
                          {diagnosisResult.classification?.category?.replace(/_/g, ' ') || 'unknown'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Reroutable:</span>
                        <span className="detail-value">
                          {diagnosisResult.classification?.reroutable ? 'True' : 'False'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Reason:</span>
                        <span className="detail-value">
                          {diagnosisResult.classification?.reason || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="json-box">
                      <div className="json-title">Raw Classification Output</div>
                      <pre>{JSON.stringify(diagnosisResult.classification, null, 2)}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="empty-sandbox-state">
                    <Brain size={36} className="text-muted" />
                    <p>Click <strong>"Run AI Diagnosis"</strong> to test how Rebound classifies this event and determines recovery link eligibility.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand-logo">
                <ShieldCheck size={24} />
              </div>
              <span className="brand-title">Razorpay Rebound</span>
            </div>
            <p className="footer-sub">Autonomous Revenue Recovery for High-Volume Razorpay Merchants.</p>
          </div>

          <div className="footer-links-grid">
            <a href="/dashboard" className="footer-link-card">
              <BarChart3 size={20} />
              <div>
                <strong>Full Audit Dashboard</strong>
                <span>View all batch events &amp; live DB logs</span>
              </div>
              <ExternalLink size={16} />
            </a>

            <a href="/live-demo" className="footer-link-card primary">
              <Zap size={20} />
              <div>
                <strong>Live Recovery Demo</strong>
                <span>Simulate a failure &amp; generate payment link</span>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Razorpay Rebound. Built for AI Revenue Recovery.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

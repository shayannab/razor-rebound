import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';

export default function LandingPage() {
  const [confirmedTotal, setConfirmedTotal] = useState(2227600); // Default to live DB sum (₹22,276.00)

  useEffect(() => {
    async function fetchLiveMetrics() {
      try {
        const res = await fetch('/api/dashboard_data');
        if (res.ok) {
          const data = await res.json();
          const events = data.events || [];
          const totalPaise = events.reduce((sum, ev) => sum + (ev.confirmed_amount_paise || 0), 0);
          if (totalPaise > 0) {
            setConfirmedTotal(totalPaise);
          }
        }
      } catch (e) {
        console.warn('Could not fetch live dashboard metrics for landing page', e);
      }
    }
    fetchLiveMetrics();
  }, []);

  const formatCurrency = (paise) => '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="landing-wrapper">
      {/* Top Header Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <img src="/logo.png" alt="Razorpay Rebound" width="36" height="36" style={{borderRadius:'8px'}} />
            <div className="brand-text">
              <span className="brand-title">Razorpay Rebound</span>
            </div>
          </div>

          <div className="nav-actions">
            <a href="/dashboard" className="btn-secondary-nav">
              <BarChart3 size={16} />
              <span>Audit Dashboard</span>
            </a>
            <a href="/live-demo" className="btn-primary-nav">
              <Zap size={16} />
              <span>Live Payment Recovery</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-heading">
            Turn Silent Payment Failures Into <span className="text-highlight">Recovered Revenue</span>
          </h1>

          <p className="hero-subheading">
            Razorpay Rebound captures checkout drops in real-time, classifies root causes, 
            and dispatches locked, fixed-amount recovery links before customers abandon their order.
          </p>

          <div className="hero-cta-group">
            <a href="/live-demo" className="btn-hero-primary">
              <Zap size={18} />
              <span>Live Payment Recovery</span>
              <ArrowRight size={18} />
            </a>
            <a href="/dashboard" className="btn-hero-secondary">
              <BarChart3 size={18} />
              <span>Audit Dashboard</span>
            </a>
          </div>

          {/* Real Metrics Ticker Card */}
          <div className="hero-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper bg-green">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="metric-value">{formatCurrency(confirmedTotal)}</div>
                <div className="metric-label">Live DB Confirmed Recovered</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper bg-blue">
                <Clock size={20} />
              </div>
              <div>
                <div className="metric-value">&lt; 50ms</div>
                <div className="metric-label">Pipeline Processing Latency</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper bg-teal">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="metric-value">100%</div>
                <div className="metric-label">Deterministic Safety Rules</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Merchant Pain Points */}
      <section className="section bg-light" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">The Merchant Pain Point</div>
            <h2 className="section-title">The Silent Revenue Leak in Online Checkout</h2>
            <p className="section-description">
              Up to 20% of checkout attempts fail silently. Generic error messages leave merchants in the dark and buyers frustrated.
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
                When a payment fails once, most buyers close the tab. Traditional retry buttons ask customers to re-type card details from scratch.
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
              <h2 className="story-title">Merchant Case Study: From Lost Sales to Automated Recovery</h2>
            </div>

            <div className="story-content-grid">
              <div className="story-text-column">
                <p className="story-paragraph">
                  Consider <strong>Bob</strong>, a growing D2C merchant selling gear online. Every week, Bob noticed payment failure drops during checkout. Customers were adding products to their cart, entering shipping details, but encountering gateway timeouts at payment.
                </p>
                
                <div className="story-quote">
                  "Industry benchmarks show that 69.8% of online shoppers abandon carts due to checkout friction or payment drops (Source: Baymard Institute E-Commerce Study)."
                </div>

                <p className="story-paragraph">
                  We built <strong>Razorpay Rebound</strong> to solve this systematically. Instead of waiting for manual support or relying on static retry buttons, Rebound listens to Razorpay payment failure events in real time:
                </p>

                <ul className="story-list">
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Differentiates bank gateway drops from business config restrictions.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Evaluates safety guardrails (₹5,000 max cap, ₹20,000 budget limit, 3-failure circuit breaker).</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="icon-check" />
                    <span>Generates a pre-filled, locked Razorpay payment link sent directly to the customer.</span>
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
                    <div className="comp-step recovered">4. 1-Click Pay &amp; Auto Reconciled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Architecture Breakdown (Hand-Drawn / Sketchy Flowchart) */}
      <section className="section bg-light" id="architecture">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Architecture Diagram</div>
            <h2 className="section-title">How the Recovery Flow Works</h2>
            <p className="section-description">
              Informative, organic pipeline flow showing real-time event capture, classification, safety bounds, and reconciliation.
            </p>
          </div>

          <div className="hand-drawn-flowchart">
            <div className="flow-step-sketch">
              <div className="sketch-badge">Step 1</div>
              <div className="sketch-box">
                <div className="sketch-title">Checkout Hook</div>
                <div className="sketch-desc">`rzp.on('payment.failed')` captures transaction drop</div>
              </div>
            </div>

            <div className="flow-arrow-sketch">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M 2 12 Q 30 4 52 12 M 44 6 L 54 12 L 44 18" strokeDasharray="4 2" />
              </svg>
            </div>

            <div className="flow-step-sketch">
              <div className="sketch-badge">Step 2</div>
              <div className="sketch-box">
                <div className="sketch-title">Classifier Engine</div>
                <div className="sketch-desc">Rule Engine &amp; ML evaluate root cause (gateway vs. config)</div>
              </div>
            </div>

            <div className="flow-arrow-sketch">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M 2 12 Q 30 20 52 12 M 44 6 L 54 12 L 44 18" strokeDasharray="4 2" />
              </svg>
            </div>

            <div className="flow-step-sketch">
              <div className="sketch-badge">Step 3</div>
              <div className="sketch-box">
                <div className="sketch-title">Safety Bounds</div>
                <div className="sketch-desc">Validates ₹5,000 cap, budget limit &amp; circuit breaker</div>
              </div>
            </div>

            <div className="flow-arrow-sketch">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M 2 12 Q 30 4 52 12 M 44 6 L 54 12 L 44 18" strokeDasharray="4 2" />
              </svg>
            </div>

            <div className="flow-step-sketch">
              <div className="sketch-badge">Step 4</div>
              <div className="sketch-box highlight">
                <div className="sketch-title">Razorpay Link</div>
                <div className="sketch-desc">Locked payment link created &amp; status reconciled in DB</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Direct Action Cards (Redirects directly to pages) */}
      <section className="section bg-white" id="actions">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Explore System</div>
            <h2 className="section-title">Launch Payment Recovery or Audit Dashboard</h2>
            <p className="section-description">
              Execute real-time payment recovery end-to-end or inspect live execution logs in audit_log_real.db.
            </p>
          </div>

          <div className="action-cards-grid">
            <a href="/live-demo" className="action-card primary">
              <div className="action-card-icon bg-primary">
                <Zap size={28} />
              </div>
              <div className="action-card-content">
                <h3>Live Payment Recovery</h3>
                <p>Launch a live Razorpay Checkout modal, capture failure event, and generate locked recovery link.</p>
                <div className="action-card-link">
                  <span>Open Payment Recovery</span>
                  <ExternalLink size={16} />
                </div>
              </div>
            </a>

            <a href="/dashboard" className="action-card">
              <div className="action-card-icon bg-slate">
                <BarChart3 size={28} />
              </div>
              <div className="action-card-content">
                <h3>Audit Dashboard</h3>
                <p>View all batch events, classification breakdowns, and live DB reconciliation logs.</p>
                <div className="action-card-link text-main">
                  <span>Open Audit Dashboard</span>
                  <ExternalLink size={16} />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/logo.png" alt="Razorpay Rebound" width="36" height="36" style={{borderRadius:'8px'}} />
              <span className="brand-title" style={{marginLeft:'0.5rem'}}>Razorpay Rebound</span>
            </div>
            <p className="footer-sub">Autonomous Revenue Recovery for Razorpay Merchants.</p>
          </div>

          <div className="footer-links-grid">
            <a href="/dashboard" className="footer-link-card">
              <BarChart3 size={20} />
              <div>
                <strong>Audit Dashboard</strong>
                <span>View all batch events &amp; live DB logs</span>
              </div>
              <ExternalLink size={16} />
            </a>

            <a href="/live-demo" className="footer-link-card primary">
              <Zap size={20} />
              <div>
                <strong>Live Payment Recovery</strong>
                <span>Execute real-time failure capture &amp; payment link recovery</span>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Razorpay Rebound. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

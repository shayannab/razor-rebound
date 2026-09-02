import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BobCharacter from './components/BobCharacter';
import ComputerMonitor from './components/ComputerMonitor';
import { 
  ArrowDown, 
  Search, 
  GitBranch, 
  Brain, 
  FileText, 
  Database, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Play
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Helper Workspace Desk component to render Bob sitting at his desk next to the monitor
const DeskWorkspace = ({ mood, monitorState }) => {
  const isBackView = mood.startsWith('back_');

  return (
    <div style={{ position: 'relative', width: '540px', height: '390px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', margin: '0 auto', overflow: 'hidden' }}>
      
      {/* Office Chair Back (Behind Bob in front view, but in front of Bob's lower torso in back view to hide cutoffs) */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '60px',
        width: '130px',
        height: '120px',
        background: '#475569',
        border: '5px solid #334155',
        borderRadius: '24px 24px 8px 8px',
        zIndex: isBackView ? 5 : 1
      }} />
      
      {/* Bob Character (sitting behind desk, pulled down to hide legs below desk) */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-110px', 
        left: '-50px', 
        zIndex: isBackView ? 4 : 2 
      }}>
        <BobCharacter mood={mood} size={330} />
      </div>

      {/* Computer Monitor (standing exactly on top of desk) */}
      <div style={{ 
        position: 'absolute', 
        bottom: '82px', 
        right: '20px', 
        zIndex: isBackView ? 2 : 4 
      }}>
        <ComputerMonitor state={monitorState} width={260} />
      </div>

      {/* Desk Surface (covers Bob's legs, monitor stands on top) */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        width: '520px',
        height: '32px',
        background: '#DDB892',
        border: '3px solid #B08968',
        borderRadius: '8px',
        boxShadow: '0 12px 24px -6px rgba(0,0,0,0.15)',
        zIndex: 3
      }} />
      
      {/* Desk Legs */}
      <div style={{ position: 'absolute', bottom: 0, left: '40px', width: '16px', height: '50px', background: '#7F5539', borderRadius: '0 0 6px 6px', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, right: '40px', width: '16px', height: '50px', background: '#7F5539', borderRadius: '0 0 6px 6px', zIndex: 1 }} />
    </div>
  );
};

function App() {
  const container = useRef();

  // Live Sandbox state
  const [sandboxEvent, setSandboxEvent] = useState(null);
  const [sandboxResult, setSandboxResult] = useState(null);
  const [sandboxStage, setSandboxStage] = useState('checkout'); // 'checkout' | 'failed' | 'pipeline' | 'success'
  const [activeStep, setActiveStep] = useState(-1);
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    const timeline = gsap.timeline();
    
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "+=5000",
      pin: true,
      scrub: 1.2,
      animation: timeline
        // Scene 1 to 2
        .to('.scene-1', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-2', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 2 to 3
        .to('.scene-2', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-3', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 3 to 4
        .to('.scene-3', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-4', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 4 to 5
        .to('.scene-4', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-5', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 5 to 6
        .to('.scene-5', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-6', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 6 to 7
        .to('.scene-5', { opacity: 0, scale: 0.95, y: -30, duration: 1 }) // GSAP needs simple chain
        .fromTo('.scene-7', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 7 to 8
        .to('.scene-7', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-8', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
        
        // Scene 8 to 9
        .to('.scene-8', { opacity: 0, scale: 0.95, y: -30, duration: 1 })
        .fromTo('.scene-9', { opacity: 0, scale: 1.05, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, "<0.4")
    });

  }, { scope: container });

  const pipelineStages = [
    { icon: <Search size={18} />, title: "1. Ingestion", desc: "Deduplicates events and validates basic payload structure.", color: "#3B82F6" },
    { icon: <GitBranch size={18} />, title: "2. Rule Engine", desc: "Precise matches on exact error/source code configurations.", color: "#10B981" },
    { icon: <Brain size={18} />, title: "3. ML Classifier", desc: "GradientBoosting predicts causes for complex, ambiguous parameters.", color: "#8B5CF6" },
    { icon: <FileText size={18} />, title: "4. Explanation Layer", desc: "Formats template explanations with strict PII safety rules.", color: "#F59E0B" },
    { icon: <Database size={18} />, title: "5. Audit Log", desc: "SQLite audit log records every classification decision (decision layer, confidence, cause, raw fields) before returning results.", color: "#EC4899" },
    { icon: <ShieldCheck size={18} />, title: "6. Orchestrator", desc: "Monitors overall stage executions. Safe diagnostic-only mode.", color: "#06B6D4" },
  ];

  const rootCauses = [
    { code: "3ds_enrollment_issue", percentage: "46.2%", desc: "Failed 3DS authentication checks.", action: "Complete 3DS or use alternative card types.", color: "#F59E0B" },
    { code: "risk_block", percentage: "16.1%", desc: "High fraud score or merchant risk warning.", action: "Examine security rules or contact checkout team.", color: "#EF4444" },
    { code: "bank_partner_restriction", percentage: "22.2%", desc: "Declined due to cross-border or partner restrictions.", action: "Escalate to merchant — requires config update or manual review.", color: "#8B5CF6" },
    { code: "integration_bug", percentage: "9.1%", desc: "Bad currency formats or merchant details.", action: "Fix transaction fields in checkout API payloads.", color: "#3B82F6" },
  ];

  const invariants = [
    { title: "Zero Money Movement", desc: "Safety first. Diagnostic pipeline cannot invoke active payment or retry APIs." },
    { title: "No LLM Outages", desc: "Template outputs prevent diagnostic failures or model hallucination risk." },
    { title: "Guaranteed Audit Flow", desc: "SQLite records every trace sequentially to ensure compliance." },
    { title: "Data Safety Guard", desc: "Raw input is blocked from exiting the explanation layers." },
  ];

  const loadRandomEvent = async () => {
    try {
      setLoading(false);
      setSandboxResult(null);
      setActiveStep(-1);
      const res = await fetch("http://localhost:8000/api/random_test_event");
      if (!res.ok) throw new Error("Backend offline");
      const event = await res.json();
      setSandboxEvent(event);
      setSandboxStage('failed'); // screen flashes red (payment failed)
    } catch (err) {
      alert("Error: Backend is offline. Please launch the FastAPI server first:\n\nuvicorn api:app --reload --port 8000");
    }
  };

  const runLivePipeline = async () => {
    if (!sandboxEvent) return;
    setLoading(true);
    setSandboxResult(null);
    setSandboxStage('pipeline'); // monitor screen shows decision chart

    // Simulated step-by-step console print animation
    setActiveStep(0);
    await new Promise(r => setTimeout(r, 300));
    setActiveStep(1);
    await new Promise(r => setTimeout(r, 300));
    setActiveStep(2);
    await new Promise(r => setTimeout(r, 300));
    setActiveStep(3);
    await new Promise(r => setTimeout(r, 300));
    setActiveStep(4);
    await new Promise(r => setTimeout(r, 300));
    setActiveStep(5);

    try {
      const res = await fetch("http://localhost:8000/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sandboxEvent)
      });
      if (!res.ok) throw new Error("Error running diagnosis");
      const result = await res.json();
      
      setSandboxResult(result);
      if (result.recovery_workflow !== 'none') {
        setSandboxStage('success'); // monitor turns green checkmark
      } else {
        setSandboxStage('failed'); // monitor stays red alert
      }
    } catch (err) {
      alert("Error running live diagnostics via FastAPI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={container} style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-wall)' }}>

      {/* SCENE 1: HERO */}
      <div className="scene-layer scene-1" style={{ backgroundColor: 'var(--bg-wall)' }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--primary)' }}>SaaS Payments</span>
              <h1 className="section-title">Meet Bob.<br/>He's building something great.</h1>
              <p className="section-subtitle">
                Bob just launched his new software globally. Orders are arriving, international clients are subscribing, and card payments are processing.
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
                <span className="pill">🌍 International SaaS</span>
                <span className="pill">💳 Credit Card Checkout</span>
              </div>
              <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>SCROLL DOWN TO HEAR THE STORY</span>
                <ArrowDown size={14} className="scroll-hint-arrow" />
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="back_happy" monitorState="checkout" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 2: CRYPTIC ERRORS */}
      <div className="scene-layer scene-2" style={{ backgroundColor: 'var(--bg-wall-red)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--warning)' }}>Payment Failures</span>
              <h1 className="section-title">Then the screen flashed red.</h1>
              <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                Bob's global users began encountering failed checkouts. Instead of clear reasons, Bob's developer portal was flooded with raw, unexplained logs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="card" style={{ borderLeft: '3px solid var(--error)', padding: '0.75rem 1rem' }}>
                  <code>ErrorCode: BAD_REQUEST_ERROR | Source: merchant</code>
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--warning)', padding: '0.75rem 1rem' }}>
                  <code>ErrorCode: CARD_NOT_ENROLLED | Source: bank</code>
                </div>
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="back_confused" monitorState="failed" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 3: THE PAIN & REVENUE LOSS */}
      <div className="scene-layer scene-3" style={{ backgroundColor: 'var(--bg-wall-red)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--error)' }}>Lost Revenue</span>
              <h1 className="section-title">Bob got frustrated.</h1>
              <p className="section-subtitle">
                With zero explanation about the errors, conversion rates plummeted. Bob spent hours guessing whether to tweak integration APIs or blame merchant rules.
              </p>
              <div className="stat-grid">
                <div className="stat-item" style={{ borderTop: '3px solid var(--error)' }}>
                  <div className="stat-num" style={{ color: 'var(--error)' }}>9</div>
                  <div className="stat-label">Total Batch Events</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(audit_log_real.db)</div>
                </div>
                <div className="stat-item" style={{ borderTop: '3px solid var(--error)' }}>
                  <div className="stat-num" style={{ color: 'var(--error)' }}>₹799.00</div>
                  <div className="stat-label">Auto-Executed Links</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(4 payment links created)</div>
                </div>
                <div className="stat-item" style={{ borderTop: '3px solid var(--error)' }}>
                  <div className="stat-num" style={{ color: 'var(--error)' }}>5</div>
                  <div className="stat-label">Held for Human Review</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(pending approval)</div>
                </div>
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="back_frustrated" monitorState="failed" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 4: DISCOVERY */}
      <div className="scene-layer scene-4" style={{ backgroundColor: 'var(--bg-wall-blue)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--primary)' }}>AI Diagnostics</span>
              <h1 className="section-title">Then, Bob found a way out.</h1>
              <p className="section-subtitle">
                Instead of guessing, he integrated the AI Revenue Recovery Diagnosis System to ingest checkout logs and deterministically find the root cause.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: 'fit-content' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>Automated 6-Stage Revenue Pipeline</span>
                </div>
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="walking" monitorState="pipeline" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 5: PIPELINE */}
      <div className="scene-layer scene-5" style={{ backgroundColor: 'var(--bg-wall-blue)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--primary)' }}>Pipeline Architecture</span>
              <h1 className="section-title">The 6-Stage Flow</h1>
              <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
                Every failed payment undergoes ingestion validation, deterministic rule filtering, ML classification, explanation generation, decision audit logging, and final orchestration.
              </p>
              <div className="pipeline-grid">
                {pipelineStages.map((stage, idx) => (
                  <div key={idx} className="pipeline-node" style={{ borderLeft: `3px solid ${stage.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: stage.color }}>{stage.icon}</span>
                      <strong style={{ fontSize: '0.85rem' }}>{stage.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="pointing" monitorState="pipeline" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 6: ROOT CAUSES */}
      <div className="scene-layer scene-6" style={{ backgroundColor: 'var(--bg-wall)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--purple)' }}>Clarity</span>
              <h1 className="section-title">Categorizing failures with precision.</h1>
              <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                The diagnostics engine parses inputs and presents simple, transparent explanations to Bob's developers and support reps.
              </p>
              <div className="rc-list">
                {rootCauses.map((rc, idx) => (
                  <div key={idx} className="rc-item" style={{ borderLeft: `3px solid ${rc.color}`, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="rc-code" style={{ background: `${rc.color}15`, color: rc.color, fontFamily: 'JetBrains Mono', fontSize: '0.78rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{rc.code}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(30, 41, 59, 0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>{rc.percentage} of failures</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{rc.desc}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span style={{ color: rc.color }}>👉 Next Step:</span> {rc.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="nodding" monitorState="pipeline" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 7: TRUST INVARIANTS */}
      <div className="scene-layer scene-7" style={{ backgroundColor: 'var(--bg-wall)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--success)' }}>Security</span>
              <h1 className="section-title">Deterministic constraints.</h1>
              <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
                Built strictly to ensure safety. The software enforces four invariants to avoid live API errors and protect client privacy.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {invariants.map((item, idx) => (
                  <div key={idx} className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Lock size={15} color="var(--success)" />
                      <strong style={{ fontSize: '0.9rem' }}>{item.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="nodding" monitorState="pipeline" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 8: THE RESULT */}
      <div className="scene-layer scene-8" style={{ backgroundColor: 'var(--bg-wall-green)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col">
            <div className="text-col">
              <span className="section-label" style={{ color: 'var(--success)' }}>Resolution</span>
              <h1 className="section-title">Bob recovered the revenue!</h1>
              <p className="section-subtitle">
                With real-time suggestions and reliable error tracking, failed payments were quickly rectified. The SaaS checkouts are now healthier than ever.
              </p>
              <div className="stat-grid">
                <div className="stat-item" style={{ borderTop: '3px solid var(--success)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <div className="stat-num" style={{ color: 'var(--success)' }}>₹799.00</div>
                  <div className="stat-label">Auto-Executed Links</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(4 recovery links sent)</div>
                </div>
                <div className="stat-item" style={{ borderTop: '3px solid var(--success)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <div className="stat-num" style={{ color: 'var(--success)' }}>5</div>
                  <div className="stat-label">Held for Human Review</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(held safely for approval)</div>
                </div>
                <div className="stat-item" style={{ borderTop: '3px solid var(--success)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <div className="stat-num" style={{ color: 'var(--success)' }}>100%</div>
                  <div className="stat-label">Audit Logs Saved</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>(audit_log_real.db)</div>
                </div>
              </div>
            </div>
            <div className="visual-col">
              <DeskWorkspace mood="celebrating" monitorState="success" />
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 9: CTA & FOOTER (Live Sandbox Integration) */}
      <div className="scene-layer scene-9" style={{ backgroundColor: 'var(--bg-wall)', opacity: 0 }}>
        <div className="scene-content">
          <div className="two-col" style={{ marginBottom: '4rem', alignItems: 'stretch' }}>
            
            <div className="text-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
              <div>
                <span className="section-label" style={{ color: 'var(--primary)' }}>Live Sandbox</span>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Try AI Diagnostics Live</h1>
                <p className="section-subtitle" style={{ fontSize: '0.95rem' }}>
                  Load a random international payment failure from our test batch, run it through the 6-stage telemetry engine, and see the recovery recommendation.
                </p>
              </div>

              {/* Interactive developer sandbox console */}
              <div className="card" style={{ background: '#0F172A', color: '#F1F5F9', border: '1px solid #1E293B', padding: '1.2rem', borderRadius: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', width: '100%', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '0.6rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.6rem', marginBottom: '0.4rem' }}>
                  <button 
                    onClick={loadRandomEvent} 
                    className="pill" 
                    style={{ background: '#1E293B', color: '#F1F5F9', border: '1px solid #334155', cursor: 'pointer', fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                  >
                    🎲 Load Random Event
                  </button>
                  <button 
                    onClick={runLivePipeline} 
                    disabled={!sandboxEvent || loading}
                    className="pill" 
                    style={{ background: sandboxEvent && !loading ? 'var(--primary)' : '#1E293B', color: '#F1F5F9', border: 'none', cursor: sandboxEvent && !loading ? 'pointer' : 'not-allowed', fontSize: '0.7rem', padding: '0.3rem 0.6rem', opacity: sandboxEvent && !loading ? 1 : 0.5 }}
                  >
                    ⚡ Run Diagnostics
                  </button>
                </div>

                {!sandboxEvent && (
                  <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', fontSize: '0.72rem' }}>
                    Click "Load Random Event" to query the FastAPI backend...
                  </div>
                )}

                {sandboxEvent && !loading && !sandboxResult && (
                  <div>
                    <div style={{ color: '#10B981', marginBottom: '0.35rem', fontWeight: 600 }}>&gt; Event loaded: {sandboxEvent.payment_id}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: '#94A3B8', fontSize: '0.72rem', background: 'rgba(30, 41, 59, 0.25)', padding: '0.6rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
                      <div>Amount: ${sandboxEvent.amount} {sandboxEvent.currency}</div>
                      <div>Card: {sandboxEvent.card_network} ({sandboxEvent.card_sub_type})</div>
                      <div>Error Code: <span style={{ color: '#ef4444' }}>{sandboxEvent.error_code}</span></div>
                      <div>Source: {sandboxEvent.error_source}</div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', color: '#F59E0B', marginTop: '0.2rem' }}>
                    <div style={{ opacity: activeStep >= 0 ? 1 : 0.3 }}>[1/6] Ingesting & deduplicating... OK</div>
                    <div style={{ opacity: activeStep >= 1 ? 1 : 0.3 }}>[2/6] Evaluating Rule Engine... {activeStep >= 2 && sandboxResult && sandboxResult.decision_layer === 'rule_engine' ? `Match found (${sandboxResult.root_cause})` : activeStep >= 1 ? 'Unknown fallthrough' : ''}</div>
                    <div style={{ opacity: activeStep >= 2 ? 1 : 0.3 }}>[3/6] Running ML Classifier... {activeStep >= 3 && sandboxResult && sandboxResult.decision_layer !== 'rule_engine' ? `Predictive class: ${sandboxResult.root_cause} (Conf: ${(sandboxResult.confidence * 100).toFixed(0)}%)` : activeStep >= 2 ? 'Skipped (matched rules)' : ''}</div>
                    <div style={{ opacity: activeStep >= 3 ? 1 : 0.3 }}>[4/6] Generating Explanation templates... OK</div>
                    <div style={{ opacity: activeStep >= 4 ? 1 : 0.3 }}>[5/6] Committing Audit Log (SQLite)... OK (ID: #{sandboxResult?.audit_id})</div>
                    <div style={{ opacity: activeStep >= 5 ? 1 : 0.3 }}>[6/6] Mapping Bounded Recovery Workflow... OK</div>
                  </div>
                )}

                {sandboxResult && !loading && (
                  <div style={{ borderTop: '1px solid #1E293B', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ DIAGNOSIS COMPLETE</span>
                      <span style={{ fontSize: '0.65rem', background: '#1E293B', color: '#94A3B8', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid #334155' }}>Audit ID: #{sandboxResult.audit_id}</span>
                    </div>
                    <div style={{ color: '#E2E8F0', marginTop: '0.15rem' }}>
                      <strong style={{ color: '#F59E0B' }}>Root Cause:</strong> {sandboxResult.root_cause} 
                      <span style={{ color: '#94A3B8', fontSize: '0.65rem', marginLeft: '0.4rem' }}>({(sandboxResult.confidence * 100).toFixed(0)}% confidence via {sandboxResult.decision_layer})</span>
                    </div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.72rem', lineHeight: 1.35 }}>{sandboxResult.explanation}</div>
                    <div style={{ color: '#818CF8', fontSize: '0.72rem', fontWeight: 600 }}>👉 Next Step: {sandboxResult.next_step}</div>
                    <div style={{ color: sandboxResult.recovery_workflow === 'none' ? '#EF4444' : '#10B981', background: sandboxResult.recovery_workflow === 'none' ? '#EF444415' : '#10B98115', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.2rem', fontSize: '0.72rem', border: `1px solid ${sandboxResult.recovery_workflow === 'none' ? '#EF444425' : '#10B98125'}` }}>
                      <strong>Recovery Workflow:</strong> {sandboxResult.recovery_workflow === 'none' ? 'Manual review required (high fraud risk/code error)' : `${sandboxResult.recovery_workflow} (status: ${sandboxResult.recovery_status})`}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="visual-col" style={{ display: 'flex', alignItems: 'center' }}>
              <DeskWorkspace mood="waving" monitorState={sandboxStage} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Razorpay Buildathon 2026</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>AI Revenue Recovery Diagnosis System</p>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Built with React + GSAP ScrollTrigger</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;

import React from 'react';
import { ShieldCheck, Brain, GitBranch, Search, FileText, Database } from 'lucide-react';

const Scene3Feature = () => {
  const pipelineStages = [
    { 
      icon: <Search size={24} />, 
      title: "1. Ingestion", 
      desc: "Deduplicates by payment_id, validates required fields, fails early on missing data.",
      color: '#818cf8'
    },
    { 
      icon: <GitBranch size={24} />, 
      title: "2. Rule Engine", 
      desc: "Deterministic match on (error_code, error_source) tuples. Exact cause in milliseconds.",
      color: '#6366f1'
    },
    { 
      icon: <Brain size={24} />, 
      title: "3. ML Classifier", 
      desc: "GradientBoosting model kicks in only for ambiguous cases. Escalates if confidence < 60%.",
      color: '#a78bfa'
    },
    { 
      icon: <FileText size={24} />, 
      title: "4. Explanation Layer", 
      desc: "Template-based, PII-safe explanations. Structurally impossible to leak raw payment data.",
      color: '#c4b5fd'
    },
    { 
      icon: <Database size={24} />, 
      title: "5. Audit Log", 
      desc: "Append-only SQLite. Every decision is logged before it's returned. Write fails = pipeline aborts.",
      color: '#e0e7ff'
    },
    { 
      icon: <ShieldCheck size={24} />, 
      title: "6. Orchestrator", 
      desc: "Wires all stages sequentially. No money movement. Diagnosis only. Zero retry risk.",
      color: '#f0fdf4'
    },
  ];

  return (
    <div className="scene-container" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1a1a2e 50%, #0f172a 100%)',
      color: 'white'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ 
            color: '#22c55e', fontWeight: 600, fontSize: '0.875rem', 
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' 
          }}>
            ✨ The Solution
          </p>
          <h1 className="title" style={{ 
            color: 'white', fontSize: '3rem',
            background: 'linear-gradient(90deg, #22c55e, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            AI Revenue Recovery
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            A 6-stage diagnosis pipeline that classifies <strong style={{ color: '#e2e8f0' }}>exactly why</strong> international 
            card payments fail — and tells Bob <strong style={{ color: '#e2e8f0' }}>exactly what to do</strong> about it.
          </p>
        </div>
        
        {/* Pipeline visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {pipelineStages.map((stage, i) => (
            <div key={i} className="feature-card" style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #334155',
              transition: 'transform 0.3s, border-color 0.3s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = stage.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#334155';
            }}
            >
              <div style={{ color: stage.color, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {stage.icon}
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{stage.title}</span>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.875rem' }}>{stage.desc}</p>
            </div>
          ))}
        </div>

        {/* Hard invariants bar */}
        <div style={{ 
          marginTop: '2rem', padding: '1rem 1.5rem', borderRadius: '12px',
          background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap'
        }}>
          {['🚫 No Money Movement', '🔒 PII-Safe Explanations', '📝 Guaranteed Audit Trail', '🤖 No Live LLMs'].map((inv, i) => (
            <span key={i} style={{ color: '#86efac', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.02em' }}>{inv}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scene3Feature;

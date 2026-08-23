import React from 'react';
import successImg from '../assets/happy_bob.jpg';

const Scene4Success = () => {
  // Sample root causes from the actual system
  const rootCauses = [
    { 
      code: '3ds_enrollment_issue', 
      explanation: 'Card not enrolled in 3D Secure or failed 3DS authentication.',
      action: 'Nudge the customer to use a different card or complete 3DS authentication.',
      color: '#f59e0b'
    },
    { 
      code: 'risk_block', 
      explanation: 'Gateway blocked this transaction due to high fraud risk indicators.',
      action: 'Review the customer\'s risk profile or contact gateway support.',
      color: '#ef4444'
    },
    { 
      code: 'bank_partner_restriction', 
      explanation: 'Acquiring bank blocked due to cross-border or MCC restrictions.',
      action: 'Route through a different acquiring partner that supports this region.',
      color: '#8b5cf6'
    },
    { 
      code: 'integration_bug', 
      explanation: 'Merchant integration sent an invalid request (malformed payload).',
      action: 'Developer intervention: Check the API request payload for errors.',
      color: '#3b82f6'
    },
  ];

  return (
    <div className="scene-container" style={{ 
      background: 'linear-gradient(135deg, #052e16 0%, #0f172a 50%, #052e16 100%)',
      color: 'white'
    }}>
      {/* Green glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="content-wrapper" style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ flex: 1.2 }}>
            <p style={{ 
              color: '#22c55e', fontWeight: 600, fontSize: '0.875rem', 
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' 
            }}>
              🎉 The Result
            </p>
            <h1 className="title" style={{ color: '#dcfce7', fontSize: '3rem' }}>
              Bob finally <span style={{ color: '#22c55e' }}>knows why</span>.
            </h1>
            <p className="subtitle" style={{ color: '#86efac', lineHeight: 1.7 }}>
              Every failed payment now comes with a <strong>root cause classification</strong>, a 
              <strong> plain-English explanation</strong>, and <strong>actionable next steps</strong> — 
              all backed by a tamper-proof audit trail.
            </p>

            {/* Results stats */}
            <div style={{ 
              display: 'flex', gap: '1.5rem', marginTop: '2rem'
            }}>
              {[
                { num: '5', label: 'Root Causes Classified', icon: '🎯' },
                { num: '< 50ms', label: 'Per-Event Latency', icon: '⚡' },
                { num: '100%', label: 'Audit Coverage', icon: '📋' },
              ].map((stat, i) => (
                <div key={i} style={{ 
                  flex: 1, padding: '1rem', borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{stat.num}</div>
                  <div style={{ fontSize: '0.75rem', color: '#86efac' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample diagnoses */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rootCauses.map((rc, i) => (
                <div key={i} style={{
                  padding: '1rem 1.25rem', borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155',
                  borderLeft: `3px solid ${rc.color}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <code style={{ 
                      background: 'rgba(0,0,0,0.3)', padding: '0.15rem 0.5rem', borderRadius: '4px',
                      fontSize: '0.7rem', color: rc.color, fontWeight: 600
                    }}>{rc.code}</code>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}>{rc.explanation}</p>
                  <p style={{ color: '#22c55e', fontSize: '0.75rem', marginTop: '0.25rem' }}>→ {rc.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="#" className="btn" style={{ 
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px'
          }}>
            See the Live Demo →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Scene4Success;

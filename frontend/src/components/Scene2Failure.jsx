import React from 'react';
import errorImg from '../assets/payment_failed.jpg';

const Scene2Failure = () => {
  return (
    <div className="scene-container" style={{ 
      background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1111 50%, #1a0a0a 100%)',
      color: 'white'
    }}>
      {/* Red pulsing glow overlay */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '4rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', 
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' 
          }}>
            ⚠️ The Problem
          </p>
          <h1 className="title" style={{ color: '#fecaca' }}>
            Then the <span style={{ color: '#ef4444' }}>drop-offs</span> started.
          </h1>
          <p className="subtitle" style={{ color: '#fca5a5', lineHeight: 1.7 }}>
            International card payments began failing silently. 
            Bob's dashboard showed cryptic error codes — <code style={{ 
              background: '#7f1d1d', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85em'
            }}>BAD_REQUEST_ERROR</code>, <code style={{ 
              background: '#7f1d1d', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85em'
            }}>CARD_NOT_ENROLLED</code> — but no explanation of <strong>why</strong> or <strong>what to do next</strong>.
          </p>
          
          {/* Stats showing the pain */}
          <div style={{ 
            display: 'flex', gap: '2rem', marginTop: '2.5rem', 
            padding: '1.5rem', borderRadius: '16px', 
            background: 'rgba(127, 29, 29, 0.3)', border: '1px solid rgba(239,68,68,0.2)'
          }}>
            {[
              { num: '23%', label: 'Payment Failure Rate' },
              { num: '₹4.7L', label: 'Monthly Revenue Lost' },
              { num: '0', label: 'Actionable Insights' },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{stat.num}</div>
                <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={errorImg} alt="Payment Failed" className="illustration" 
            style={{ borderRadius: '24px', border: '2px solid rgba(239,68,68,0.4)' }} />
        </div>
      </div>
    </div>
  );
};

export default Scene2Failure;

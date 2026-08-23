import React from 'react';
import heroImg from '../assets/bob_at_desk.jpg';

const Scene1Hero = () => {
  return (
    <div className="scene-container" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: 'white'
    }}>
      {/* Subtle grid pattern overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4rem' }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            color: '#818cf8', fontWeight: 600, fontSize: '0.875rem', 
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' 
          }}>
            Razorpay Buildathon 2026
          </p>
          <h1 className="title" style={{ color: 'white' }}>
            Meet Bob.<br/>
            <span style={{ 
              background: 'linear-gradient(90deg, #818cf8, #6366f1, #4f46e5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>He runs a growing SaaS.</span>
          </h1>
          <p className="subtitle" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
            Bob just launched his product globally. Customers from 12 countries are signing up. 
            International payments are flowing in through Razorpay. Life is good... <em>or so he thinks.</em>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '999px',
              border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem'
            }}>🌍 International Payments</span>
            <span style={{ 
              display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '999px',
              border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem'
            }}>💳 Card Transactions</span>
            <span style={{ 
              display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '999px',
              border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem'
            }}>📈 Growing Revenue</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={heroImg} alt="Bob at desk" className="illustration" 
            style={{ borderRadius: '24px', border: '1px solid #334155' }} />
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        animation: 'bounce 2s infinite'
      }}>
        <span style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SCROLL TO BEGIN</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3L10 17M10 17L16 11M10 17L4 11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default Scene1Hero;

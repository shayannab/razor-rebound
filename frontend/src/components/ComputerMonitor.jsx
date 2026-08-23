import React from 'react';

/**
 * A stylized vector Computer Monitor showing different payment gateway states.
 * Props:
 *   state: 'checkout' | 'failed' | 'pipeline' | 'success'
 *   width: number (default 260)
 */
const ComputerMonitor = ({ state = 'checkout', width = 260 }) => {
  const height = width * 0.75;

  const renderScreenContent = () => {
    switch (state) {
      case 'checkout':
        return (
          <g>
            {/* Screen background (clean checkout page) */}
            <rect x="10" y="10" width="180" height="110" fill="#FFFFFF" rx="4" />
            {/* Top bar (browser header) */}
            <rect x="10" y="10" width="180" height="10" fill="#E2E8F0" rx="2" />
            <circle cx="16" cy="15" r="2" fill="#EF4444" />
            <circle cx="22" cy="15" r="2" fill="#F59E0B" />
            <circle cx="28" cy="15" r="2" fill="#10B981" />
            <rect x="36" y="13" width="80" height="4" rx="2" fill="#CBD5E1" />
            
            {/* Payment form elements */}
            <rect x="20" y="30" width="100" height="8" rx="2" fill="#E2E8F0" />
            <rect x="20" y="44" width="70" height="6" rx="2" fill="#CBD5E1" />
            
            <rect x="20" y="58" width="100" height="12" rx="3" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="28" cy="64" r="3" fill="#94A3B8" />
            <rect x="36" y="62" width="50" height="4" rx="1.5" fill="#94A3B8" />

            {/* Input fields */}
            <rect x="20" y="76" width="45" height="10" rx="3" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="75" y="76" width="45" height="10" rx="3" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />

            {/* Order summary on right */}
            <rect x="130" y="30" width="50" height="40" rx="4" fill="#F8FAFC" />
            <rect x="136" y="36" width="38" height="4" rx="2" fill="#E2E8F0" />
            <rect x="136" y="44" width="28" height="4" rx="2" fill="#CBD5E1" />
            <rect x="136" y="58" width="38" height="6" rx="2" fill="#3B82F6" />

            {/* Checkout CTA button (Pay Now) */}
            <rect x="20" y="94" width="100" height="14" rx="4" fill="#3B82F6" className="screen-btn-pulse" />
            <rect x="50" y="99" width="40" height="4" rx="2" fill="#FFFFFF" />
          </g>
        );

      case 'failed':
        return (
          <g>
            {/* Flashing red screen background */}
            <rect x="10" y="10" width="180" height="110" fill="#FEF2F2" rx="4" stroke="#EF4444" strokeWidth="2" />
            
            {/* Top browser bar */}
            <rect x="10" y="10" width="180" height="10" fill="#FCA5A5" rx="2" />
            <circle cx="16" cy="15" r="2" fill="#EF4444" />
            <circle cx="22" cy="15" r="2" fill="#F59E0B" />
            <circle cx="28" cy="15" r="2" fill="#10B981" />
            
            {/* Large Alert Icon */}
            <circle cx="100" cy="50" r="16" fill="#EF4444" />
            <line x1="100" y1="42" x2="100" y2="52" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="58" r="2" fill="#FFFFFF" />

            {/* FAILED TEXT */}
            <text x="100" y="82" textAnchor="middle" fontSize="9" fontWeight="900" fill="#EF4444" letterSpacing="0.05em">PAYMENT FAILED</text>
            
            {/* Action suggestions on screen */}
            <rect x="40" y="94" width="120" height="14" rx="3" fill="#EF4444" opacity="0.1" />
            <text x="100" y="103" textAnchor="middle" fontSize="6" fontWeight="600" fill="#B91C1C">ERR: CARD_NOT_ENROLLED</text>
          </g>
        );

      case 'pipeline':
        return (
          <g>
            {/* Clean white dashboard */}
            <rect x="10" y="10" width="180" height="110" fill="#F8FAFC" rx="4" />
            {/* Top browser bar */}
            <rect x="10" y="10" width="180" height="10" fill="#E2E8F0" rx="2" />
            
            {/* Header Title inside Dashboard */}
            <text x="25" y="30" fontSize="7" fontWeight="800" fill="#475569" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>DECISION SPLIT</text>
            <text x="25" y="38" fontSize="4.5" fill="#94A3B8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Real-time batch execution profile</text>

            {/* Stacked horizontal bar chart representing actual Rule / ML / Escalation split */}
            {/* Rule Engine: 90.1% */}
            <rect x="25" y="48" width="135" height="10" rx="2" fill="#10B981" />
            {/* ML Classifier: 9.4% */}
            <rect x="162" y="48" width="14" height="10" rx="2" fill="#8B5CF6" />
            {/* Escalated: 0.5% */}
            <rect x="178" y="48" width="2" height="10" rx="0.5" fill="#EF4444" />
            
            {/* Legend */}
            {/* Rule Engine Indicator */}
            <circle cx="28" cy="70" r="2.5" fill="#10B981" />
            <text x="36" y="72" fontSize="5.5" fontWeight="700" fill="#475569" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Rule Engine (90.1%)</text>
            
            {/* ML Classifier Indicator */}
            <circle cx="28" cy="82" r="2.5" fill="#8B5CF6" />
            <text x="36" y="84" fontSize="5.5" fontWeight="700" fill="#475569" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>ML Classifier (9.4%)</text>
            
            {/* Escalated Indicator */}
            <circle cx="28" cy="94" r="2.5" fill="#EF4444" />
            <text x="36" y="96" fontSize="5.5" fontWeight="700" fill="#475569" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Escalated / Unknown (0.5%)</text>
          </g>
        );

      case 'success':
        return (
          <g>
            {/* Success green background */}
            <rect x="10" y="10" width="180" height="110" fill="#F0FDF4" rx="4" stroke="#10B981" strokeWidth="2" />
            
            {/* Top browser bar */}
            <rect x="10" y="10" width="180" height="10" fill="#A7F3D0" rx="2" />
            
            {/* Success badge */}
            <circle cx="100" cy="50" r="16" fill="#10B981" />
            <path d="M93 50 L98 55 L108 43" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* SUCCESS TEXT */}
            <text x="100" y="82" textAnchor="middle" fontSize="9" fontWeight="900" fill="#10B981" letterSpacing="0.05em">SUCCESSFUL</text>
            <text x="100" y="96" textAnchor="middle" fontSize="6" fontWeight="500" fill="#047857">Revenue Recovered</text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className={`computer-monitor state-${state}`}
    >
      {/* Monitor frame outer body */}
      <rect x="2" y="2" width="196" height="126" fill="#475569" rx="8" />
      {/* Stand column */}
      <rect x="85" y="126" width="30" height="18" fill="#334155" />
      {/* Stand base plate */}
      <ellipse cx="100" cy="144" rx="30" ry="4" fill="#334155" />
      
      {/* Inner display screen border */}
      <rect x="8" y="8" width="184" height="114" fill="#0F172A" rx="5" />
      
      {/* Dynamic screen content */}
      {renderScreenContent()}
    </svg>
  );
};

export default ComputerMonitor;

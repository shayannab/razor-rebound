import React from 'react';

/**
 * Pure SVG Bob Character with realistic proportions.
 * Supports both front and back views.
 * Props:
 *   mood: 'happy' | 'confused' | 'frustrated' | 'walking' | 'pointing' | 'nodding' | 'celebrating' | 'waving' | 'back_happy' | 'back_confused' | 'back_frustrated'
 *   size: number (default 200)
 *   showLegs: boolean (default false, since Bob sits behind the desk in the workspace layout)
 */
const BobCharacter = ({ mood = 'happy', size = 200, showLegs = false }) => {
  const scale = size / 200;

  // Shared head components
  const head = (faceColor = '#FBBF24') => (
    <g className="bob-head">
      {/* Hair */}
      <ellipse cx="100" cy="36" rx="21" ry="18" fill="#4A3728" />
      {/* Face */}
      <ellipse cx="100" cy="42" rx="17" ry="17" fill={faceColor} />
      {/* Eyes */}
      {mood === 'frustrated' ? (
        <>
          <line x1="91" y1="39" x2="96" y2="43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
          <line x1="96" y1="39" x2="91" y2="43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
          <line x1="104" y1="39" x2="109" y2="43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
          <line x1="109" y1="39" x2="104" y2="43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : mood === 'celebrating' ? (
        <>
          <path d="M90 40 Q94 36 98 40" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M102 40 Q106 36 110 40" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <circle cx="94" cy="40" r="2.2" fill="#1e293b" />
          <circle cx="106" cy="40" r="2.2" fill="#1e293b" />
        </>
      )}
      {/* Mouth */}
      {mood === 'happy' || mood === 'celebrating' || mood === 'waving' ? (
        <path d="M94 49 Q100 55 106 49" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      ) : mood === 'frustrated' ? (
        <path d="M94 51 Q100 45 106 51" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      ) : mood === 'confused' ? (
        <circle cx="100" cy="50" rx="3" ry="2" fill="#1e293b" opacity="0.7"/>
      ) : (
        <line x1="95" y1="50" x2="105" y2="50" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round"/>
      )}
      {/* Confused question mark */}
      {mood === 'confused' && (
        <text x="122" y="28" fontSize="18" fontWeight="800" fill="#ef4444" className="bob-question">?</text>
      )}
      {/* Frustrated sweat drops */}
      {mood === 'frustrated' && (
        <>
          <circle cx="122" cy="30" r="2" fill="#60a5fa" opacity="0.7" className="bob-sweat"/>
          <circle cx="78" cy="32" r="1.5" fill="#60a5fa" opacity="0.5" className="bob-sweat-2"/>
        </>
      )}
    </g>
  );

  const body = (shirtColor = '#3B82F6') => (
    <g className="bob-body">
      {/* Neck */}
      <rect x="96" y="56" width="8" height="12" rx="2" fill="#FBBF24" />
      {/* Torso */}
      <path d="M78 66 C78 63, 122 63, 122 66 L124 136 C124 139, 76 139, 76 136 Z" fill={shirtColor} />
      {/* Collar */}
      <path d="M93 66 L100 74 L107 66" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
    </g>
  );

  const legs = () => (
    <g className="bob-legs">
      <rect x="80" y="136" width="18" height="70" rx="3" fill="#1e293b" />
      <rect x="102" y="136" width="18" height="70" rx="3" fill="#1e293b" />
      <ellipse cx="89" cy="209" rx="11" ry="5" fill="#78716c" />
      <ellipse cx="111" cy="209" rx="11" ry="5" fill="#78716c" />
    </g>
  );

  const walkingLegs = () => (
    <g className="bob-legs bob-walk-legs">
      <rect x="80" y="136" width="18" height="70" rx="3" fill="#1e293b" className="bob-leg-left"/>
      <rect x="102" y="136" width="18" height="70" rx="3" fill="#1e293b" className="bob-leg-right"/>
      <ellipse cx="89" cy="209" rx="11" ry="5" fill="#78716c" className="bob-foot-left"/>
      <ellipse cx="111" cy="209" rx="11" ry="5" fill="#78716c" className="bob-foot-right"/>
    </g>
  );

  const renderPose = () => {
    switch (mood) {
      case 'happy':
        return (
          <g className="bob-pose-happy">
            {head()}
            {body()}
            <path d="M78 72 Q64 90, 58 115" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="57" cy="116" r="5" fill="#FBBF24"/>
            <path d="M122 72 Q136 90, 142 115" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="143" cy="116" r="5" fill="#FBBF24"/>
            {showLegs && legs()}
          </g>
        );

      case 'confused':
        return (
          <g className="bob-pose-confused">
            {head('#FBBF24')}
            {body('#6366f1')}
            <path d="M122 72 Q138 62, 128 38" stroke="#6366f1" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="127" cy="36" r="5" fill="#FBBF24"/>
            <path d="M78 72 Q64 88, 58 115" stroke="#6366f1" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="57" cy="116" r="5" fill="#FBBF24"/>
            {showLegs && legs()}
          </g>
        );

      case 'frustrated':
        return (
          <g className="bob-pose-frustrated bob-shake">
            {head('#FCA5A5')}
            {body('#ef4444')}
            <path d="M78 72 Q62 58, 80 38" stroke="#ef4444" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="81" cy="36" r="5" fill="#FBBF24"/>
            <path d="M122 72 Q138 58, 120 38" stroke="#ef4444" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="119" cy="36" r="5" fill="#FBBF24"/>
            {showLegs && legs()}
          </g>
        );

      case 'walking':
        return (
          <g className="bob-pose-walking bob-bounce">
            {head()}
            {body('#3B82F6')}
            <path d="M78 72 Q58 90, 62 120" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round" className="bob-arm-swing-left"/>
            <circle cx="61" cy="121" r="5" fill="#FBBF24" className="bob-hand-swing-left"/>
            <path d="M122 72 Q142 80 138 100" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round" className="bob-arm-swing-right"/>
            <circle cx="139" cy="101" r="5" fill="#FBBF24" className="bob-hand-swing-right"/>
            {showLegs && walkingLegs()}
          </g>
        );

      case 'pointing':
        return (
          <g className="bob-pose-pointing">
            {head()}
            {body('#2563eb')}
            <path d="M78 72 Q64 88, 58 115" stroke="#2563eb" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="57" cy="116" r="5" fill="#FBBF24"/>
            <path d="M122 72 Q148 68, 162 65" stroke="#2563eb" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="163" cy="64" r="5" fill="#FBBF24"/>
            <line x1="166" y1="63" x2="178" y2="60" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>
            {showLegs && legs()}
          </g>
        );

      case 'nodding':
        return (
          <g className="bob-pose-nodding bob-nod">
            {head()}
            {body('#0ea5e9')}
            <path d="M78 76 Q90 90, 120 82" stroke="#0ea5e9" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <path d="M122 76 Q110 90, 80 82" stroke="#0ea5e9" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="118" cy="82" r="5" fill="#FBBF24"/>
            <circle cx="82" cy="82" r="5" fill="#FBBF24"/>
            {showLegs && legs()}
          </g>
        );

      case 'celebrating':
        return (
          <g className="bob-pose-celebrating bob-jump">
            {head('#FBBF24')}
            {body('#22c55e')}
            <path d="M78 72 Q58 45, 52 24" stroke="#22c55e" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="51" cy="23" r="5" fill="#FBBF24"/>
            <path d="M122 72 Q142 45 148 24" stroke="#22c55e" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="149" cy="23" r="5" fill="#FBBF24"/>
            <rect x="40" y="10" width="5" height="5" fill="#f59e0b" className="confetti-1" opacity="0.8"/>
            <rect x="160" y="8" width="4" height="4" fill="#ef4444" className="confetti-2" opacity="0.8"/>
            {showLegs && legs()}
          </g>
        );

      case 'waving':
        return (
          <g className="bob-pose-waving">
            {head()}
            {body('#3B82F6')}
            <path d="M78 72 Q64 88, 58 115" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="57" cy="116" r="5" fill="#FBBF24"/>
            <path d="M122 72 Q138 52, 136 28" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="136" cy="26" r="5" fill="#FBBF24" className="bob-wave-hand"/>
            {showLegs && legs()}
          </g>
        );

      /* ===== BOB FROM BEHIND POSES ===== */
      case 'back_happy':
        return (
          <g className="bob-pose-back-happy">
            <rect x="96" y="56" width="8" height="12" rx="1.5" fill="#E2A65E" />
            <path d="M78 66 C78 63, 122 63, 122 66 L124 136 Z" fill="#3B82F6" />
            <ellipse cx="100" cy="36" rx="21" ry="18" fill="#4A3728" />
            <ellipse cx="100" cy="42" rx="17" ry="17" fill="#4A3728" />
            <circle cx="78" cy="42" r="3.5" fill="#E2A65E" />
            <circle cx="122" cy="42" r="3.5" fill="#E2A65E" />
            <path d="M78 72 Q64 82, 80 95" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round" className="bob-arm-swing-left" />
            <path d="M122 72 Q136 82, 120 95" stroke="#3B82F6" strokeWidth="9" fill="none" strokeLinecap="round" className="bob-arm-swing-right" />
            <circle cx="80" cy="95" r="5" fill="#E2A65E" />
            <circle cx="120" cy="95" r="5" fill="#E2A65E" />
          </g>
        );

      case 'back_confused':
        return (
          <g className="bob-pose-back-confused">
            <rect x="96" y="56" width="8" height="12" rx="1.5" fill="#E2A65E" />
            <path d="M78 66 C78 63, 122 63, 122 66 L124 136 Z" fill="#6366f1" />
            <ellipse cx="100" cy="36" rx="21" ry="18" fill="#4A3728" />
            <ellipse cx="100" cy="42" rx="17" ry="17" fill="#4A3728" />
            <circle cx="78" cy="42" r="3.5" fill="#E2A65E" />
            <circle cx="122" cy="42" r="3.5" fill="#E2A65E" />
            <path d="M122 72 Q138 62, 128 38" stroke="#6366f1" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="127" cy="36" r="5" fill="#E2A65E"/>
            <path d="M78 72 Q64 82, 70 105" stroke="#6366f1" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="70" cy="106" r="5" fill="#E2A65E"/>
            <text x="122" y="28" fontSize="18" fontWeight="800" fill="#ef4444" className="bob-question">?</text>
          </g>
        );

      case 'back_frustrated':
        return (
          <g className="bob-pose-back-frustrated bob-shake">
            <rect x="96" y="56" width="8" height="12" rx="1.5" fill="#E2A65E" />
            <path d="M78 66 C78 63, 122 63, 122 66 L124 136 Z" fill="#ef4444" />
            <ellipse cx="100" cy="36" rx="21" ry="18" fill="#4A3728" />
            <ellipse cx="100" cy="42" rx="17" ry="17" fill="#4A3728" />
            <circle cx="78" cy="42" r="3.5" fill="#E2A65E" />
            <circle cx="122" cy="42" r="3.5" fill="#E2A65E" />
            <path d="M78 72 Q62 58, 80 38" stroke="#ef4444" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="81" cy="36" r="5" fill="#E2A65E"/>
            <path d="M122 72 Q138 58, 120 38" stroke="#ef4444" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <circle cx="119" cy="36" r="5" fill="#E2A65E"/>
            <circle cx="122" cy="30" r="2.2" fill="#60a5fa" opacity="0.7" className="bob-sweat"/>
            <circle cx="78" cy="32" r="1.8" fill="#60a5fa" opacity="0.5" className="bob-sweat-2"/>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={200 * scale}
      height={240 * scale}
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={`bob-character bob-mood-${mood}`}
    >
      {renderPose()}
    </svg>
  );
};

export default BobCharacter;

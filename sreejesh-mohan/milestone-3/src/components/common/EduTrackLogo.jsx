// src/components/common/EduTrackLogo.jsx
import React from 'react';

/**
 * Realistic 3D-styled EduTrack vector logo icon
 * Features a multi-layered academic mortarboard cap, golden silk tassel,
 * open book foundation, and an ascending progress orbit symbolizing tracking.
 */
export const EduTrackIcon = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md select-none ${className}`}
      aria-label="EduTrack Logo"
    >
      <defs>
        {/* Outer squircle gradient */}
        <linearGradient id="et_bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Gloss highlight overlay */}
        <linearGradient id="et_gloss" x1="0" y1="0" x2="120" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Cap top face gradient (3D specular sheen) */}
        <linearGradient id="et_cap_top" x1="20" y1="26" x2="100" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="35%" stopColor="#6366f1" />
          <stop offset="70%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>

        {/* Cap bevel 3D edge */}
        <linearGradient id="et_cap_edge" x1="60" y1="46" x2="60" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Cap skull base */}
        <linearGradient id="et_cap_base" x1="60" y1="52" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3730a3" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Golden metallic tassel gradient */}
        <linearGradient id="et_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="80%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Book pages gradient */}
        <linearGradient id="et_page_left" x1="22" y1="80" x2="58" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="et_page_right" x1="98" y1="80" x2="62" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Ascending learning progress track / orbit */}
        <linearGradient id="et_track" x1="16" y1="104" x2="108" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Soft realistic drop shadow filter */}
        <filter id="et_shadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.35" />
        </filter>
        <filter id="et_cap_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base container squircle with subtle border & glass bevel */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill="url(#et_bg)" />
      <rect x="4" y="4" width="112" height="112" rx="28" fill="url(#et_gloss)" />
      <rect x="4.5" y="4.5" width="111" height="111" rx="27.5" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />

      {/* Orbit Progress Track (The 'Track' in EduTrack) */}
      <path
        d="M18 72 C 18 36, 50 16, 94 22 C 104 24, 108 30, 104 36 C 98 44, 76 56, 42 74 C 28 82, 18 80, 18 72 Z"
        fill="url(#et_track)"
        opacity="0.22"
      />
      <path
        d="M14 74 C 20 28, 64 12, 104 22"
        stroke="url(#et_track)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        opacity="0.8"
      />

      {/* Foundation: Open Book (Realistic curvature) */}
      <g filter="url(#et_shadow)">
        {/* Book spine bottom support */}
        <path
          d="M60 97 L24 88 C 24 88, 25 96, 60 103 C 95 96, 96 88, 96 88 L60 97 Z"
          fill="#1e1b4b"
          opacity="0.6"
        />

        {/* Left page */}
        <path
          d="M60 95 C 46 91, 32 86, 22 84 C 21 84, 20 85, 20 86 L 20 95 C 32 97, 46 100, 60 103 Z"
          fill="url(#et_page_left)"
        />
        {/* Right page */}
        <path
          d="M60 95 C 74 91, 88 86, 98 84 C 99 84, 100 85, 100 86 L 100 95 C 88 97, 74 100, 60 103 Z"
          fill="url(#et_page_right)"
        />

        {/* Book page fold shading */}
        <path
          d="M59 95 L61 95 L61 103 L59 103 Z"
          fill="#94a3b8"
          opacity="0.5"
        />
        {/* Golden ribbon bookmark hanging from book center */}
        <path
          d="M58 95 L62 95 L62 106 L60 104 L58 106 Z"
          fill="url(#et_gold)"
        />
      </g>

      {/* Graduation Mortarboard Skull Band */}
      <g filter="url(#et_cap_glow)">
        <path
          d="M38 52 C 38 48, 82 48, 82 52 L 82 68 C 82 76, 60 81, 60 81 C 60 81, 38 76, 38 68 Z"
          fill="url(#et_cap_base)"
        />
        {/* Skull band rim shadow */}
        <path
          d="M38 58 C 48 64, 72 64, 82 58 L 82 62 C 72 68, 48 68, 38 62 Z"
          fill="#0f172a"
          opacity="0.4"
        />
      </g>

      {/* Mortarboard Diamond 3D Top with Beveled Edge */}
      <g filter="url(#et_shadow)">
        {/* 3D Under-lip thickness */}
        <polygon
          points="60,52 104,39 104,43 60,56 16,43 16,39"
          fill="url(#et_cap_edge)"
        />
        <polygon
          points="60,56 104,43 104,45 60,58 16,45 16,43"
          fill="#0f172a"
          opacity="0.6"
        />

        {/* Main Diamond Upper Face */}
        <polygon
          points="60,25 104,39 60,52 16,39"
          fill="url(#et_cap_top)"
        />

        {/* Top glossy specular highlight */}
        <polygon
          points="60,26 98,38 60,50 22,38"
          fill="#ffffff"
          opacity="0.16"
        />
        <path
          d="M60 26 L96 38 L60 41 L24 38 Z"
          fill="#ffffff"
          opacity="0.25"
        />

        {/* Center Golden Button / Pin */}
        <ellipse cx="60" cy="38.5" rx="3.5" ry="2.2" fill="url(#et_gold)" />
        <ellipse cx="60" cy="38" rx="2" ry="1.2" fill="#fef9c3" />

        {/* Golden Silk Tassel drape */}
        {/* Ribbon line draped to left/front */}
        <path
          d="M60 38.5 C 50 39, 32 44, 29 55 C 27 62, 28 68, 28 73"
          stroke="url(#et_gold)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Golden tassel knot ring */}
        <ellipse cx="28" cy="73" rx="2.5" ry="1.8" fill="url(#et_gold)" />
        {/* Tassel flare brush */}
        <path
          d="M26 74 C 25 81, 24 85, 23 87 C 27 88, 30 88, 33 87 C 32 85, 31 81, 30 74 Z"
          fill="url(#et_gold)"
        />
        <path
          d="M28 75 L28 87"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </g>

      {/* Sparkle of Excellence (Top Right) */}
      <path
        d="M96 16 L98 22 L104 24 L98 26 L96 32 L94 26 L88 24 L94 22 Z"
        fill="#fde047"
        opacity="0.9"
      />
      <circle cx="96" cy="24" r="1.5" fill="#ffffff" />
    </svg>
  );
};

/**
 * Full EduTrack Brand Lockup: Realistic Icon + Sleek Typography
 */
export const EduTrackLogo = ({
  size = 40,
  showTagline = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <EduTrackIcon size={size} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Edu<span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">Track</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-md shadow-2xs">
            PRO
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500 mt-0.5">
            Course Learning Tracker
          </p>
        )}
      </div>
    </div>
  );
};

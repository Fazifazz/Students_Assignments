import React from 'react';

/**
 * BrandLogo - Professional handcrafted e-commerce brand identity
 * Features a minimalist organic cart & sprout emblem with crisp modern typography
 */
export default function BrandLogo({ className = '', size = 28 }) {
  return (
    <div className={`brand-identity ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-icon"
        aria-hidden="true"
      >
        {/* Cart Chassis */}
        <path
          d="M3.5 7.5H6.8L9.4 19H23.5L25.8 9.5H7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Modern Accent Wheels */}
        <circle cx="11.8" cy="24.5" r="2.2" fill="#a3e635" />
        <circle cx="21.5" cy="24.5" r="2.2" fill="#a3e635" />
        {/* Organic Sprout Motif (Curated Nest) */}
        <path
          d="M16.5 14V5.5"
          stroke="#a3e635"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 5.5C14 3.5 12 5 12.5 7.5C13 9.5 15 10.5 16.5 11.5"
          fill="#a3e635"
        />
        <path
          d="M16.5 5.5C19 3.5 21 5 20.5 7.5C20 9.5 18 10.5 16.5 11.5"
          fill="#a3e635"
        />
      </svg>
      <span className="brand-logo-text">ShopNest</span>
    </div>
  );
}

// src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Brewing recipe details...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner-wrapper">
        <Loader2 size={44} className="spinner-icon-animate" strokeWidth={2.2} />
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

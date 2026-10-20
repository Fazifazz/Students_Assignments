// src/components/ErrorMessage.jsx
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card" role="alert">
      <div className="error-icon">
        <AlertCircle size={24} color="#b91c1c" />
      </div>
      <div className="error-content">
        <h4 className="error-title">Unable to Load Data</h4>
        <p className="error-desc">{message || 'An error occurred while fetching recipe data.'}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary retry-btn" onClick={onRetry}>
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}

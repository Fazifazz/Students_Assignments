import React from 'react';
import { Link } from 'react-router-dom';

// 404 Route Component (Session 33)
export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-warning">404</h1>
        <h2 className="fw-semibold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The equipment record or route you navigated to does not exist.
        </p>
        <Link to="/" className="btn btn-dark px-4 py-2">
          ← Return to Fleet Overview
        </Link>
      </div>
    </div>
  );
}

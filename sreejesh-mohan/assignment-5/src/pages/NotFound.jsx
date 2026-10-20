// src/pages/NotFound.jsx
// 404 Catch-All Page for unmatched routes
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home as HomeIcon, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-not-found">
      <div className="not-found-card">
        <div className="not-found-icon-wrapper">
          <FileQuestion size={56} strokeWidth={1.5} className="not-found-svg-icon" />
          <span className="not-found-code">404</span>
        </div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          The recipe or culinary archive page you are looking for does not exist in our kitchen records.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-secondary">
            <HomeIcon size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/recipes" className="btn btn-primary">
            <Compass size={16} />
            <span>Browse Recipes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

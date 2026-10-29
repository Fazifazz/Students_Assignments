const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="d-flex align-items-center justify-content-center gap-2 py-4 text-muted">
    <div className="spinner-border spinner-border-sm" role="status" aria-label={label}></div>
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;

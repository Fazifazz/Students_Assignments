export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-shell" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

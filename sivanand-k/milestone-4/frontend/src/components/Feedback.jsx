export function Loading({ label = 'Loading your library…' }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onRetry && <button className="text-link" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">▤</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state not-found">
      <div className="empty-icon" aria-hidden="true">?</div>
      <span className="eyebrow">LOST BETWEEN THE PAGES</span>
      <h1>We can’t find that page.</h1>
      <p>The page may have moved, or the address might be mistyped.</p>
      <Link className="button button-primary" to="/">Back to dashboard</Link>
    </div>
  );
}

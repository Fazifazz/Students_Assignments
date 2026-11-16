import { useEffect } from 'react';

export function PageIntro({ eyebrow, title, description, children }) {
  return (
    <div className="page-intro">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
      {children && <div className="intro-actions">{children}</div>}
    </div>
  );
}

export function SectionHeading({ title, action, to }) {
  return <div className="section-heading"><h3>{title}</h3>{action && <a href={to || '#'} onClick={to ? undefined : (event) => event.preventDefault()}>{action} <span>→</span></a>}</div>;
}

export function StatCard({ icon, label, value, note, tone = 'lavender' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon tone-${tone}`} aria-hidden="true">{icon}</div>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
    </div>
  );
}

export function EmptyState({ icon = '▤', title, description, children }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h3>{title}</h3><p>{description}</p>{children}</div>;
}

export function Modal({ title, onClose, children, size = '' }) {
  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}>×</button></div>
        {children}
      </section>
    </div>
  );
}

export function ConfirmModal({ title, message, onCancel, onConfirm, confirmLabel = 'Delete' }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="modal-message">{message}</p>
      <div className="form-actions"><button className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-danger" onClick={onConfirm}>{confirmLabel}</button></div>
    </Modal>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search by title or author…' }) {
  return <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label="Search books" />{value && <button type="button" onClick={() => onChange('')} aria-label="Clear search">×</button>}</label>;
}

export function LoadingSpinner() {
  return <div className="loading-spinner" role="status"><span />Loading your reading life…</div>;
}

export function ErrorMessage({ message }) {
  return <div className="error-message" role="alert">{message}</div>;
}

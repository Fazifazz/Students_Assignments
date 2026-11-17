export default function ProgressBar({ value = 0, color = 'sage', className = '' }) {
  const progress = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className={`progress-track ${className}`} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <span className={`progress-fill progress-${color}`} style={{ width: `${progress}%` }} />
    </div>
  );
}

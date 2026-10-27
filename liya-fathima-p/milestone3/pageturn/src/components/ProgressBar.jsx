export default function ProgressBar({ value = 0 }) {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
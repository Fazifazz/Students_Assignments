export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon size={21} />
      </div>
      <p className="muted">{label}</p>
      <h2>{value}</h2>
      <small>{note}</small>
    </article>
  );
}
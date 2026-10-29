function Dashboard({ workouts }) {
  const completedCount = workouts.filter((workout) => workout.completed).length;
  const pendingCount = workouts.length - completedCount;

  const stats = [
    { label: "Total workouts", value: workouts.length, detail: "ALL SESSIONS", icon: "total" },
    { label: "Completed", value: completedCount, detail: "WAY TO GO", icon: "complete" },
    { label: "Pending", value: pendingCount, detail: "UP NEXT", icon: "pending" },
  ];

  return (
    <section className="dashboard" aria-label="Workout statistics">
      {stats.map((stat, index) => (
        <article className={`stat-card stat-card-${index + 1}`} key={stat.label}>
          <div className="stat-card-top">
            <p className="stat-label">{stat.label}</p>
            <span className={`stat-icon stat-icon-${stat.icon}`} aria-hidden="true">
              {stat.icon === "total" && (
                <svg viewBox="0 0 24 24"><path d="M4 19V5m0 14h16M8 15l4-4 3 2 5-6" /></svg>
              )}
              {stat.icon === "complete" && (
                <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
              )}
              {stat.icon === "pending" && (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
              )}
            </span>
          </div>
          <div className="stat-card-bottom">
            <p className="stat-value">{stat.value}</p>
            <span className="stat-detail">{stat.detail}</span>
          </div>
          <span className="stat-decoration" aria-hidden="true" />
        </article>
      ))}
    </section>
  );
}

export default Dashboard;

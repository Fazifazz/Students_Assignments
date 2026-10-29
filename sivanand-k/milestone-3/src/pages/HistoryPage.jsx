import { Link } from "react-router-dom";
import { useWorkouts } from "../context/WorkoutContext.jsx";

function HistoryPage() {
  const { workouts } = useWorkouts();
  const completedWorkouts = workouts
    .filter((workout) => workout.completed)
    .sort((first, second) => second.date.localeCompare(first.date));
  const completedMinutes = completedWorkouts.reduce(
    (total, workout) => total + workout.duration,
    0,
  );

  return (
    <section className="page-section history-page" aria-labelledby="history-heading">
      <div className="page-intro">
        <p className="eyebrow">PROGRESS YOU CAN SEE</p>
        <h1 id="history-heading">Workout history</h1>
        <p>Every completed session is proof that you showed up.</p>
      </div>
      <div className="history-summary">
        <article className="history-summary-card">
          <span className="history-summary-label">COMPLETED SESSIONS</span>
          <strong>{completedWorkouts.length}</strong>
        </article>
        <article className="history-summary-card">
          <span className="history-summary-label">TOTAL ACTIVE MINUTES</span>
          <strong>{completedMinutes}<span> min</span></strong>
        </article>
      </div>

      {completedWorkouts.length > 0 ? (
        <div className="history-list">
          {completedWorkouts.map((workout) => (
            <article className="history-card" key={workout.id}>
              <span className="history-check" aria-hidden="true">✓</span>
              <div className="history-card-content">
                <span className={`category-tag category-${workout.category.toLowerCase()}`}>
                  <span className="category-dot" aria-hidden="true" />
                  {workout.category}
                </span>
                <h2>{workout.name}</h2>
                <p>
                  <span>{new Date(`${workout.date}T12:00:00`).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}</span>
                  <span aria-hidden="true">·</span>
                  <span>{workout.duration} minutes</span>
                </p>
              </div>
              <span className="history-complete-label">COMPLETED</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state page-empty-state">
          <span className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
          </span>
          <h3>Your history starts with one session</h3>
          <p>Mark a workout as completed and it will appear here with its date and duration.</p>
          <Link className="primary-button history-action" to="/workouts">Go to workouts <span aria-hidden="true">↗</span></Link>
        </div>
      )}
    </section>
  );
}

export default HistoryPage;

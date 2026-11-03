const categoryStyles = {
  Strength: "category-strength",
  Cardio: "category-cardio",
  Flexibility: "category-flexibility",
};

function WorkoutCard({ workout, onToggle, onDelete }) {
  const formattedDate = new Date(`${workout.date}T12:00:00`).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <article className={`workout-card ${workout.completed ? "is-completed" : ""}`}>
      <div className="workout-card-header">
        <span className={`category-tag ${categoryStyles[workout.category] || ""}`}>
          <span className="category-dot" aria-hidden="true" />
          {workout.category}
        </span>
        <span className={`status-pill ${workout.completed ? "status-done" : "status-pending"}`}>
          <span className="status-dot" aria-hidden="true" />
          {workout.completed ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="workout-card-main">
        <h3>{workout.name}</h3>
        <div className="workout-meta">
          <span className="meta-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7v5l3 2" />
            </svg>
            {workout.duration} min
          </span>
          <span className="meta-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="6" width="16" height="14" rx="2" />
              <path d="M8 4v4m8-4v4M4 10h16" />
            </svg>
            {formattedDate}
          </span>
        </div>
      </div>
      <div className="workout-card-footer">
        <button
          className={`status-button ${workout.completed ? "is-done" : ""}`}
          type="button"
          onClick={onToggle}
          aria-label={workout.completed ? `Mark ${workout.name} as pending` : `Mark ${workout.name} as completed`}
        >
          <span aria-hidden="true">{workout.completed ? "↺" : "✓"}</span>
          {workout.completed ? "Mark pending" : "Complete workout"}
        </button>
        <button
          className="delete-button"
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${workout.name}`}
          title="Delete workout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default WorkoutCard;

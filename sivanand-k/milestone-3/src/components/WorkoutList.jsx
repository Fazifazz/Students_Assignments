import WorkoutCard from "./WorkoutCard.jsx";

const filters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

function WorkoutList({
  workouts,
  filter,
  onFilterChange,
  onToggleWorkout,
  onDeleteWorkout,
}) {
  return (
    <div className="workout-list-area">
      <div className="list-toolbar">
        <p className="list-caption">YOUR SESSIONS</p>
        <div className="filter-bar" role="group" aria-label="Filter workouts">
          {filters.map((option) => (
            <button
              className={`filter-button ${filter === option.value ? "active" : ""}`}
              type="button"
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              aria-pressed={filter === option.value}
            >
              {option.label}
              {filter === option.value && <span className="filter-indicator" />}
            </button>
          ))}
        </div>
      </div>

      {workouts.length > 0 ? (
        <div className="workout-list">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onToggle={() => onToggleWorkout(workout.id)}
              onDelete={() => onDeleteWorkout(workout.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M14 31.5h20a8 8 0 0 0 .4-16 11 11 0 0 0-20.8 2.2A7 7 0 0 0 14 31.5Z" />
              <path d="M19 38h10m-7 4h4" />
            </svg>
          </span>
          <h3>{filter === "all" ? "Your next session starts here" : `No ${filter} workouts yet`}</h3>
          <p>
            {filter === "all"
              ? "Add your first workout and start building a routine that feels good."
              : "Switch filters or add a workout to keep your momentum going."}
          </p>
          {filter === "all" && (
            <a className="empty-action" href="#add-workout">Plan a workout <span aria-hidden="true">↗</span></a>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkoutList;

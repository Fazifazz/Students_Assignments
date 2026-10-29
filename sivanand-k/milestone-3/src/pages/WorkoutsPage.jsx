import { useState } from "react";
import WorkoutForm from "../components/WorkoutForm.jsx";
import WorkoutList from "../components/WorkoutList.jsx";
import { useWorkouts } from "../context/WorkoutContext.jsx";

function WorkoutsPage() {
  const [filter, setFilter] = useState("all");
  const { workouts, addWorkout, toggleWorkout, deleteWorkout } = useWorkouts();

  const visibleWorkouts = workouts.filter((workout) => {
    if (filter === "completed") return workout.completed;
    if (filter === "pending") return !workout.completed;
    return true;
  });

  return (
    <section id="workouts" className="workout-section page-section" aria-labelledby="workouts-heading">
      <div className="page-intro">
        <p className="eyebrow">YOUR ROUTINE</p>
        <h1 id="workouts-heading">Workouts</h1>
        <p>Plan your next session and keep your progress moving.</p>
      </div>
      <div className="workout-section-heading">
        <div>
          <p className="eyebrow">YOUR SESSIONS</p>
          <h2>Workout planner</h2>
        </div>
        <span className="workout-count">
          {workouts.length} {workouts.length === 1 ? "SESSION" : "SESSIONS"}
        </span>
      </div>
      <div className="workout-layout">
        <div id="add-workout" className="form-column">
          <WorkoutForm onAddWorkout={addWorkout} />
        </div>
        <WorkoutList
          workouts={visibleWorkouts}
          filter={filter}
          onFilterChange={setFilter}
          onToggleWorkout={toggleWorkout}
          onDeleteWorkout={deleteWorkout}
        />
      </div>
    </section>
  );
}

export default WorkoutsPage;

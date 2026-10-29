import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";
import { useWorkouts } from "../context/WorkoutContext.jsx";

function DashboardPage() {
  const { workouts } = useWorkouts();
  const completedWorkouts = workouts.filter((workout) => workout.completed);
  const latestWorkouts = workouts.slice(0, 3);

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR FITNESS, YOUR PACE</p>
          <h1>Make today <span>count.</span></h1>
          <p className="welcome-copy">
            Build a routine that works for you. Every session is a step forward.
          </p>
          <Link className="primary-button hero-button" to="/workouts">
            <span aria-hidden="true">+</span> Add workout
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit hero-orbit-outer" />
          <span className="hero-orbit hero-orbit-inner" />
          <span className="hero-spark">✳</span>
          <span className="hero-art-label">SHOW UP<br />FOR YOURSELF</span>
        </div>
      </section>

      <section id="overview" className="overview-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR MOMENTUM</p>
            <h2>At a glance</h2>
          </div>
          <span className="live-indicator"><span /> Updated as you go</span>
        </div>
        <Dashboard workouts={workouts} />
      </section>

      <section className="overview-recent" aria-labelledby="recent-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KEEP THE MOMENTUM</p>
            <h2 id="recent-heading">Recent workouts</h2>
          </div>
          <Link className="text-link" to="/workouts">View workouts <span aria-hidden="true">↗</span></Link>
        </div>
        {latestWorkouts.length > 0 ? (
          <div className="overview-summary-grid">
            {latestWorkouts.map((workout) => (
              <article className="overview-summary-card" key={workout.id}>
                <span className={`category-tag category-${workout.category.toLowerCase()}`}>
                  <span className="category-dot" aria-hidden="true" />
                  {workout.category}
                </span>
                <h3>{workout.name}</h3>
                <p>{workout.duration} min <span aria-hidden="true">·</span> {workout.completed ? "Completed" : "Pending"}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="overview-empty">
            <p>Your workout plan is ready when you are.</p>
            <Link className="text-link" to="/workouts">Plan your first workout <span aria-hidden="true">↗</span></Link>
          </div>
        )}
        {completedWorkouts.length > 0 && (
          <p className="dashboard-note">
            You’ve completed {completedWorkouts.length} {completedWorkouts.length === 1 ? "session" : "sessions"} so far. Nice work.
          </p>
        )}
      </section>
    </>
  );
}

export default DashboardPage;

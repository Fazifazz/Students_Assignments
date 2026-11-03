import { useState } from "react";
import { useWorkouts } from "../context/WorkoutContext.jsx";

function SettingsPage() {
  const [message, setMessage] = useState("");
  const { workouts, clearWorkouts } = useWorkouts();

  function handleClearWorkouts() {
    if (workouts.length === 0) {
      setMessage("There are no saved workouts to clear.");
      return;
    }

    const confirmed = window.confirm(
      `Clear all ${workouts.length} saved ${workouts.length === 1 ? "workout" : "workouts"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    clearWorkouts();
    setMessage("All saved workouts have been cleared.");
  }

  return (
    <section className="page-section settings-page" aria-labelledby="settings-heading">
      <div className="page-intro">
        <p className="eyebrow">MAKE IT YOURS</p>
        <h1 id="settings-heading">Settings</h1>
        <p>Manage your FitTrack Lite data and preferences.</p>
      </div>

      <section className="settings-card" aria-labelledby="data-heading">
        <div className="settings-card-heading">
          <span className="settings-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 7h16M6 7v13h12V7M9 7V4h6v3m-4 4v5m2-5v5" /></svg>
          </span>
          <div>
            <p className="eyebrow">LOCAL DATA</p>
            <h2 id="data-heading">Workout data</h2>
          </div>
        </div>
        <p className="settings-description">
          Your {workouts.length} {workouts.length === 1 ? "workout is" : "workouts are"} saved in this browser’s LocalStorage. Clearing this data removes all workouts and history from this device.
        </p>
        <div className="settings-actions">
          <button className="danger-button" type="button" onClick={handleClearWorkouts}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
            </svg>
            Clear saved workouts
          </button>
          {message && <p className="settings-message" role="status">{message}</p>}
        </div>
      </section>

      <p className="settings-footnote">FitTrack Lite keeps your workout data on this device. No account or online sync is used.</p>
    </section>
  );
}

export default SettingsPage;

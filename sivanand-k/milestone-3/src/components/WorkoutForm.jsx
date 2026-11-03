import { useState } from "react";

const categories = ["Strength", "Cardio", "Flexibility"];

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function WorkoutForm({ onAddWorkout }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(getTodayDate);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const durationInMinutes = Number(duration);

    if (!trimmedName || !category || !date) {
      setError("Please fill in every field before adding your workout.");
      return;
    }

    if (!Number.isInteger(durationInMinutes) || durationInMinutes < 1) {
      setError("Duration must be a whole number of at least 1 minute.");
      return;
    }

    onAddWorkout({
      name: trimmedName,
      category,
      duration: durationInMinutes,
      date,
    });

    setName("");
    setCategory(categories[0]);
    setDuration("");
    setDate(getTodayDate());
    setError("");
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-card-top">
        <div className="form-heading">
          <span className="form-heading-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 8v8M3.5 10v4M18 8v8m2.5-6v4M6 12h12" /></svg>
          </span>
          <div>
            <p className="eyebrow">MAKE IT HAPPEN</p>
            <h3>Add a workout</h3>
          </div>
        </div>
        <span className="form-step">01</span>
      </div>

      <label className="form-field">
        <span>Workout name <span className="required-mark">*</span></span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Morning run"
          maxLength={60}
          required
          aria-invalid={Boolean(error && !name.trim())}
        />
      </label>

      <label className="form-field">
        <span>Category <span className="required-mark">*</span></span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
          aria-invalid={Boolean(error && !category)}
        >
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label className="form-field">
          <span>Duration <span className="required-mark">*</span></span>
          <div className="input-with-unit">
            <input
              type="number"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="30"
              min="1"
              step="1"
              required
              aria-invalid={Boolean(error && (!Number.isInteger(Number(duration)) || Number(duration) < 1))}
            />
            <span className="input-unit">min</span>
          </div>
        </label>

        <label className="form-field">
          <span>Date <span className="required-mark">*</span></span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            aria-invalid={Boolean(error && !date)}
          />
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          <span aria-hidden="true">!</span> {error}
        </p>
      )}

      <button className="primary-button add-button" type="submit">
        Add to my plan <span aria-hidden="true">↗</span>
      </button>
      <p className="form-footnote">Consistency beats intensity. Start where you are.</p>
    </form>
  );
}

export default WorkoutForm;

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "fittrack-lite-workouts";
const WorkoutContext = createContext(null);

function isValidWorkout(workout) {
  return (
    workout &&
    typeof workout.id === "string" &&
    typeof workout.name === "string" &&
    ["Strength", "Cardio", "Flexibility"].includes(workout.category) &&
    Number.isInteger(workout.duration) &&
    workout.duration > 0 &&
    typeof workout.date === "string" &&
    typeof workout.completed === "boolean"
  );
}

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem(STORAGE_KEY);
      if (savedWorkouts) {
        const parsedWorkouts = JSON.parse(savedWorkouts);
        if (Array.isArray(parsedWorkouts)) {
          setWorkouts(parsedWorkouts.filter(isValidWorkout));
        } else {
          console.error("Saved workouts are not in the expected format.");
        }
      }
    } catch (error) {
      console.error("Could not load saved workouts from LocalStorage.", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      if (workouts.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
      }
    } catch (error) {
      console.error("Could not save workouts to LocalStorage.", error);
    }
  }, [workouts, isLoaded]);

  function addWorkout(workoutDetails) {
    const id = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

    setWorkouts((currentWorkouts) => [
      { ...workoutDetails, id, completed: false },
      ...currentWorkouts,
    ]);
  }

  function toggleWorkout(workoutId) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === workoutId
          ? { ...workout, completed: !workout.completed }
          : workout,
      ),
    );
  }

  function deleteWorkout(workoutId) {
    const workoutToDelete = workouts.find((workout) => workout.id === workoutId);
    if (!workoutToDelete) return;
    if (!window.confirm(`Delete "${workoutToDelete.name}" from your plan?`)) return;

    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => workout.id !== workoutId),
    );
  }

  function clearWorkouts() {
    setWorkouts([]);
  }

  return (
    <WorkoutContext.Provider
      value={{ workouts, addWorkout, toggleWorkout, deleteWorkout, clearWorkouts }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkouts must be used inside a WorkoutProvider.");
  }
  return context;
}

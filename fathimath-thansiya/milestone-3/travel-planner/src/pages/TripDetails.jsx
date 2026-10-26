import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Wallet2 } from "lucide-react";
import {
  addActivity,
  deleteActivity,
  reorderActivity,
} from "../features/trips/tripSlice";
import { addExpense, deleteExpense } from "../features/budget/budgetSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateRange } from "../utils/dateUtils";

const expenseOptions = ["Accommodation", "Transport", "Food", "Activities"];

export default function TripDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const trips = useSelector((state) => state.trips.trips);
  const destinations = useSelector((state) => state.destinations.all);
  const expenseMap = useSelector((state) => state.budget.expensesByTrip);

  const trip = useMemo(() => trips.find((item) => item.id === id), [trips, id]);
  const destination = useMemo(
    () =>
      destinations.find((item) => item.id === trip?.destinationId) ||
      destinations[0],
    [destinations, trip],
  );

  const [activityForm, setActivityForm] = useState({
    name: "",
    time: "",
    description: "",
    cost: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    category: "Accommodation",
    label: "",
    amount: "",
  });

  if (!trip) {
    return (
      <div className="page-shell">
        <div className="container section-space">
          <h2>Trip not found.</h2>
        </div>
      </div>
    );
  }

  const tripExpenses = expenseMap[trip.id] || [];
  const activityList = trip.itinerary || [];
  const totalExpense = tripExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const remainingBudget = Number(trip.budget || 0) - totalExpense;

  const handleAddActivity = () => {
    if (!activityForm.name.trim()) return;

    dispatch(
      addActivity({
        tripId: trip.id,
        activity: {
          name: activityForm.name,
          time: activityForm.time,
          description: activityForm.description,
          cost: Number(activityForm.cost || 0),
        },
      }),
    );

    setActivityForm({ name: "", time: "", description: "", cost: "" });
  };

  const handleAddExpense = () => {
    if (
      !expenseForm.label.trim() ||
      !expenseForm.amount ||
      Number(expenseForm.amount) <= 0
    )
      return;

    dispatch(
      addExpense({
        tripId: trip.id,
        expense: {
          category: expenseForm.category,
          label: expenseForm.label,
          amount: Number(expenseForm.amount),
        },
      }),
    );

    setExpenseForm({ category: "Accommodation", label: "", amount: "" });
  };

  return (
    <div className="page-shell">
      <div className="container section-space trip-detail-page">
        <div className="trip-overview">
          <div>
            <span className="eyebrow">Trip overview</span>
            <h1>{destination.name}</h1>
          </div>
          <div className="trip-summary-card">
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            <strong>{trip.travellers} travellers</strong>
            <small>
              {formatCurrency(trip.budget || 0, trip.currency || "USD")} budget
            </small>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metric-box">
            <span>Total spent</span>
            <strong>
              {formatCurrency(totalExpense, trip.currency || "USD")}
            </strong>
          </div>
          <div className="metric-box">
            <span>Remaining</span>
            <strong>
              {formatCurrency(remainingBudget, trip.currency || "USD")}
            </strong>
          </div>
          <div className="metric-box">
            <span>Activities</span>
            <strong>{activityList.length}</strong>
          </div>
        </div>

        <div className="trip-layout">
          <section className="detail-panel itinerary-panel">
            <div className="section-heading compact-heading">
              <div>
                <span className="eyebrow">Itinerary</span>
                <h2>Day-by-day plan</h2>
              </div>
            </div>

            <div className="activity-form card-block">
              <input
                value={activityForm.name}
                onChange={(event) =>
                  setActivityForm({ ...activityForm, name: event.target.value })
                }
                placeholder="Activity name"
              />
              <input
                value={activityForm.time}
                onChange={(event) =>
                  setActivityForm({ ...activityForm, time: event.target.value })
                }
                type="time"
              />
              <input
                value={activityForm.cost}
                onChange={(event) =>
                  setActivityForm({ ...activityForm, cost: event.target.value })
                }
                type="number"
                min="0"
                placeholder="Est. cost"
              />
              <textarea
                value={activityForm.description}
                onChange={(event) =>
                  setActivityForm({
                    ...activityForm,
                    description: event.target.value,
                  })
                }
                placeholder="Add a quick note"
                rows="2"
              />
              <button
                type="button"
                className="primary-btn"
                onClick={handleAddActivity}
              >
                Add activity
              </button>
            </div>

            {activityList.length === 0 ? (
              <div className="empty-state boxed-empty small-box">
                <Plus size={16} />
                <p>No activities yet. Add your first plan for this trip.</p>
              </div>
            ) : (
              <div className="activity-list">
                {activityList.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-item__header">
                      <div>
                        <strong>{activity.name}</strong>
                        <small>{activity.time || "Flexible timing"}</small>
                      </div>
                      <div className="activity-actions">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              reorderActivity({
                                tripId: trip.id,
                                activityId: activity.id,
                                direction: "up",
                              }),
                            )
                          }
                          aria-label="Move activity up"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              reorderActivity({
                                tripId: trip.id,
                                activityId: activity.id,
                                direction: "down",
                              }),
                            )
                          }
                          aria-label="Move activity down"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              deleteActivity({
                                tripId: trip.id,
                                activityId: activity.id,
                              }),
                            )
                          }
                          aria-label="Delete activity"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p>{activity.description || "No note added yet."}</p>
                    <span className="activity-cost">
                      {formatCurrency(
                        activity.cost || 0,
                        trip.currency || "USD",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="detail-panel budget-panel">
            <div className="section-heading compact-heading">
              <div>
                <span className="eyebrow">Budget</span>
                <h2>Expense tracker</h2>
              </div>
            </div>

            <div className="expense-form card-block">
              <select
                value={expenseForm.category}
                onChange={(event) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: event.target.value,
                  })
                }
              >
                {expenseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                value={expenseForm.label}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, label: event.target.value })
                }
                placeholder="Expense label"
              />
              <input
                value={expenseForm.amount}
                onChange={(event) =>
                  setExpenseForm({ ...expenseForm, amount: event.target.value })
                }
                type="number"
                min="0"
                placeholder="Amount"
              />
              <button
                type="button"
                className="primary-btn"
                onClick={handleAddExpense}
              >
                Add expense
              </button>
            </div>

            <div className="budget-summary">
              <div>
                <span>Spent</span>
                <strong>
                  {formatCurrency(totalExpense, trip.currency || "USD")}
                </strong>
              </div>
              <div>
                <span>Budget left</span>
                <strong className={remainingBudget < 0 ? "danger" : ""}>
                  {formatCurrency(remainingBudget, trip.currency || "USD")}
                </strong>
              </div>
            </div>

            <div className="expense-list">
              {tripExpenses.length === 0 ? (
                <div className="empty-state boxed-empty small-box">
                  <Wallet2 size={16} />
                  <p>No expenses logged yet.</p>
                </div>
              ) : (
                tripExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div>
                      <strong>{expense.label}</strong>
                      <small>{expense.category}</small>
                    </div>
                    <div className="expense-meta">
                      <span>
                        {formatCurrency(expense.amount, trip.currency || "USD")}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            deleteExpense({
                              tripId: trip.id,
                              expenseId: expense.id,
                            }),
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

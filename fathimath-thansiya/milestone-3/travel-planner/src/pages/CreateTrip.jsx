import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createTrip } from "../features/trips/tripSlice";

const currencies = ["USD", "EUR", "GBP", "AED", "INR"];

const initialValues = {
  destinationId: "",
  startDate: "",
  endDate: "",
  travellers: 2,
  budget: "",
  currency: "USD",
  travelStyle: "Relaxed",
  notes: "",
};

export default function CreateTrip() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const destinations = useSelector((state) => state.destinations.all);

  const destinationIdFromQuery = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("destination") || "";
  }, [search]);

  const [form, setForm] = useState({
    ...initialValues,
    destinationId: destinationIdFromQuery,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.destinationId)
      nextErrors.destinationId = "Please select a destination.";
    if (!form.startDate) nextErrors.startDate = "Please choose a start date.";
    if (!form.endDate) nextErrors.endDate = "Please choose an end date.";
    if (new Date(form.endDate) < new Date(form.startDate))
      nextErrors.endDate = "End date must be after the start date.";
    if (!form.travellers || Number(form.travellers) <= 0)
      nextErrors.travellers = "Travellers must be at least 1.";
    if (!form.budget || Number(form.budget) <= 0)
      nextErrors.budget = "Budget must be greater than zero.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus("Please fix the highlighted fields before creating your trip.");
      return;
    }

    const trip = {
      id: `trip-${Date.now()}`,
      destinationId: form.destinationId,
      startDate: form.startDate,
      endDate: form.endDate,
      travellers: Number(form.travellers),
      budget: Number(form.budget),
      currency: form.currency,
      travelStyle: form.travelStyle,
      notes: form.notes,
      itinerary: [],
    };

    dispatch(createTrip(trip));
    setStatus("Trip created successfully. Your itinerary is ready to refine.");
    setTimeout(() => navigate("/trips"), 900);
  };

  return (
    <div className="page-shell">
      <div className="container section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Create a trip</span>
            <h1>Start a new adventure.</h1>
          </div>
        </div>

        <form className="trip-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                value={form.destinationId}
                onChange={(event) =>
                  handleChange("destinationId", event.target.value)
                }
              >
                <option value="">Choose a destination</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
              {errors.destinationId && <small>{errors.destinationId}</small>}
            </div>

            <div className="field">
              <label htmlFor="travelStyle">Travel style</label>
              <select
                id="travelStyle"
                value={form.travelStyle}
                onChange={(event) =>
                  handleChange("travelStyle", event.target.value)
                }
              >
                <option value="Relaxed">Relaxed</option>
                <option value="Luxury">Luxury</option>
                <option value="Culture">Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Foodie">Foodie</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  handleChange("startDate", event.target.value)
                }
              />
              {errors.startDate && <small>{errors.startDate}</small>}
            </div>

            <div className="field">
              <label htmlFor="endDate">End date</label>
              <input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  handleChange("endDate", event.target.value)
                }
              />
              {errors.endDate && <small>{errors.endDate}</small>}
            </div>

            <div className="field">
              <label htmlFor="travellers">Travellers</label>
              <input
                id="travellers"
                type="number"
                min="1"
                value={form.travellers}
                onChange={(event) =>
                  handleChange("travellers", event.target.value)
                }
              />
              {errors.travellers && <small>{errors.travellers}</small>}
            </div>

            <div className="field">
              <label htmlFor="budget">Total budget</label>
              <input
                id="budget"
                type="number"
                min="1"
                value={form.budget}
                onChange={(event) => handleChange("budget", event.target.value)}
              />
              {errors.budget && <small>{errors.budget}</small>}
            </div>

            <div className="field">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={form.currency}
                onChange={(event) =>
                  handleChange("currency", event.target.value)
                }
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows="4"
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              placeholder="Tell us about your pace, must-dos, and travel mood."
            />
          </div>

          {status && <div className="success-box">{status}</div>}

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Create trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

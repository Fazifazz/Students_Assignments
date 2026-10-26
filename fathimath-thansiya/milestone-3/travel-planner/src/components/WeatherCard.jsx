import { CloudSun, Wind } from "lucide-react";

export default function WeatherCard({ weather, loading, error }) {
  if (loading) {
    return (
      <div className="weather-card loading-box">Checking the forecast...</div>
    );
  }

  if (error) {
    return (
      <div className="weather-card weather-error">
        Weather unavailable right now.
      </div>
    );
  }

  if (!weather) {
    return <div className="weather-card">No forecast loaded.</div>;
  }

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <p className="eyebrow">Current weather</p>
          <h3>{weather.current.description}</h3>
        </div>
        <CloudSun size={28} />
      </div>

      <div className="weather-main">
        <span className="weather-temp">
          {Math.round(weather.current.temperature)}°C
        </span>
      </div>

      <div className="weather-stats">
        <span>
          <Wind size={16} />
          {Math.round(weather.current.windSpeed)} km/h
        </span>
      </div>

      {weather.forecast?.length > 0 && (
        <div className="forecast-list">
          {weather.forecast.slice(0, 3).map((day) => (
            <div key={day.date} className="forecast-day">
              <span>
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
              <strong>{Math.round(day.max)}°</strong>
              <small>{Math.round(day.min)}°</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ForecastCard({ daily, unit }) {
  const convertTemp = (temp) =>
    unit === 'F' ? Math.round((temp * 9) / 5 + 32) : temp;

  const formatDay = (dateStr, index) => {
    if (index === 0) return 'Today';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="forecast-section">
      <p className="section-label">5-Day Forecast</p>
      {daily.map((day, index) => (
        <div key={index} className="forecast-row">
          <p className="forecast-day">{formatDay(day.date, index)}</p>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon}.png`}
            alt={day.description}
            className="forecast-icon"
            style={{ width: '32px', height: '32px' }}
          />
          <p className="forecast-desc">{day.description}</p>
          <p className="forecast-temps">
            {convertTemp(day.max)}° / {convertTemp(day.min)}°
          </p>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
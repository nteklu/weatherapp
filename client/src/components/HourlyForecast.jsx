function HourlyForecast({ hourly, unit }) {
  const formatTime = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  };

  const convertTemp = (temp) =>
    unit === 'F' ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);

  return (
    <div className="hourly-section">
      <p className="section-label">Hourly Forecast</p>
      <div className="hourly-scroll">
        {hourly.map((item, index) => (
          <div key={index} className="hourly-item">
            <p className="hourly-time">
              {index === 0 ? 'Now' : formatTime(item.time)}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.description}
              className="hourly-icon"
              style={{ width: '32px', height: '32px' }}
            />
            <p className="hourly-temp">{convertTemp(item.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
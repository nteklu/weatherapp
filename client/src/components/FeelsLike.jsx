function FeelsLike({ feels_like, temp, unit }) {
  const value = unit === 'F'
    ? Math.round((feels_like * 9) / 5 + 32)
    : Math.round(feels_like);

  const diff = feels_like - temp;
  const reason =
    diff < -3 ? 'Winds making it colder' :
    diff > 3  ? 'Humidity making it warmer' :
                'Similar to actual temp';

  return (
    <div className="info-card">
      <p className="info-card-label">Feels Like</p>
      <p className="feels-big">{value}°</p>
      <p className="feels-sub">{reason}</p>
    </div>
  );
}

export default FeelsLike;
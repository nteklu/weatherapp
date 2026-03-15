function SunriseSunset({ sunrise, sunset }) {
  const format = (unix) =>
    new Date(unix * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

  return (
    <div className="info-card">
      <p className="info-card-label">Sunrise & Sunset</p>
      <div className="sunrise-row">
        <div>
          <p className="sun-sublabel">Rise</p>
          <p className="sun-time rise">{format(sunrise)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="sun-sublabel">Set</p>
          <p className="sun-time set">{format(sunset)}</p>
        </div>
      </div>
    </div>
  );
}

export default SunriseSunset;
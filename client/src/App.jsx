import { useState } from 'react';
import axios from 'axios';
import './App.css';

function WeatherCard({ data }) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <p className="location-label">Current Weather</p>
          <h2 className="city-name">{data.city}</h2>
          <p className="date">{date}</p>
        </div>
      </div>

      <div className="weather-main">
        <div className="temp-section">
          <p className="temperature">{Math.round(data.temperature)}°</p>
          <p className="description">{data.description}</p>
          <p className="feels-like">Feels like {Math.round(data.feels_like)}°C</p>
        </div>
        <div className="icon-section">
          <div className="icon-circle">
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt={data.description}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Humidity</p>
          <p className="stat-value">{data.humidity}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Wind</p>
          <p className="stat-value">{data.wind_speed} m/s</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Feels like</p>
          <p className="stat-value">{Math.round(data.feels_like)}°C</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="app">
      <div className="app-header">
        <p className="app-title">Weather Dashboard</p>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
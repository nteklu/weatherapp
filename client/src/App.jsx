import { useState } from 'react';
import axios from 'axios';
import './App.css';

function WeatherCard({ data }) {
  return (
    <div className="weather-card">
      <h2>{data.city}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
        alt={data.description}
      />
      <p className="temp">{Math.round(data.temperature)}°C</p>
      <p className="description">{data.description}</p>
      <div className="details">
        <span>Feels like: {Math.round(data.feels_like)}°C</span>
        <span>Humidity: {data.humidity}%</span>
        <span>Wind: {data.wind_speed} m/s</span>
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
      const res = await axios.get(`/api/weather?city=${city}`);
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
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
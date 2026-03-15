import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SunriseSunset from './components/SunriseSunset';
import FeelsLike from './components/FeelsLike';
import HourlyForecast from './components/HourlyForecast';
import ForecastCard from './components/ForecastCard';

function WeatherCard({ data, unit }) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const convertTemp = (temp) =>
    unit === 'F' ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <p className="location-label">Current Weather</p>
          <h2 className="city-name">{data.city}</h2>
          <p className="date">{date}</p>
        </div>
        <div className="icon-circle">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
          />
        </div>
      </div>
      <p className="temperature">{convertTemp(data.temperature)}°</p>
      <p className="description">{data.description}</p>
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
          <p className="stat-label">UV Index</p>
          <p className="stat-value">{data.uv ?? '--'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">AQI</p>
          <p className={`stat-value ${data.airQuality?.quality || ''}`}>
            {data.airQuality?.label || '--'}
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('C');

  const handleSearch = async () => {
  if (!city.trim()) return;
  setLoading(true);
  setError('');
  setWeather(null);
  setForecast(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  try {
    const weatherRes = await axios.get(`${apiUrl}/api/weather?city=${city}`);
    const weatherData = weatherRes.data;

    const [forecastRes, aqRes] = await Promise.all([
      axios.get(`${apiUrl}/api/forecast?city=${city}`),
      axios.get(`${apiUrl}/api/airquality?lat=${weatherData.lat}&lon=${weatherData.lon}`),
    ]);

    setWeather({ ...weatherData, airQuality: aqRes.data });
    setForecast(forecastRes.data);
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

const fetchByCoords = async (lat, lon) => {
  setLoading(true);
  setError('');
  setWeather(null);
  setForecast(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  try {
    const weatherRes = await axios.get(
      `${apiUrl}/api/weatherbycoords?lat=${lat}&lon=${lon}`
    );
    const weatherData = weatherRes.data;

    const [forecastRes, aqRes] = await Promise.all([
      axios.get(`${apiUrl}/api/forecast?city=${weatherData.city}`),
      axios.get(
        `${apiUrl}/api/airquality?lat=${weatherData.lat}&lon=${weatherData.lon}`
      ),
    ]);

    setWeather({ ...weatherData, airQuality: aqRes.data });
    setForecast(forecastRes.data);
  } catch (err) {
    setError('Could not fetch weather for your location');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        // User denied location or it failed — do nothing, let them search manually
      }
    );
  }
}, []);

const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="app">
      <div className="app-header">
        <p className="app-title">Weather Dashboard</p>
        <div className="temp-toggle">
          <button
            className={unit === 'C' ? 'active' : ''}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={unit === 'F' ? 'active' : ''}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>
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

      {!weather && !error && (
        <div className="empty-state">
          <p>{loading ? 'Detecting your location...' : 'Search for a city to see the weather'}</p>
        </div>
      )}

      {weather && (
        <>
          <WeatherCard data={weather} unit={unit} />
          <div className="two-col">
            <SunriseSunset
              sunrise={weather.sunrise}
              sunset={weather.sunset}
            />
            <FeelsLike
              feels_like={weather.feels_like}
              temp={weather.temperature}
              unit={unit}
            />
          </div>
          {forecast && (
            <>
              <HourlyForecast hourly={forecast.hourly} unit={unit} />
              <ForecastCard daily={forecast.daily} unit={unit} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
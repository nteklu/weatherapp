const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordinates are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const weatherResponse = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      }
    );

    const { name, main, weather, wind, sys, coord } = weatherResponse.data;

    const uvResponse = await axios.get(
      'https://api.openweathermap.org/data/2.5/uvi',
      {
        params: {
          lat: coord.lat,
          lon: coord.lon,
          appid: apiKey,
        },
      }
    );

    res.json({
      city: name,
      temperature: main.temp,
      feels_like: main.feels_like,
      humidity: main.humidity,
      description: weather[0].description,
      icon: weather[0].icon,
      wind_speed: wind.speed,
      sunrise: sys.sunrise,
      sunset: sys.sunset,
      lat: coord.lat,
      lon: coord.lon,
      uv: Math.round(uvResponse.data.value),
    });

  } catch (err) {
    res.status(500).json({ error: 'Could not fetch weather for your location' });
  }
});

module.exports = router;
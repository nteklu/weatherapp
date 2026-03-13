const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather`;

    const response = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    const { name, main, weather, wind } = response.data;

    res.json({
      city: name,
      temperature: main.temp,
      feels_like: main.feels_like,
      humidity: main.humidity,
      description: weather[0].description,
      icon: weather[0].icon,
      wind_speed: wind.speed,
    });

  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
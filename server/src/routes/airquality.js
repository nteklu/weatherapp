const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/air_pollution',
      {
        params: { lat, lon, appid: apiKey },
      }
    );

    const aqi = response.data.list[0].main.aqi;
    const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const quality = ['', 'good', 'good', 'moderate', 'poor', 'poor'];

    res.json({
      aqi,
      label: labels[aqi],
      quality: quality[aqi],
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch air quality' });
  }
});

module.exports = router;
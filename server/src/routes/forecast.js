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

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
      }
    );

    const list = response.data.list;

    const hourly = list.slice(0, 8).map((item) => ({
      time: item.dt_txt,
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }));

    const dailyMap = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          temps: [],
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        };
      }
      dailyMap[date].temps.push(item.main.temp);
    });

    const daily = Object.values(dailyMap)
      .slice(0, 5)
      .map((day) => ({
        date: day.date,
        icon: day.icon,
        description: day.description,
        min: Math.round(Math.min(...day.temps)),
        max: Math.round(Math.max(...day.temps)),
      }));

    res.json({ hourly, daily });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
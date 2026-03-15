require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoute = require('./routes/weather');
const forecastRoute = require('./routes/forecast');
const airQualityRoute = require('./routes/airquality');
const weatherByCoordsRoute = require('./routes/weatherbycoords');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoute);
app.use('/api/forecast', forecastRoute);
app.use('/api/airquality', airQualityRoute);
app.use('/api/weatherbycoords', weatherByCoordsRoute);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
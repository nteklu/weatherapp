const request = require('supertest');
const app = require('../src/index');

describe('GET /api/weather', () => {
  test('returns 400 if no city is provided', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('City name is required');
  });

  test('returns 404 for an unrecognized city', async () => {
    const res = await request(app).get('/api/weather?city=xyzfakecity123');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('City not found');
  });

  test('returns weather data for a valid city', async () => {
    const res = await request(app).get('/api/weather?city=London');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('city');
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('wind_speed');
  });
});
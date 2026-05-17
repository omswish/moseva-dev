// tests/app.test.js
const request = require('supertest');
const app = require('../src/app');

describe('App Bootstrapping & Health Check', () => {
  it('should successfully return 200 OK on health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/api/v1/invalid-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toEqual(false);
    expect(res.body.error.code).toEqual('NOT_FOUND');
  });
});

import request from 'supertest';
import app from '../../src/app';

describe('Public & Health API Endpoints (Integration Tests)', () => {
  test('GET /api/v1/health returns status 200 with healthy payload', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  test('GET /api/v1/public/landing-stats returns 200 with platform proof points', async () => {
    const res = await request(app).get('/api/v1/public/landing-stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.studentsAssessed).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.supportedDegrees)).toBe(true);
  });

  test('Protected endpoint without token returns 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Validation rejects malformed registration payload with 400', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'not-an-email',
      password: 'short'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

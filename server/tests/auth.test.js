import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.model.js';

// Set env vars for test before importing app
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-that-is-long-enough-32chars!!';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-that-is-long-enough-32chars!';
process.env.CLIENT_URL = 'http://localhost:5173';

const validUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Password1',
};

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  // ─── Registration ───────────────────────────────────────────

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return 201', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      // Refresh token should be in cookie, NOT in JSON body
      expect(res.body.data.refreshToken).toBeUndefined();
    });

    it('should set httpOnly refresh token cookie on register', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie).toContain('HttpOnly');
    });

    it('should return 409 for duplicate email', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
      const res = await request(app).post('/api/v1/auth/register').send(validUser);

      expect(res.status).toBe(409);
    });

    it('should reject weak password (no uppercase)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: 'password1' });

      expect(res.status).toBe(400);
    });

    it('should reject weak password (no number)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: 'Password' });

      expect(res.status).toBe(400);
    });

    it('should BLOCK mass-assignment of role to admin', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, role: 'admin' });

      expect(res.status).toBe(201);
      // The user should be created but with role='user', not 'admin'
      const user = await User.findOne({ email: validUser.email });
      expect(user.role).toBe('user');
    });
  });

  // ─── Login ──────────────────────────────────────────────────

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
    });

    afterEach(async () => {
      await clearTestDB();
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: 'WrongPass1' });

      expect(res.status).toBe(401);
    });

    it('should BLOCK login for disabled users', async () => {
      // Disable the user directly in DB
      await User.findOneAndUpdate({ email: validUser.email }, { isDisabled: true });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(403);
    });
  });

  // ─── Refresh Token Rotation ─────────────────────────────────

  describe('POST /api/v1/auth/refresh', () => {
    let refreshCookie;

    beforeEach(async () => {
      const reg = await request(app).post('/api/v1/auth/register').send(validUser);
      const cookies = reg.headers['set-cookie'];
      refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
    });

    afterEach(async () => {
      await clearTestDB();
    });

    it('should issue a new access token on valid refresh', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshCookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      // Should also rotate the refresh token cookie
      const newCookies = res.headers['set-cookie'];
      expect(newCookies).toBeDefined();
    });

    it('should DETECT refresh token reuse and invalidate all sessions', async () => {
      // Use the refresh token once (rotation happens — old token replaced with new one)
      const firstRefresh = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshCookie]);
      expect(firstRefresh.status).toBe(200);

      // Try to use the ORIGINAL (now-rotated-out) token again
      const reuseAttempt = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshCookie]);

      // Should be rejected — this is the reuse detection
      expect(reuseAttempt.status).toBe(401);

      // Verify ALL sessions were wiped (the new token from firstRefresh should also fail)
      const newCookies = firstRefresh.headers['set-cookie'];
      const newRefreshCookie = newCookies.find(c => c.startsWith('refreshToken='));
      const afterWipe = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [newRefreshCookie]);

      expect(afterWipe.status).toBe(401);
    });

    it('should reject missing refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');

      expect(res.status).toBe(401);
    });
  });

  // ─── Logout ─────────────────────────────────────────────────

  describe('POST /api/v1/auth/logout', () => {
    it('should clear the refresh cookie on logout', async () => {
      const reg = await request(app).post('/api/v1/auth/register').send(validUser);
      const cookies = reg.headers['set-cookie'];
      const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', [refreshCookie]);

      expect(res.status).toBe(200);
      // The rotated-out token should no longer work
      const afterLogout = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshCookie]);
      expect(afterLogout.status).toBe(401);
    });
  });
});

import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from '@jest/globals';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.model.js';

process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-that-is-long-enough-32chars!!';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-that-is-long-enough-32chars!';
process.env.CLIENT_URL = 'http://localhost:5173';

const userA = {
  firstName: 'Alice',
  lastName: 'Dev',
  email: 'alice@example.com',
  password: 'Password1',
};
const userB = {
  firstName: 'Bob',
  lastName: 'Dev',
  email: 'bob@example.com',
  password: 'Password1',
};

// Helper: register + login and return { accessToken, userId }
async function createAuthUser(userData) {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send(userData);
  return {
    accessToken: res.body.data.accessToken,
    userId: res.body.data.user._id,
  };
}

describe('Security Guards', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  // ─── Self-targeting: Swipe ────────────────────────────────

  describe('Self-targeting on swipe', () => {
    it('should reject swiping on yourself', async () => {
      const { accessToken, userId } = await createAuthUser(userA);

      // Set some skills so the user is valid for discovery
      await User.findByIdAndUpdate(userId, { skills: ['React'] });

      const res = await request(app)
        .post('/api/v1/discover/swipe')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ swipedId: userId, action: 'like' });

      expect(res.status).toBe(400);
    });
  });

  // ─── Self-targeting: Connection ───────────────────────────

  describe('Self-targeting on connection request', () => {
    it('should reject sending a connection request to yourself', async () => {
      const { accessToken, userId } = await createAuthUser(userA);

      const res = await request(app)
        .post(`/api/v1/connections/request/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(400);
    });
  });

  // ─── NoSQL Injection ──────────────────────────────────────

  describe('NoSQL injection prevention', () => {
    it('should sanitize $gt operator in login email', async () => {
      await createAuthUser(userA);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: { $gt: '' },
          password: 'Password1',
        });

      // Should NOT succeed — the sanitizer strips the $gt,
      // and the empty/mangled email won't match any user
      expect(res.status).not.toBe(200);
    });
  });

  // ─── Protected routes without auth ────────────────────────

  describe('Protected routes reject unauthenticated requests', () => {
    it('should return 401 on GET /api/v1/posts without token', async () => {
      const res = await request(app).get('/api/v1/posts');
      expect(res.status).toBe(401);
    });

    it('should return 401 on GET /api/v1/discover/recommendations without token', async () => {
      const res = await request(app).get('/api/v1/discover/recommendations');
      expect(res.status).toBe(401);
    });

    it('should return 401 on GET /api/v1/connections without token', async () => {
      const res = await request(app).get('/api/v1/connections');
      expect(res.status).toBe(401);
    });
  });

  // ─── Admin authorization ──────────────────────────────────

  describe('Admin-only routes', () => {
    it('should reject non-admin users from admin endpoints', async () => {
      const { accessToken } = await createAuthUser(userA);
      const { userId: targetId } = await createAuthUser(userB);

      const res = await request(app)
        .post(`/api/v1/admin/users/${targetId}/disable`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(403);
    });
  });
});

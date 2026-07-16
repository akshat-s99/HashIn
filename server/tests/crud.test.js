import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js';
import app from '../src/app.js';
import { User } from '../src/models/User.model.js';
import { Post } from '../src/models/Post.model.js';
import { Connection } from '../src/models/Connection.model.js';

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

async function createAuthUser(userData) {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send(userData);
  return {
    accessToken: res.body.data.accessToken,
    userId: res.body.data.user._id,
  };
}

describe('CRUD Operations', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  // ─── Posts ────────────────────────────────────────────────

  describe('Posts', () => {
    it('should create a text post', async () => {
      const { accessToken } = await createAuthUser(userA);

      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Hello world!' });

      expect(res.status).toBe(201);
      expect(res.body.data.post.content).toBe('Hello world!');
    });

    it('should reject empty post content', async () => {
      const { accessToken } = await createAuthUser(userA);

      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should reject post with > 500 chars', async () => {
      const { accessToken } = await createAuthUser(userA);

      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a'.repeat(501) });

      expect(res.status).toBe(400);
    });

    it('should toggle like on a post', async () => {
      const { accessToken, userId } = await createAuthUser(userA);

      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Like me!' });
      const postId = postRes.body.data.post._id;

      // Like
      const likeRes = await request(app)
        .put(`/api/v1/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(likeRes.status).toBe(200);
      expect(likeRes.body.data.post.likes).toContain(userId);

      // Unlike (toggle)
      const unlikeRes = await request(app)
        .put(`/api/v1/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(unlikeRes.status).toBe(200);
      expect(unlikeRes.body.data.post.likes).not.toContain(userId);
    });

    it('should not allow non-author to delete a post', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      const postRes = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${authA.accessToken}`)
        .send({ content: 'My post' });
      const postId = postRes.body.data.post._id;

      // User B tries to delete User A's post
      const deleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}`)
        .set('Authorization', `Bearer ${authB.accessToken}`);

      expect(deleteRes.status).toBe(403);
    });

    it('should allow author to delete own post', async () => {
      const { accessToken } = await createAuthUser(userA);

      const postRes = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Delete me' });
      const postId = postRes.body.data.post._id;

      const deleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(deleteRes.status).toBe(200);
    });
  });

  // ─── Bookmarks ────────────────────────────────────────────

  describe('Bookmarks', () => {
    it('should toggle bookmark and retrieve bookmarked posts', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      // User B creates a post
      const postRes = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${authB.accessToken}`)
        .send({ content: 'Bookmark this' });
      const postId = postRes.body.data.post._id;

      // User A bookmarks it
      const bookmarkRes = await request(app)
        .post(`/api/v1/posts/${postId}/bookmark`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(bookmarkRes.status).toBe(200);

      // User A retrieves bookmarked posts
      const savedRes = await request(app)
        .get('/api/v1/posts/bookmarks')
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(savedRes.status).toBe(200);
      expect(savedRes.body.data.posts.length).toBe(1);

      // User A un-bookmarks
      await request(app)
        .post(`/api/v1/posts/${postId}/bookmark`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      const emptyRes = await request(app)
        .get('/api/v1/posts/bookmarks')
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(emptyRes.body.data.posts.length).toBe(0);
    });
  });

  // ─── Connections ──────────────────────────────────────────

  describe('Connections', () => {
    it('should send and accept a connection request', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      // A sends request to B
      const sendRes = await request(app)
        .post(`/api/v1/connections/request/${authB.userId}`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(sendRes.status).toBe(201);
      const connectionId = sendRes.body.data.connection._id;

      // B accepts
      const acceptRes = await request(app)
        .put(`/api/v1/connections/${connectionId}/status`)
        .set('Authorization', `Bearer ${authB.accessToken}`)
        .send({ status: 'accepted' });
      expect(acceptRes.status).toBe(200);
    });

    it('should reject duplicate connection requests', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      await request(app)
        .post(`/api/v1/connections/request/${authB.userId}`)
        .set('Authorization', `Bearer ${authA.accessToken}`);

      // Send again — should fail
      const dup = await request(app)
        .post(`/api/v1/connections/request/${authB.userId}`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(dup.status).toBe(409);
    });

    it('should remove an accepted connection', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      const sendRes = await request(app)
        .post(`/api/v1/connections/request/${authB.userId}`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      const connectionId = sendRes.body.data.connection._id;

      // Accept first
      await request(app)
        .put(`/api/v1/connections/${connectionId}/status`)
        .set('Authorization', `Bearer ${authB.accessToken}`)
        .send({ status: 'accepted' });

      // Remove
      const removeRes = await request(app)
        .delete(`/api/v1/connections/${connectionId}`)
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(removeRes.status).toBe(200);
    });
  });

  // ─── Cascading Delete ─────────────────────────────────────

  describe('Cascading Deletes', () => {
    it('should delete all user data when account is deleted', async () => {
      const authA = await createAuthUser(userA);
      const authB = await createAuthUser(userB);

      // Create posts by user A
      await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${authA.accessToken}`)
        .send({ content: 'Post by A' });

      // Create connection
      await Connection.create({
        senderId: authA.userId,
        receiverId: authB.userId,
        status: 'accepted',
      });

      // Delete user A
      const deleteRes = await request(app)
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${authA.accessToken}`);
      expect(deleteRes.status).toBe(200);

      // Verify cascading deletes
      const posts = await Post.find({ authorId: authA.userId });
      expect(posts.length).toBe(0);

      const connections = await Connection.find({
        $or: [{ senderId: authA.userId }, { receiverId: authA.userId }],
      });
      expect(connections.length).toBe(0);

      const user = await User.findById(authA.userId);
      expect(user).toBeNull();
    });
  });
});

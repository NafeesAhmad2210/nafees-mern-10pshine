import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));
vi.mock('../logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'fake-jwt-token'),
    verify: vi.fn(),
  },
}));

import authRoutes from './auth.js';
import User from '../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('returns 400 when name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'a@b.com', password: 'password1' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name.*email.*password|required/i);
      expect(User.create).not.toHaveBeenCalled();
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test', password: 'password1' });
      expect(res.status).toBe(400);
      expect(User.create).not.toHaveBeenCalled();
    });

    it('returns 400 when password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test', email: 'a@b.com', password: '12345' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/6 characters|password/i);
      expect(User.create).not.toHaveBeenCalled();
    });

    it('returns 409 when email already registered', async () => {
      User.findOne.mockResolvedValue({ _id: 'existing', email: 'a@b.com' });
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test', email: 'a@b.com', password: 'password1' });
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already registered|email/i);
      expect(User.create).not.toHaveBeenCalled();
    });

    it('returns 201 with token and user on success', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'new-user-id',
        name: 'Test User',
        email: 'new@test.com',
      });
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'new@test.com', password: 'password1' });
      expect(res.status).toBe(201);
      expect(res.body.token).toBe('fake-jwt-token');
      expect(res.body.user).toEqual({
        id: 'new-user-id',
        name: 'Test User',
        email: 'new@test.com',
      });
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'new@test.com',
          password: 'password1',
        })
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password1' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email.*password|required/i);
    });

    it('returns 401 when user not found', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nope@test.com', password: 'password1' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid|password/i);
    });

    it('returns 401 when password does not match', async () => {
      User.findOne.mockResolvedValue({
        _id: 'user1',
        name: 'Test',
        email: 'test@test.com',
        comparePassword: vi.fn().mockResolvedValue(false),
      });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid|password/i);
    });

    it('returns 200 with token and user when credentials valid', async () => {
      const user = {
        _id: 'user1',
        name: 'Test User',
        email: 'test@test.com',
        comparePassword: vi.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(user);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'correct' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBe('fake-jwt-token');
      expect(res.body.user).toEqual({
        id: 'user1',
        name: 'Test User',
        email: 'test@test.com',
      });
      expect(user.comparePassword).toHaveBeenCalledWith('correct');
    });
  });
});

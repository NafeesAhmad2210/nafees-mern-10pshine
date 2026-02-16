import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
vi.mock('../models/Note.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
  },
}));
vi.mock('../logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Use a stub auth that injects userId
vi.mock('../middleware/auth.js', () => ({
  authMiddleware: (req, res, next) => {
    req.userId = req.headers['x-test-user-id'] || 'test-user-id';
    next();
  },
}));

import notesRoutes from './notes.js';
import Note from '../models/Note.js';

const app = express();
app.use(express.json());
app.use('/api/notes', notesRoutes);

describe('Notes routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Note.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }),
    });
  });

  describe('GET /api/notes', () => {
    it('returns notes for authenticated user', async () => {
      const notes = [
        { _id: '1', title: 'Note 1', content: '', important: false, userId: 'user1' },
      ];
      Note.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(notes) }),
      });
      const res = await request(app)
        .get('/api/notes')
        .set('x-test-user-id', 'user1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(notes);
      expect(Note.find).toHaveBeenCalledWith({ userId: 'user1' });
    });

    it('filters by important when query important=true', async () => {
      Note.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }),
      });
      await request(app).get('/api/notes?important=true');
      expect(Note.find).toHaveBeenCalledWith({
        userId: 'test-user-id',
        important: true,
      });
    });
  });

  describe('POST /api/notes', () => {
    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('x-test-user-id', 'user1')
        .send({ content: 'body' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title|required/i);
      expect(Note.create).not.toHaveBeenCalled();
    });

    it('returns 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('x-test-user-id', 'user1')
        .send({ title: '   ', content: 'body' });
      expect(res.status).toBe(400);
      expect(Note.create).not.toHaveBeenCalled();
    });

    it('returns 201 and creates note with valid body', async () => {
      const created = {
        _id: 'note-1',
        title: 'My Note',
        content: 'Hello',
        important: true,
        userId: 'user1',
      };
      Note.create.mockResolvedValue(created);
      const res = await request(app)
        .post('/api/notes')
        .set('x-test-user-id', 'user1')
        .send({ title: 'My Note', content: 'Hello', important: true });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
      expect(Note.create).toHaveBeenCalledWith({
        title: 'My Note',
        content: 'Hello',
        important: true,
        userId: 'user1',
      });
    });

    it('defaults content and important when not sent', async () => {
      Note.create.mockResolvedValue({
        _id: 'n1',
        title: 'T',
        content: '',
        important: false,
        userId: 'u1',
      });
      await request(app)
        .post('/api/notes')
        .set('x-test-user-id', 'u1')
        .send({ title: 'T' });
      expect(Note.create).toHaveBeenCalledWith({
        title: 'T',
        content: '',
        important: false,
        userId: 'u1',
      });
    });
  });
});

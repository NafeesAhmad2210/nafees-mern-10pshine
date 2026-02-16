import express from 'express';
import Note from '../models/Note.js';
import logger from '../logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { important } = req.query;
    const filter = { userId: req.userId };
    if (important === 'true') filter.important = true;
    const notes = await Note.find(filter).sort({ createdAt: -1 }).lean();
    res.json(notes);
  } catch (err) {
    logger.error({ err }, 'Get notes error');
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, important } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const note = await Note.create({
      title: title.trim(),
      content: (content || '').trim(),
      important: Boolean(important),
      userId: req.userId,
    });
    logger.info({ noteId: note._id, userId: req.userId }, 'Note created');
    res.status(201).json(note);
  } catch (err) {
    logger.error({ err }, 'Create note error');
    res.status(500).json({ error: 'Failed to create note' });
  }
});

export default router;

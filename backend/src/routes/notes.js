import express from 'express';
import Note from '../models/Note.js';
import logger from '../logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { important, trashed } = req.query;
    const filter = { userId: req.userId };
    if (important === 'true') filter.important = true;
    if (trashed === 'true') filter.trashed = true;
    else filter.trashed = { $ne: true };
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
    logger.info({ noteId: note._id }, 'Note created');
    res.status(201).json(note);
  } catch (err) {
    logger.error({ err }, 'Create note error');
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, important, trashed } = req.body;
    const update = {};
    if (typeof title === 'string' && title.trim()) update.title = title.trim();
    if (typeof content === 'string') update.content = (content || '').trim();
    if (typeof important === 'boolean') update.important = important;
    if (trashed === true || trashed === 'true') update.trashed = true;
    else if (trashed === false || trashed === 'false') update.trashed = false;
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Send title, content, important or trashed' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: update },
      { new: true }
    ).lean();
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    logger.error({ err }, 'Update note error');
    res.status(500).json({ error: 'Failed to update note' });
  }
});

export default router;

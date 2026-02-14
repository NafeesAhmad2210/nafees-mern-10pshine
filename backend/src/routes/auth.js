import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../logger.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logger.warn({ body: req.body }, 'Signup validation failed: missing fields');
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn({ email }, 'Signup failed: email already registered');
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    logger.info({ userId: user._id, email: user.email }, 'User registered');

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error({ err }, 'Signup error');
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn({ body: req.body }, 'Login validation failed: missing fields');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn({ email }, 'Login failed: user not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      logger.warn({ email }, 'Login failed: wrong password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    logger.info({ userId: user._id, email: user.email }, 'User logged in');

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error({ err }, 'Login error');
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

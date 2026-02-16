import jwt from 'jsonwebtoken';
import logger from '../logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    logger.warn({ err }, 'Invalid token');
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

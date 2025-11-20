const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecret';

exports.authenticate = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { rows } = await pool.query('SELECT r.name FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=$1', [userId]);
    if (rows.length === 0) return res.status(403).json({ error: 'Forbidden' });
    if (rows[0].name !== 'admin') return res.status(403).json({ error: 'Forbidden: admin only' });
    next();
  } catch (err) { next(err); }
};

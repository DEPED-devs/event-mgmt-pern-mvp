const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

exports.register = async (req, res, next) => {
  try {
    const { username, password, email, role_id, employee_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash, email, role_id, employee_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, username, email, role_id, employee_id',
      [username, hash, email, role_id || 3, employee_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON r.id=u.role_id WHERE username=$1',
      [username]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role_name, employee_id: user.employee_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role_name, employee_id: user.employee_id } });
  } catch (err) { next(err); }
};

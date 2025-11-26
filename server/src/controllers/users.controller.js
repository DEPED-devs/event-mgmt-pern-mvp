// src/controllers/users.controller.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecret';

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, role_id, is_active, created_at 
       FROM users ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET USER BY ID
exports.getUserById = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, role_id, is_active, created_at 
       FROM users WHERE id=$1`,
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE USER
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, email, role_id } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (username, email, role_id, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role_id, created_at`,
      [username, email, role_id, hash]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// UPDATE USER
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check user
    const existing = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    if (!existing.rows.length)
      return res.status(404).json({ message: 'User not found' });

    let { username, email, role_id, password } = req.body;

    let password_hash = existing.rows[0].password_hash;

    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const { rows } = await pool.query(
      `UPDATE users 
       SET username=$1, email=$2, role_id=$3, password_hash=$4
       WHERE id=$5
       RETURNING id, username, email, role_id, created_at`,
      [username, email, role_id, password_hash, id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { username, password, email, role_id } = req.body;

    const exists = await pool.query(`SELECT 1 FROM users WHERE username=$1`, [
      username,
    ]);

    if (exists.rows.length)
      return res.status(400).json({ message: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (username, email, role_id, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role_id`,
      [username, email, role_id, hash]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE username=$1`,
      [username]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'User not found' });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};

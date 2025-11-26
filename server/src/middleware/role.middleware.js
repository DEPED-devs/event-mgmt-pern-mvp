const pool = require('../config/db');

exports.authorizeRole = (roles = []) => async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { rows } = await pool.query(
      'SELECT r.name FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = $1',
      [userId]
    );

    if (!rows.length || !roles.includes(rows[0].name)) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

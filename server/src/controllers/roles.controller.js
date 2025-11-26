// const db = require('../config/db');

// exports.getAllRoles = async (req, res) => {
//   try {
//     const roles = await db.roles.findAll();
//     res.json(roles);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getRoleById = async (req, res) => {
//   try {
//     const role = await db.roles.findByPk(req.params.id);
//     if (!role) return res.status(404).json({ message: 'Role not found' });
//     res.json(role);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createRole = async (req, res) => {
//   try {
//     const newRole = await db.roles.create(req.body);
//     res.status(201).json(newRole);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateRole = async (req, res) => {
//   try {
//     const role = await db.roles.findByPk(req.params.id);
//     if (!role) return res.status(404).json({ message: 'Role not found' });
//     await role.update(req.body);
//     res.json(role);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteRole = async (req, res) => {
//   try {
//     const role = await db.roles.findByPk(req.params.id);
//     if (!role) return res.status(404).json({ message: 'Role not found' });
//     await role.destroy();
//     res.json({ message: 'Role deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/roles.controller.js
const pool = require('../config/db');

// ## GET ALL ROLES
exports.getAllRoles = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, name, description FROM roles ORDER BY id ASC`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ## GET ROLE BY ID
exports.getRoleById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, name, description FROM roles WHERE id=$1`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Role not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## CREATE ROLE
exports.createRole = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## UPDATE ROLE
exports.updateRole = async (req, res, next) => {
    const { name, description } = req.body;
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `UPDATE roles SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
            [name, description, id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Role not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## DELETE ROLE
exports.deleteRole = async (req, res, next) => {
    try {
        const result = await pool.query(`DELETE FROM roles WHERE id=$1`, [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        next(err);
    }
};
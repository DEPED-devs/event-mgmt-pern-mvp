// const pool = require('../config/db');

// const getAllAttendance = async (req, res) => {
//   try {
//     const attendance = await db.user_event_attendance.findAll();
//     res.json(attendance);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getAttendanceById = async (req, res) => {
//   try {
//     const record = await db.user_event_attendance.findByPk(req.params.id);
//     if (!record) return res.status(404).json({ message: 'Attendance record not found' });
//     res.json(record);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const createAttendance = async (req, res) => {
//   try {
//     const newRecord = await db.user_event_attendance.create(req.body);
//     res.status(201).json(newRecord);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateAttendance = async (req, res) => {
//   try {
//     const record = await db.user_event_attendance.findByPk(req.params.id);
//     if (!record) return res.status(404).json({ message: 'Attendance record not found' });
//     await record.update(req.body);
//     res.json(record);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteAttendance = async (req, res) => {
//   try {
//     const record = await db.user_event_attendance.findByPk(req.params.id);
//     if (!record) return res.status(404).json({ message: 'Attendance record not found' });
//     await record.destroy();
//     res.json({ message: 'Attendance record deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   getAllAttendance,
//   getAttendanceById,
//   createAttendance,
//   updateAttendance,
//   deleteAttendance, 
// }

// src/controllers/userEventAttendance.controller.js
const pool = require('../config/db');

// Columns from the attendance table. Use alias 'ua.' for clarity in the query.
const ATTENDANCE_COLUMNS = 'ua.id, ua.user_id, ua.event_date_id, ua.attended_at'; 

// ## GET ALL ATTENDANCE (READ ALL - with JOINS)
const getAllAttendance = async (req, res, next) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ${ATTENDANCE_COLUMNS}, 
                u.username, 
                e.title AS event_title,
                ed.session_date AS event_date_time -- Fetch the session_date from the event_dates table
            FROM user_event_attendance ua -- Corrected alias to 'ua'
            
            -- Join 1: Link to Users
            JOIN users u ON ua.user_id = u.id 
            
            -- Join 2: Link Attendance to Event Dates
            JOIN event_dates ed ON ua.event_date_id = ed.id 
            
            -- Join 3: Link Event Dates to Events
            JOIN events e ON ed.event_id = e.id 
            
            ORDER BY ua.attended_at DESC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ## GET ATTENDANCE BY ID (READ BY ID)
const getAttendanceById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM user_event_attendance WHERE id = $1`, 
            [req.params.id]
        );
        
        if (rows.length === 0) 
            return res.status(404).json({ message: 'Attendance record not found' });
            
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## CREATE ATTENDANCE
const createAttendance = async (req, res, next) => {
    const { user_id, event_id } = req.body;
    
    try {
        const { rows } = await pool.query(
            // Note: If you have a column like 'attended_at' you may want to set it to NOW() here
            `INSERT INTO user_event_attendance (user_id, event_id)
             VALUES ($1, $2)
             RETURNING *`,
            [user_id, event_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        // Catching potential unique constraint violation errors (if a user attends the same event twice)
        next(err);
    }
};

// ## UPDATE ATTENDANCE
const updateAttendance = async (req, res, next) => {
    const { id } = req.params;
    const { user_id, event_id, attended_at } = req.body;
    
    try {
        const { rows } = await pool.query(
            `UPDATE user_event_attendance 
             SET user_id = $1, event_id = $2, attended_at = $3
             WHERE id = $4
             RETURNING *`,
            [user_id, event_id, attended_at, id]
        );

        if (rows.length === 0) 
            return res.status(404).json({ message: 'Attendance record not found' });
            
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## DELETE ATTENDANCE
const deleteAttendance = async (req, res, next) => {
    try {
        const result = await pool.query(
            `DELETE FROM user_event_attendance WHERE id = $1`, 
            [req.params.id]
        );
        
        if (result.rowCount === 0) 
            return res.status(404).json({ message: 'Attendance record not found' });
            
        res.json({ message: 'Attendance record deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance, 
};
// src/routes/users.routes.js
const router = require('express').Router();
const usersController = require('../controllers/users.controller');
// 1. Import 'authenticate' from auth.middleware
const { authenticate } = require('../middleware/auth.middleware');
// 2. Import 'authorizeRole' from role.middleware
const { authorizeRole } = require("../middleware/role.middleware");

// Public
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// Admin-only: list all users
// 3. Replace 'authorizeAdmin' with 'authorizeRole' passing the specific role name
// router.get('/', authenticate, authorizeRole(['admin']), usersController.getAllUsers);

// // Authenticated
// router.get('/:id', authenticate, usersController.getUserById);
// router.put('/:id', authenticate, usersController.updateUser);
// router.delete('/:id', authenticate, authorizeRole(['admin']), usersController.deleteUser);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', usersController.getAllUsers);

// Authenticated
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRole } = require('../middleware/role.middleware');

// router.get('/', authenticate, rolesController.getAllRoles);
// router.get('/:id', authenticate, rolesController.getRoleById);
// router.post('/', authenticate, authorizeRole(['admin']), rolesController.createRole);
// router.put('/:id', authenticate, authorizeRole(['admin']), rolesController.updateRole);
// router.delete('/:id', authenticate, authorizeRole(['admin']), rolesController.deleteRole);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', rolesController.getAllRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.put('/:id', rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);
module.exports = router;

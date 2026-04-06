import express from 'express';
//will check the token
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { createUser, deleteUser, updateUser } from '../../controllers/user/user.controller.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';

//will check the role
const router = express.Router();
router.post('/', authenticateToken, authorizeRoles('admin'), createUser)
router.patch('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
//to soft delet the user 
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser)
export default router
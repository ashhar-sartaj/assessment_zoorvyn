import express from 'express'
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { getSummary } from '../../controllers/dashboard/dashboard.controller.js';

const router = express.Router();
router.get('/summary', authenticateToken, authorizeRoles('admin','analyst','viewer'), getSummary)
export default router;
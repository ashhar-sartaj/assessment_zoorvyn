import express from 'express'
import { login } from '../../controllers/auth/auth.controller.js';
const router = express.Router();
router.post('/login', login); //create login in the controller

export default router;
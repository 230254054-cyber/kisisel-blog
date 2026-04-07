import express from 'express';
import { login, changePassword } from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/login', login);
router.put('/change-password', authMiddleware, changePassword);

export default router;

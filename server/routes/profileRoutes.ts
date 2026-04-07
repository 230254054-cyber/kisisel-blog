import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/', getProfile);
router.put('/', authMiddleware, updateProfile);

export default router;

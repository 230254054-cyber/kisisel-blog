import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/', getProjects);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;

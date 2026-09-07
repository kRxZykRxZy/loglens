import { Router } from 'express';
import { list, create } from '../controllers/project-controller.js';
import { requireAuth } from '../middleware/require-auth.js';
export const projectRoutes = Router();
projectRoutes.use(requireAuth);
projectRoutes.get('/', list);
projectRoutes.post('/', create);

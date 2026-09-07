import { Router } from 'express';
import express from 'express';
import { list, create } from '../controllers/project-controller.js';
import { requireAuth } from '../middleware/require-auth.js';
export const projectRoutes = Router();
projectRoutes.use(requireAuth);
projectRoutes.use(express.json({ limit: '256kb' }));
projectRoutes.get('/', list);
projectRoutes.post('/', create);

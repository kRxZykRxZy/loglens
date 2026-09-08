import { Router } from 'express';
import express from 'express';
import {
  acceptInvite,
  changeMemberRole,
  create,
  invite,
  leave,
  list,
  listMembers,
  read,
  remove,
  removeMember,
  setArchive,
  transfer,
  update,
} from '../controllers/project-controller.js';
import {
  create as createKey,
  list as listKeys,
  rename as renameKey,
  revoke as revokeKey,
  rotate as rotateKey,
} from '../controllers/api-key-controller.js';
import { requireAuth } from '../middleware/require-auth.js';
export const projectRoutes = Router();
projectRoutes.use(requireAuth);
projectRoutes.use(express.json({ limit: '256kb' }));

projectRoutes.get('/', list);
projectRoutes.post('/', create);

projectRoutes.get('/:projectId', read);
projectRoutes.patch('/:projectId', update);
projectRoutes.patch('/:projectId/archive', setArchive);
projectRoutes.delete('/:projectId', remove);

projectRoutes.get('/:projectId/members', listMembers);
projectRoutes.post('/:projectId/members', invite);
projectRoutes.post('/:projectId/members/accept', acceptInvite);
projectRoutes.post('/:projectId/leave', leave);
projectRoutes.patch('/:projectId/members/:userId', changeMemberRole);
projectRoutes.delete('/:projectId/members/:userId', removeMember);
projectRoutes.post('/:projectId/transfer', transfer);

projectRoutes.get('/:projectId/keys', listKeys);
projectRoutes.post('/:projectId/keys', createKey);
projectRoutes.patch('/:projectId/keys/:keyId', renameKey);
projectRoutes.post('/:projectId/keys/:keyId/rotate', rotateKey);
projectRoutes.delete('/:projectId/keys/:keyId', revokeKey);

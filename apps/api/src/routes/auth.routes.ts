import { Router } from 'express';
import express from 'express';
import { register, login, logout } from '../controllers/auth-controller.js';
import { me } from '../controllers/me-controller.js';
import { requireAuth } from '../middleware/require-auth.js';
import { rateLimit } from '../middleware/rate-limit.js';
import {
  forgotPassword,
  resendConfirmation,
  exportAccount,
  deleteAccount,
  revokeSessions,
  auditEvents,
} from '../controllers/account-controller.js';

export const authRoutes = Router();
authRoutes.use(express.json({ limit: '256kb' }));

authRoutes.post(
  '/register',
  rateLimit({ windowMs: 60_000, max: 10, keyPrefix: 'auth:register' }),
  register,
);
authRoutes.post('/login', rateLimit({ windowMs: 60_000, max: 20, keyPrefix: 'auth:login' }), login);
authRoutes.post('/logout', logout);
authRoutes.get('/me', requireAuth, me);

authRoutes.post(
  '/forgot-password',
  rateLimit({ windowMs: 60_000, max: 3, keyPrefix: 'auth:forgot' }),
  forgotPassword,
);
authRoutes.post(
  '/resend-confirmation',
  rateLimit({ windowMs: 60_000, max: 3, keyPrefix: 'auth:resend' }),
  resendConfirmation,
);

authRoutes.get('/export', exportAccount);
authRoutes.delete('/account', deleteAccount);
authRoutes.post('/sessions/revoke', revokeSessions);
authRoutes.get('/events', auditEvents);

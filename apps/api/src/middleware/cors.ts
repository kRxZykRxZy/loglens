import type { RequestHandler } from 'express';
import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware: RequestHandler = cors({
  origin: env.corsOrigin || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
});
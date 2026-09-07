import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { apiRouter } from './routes/api-router.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { corsMiddleware } from './middleware/cors.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './errors/error-handler.js';
import { frontend } from './middleware/frontend.js';
import { env } from './config/env.js';

export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(requestId);
  app.use(requestLogger);
  app.use(compression());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(corsMiddleware);
  app.use('/api', express.json({ limit: env.bodyLimit }));
  app.use('/api', apiRouter);
  app.use(frontend);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
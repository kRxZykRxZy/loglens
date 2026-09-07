import 'dotenv/config';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { migrate } from './database/migrate.js';
import { pool } from './database/pool.js';
import { logger } from './logger/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const start = async () => {
  await migrate();
  const app = createApp();
  const server = app.listen(env.port, () =>
    logger.info(`LogLens API listening on ${env.port}`, { port: env.port }),
  );

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`, { signal });
    const force = setTimeout(() => {
      logger.error('Graceful shutdown timed out, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    force.unref();
    server.close(async () => {
      await pool.end();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((err) => {
  logger.error('Failed to start LogLens API', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});

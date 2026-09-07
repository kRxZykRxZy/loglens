import 'dotenv/config';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { migrate } from './database/migrate.js';
const start = async () => {
  await migrate();
  const app = createApp();
  app.listen(env.port, () => console.log(`LogLens API listening on ${env.port}`));
};
start().catch((err) => {
  console.error(err);
  process.exit(1);
});

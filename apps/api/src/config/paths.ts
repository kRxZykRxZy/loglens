import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
export const webDist = path.resolve(here, '../../../../apps/web/dist');
export const webIndex = path.join(webDist, 'index.html');

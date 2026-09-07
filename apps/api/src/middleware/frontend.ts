import express, { type RequestHandler } from 'express';
import { webDist, webIndex } from '../config/paths.js';
import fs from 'node:fs';
export const frontend: RequestHandler = (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (fs.existsSync(webIndex))
    return express.static(webDist)(req, res, () => res.sendFile(webIndex));
  return res.status(503).send('LogLens web build is not available.');
};

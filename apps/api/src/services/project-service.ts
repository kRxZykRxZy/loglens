import { randomUUID } from 'node:crypto';
import { createProject, listProjects } from '../repositories/project-repository.js';
export const getProjects = (userId: string) => listProjects(userId);
export const addProject = (userId: string, name: string) =>
  createProject(randomUUID(), userId, name.trim());

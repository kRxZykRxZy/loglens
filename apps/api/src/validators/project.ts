import { requireString } from '@loglens/validation';
import { AppError } from '../errors/app-error.js';

export const projectName = (value: unknown) => {
  const result = requireString(value, 'Project name', { minLength: 1, maxLength: 100 });
  if (!result.ok) throw new AppError(400, result.error, 'INVALID_PROJECT');
  return result.value;
};

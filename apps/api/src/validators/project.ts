import { requireString, requireNullableString } from '@loglens/validation';
import { AppError } from '../errors/app-error.js';
import { PROJECT_ROLES, type ProjectRole } from '../types/domain.js';

export const projectName = (value: unknown) => {
  const result = requireString(value, 'Project name', { minLength: 1, maxLength: 100 });
  if (!result.ok) throw new AppError(400, result.error, 'INVALID_PROJECT');
  return result.value;
};

export const projectDescription = (value: unknown): string | null => {
  const result = requireNullableString(value, 'Project description', { maxLength: 500 });
  if (!result.ok) throw new AppError(400, result.error, 'INVALID_PROJECT');
  return result.value === '' ? null : result.value;
};

export const projectRole = (value: unknown): ProjectRole => {
  const result = requireString(value, 'Role', { minLength: 1, maxLength: 20 });
  if (!result.ok) throw new AppError(400, result.error, 'INVALID_ROLE');
  if (!PROJECT_ROLES.includes(result.value as ProjectRole)) {
    throw new AppError(400, 'Unknown role', 'INVALID_ROLE');
  }
  return result.value as ProjectRole;
};

export const apiKeyName = (value: unknown) => {
  const result = requireString(value, 'API key name', { minLength: 1, maxLength: 64 });
  if (!result.ok) throw new AppError(400, result.error, 'INVALID_API_KEY');
  return result.value;
};

export const uuid = (value: unknown) => {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)
  ) {
    throw new AppError(400, 'A valid UUID is required', 'INVALID_ID');
  }
  return value;
};

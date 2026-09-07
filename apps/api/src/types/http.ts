import type { Request } from 'express';

export type AuthenticatedRequest = Request & { userId?: string; userEmail?: string | null };
export type ApiErrorBody = { error: string; code?: string };

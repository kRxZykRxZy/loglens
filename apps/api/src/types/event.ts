import type { Severity } from '@loglens/shared';

export type EventInput = {
  message: string;
  severity: Severity;
  metadata?: Record<string, unknown>;
  stackTrace?: string;
  environment?: string;
  service?: string;
  source?: string;
  requestId?: string;
};

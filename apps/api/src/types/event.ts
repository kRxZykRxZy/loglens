export type Severity = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
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

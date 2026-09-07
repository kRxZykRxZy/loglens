import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export type LogEntry = {
  level: LogLevel;
  message: string;
  requestId?: string;
  service: string;
  [key: string]: unknown;
};

function toJson(entry: LogEntry): string {
  try {
    return JSON.stringify(entry);
  } catch {
    return JSON.stringify({ ...entry, message: entry.message, level: entry.level, service: entry.service });
  }
}

export class Logger {
  constructor(
    private readonly service: string,
    private readonly minLevel: LogLevel = env.logLevel,
  ) {}

  private write(level: LogLevel, message: string, fields: Record<string, unknown> = {}) {
    if (LEVELS[level] < LEVELS[this.minLevel]) return;
    const entry: LogEntry = { level, message, service: this.service, ...fields };
    process.stdout.write(toJson(entry) + '\n');
  }

  debug(message: string, fields: Record<string, unknown> = {}) {
    this.write('debug', message, fields);
  }
  info(message: string, fields: Record<string, unknown> = {}) {
    this.write('info', message, fields);
  }
  warn(message: string, fields: Record<string, unknown> = {}) {
    this.write('warn', message, fields);
  }
  error(message: string, fields: Record<string, unknown> = {}) {
    this.write('error', message, fields);
  }

  child(service: string): Logger {
    return new Logger(service, this.minLevel);
  }
}

export const logger = new Logger('api');

export function newRequestId(): string {
  return randomUUID();
}
export const PLANS = ['free', 'pro'] as const;
export type Plan = (typeof PLANS)[number];

export type PlanLimits = {
  projects: number;
  eventsPerMonth: number;
  retentionDays: number;
  members: number;
  alerts: number;
};

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    projects: 3,
    eventsPerMonth: 1_000_000,
    retentionDays: 7,
    members: 1,
    alerts: 3,
  },
  pro: {
    projects: 50,
    eventsPerMonth: 50_000_000,
    retentionDays: 90,
    members: 25,
    alerts: 100,
  },
};

export const DEFAULT_PLAN: Plan = 'free';

export const EVENT_MAX_BYTES = 256 * 1024;

export const INGEST_BATCH_MAX = 100;

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

export type ServiceStatus =
  | "operational"
  | "degraded"
  | "down"
  | "investigating"
  | "unknown"
  | "resolved";

export interface Svc {
  slug: string;
  name: string;
  category: string;
  description?: string;
  url?: string;
  apiUrl?: string;
  docsUrl?: string;
  statusUrl?: string;
  logo?: string;
  icon?: string;
}

export interface StatusSnapshot {
  slug: string;
  name?: string;
  category?: string;
  status: ServiceStatus;
  latencyMs: number | null;
  checkedAt: string | null;
  stale?: boolean;
  uptime: number;
  uptime24?: number;
  uptime7?: number;
  uptime30?: number;
}

export interface Incident {
  id: string;
  serviceSlug: string;
  serviceName?: string;
  serviceIcon?: string;
  title: string;
  description?: string;
  status: ServiceStatus;
  severity?: string;
  category?: string;
  startedAt: string;
  endedAt?: string | null;
  resolvedAt?: string | null;
  url?: string;
}

export interface TimelineResponse {
  incidents: Incident[];
  nextCursor: string | null;
}

export const STATUS_META: Record<ServiceStatus, { label: string; severity: number }> = {
  operational: { label: "Operational", severity: 0 },
  degraded: { label: "Degraded", severity: 1 },
  investigating: { label: "Investigating", severity: 2 },
  down: { label: "Down", severity: 3 },
  unknown: { label: "Unknown", severity: -1 },
  resolved: { label: "Resolved", severity: 0 },
};

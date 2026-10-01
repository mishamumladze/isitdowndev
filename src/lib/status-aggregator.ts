import type { Svc } from "./services-config";

export type NormalizedStatus =
  | "operational"
  | "degraded"
  | "down"
  | "investigating"
  | "unknown";

export type ServiceResult = {
  slug: string;
  status: NormalizedStatus;
  latencyMs: number | null;
  checkedAt: string;
  indicator?: string;
};

export function normalizeIndicator(indicator?: string | null): NormalizedStatus {
  if (!indicator) return "unknown";
  const v = indicator.toLowerCase().trim();
  if (v === "none" || v === "operational" || v === "ok") return "operational";
  if (v === "minor" || v === "degraded" || v === "partial") return "degraded";
  if (v === "major" || v === "critical" || v === "down" || v === "outage") return "down";
  return "investigating";
}

function timeoutSignal(ms: number): AbortSignal {
  // AbortSignal.timeout available Node 18+
  return AbortSignal.timeout(ms);
}

export async function fetchServiceStatus(svc: Svc): Promise<ServiceResult> {
  const checkedAt = new Date().toISOString();
  const started = Date.now();
  try {
    if (svc.apiUrl) {
      const res = await fetch(svc.apiUrl, {
        signal: timeoutSignal(8000),
        headers: { Accept: "application/json", "User-Agent": "isitdowndev/1.0" },
        cache: "no-store",
      });
      const latencyMs = Date.now() - started;
      if (!res.ok) {
        return { slug: svc.slug, status: "investigating", latencyMs, checkedAt };
      }
      const json = (await res.json()) as {
        status?: { indicator?: string };
        indicator?: string;
      };
      const indicator = json?.status?.indicator ?? json?.indicator ?? null;
      return {
        slug: svc.slug,
        status: normalizeIndicator(indicator),
        latencyMs,
        checkedAt,
        indicator: indicator ?? undefined,
      };
    }
    // Ping fallback: statusUrl reachable => operational
    const res = await fetch(svc.statusUrl, {
      method: "HEAD",
      signal: timeoutSignal(8000),
      cache: "no-store",
      redirect: "follow",
    });
    const latencyMs = Date.now() - started;
    return {
      slug: svc.slug,
      status: res.ok ? "operational" : "investigating",
      latencyMs,
      checkedAt,
    };
  } catch {
    return {
      slug: svc.slug,
      status: "unknown",
      latencyMs: Date.now() - started,
      checkedAt,
    };
  }
}

export async function aggregateStatuses(services: Svc[]): Promise<ServiceResult[]> {
  const settled = await Promise.allSettled(services.map((s) => fetchServiceStatus(s)));
  return settled.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          slug: services[i].slug,
          status: "unknown" as const,
          latencyMs: null,
          checkedAt: new Date().toISOString(),
        },
  );
}

export function computeUptime(checks: Array<{ status: string }>): number {
  if (checks.length === 0) return 100;
  const up = checks.filter((c) => c.status === "operational").length;
  return Math.round((up / checks.length) * 1000) / 10;
}

export const STALE_MS = 5 * 60 * 1000;

export function isStale(checkedAt: Date | string, now = Date.now()): boolean {
  const t = checkedAt instanceof Date ? checkedAt.getTime() : Date.parse(checkedAt);
  if (Number.isNaN(t)) return true;
  return now - t > STALE_MS;
}

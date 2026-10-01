import { db } from "./db";
import type { ServiceResult } from "./status-aggregator";

const SEVERITY_RANK: Record<string, number> = {
  operational: 0,
  unknown: 1,
  investigating: 2,
  degraded: 3,
  down: 4,
};

function statusToSeverity(status: string): "minor" | "major" | "critical" {
  if (status === "down") return "critical";
  if (status === "degraded") return "major";
  return "minor";
}

export function detectTransition(
  prev: string | null | undefined,
  next: string,
): boolean {
  if (!prev) return next !== "operational";
  if (prev === next) return false;
  const p = SEVERITY_RANK[prev] ?? 1;
  const n = SEVERITY_RANK[next] ?? 1;
  // Alert on any meaningful change, or recovery to operational
  if (next === "operational" && prev !== "operational") return true;
  return Math.abs(n - p) >= 1;
}

export type FanoutOptions = {
  serviceSlug: string;
  prevStatus: string | null;
  next: ServiceResult;
};

export async function webhookFanout(opts: FanoutOptions): Promise<number> {
  const { serviceSlug, prevStatus, next } = opts;
  if (!detectTransition(prevStatus, next.status)) return 0;

  const subscribers = await db.userService.findMany({
    where: { serviceSlug },
    select: { userId: true },
  });
  if (subscribers.length === 0) return 0;
  const userIds = subscribers.map((s) => s.userId);

  const webhooks = await db.webhook.findMany({ where: { userId: { in: userIds } } });
  if (webhooks.length === 0) return 0;

  const payload = {
    event: "status-change",
    service: serviceSlug,
    previousStatus: prevStatus,
    status: next.status,
    latencyMs: next.latencyMs,
    checkedAt: next.checkedAt,
    severity: statusToSeverity(next.status),
  };

  const deliveries = await Promise.allSettled(
    webhooks.map(async (wh) => {
      const res = await fetch(wh.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "isitdowndev/1.0" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      await db.notificationLog.create({
        data: {
          userId: wh.userId,
          type: `webhook:${wh.provider}`,
          payload: JSON.stringify({
            webhookId: wh.id,
            service: serviceSlug,
            status: next.status,
            ok: res.ok,
            httpStatus: res.status,
          }),
        },
      });
      return res.ok;
    }),
  );

  return deliveries.filter((d) => d.status === "fulfilled" && d.value).length;
}

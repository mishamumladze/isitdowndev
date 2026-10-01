import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { SERVICES, SERVICE_MAP } from "@/lib/services-config";
import { aggregateStatuses } from "@/lib/status-aggregator";
import { webhookFanout } from "@/lib/alerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const param = request.nextUrl.searchParams.get("secret");
  if (param === secret) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure Service rows exist
  await Promise.all(
    SERVICES.map((cfg) =>
      db.service.upsert({
        where: { slug: cfg.slug },
        update: {
          name: cfg.name,
          category: cfg.category,
          statusUrl: cfg.statusUrl,
          apiUrl: cfg.apiUrl,
          docsUrl: cfg.docsUrl,
          logo: cfg.logo,
        },
        create: {
          slug: cfg.slug,
          name: cfg.name,
          category: cfg.category,
          statusUrl: cfg.statusUrl,
          apiUrl: cfg.apiUrl,
          docsUrl: cfg.docsUrl,
          logo: cfg.logo,
        },
      }),
    ),
  );

  const previous = await db.statusCheck.findMany({
    orderBy: { checkedAt: "desc" },
    take: SERVICES.length * 2,
    select: { serviceSlug: true, status: true },
  });
  const prevBySlug = new Map<string, string>();
  for (const p of previous) {
    if (!prevBySlug.has(p.serviceSlug)) prevBySlug.set(p.serviceSlug, p.status);
  }

  const results = await aggregateStatuses(SERVICES);

  let checksWritten = 0;
  let incidentsOpened = 0;
  let incidentsResolved = 0;
  let notificationsSent = 0;

  for (const r of results) {
    await db.statusCheck.create({
      data: { serviceSlug: r.slug, status: r.status, latencyMs: r.latencyMs },
    });
    checksWritten++;

    const prev = prevBySlug.get(r.slug) ?? null;
    const cfg = SERVICE_MAP.get(r.slug);

    if (prev !== r.status) {
      if (r.status === "down" || r.status === "degraded") {
        const open = await db.incident.findFirst({
          where: { serviceSlug: r.slug, resolvedAt: null },
          orderBy: { startedAt: "desc" },
        });
        if (!open) {
          await db.incident.create({
            data: {
              title: `${cfg?.name ?? r.slug} ${r.status === "down" ? "outage" : "degraded performance"}`,
              status: "investigating",
              severity: r.status === "down" ? "critical" : "major",
              serviceSlug: r.slug,
            },
          });
          incidentsOpened++;
        }
      } else if (r.status === "operational" && prev && prev !== "operational") {
        const open = await db.incident.findMany({
          where: { serviceSlug: r.slug, resolvedAt: null },
        });
        if (open.length > 0) {
          await db.incident.updateMany({
            where: { serviceSlug: r.slug, resolvedAt: null },
            data: { status: "resolved", resolvedAt: new Date() },
          });
          incidentsResolved += open.length;
        }
      }
    }

    try {
      notificationsSent += await webhookFanout({
        serviceSlug: r.slug,
        prevStatus: prev,
        next: r,
      });
    } catch {
      // Fanout failures must not fail the cron run
    }
  }

  return NextResponse.json({
    ok: true,
    checked: results.length,
    checksWritten,
    incidentsOpened,
    incidentsResolved,
    notificationsSent,
    at: new Date().toISOString(),
  });
}

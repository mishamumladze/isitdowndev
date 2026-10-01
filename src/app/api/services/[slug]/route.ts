import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { SERVICE_MAP } from "@/lib/services-config";
import { computeUptime } from "@/lib/status-aggregator";

export const revalidate = 300;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const key = slug.toLowerCase();
  const cfg = SERVICE_MAP.get(key);
  if (!cfg) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }

  await db.service.upsert({
    where: { slug: key },
    update: {
      name: cfg.name,
      category: cfg.category,
      statusUrl: cfg.statusUrl,
      apiUrl: cfg.apiUrl,
      docsUrl: cfg.docsUrl,
      logo: cfg.logo,
    },
    create: {
      slug: key,
      name: cfg.name,
      category: cfg.category,
      statusUrl: cfg.statusUrl,
      apiUrl: cfg.apiUrl,
      docsUrl: cfg.docsUrl,
      logo: cfg.logo,
    },
  });

  const [latest, history, incidents] = await Promise.all([
    db.statusCheck.findFirst({
      where: { serviceSlug: key },
      orderBy: { checkedAt: "desc" },
    }),
    db.statusCheck.findMany({
      where: { serviceSlug: key },
      orderBy: { checkedAt: "desc" },
      take: 50,
    }),
    db.incident.findMany({
      where: { serviceSlug: key },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    service: cfg,
    latest: latest
      ? {
          status: latest.status,
          latencyMs: latest.latencyMs,
          checkedAt: latest.checkedAt.toISOString(),
        }
      : null,
    uptime: computeUptime(history.map((h) => ({ status: h.status }))),
    history: history.map((h) => ({
      status: h.status,
      latencyMs: h.latencyMs,
      checkedAt: h.checkedAt.toISOString(),
    })),
    incidents: incidents.map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      severity: i.severity,
      startedAt: i.startedAt.toISOString(),
      resolvedAt: i.resolvedAt?.toISOString() ?? null,
    })),
  });
}

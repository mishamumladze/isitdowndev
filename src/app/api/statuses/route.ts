import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { SERVICE_MAP, SERVICES } from "@/lib/services-config";
import {
  aggregateStatuses,
  computeUptime,
  fetchServiceStatus,
  isStale,
} from "@/lib/status-aggregator";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const wanted = idsParam
    ? idsParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : SERVICES.map((s) => s.slug);
  const known = wanted.filter((slug) => SERVICE_MAP.has(slug));
  const unknown = wanted.filter((slug) => !SERVICE_MAP.has(slug));

  // Ensure Service rows exist for known slugs
  await Promise.all(
    known.map((slug) => {
      const cfg = SERVICE_MAP.get(slug)!;
      return db.service.upsert({
        where: { slug },
        update: {
          name: cfg.name,
          category: cfg.category,
          statusUrl: cfg.statusUrl,
          apiUrl: cfg.apiUrl,
          docsUrl: cfg.docsUrl,
          logo: cfg.logo,
        },
        create: {
          slug,
          name: cfg.name,
          category: cfg.category,
          statusUrl: cfg.statusUrl,
          apiUrl: cfg.apiUrl,
          docsUrl: cfg.docsUrl,
          logo: cfg.logo,
        },
      });
    }),
  );

  const lastChecks = await db.statusCheck.findMany({
    where: { serviceSlug: { in: known } },
    orderBy: { checkedAt: "desc" },
  });
  const latestBySlug = new Map<string, (typeof lastChecks)[number]>();
  for (const c of lastChecks) {
    if (!latestBySlug.has(c.serviceSlug)) latestBySlug.set(c.serviceSlug, c);
  }

  const now = Date.now();
  const staleSlugs = known.filter((slug) => {
    const last = latestBySlug.get(slug);
    return !last || isStale(last.checkedAt, now);
  });

  if (staleSlugs.length > 0) {
    const svcs = staleSlugs.map((slug) => SERVICE_MAP.get(slug)!);
    const fresh =
      svcs.length === 1
        ? [await fetchServiceStatus(svcs[0])]
        : await aggregateStatuses(svcs);
    await Promise.all(
      fresh.map((r) =>
        db.statusCheck.create({
          data: {
            serviceSlug: r.slug,
            status: r.status,
            latencyMs: r.latencyMs,
          },
        }),
      ),
    );
    const reRead = await db.statusCheck.findMany({
      where: { serviceSlug: { in: staleSlugs } },
      orderBy: { checkedAt: "desc" },
    });
    for (const c of reRead) {
      const cur = latestBySlug.get(c.serviceSlug);
      if (!cur || c.checkedAt > cur.checkedAt) latestBySlug.set(c.serviceSlug, c);
    }
  }

  const recentBySlug = new Map<string, Array<{ status: string }>>();
  const recents = await db.statusCheck.findMany({
    where: { serviceSlug: { in: known } },
    orderBy: { checkedAt: "desc" },
    take: known.length * 50,
    select: { serviceSlug: true, status: true },
  });
  for (const r of recents) {
    const arr = recentBySlug.get(r.serviceSlug) ?? [];
    if (arr.length < 50) {
      arr.push({ status: r.status });
      recentBySlug.set(r.serviceSlug, arr);
    }
  }

  return NextResponse.json({
    statuses: known.map((slug) => {
      const last = latestBySlug.get(slug);
      const cfg = SERVICE_MAP.get(slug)!;
      return {
        slug,
        name: cfg.name,
        category: cfg.category,
        status: last?.status ?? "unknown",
        latencyMs: last?.latencyMs ?? null,
        checkedAt: last?.checkedAt.toISOString() ?? null,
        stale: last ? isStale(last.checkedAt, now) : true,
        uptime: computeUptime(recentBySlug.get(slug) ?? []),
      };
    }),
    unknown,
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { SERVICE_MAP } from "@/lib/services-config";

export const revalidate = 300;

const querySchema = z.object({
  service: z.string().trim().min(1).max(100).optional(),
  status: z.string().trim().min(1).max(50).optional(),
  cursor: z.string().trim().min(1).max(100).optional(),
});

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { service, status, cursor } = parsed.data;

  const incidents = await db.incident.findMany({
    where: {
      ...(service ? { serviceSlug: service.toLowerCase() } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { startedAt: "desc" },
    take: PAGE_SIZE + 1,
    ...(cursor
      ? { cursor: { id: cursor }, skip: 1 }
      : {}),
    include: { service: { select: { name: true, category: true } } },
  });

  const hasMore = incidents.length > PAGE_SIZE;
  const page = hasMore ? incidents.slice(0, PAGE_SIZE) : incidents;

  return NextResponse.json({
    incidents: page.map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      severity: i.severity,
      serviceSlug: i.serviceSlug,
      serviceName: i.service.name,
      serviceIcon: SERVICE_MAP.get(i.serviceSlug)?.icon,
      category: i.service.category,
      startedAt: i.startedAt.toISOString(),
      resolvedAt: i.resolvedAt?.toISOString() ?? null,
    })),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const DEMO_USER_ID = "local";

const postSchema = z
  .object({
    userId: z.string().min(1).max(100).optional(),
    provider: z.string().min(1).max(50).optional(),
    url: z.string().url().max(2048).optional(),
    events: z.string().min(1).max(200).optional(),
    action: z.literal("test").optional(),
    id: z.string().min(1).max(100).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.action === "test") {
      if (!v.id) ctx.addIssue({ code: "custom", message: "id required for test" });
    } else {
      if (!v.provider) ctx.addIssue({ code: "custom", message: "provider required" });
      if (!v.url) ctx.addIssue({ code: "custom", message: "url required" });
    }
  });

function userIdFrom(request: NextRequest, body?: { userId?: string }): string {
  return (
    body?.userId ?? request.nextUrl.searchParams.get("userId") ?? DEMO_USER_ID
  );
}

export async function GET(request: NextRequest) {
  const userId = userIdFrom(request);
  const hooks = await db.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    webhooks: hooks.map((w) => ({
      id: w.id,
      provider: w.provider,
      url: w.url,
      events: w.events,
      createdAt: w.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const userId = userIdFrom(request, parsed.data);
  await db.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@example.local` },
  });

  if (parsed.data.action === "test") {
    const hook = await db.webhook.findFirst({
      where: { id: parsed.data.id!, userId },
    });
    if (!hook) return NextResponse.json({ error: "Not found" }, { status: 404 });
    try {
      const res = await fetch(hook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "isitdowndev/1.0" },
        body: JSON.stringify({ event: "test", webhookId: hook.id, at: new Date().toISOString() }),
        signal: AbortSignal.timeout(8000),
      });
      await db.notificationLog.create({
        data: {
          userId,
          type: `webhook:${hook.provider}`,
          payload: JSON.stringify({
            webhookId: hook.id,
            event: "test",
            ok: res.ok,
            httpStatus: res.status,
          }),
        },
      });
      return NextResponse.json({ ok: res.ok, httpStatus: res.status });
    } catch {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  }

  const created = await db.webhook.create({
    data: {
      userId,
      provider: parsed.data.provider!,
      url: parsed.data.url!,
      events: parsed.data.events ?? "status-change",
    },
  });
  return NextResponse.json(
    {
      id: created.id,
      provider: created.provider,
      url: created.url,
      events: created.events,
    },
    { status: 201 },
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const userId = userIdFrom(request);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const existing = await db.webhook.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.webhook.delete({ where: { id } });
  return NextResponse.json({ ok: true, id });
}

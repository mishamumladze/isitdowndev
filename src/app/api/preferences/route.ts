import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const DEMO_USER_ID = "local";
const DEMO_EMAIL = "demo@example.local";

const putSchema = z.object({
  userId: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  severity: z.enum(["minor", "major", "critical"]).default("major"),
  browserPush: z.boolean().default(true),
});

async function ensureUser(userId: string, email?: string) {
  return db.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: email ?? `${userId}@example.local` },
  });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? DEMO_USER_ID;
  const pref = await db.alertPreference.findUnique({ where: { userId } });
  if (!pref) {
    return NextResponse.json({
      userId,
      severity: "major",
      browserPush: true,
      persisted: false,
    });
  }
  return NextResponse.json({
    userId: pref.userId,
    severity: pref.severity,
    browserPush: pref.browserPush,
    persisted: true,
  });
}

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const userId = parsed.data.userId ?? DEMO_USER_ID;
  const email = parsed.data.email ?? (userId === DEMO_USER_ID ? DEMO_EMAIL : undefined);
  await ensureUser(userId, email);

  const pref = await db.alertPreference.upsert({
    where: { userId },
    update: { severity: parsed.data.severity, browserPush: parsed.data.browserPush },
    create: {
      userId,
      severity: parsed.data.severity,
      browserPush: parsed.data.browserPush,
    },
  });
  return NextResponse.json({
    userId: pref.userId,
    severity: pref.severity,
    browserPush: pref.browserPush,
    persisted: true,
  });
}

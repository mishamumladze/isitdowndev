import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 25_000;

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      try {
        send("hello", { ok: true, at: new Date().toISOString() });

        // Initial snapshot: counts of latest known statuses
        try {
          const recent = await db.statusCheck.findMany({
            orderBy: { checkedAt: "desc" },
            take: 500,
            select: { serviceSlug: true, status: true },
          });
          const seen = new Set<string>();
          const counts: Record<string, number> = {};
          for (const r of recent) {
            if (seen.has(r.serviceSlug)) continue;
            seen.add(r.serviceSlug);
            counts[r.status] = (counts[r.status] ?? 0) + 1;
          }
          send("snapshot", { counts, at: new Date().toISOString() });
        } catch {
          // DB unavailable (e.g. not migrated yet): stream stays alive
          send("snapshot", { counts: {}, at: new Date().toISOString() });
        }

        const timer = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
            send("ping", { at: new Date().toISOString() });
          } catch {
            clearInterval(timer);
          }
        }, HEARTBEAT_MS);

        // Close server-side if client aborts: Next closes the stream;
        // keep timer cleanup best-effort via return below.
        await new Promise<never>(() => {});
      } catch {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

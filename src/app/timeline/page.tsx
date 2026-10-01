import { Suspense } from "react";
import TimelineFeed from "@/components/timeline/TimelineFeed";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import { serverBaseUrl } from "@/lib/server-url";
import type { Incident } from "@/types";

export const revalidate = 15;

async function getTimeline(service: string, status: string) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (status) params.set("status", status);
  try {
    const res = await fetch(`${await serverBaseUrl()}/api/timeline?${params}`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) return { incidents: [], nextCursor: null };
    const data = await res.json();
    return {
      incidents: (data.incidents ?? []) as Incident[],
      nextCursor: (data.nextCursor ?? null) as string | null,
    };
  } catch {
    return { incidents: [], nextCursor: null };
  }
}

async function getServiceSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${await serverBaseUrl()}/api/services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.services ?? []);
    return list.map((s: { slug: string }) => s.slug);
  } catch {
    return [];
  }
}

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; status?: string }>;
}) {
  const { service = "", status = "" } = await searchParams;
  const [{ incidents, nextCursor }, slugs] = await Promise.all([
    getTimeline(service, status),
    getServiceSlugs(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <header>
        <p
          className="font-mono text-xs font-semibold tracking-widest text-emerald-600 uppercase
            dark:text-emerald-400"
        >
          Outage log
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="mt-1.5 max-w-xl text-[15px] text-zinc-600 dark:text-zinc-300">
          Every degradation, outage, and recovery across tracked services — newest first. Scroll to
          load older history.
        </p>
      </header>

      <Suspense>
        <TimelineFilters services={slugs} />
      </Suspense>

      <div aria-live="polite">
        <TimelineFeed
          initial={incidents}
          initialCursor={nextCursor}
          service={service}
          status={status}
        />
      </div>
    </main>
  );
}

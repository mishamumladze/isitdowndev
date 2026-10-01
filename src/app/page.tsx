import DashboardClient from "@/components/dashboard/DashboardClient";
import { serverBaseUrl } from "@/lib/server-url";
import type { StatusSnapshot, Svc } from "@/types";

export const revalidate = 30;

async function getServices(): Promise<Svc[]> {
  try {
    const res = await fetch(`${await serverBaseUrl()}/api/services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.services ?? []);
  } catch {
    return [];
  }
}

async function getStatuses(slugs: string[]): Promise<StatusSnapshot[]> {
  if (slugs.length === 0) return [];
  try {
    const res = await fetch(`${await serverBaseUrl()}/api/statuses?ids=${slugs.join(",")}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.statuses ?? []);
  } catch {
    return [];
  }
}

export default async function Home() {
  const services = await getServices();
  const initialSnapshots = await getStatuses(services.map((s) => s.slug));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section
        className="dotgrid relative overflow-hidden rounded-3xl border border-zinc-200 bg-white px-5
          py-8 sm:px-8 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full
            bg-emerald-500/20 blur-3xl"
          aria-hidden="true"
        />
        <p
          className="font-mono text-xs font-semibold tracking-widest text-emerald-600 uppercase
            dark:text-emerald-400"
        >
          Developer status board
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Every tool you ship with, on one board.
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          Live health, latency, and uptime for the APIs, clouds, and models your stack depends on —
          plus a running log of every outage and recovery.
        </p>
      </section>

      <DashboardClient services={services} initialSnapshots={initialSnapshots} />
    </main>
  );
}

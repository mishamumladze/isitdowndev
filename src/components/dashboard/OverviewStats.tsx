"use client";

import { Activity, AlertTriangle, Clock3, XOctagon } from "lucide-react";
import type { StatusSnapshot } from "@/types";

export default function OverviewStats({ snapshots }: { snapshots: StatusSnapshot[] }) {
  const total = snapshots.length;
  const down = snapshots.filter((s) => s.status === "down").length;
  const degraded = snapshots.filter(
    (s) => s.status === "degraded" || s.status === "investigating",
  ).length;
  const operational = snapshots.filter(
    (s) => s.status === "operational" || s.status === "resolved",
  ).length;
  const unknown = total - down - degraded - operational;
  const latencies = snapshots
    .map((s) => s.latencyMs)
    .filter((v): v is number => typeof v === "number");
  const avgLatency = latencies.length
    ? Math.round(latencies.reduce((a, s) => a + s, 0) / latencies.length)
    : 0;

  const cards = [
    {
      label: "Operational",
      value: String(operational),
      sub: unknown > 0 ? `of ${total} tracked · ${unknown} unknown` : `of ${total} tracked`,
      icon: Activity,
      accent: "text-emerald-600 dark:text-emerald-400",
      ring: "border-emerald-500/30",
    },
    {
      label: "Degraded",
      value: String(degraded),
      sub: "slow or partial",
      icon: AlertTriangle,
      accent: "text-yellow-600 dark:text-yellow-400",
      ring: "border-yellow-500/30",
    },
    {
      label: "Down",
      value: String(down),
      sub: "needs attention",
      icon: XOctagon,
      accent: "text-red-600 dark:text-red-400",
      ring: "border-red-500/30",
    },
    {
      label: "Avg latency",
      value: latencies.length ? `${avgLatency}ms` : "—",
      sub: "last check",
      icon: Clock3,
      accent: "text-zinc-600 dark:text-zinc-300",
      ring: "border-zinc-300 dark:border-zinc-700",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Status overview">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl border ${c.ring} bg-white p-4 dark:bg-zinc-900`}
        >
          <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            <c.icon size={14} className={c.accent} aria-hidden="true" />
            {c.label}
          </dt>
          <dd className="mt-1 font-mono text-2xl font-bold tracking-tight text-zinc-900 tabular-nums dark:text-white">
            {c.value}
          </dd>
          <dd className="text-xs text-zinc-500 dark:text-zinc-400">{c.sub}</dd>
        </div>
      ))}
    </dl>
  );
}

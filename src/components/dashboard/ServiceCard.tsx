"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { StatusSnapshot, Svc } from "@/types";
import ServiceIcon from "@/components/ui/ServiceIcon";
import StatusBadge from "./StatusBadge";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ServiceCard({
  service,
  snapshot,
}: {
  service: Svc;
  snapshot?: StatusSnapshot;
}) {
  const status = snapshot?.status ?? "unknown";
  const uptime = snapshot?.uptime ?? snapshot?.uptime30 ?? 100;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-400/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <ServiceIcon icon={service.icon} name={service.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
              {service.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {service.category}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div>
          <p className="font-mono text-2xl font-bold tracking-tight text-zinc-900 tabular-nums dark:text-white">
            {uptime.toFixed(2)}
            <span className="text-sm font-medium text-zinc-400">%</span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">30-day uptime</p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 font-mono text-sm font-semibold text-zinc-700 tabular-nums dark:text-zinc-200">
            {snapshot?.latencyMs != null ? `${snapshot.latencyMs}ms` : "—"}
          </p>
          <p className="flex items-center justify-end gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock size={11} aria-hidden="true" />
            {snapshot?.checkedAt ? timeAgo(snapshot.checkedAt) : "no check yet"}
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
        View details
        <ArrowUpRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

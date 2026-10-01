"use client";

import { STATUS_META, type ServiceStatus } from "@/types";

const styles: Record<ServiceStatus, string> = {
  operational:
    "bg-emerald-100 text-emerald-800 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25",
  degraded:
    "bg-yellow-100 text-yellow-800 ring-yellow-600/30 dark:bg-yellow-500/15 dark:text-yellow-300 dark:ring-yellow-400/25",
  down: "bg-red-100 text-red-800 ring-red-600/25 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/25",
  investigating:
    "bg-orange-100 text-orange-800 ring-orange-600/25 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/25",
  unknown:
    "bg-zinc-100 text-zinc-600 ring-zinc-500/25 dark:bg-zinc-500/15 dark:text-zinc-300 dark:ring-zinc-400/25",
  resolved:
    "bg-emerald-100 text-emerald-800 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25",
};

const dots: Record<ServiceStatus, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  investigating: "bg-orange-500",
  unknown: "bg-zinc-400",
  resolved: "bg-emerald-500",
};

export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: ServiceStatus | string;
  size?: "sm" | "md";
}) {
  const key = (STATUS_META[status as ServiceStatus] ? status : "unknown") as ServiceStatus;
  const meta = STATUS_META[key];
  const pad = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${pad} ${styles[key]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[key]}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import Search from "@/components/ui/Search";
import type { ServiceStatus } from "@/types";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "down", label: "Down" },
  { value: "degraded", label: "Degraded" },
  { value: "investigating", label: "Investigating" },
  { value: "operational", label: "Operational" },
];

export default function TimelineFilters({ services }: { services: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const service = params.get("service") ?? "";
  const status = params.get("status") ?? "";

  function set(key: "service" | "status", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("cursor");
    const qs = next.toString();
    router.push(qs ? `/timeline?${qs}` : "/timeline");
  }

  function reset() {
    router.push("/timeline");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-end dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex-1">
        <label
          htmlFor="timeline-service"
          className="mb-1.5 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Service
        </label>
        <Search
          value={service}
          onChange={(v) => set("service", v)}
          placeholder="Filter by service slug…"
          label="Filter timeline by service"
        />
      </div>
      <div className="sm:w-52">
        <label
          htmlFor="timeline-status"
          className="mb-1.5 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Status
        </label>
        <select
          id="timeline-status"
          value={status}
          onChange={(e) => set("status", e.target.value as ServiceStatus | "")}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {(service || status) && (
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset
        </button>
      )}
      {services.length > 0 && (
        <datalist id="timeline-services">
          {services.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}

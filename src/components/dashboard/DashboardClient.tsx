"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, CloudOff, Radar } from "lucide-react";
import { STATUS_META, type StatusSnapshot, type Svc } from "@/types";
import { useLiveStatuses } from "@/hooks/useLiveStatuses";
import { useStack } from "@/hooks/useStack";
import ServiceCard from "./ServiceCard";
import OverviewStats from "./OverviewStats";
import StackSelector from "./StackSelector";
import Search from "@/components/ui/Search";
import EmptyState from "@/components/ui/EmptyState";

type StatusFilter = "all" | "issues" | "operational";
type SortKey = "severity" | "name" | "uptime" | "latency";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "issues", label: "Issues" },
  { value: "operational", label: "Operational" },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: "severity", label: "Severity" },
  { value: "name", label: "Name" },
  { value: "uptime", label: "Uptime" },
  { value: "latency", label: "Latency" },
];

export default function DashboardClient({
  services,
  initialSnapshots,
}: {
  services: Svc[];
  initialSnapshots: StatusSnapshot[];
}) {
  const { snapshots, live } = useLiveStatuses(initialSnapshots);
  const { stack } = useStack();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("severity");
  const [stackOnly, setStackOnly] = useState(false);

  const bySlug = useMemo(() => new Map(snapshots.map((s) => [s.slug, s])), [snapshots]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = services.filter((svc) => {
      if (stackOnly && !stack.includes(svc.slug)) return false;
      if (q && !`${svc.name} ${svc.slug} ${svc.category}`.toLowerCase().includes(q))
        return false;
      const status = bySlug.get(svc.slug)?.status ?? "unknown";
      if (filter === "issues" && (status === "operational" || status === "resolved"))
        return false;
      if (filter === "operational" && status !== "operational" && status !== "resolved")
        return false;
      return true;
    });
    const severityOf = (slug: string) => {
      const status = bySlug.get(slug)?.status ?? "unknown";
      return STATUS_META[status]?.severity ?? -1;
    };
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "uptime")
        return (
          (bySlug.get(a.slug)?.uptime ?? bySlug.get(a.slug)?.uptime30 ?? 100) -
          (bySlug.get(b.slug)?.uptime ?? bySlug.get(b.slug)?.uptime30 ?? 100)
        );
      if (sort === "latency")
        return (bySlug.get(b.slug)?.latencyMs ?? -1) - (bySlug.get(a.slug)?.latencyMs ?? -1);
      return severityOf(b.slug) - severityOf(a.slug) || a.name.localeCompare(b.name);
    });
    return list;
  }, [services, bySlug, query, filter, sort, stackOnly, stack]);

  const issueCount = snapshots.filter(
    (s) => s.status !== "operational" && s.status !== "resolved",
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <div aria-live="polite" className="sr-only">
        {issueCount === 0
          ? "All tracked services are operational."
          : `${issueCount} ${issueCount === 1 ? "service has" : "services have"} issues.`}
      </div>

      <OverviewStats snapshots={snapshots} />

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Search value={query} onChange={setQuery} placeholder="Search 50+ services…" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800" role="group" aria-label="Filter by status">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === f.value
                      ? "bg-white text-zinc-900 shadow dark:bg-zinc-950 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-2.5 py-2 text-sm dark:border-zinc-700">
              <ArrowDownUp size={14} className="text-zinc-400" aria-hidden="true" />
              <span className="sr-only">Sort services</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent text-sm font-medium focus:outline-none"
                aria-label="Sort services"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <StackSelector allSlugs={services.map((s) => s.slug)} services={services} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Radar size={13} aria-hidden="true" />
            {live ? (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Live — streaming updates
              </span>
            ) : (
              <span>Live updates connecting…</span>
            )}
          </span>
          <label className="inline-flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={stackOnly}
              onChange={(e) => setStackOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-emerald-500"
            />
            My stack only{stack.length > 0 && ` (${stack.length})`}
          </label>
          <span className="ml-auto font-mono" aria-live="polite">
            {visible.length} of {services.length} shown
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CloudOff size={28} />}
          title={services.length === 0 ? "No services tracked yet" : "No services match"}
          hint={
            services.length === 0
              ? "The status backend has not reported any services yet. Check back once monitoring is wired up."
              : stackOnly
                ? "Your stack filter hides everything. Add services via My stack, or turn the filter off."
                : "Try a different search term or clear the status filter."
          }
          action={
            query || filter !== "all" || stackOnly ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setStackOnly(false);
                }}
                className="rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((svc) => (
            <ServiceCard key={svc.slug} service={svc} snapshot={bySlug.get(svc.slug)} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";
import type { Incident } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import ServiceIcon from "@/components/ui/ServiceIcon";
import StatusBadge from "@/components/dashboard/StatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TimelineFeed({
  initial,
  initialCursor,
  service,
  status,
}: {
  initial: Incident[];
  initialCursor: string | null;
  service: string;
  status: string;
}) {
  const [incidents, setIncidents] = useState(initial);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIncidents(initial);
    setCursor(initialCursor);
  }, [initial, initialCursor, service, status]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !cursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || loading) return;
        setLoading(true);
        const params = new URLSearchParams({ cursor });
        if (service) params.set("service", service);
        if (status) params.set("status", status);
        fetch(`/api/timeline?${params}`)
          .then((r) => r.json())
          .then((data) => {
            setIncidents((prev) => [...prev, ...data.incidents]);
            setCursor(data.nextCursor);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, service, status, loading]);

  if (incidents.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<History size={28} />}
        title="No incidents found"
        hint="Nothing matches these filters. All monitored services are calm right now — try widening the search."
      />
    );
  }

  return (
    <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-zinc-200 dark:before:bg-zinc-800" aria-label="Incident timeline">
      {incidents.map((incident) => (
        <li key={incident.id} className="relative pl-8">
          <span
            className={`absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-950 ${
              incident.status === "down"
                ? "bg-red-500"
                : incident.status === "degraded"
                  ? "bg-yellow-500"
                  : incident.status === "investigating"
                    ? "bg-orange-500"
                    : incident.status === "unknown"
                      ? "bg-zinc-400"
                      : "bg-emerald-500"
            }`}
            aria-hidden="true"
          />
          <article className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={incident.status} />
              <ServiceIcon
                icon={incident.serviceIcon}
                name={incident.serviceName ?? incident.serviceSlug}
                size="sm"
              />
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {incident.serviceName}
              </span>
              <span className="ml-auto text-xs text-zinc-400">{formatDate(incident.startedAt)}</span>
            </div>
            <h3 className="mt-2 text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
              {incident.title}
            </h3>
            {incident.description && (
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {incident.description}
              </p>
            )}
            {incident.endedAt && (
              <p className="mt-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                Resolved {formatDate(incident.endedAt)}
              </p>
            )}
          </article>
        </li>
      ))}
      <div ref={sentinel} aria-hidden="true" />
      {loading && (
        <li className="pl-8" aria-live="polite">
          <div className="h-20 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </li>
      )}
      {!cursor && incidents.length > 0 && (
        <li className="pl-8 text-center font-mono text-xs text-zinc-400">
          — end of history —
        </li>
      )}
    </ol>
  );
}

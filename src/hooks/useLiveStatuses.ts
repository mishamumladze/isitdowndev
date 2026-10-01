"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS_META, type StatusSnapshot } from "@/types";

function isSnapshot(value: unknown): value is StatusSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.status === "string" &&
    (v.status as string) in STATUS_META
  );
}

export function useLiveStatuses(initial: StatusSnapshot[]) {
  const [snapshots, setSnapshots] = useState<StatusSnapshot[]>(initial);
  const [live, setLive] = useState(false);
  // Keep the latest render's map handy for cheap SSE merges below.
  const ref = useRef(initial);
  ref.current = snapshots;

  useEffect(() => {
    setSnapshots(initial);
  }, [initial]);

  useEffect(() => {
    const source = new EventSource("/api/stream");
    const markLive = () => setLive(true);
    const applyUpdate = (event: MessageEvent) => {
      try {
        const update: unknown = JSON.parse(event.data);
        if (!isSnapshot(update)) return;
        markLive();
        setSnapshots((prev) => {
          const i = prev.findIndex((s) => s.slug === update.slug);
          if (i === -1) return [...prev, update];
          const next = [...prev];
          next[i] = { ...next[i], ...update };
          return next;
        });
      } catch {
        /* ignore malformed SSE frames */
      }
    };
    source.onopen = markLive;
    source.onmessage = applyUpdate;
    source.addEventListener("hello", markLive);
    source.addEventListener("snapshot", markLive);
    source.addEventListener("ping", markLive);
    source.addEventListener("status", applyUpdate as EventListener);
    source.addEventListener("status-update", applyUpdate as EventListener);
    source.onerror = () => setLive(false);
    return () => source.close();
  }, []);

  return { snapshots, live };
}

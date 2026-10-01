"use client";

import { useState } from "react";
import { Check, ChevronDown, Layers } from "lucide-react";
import { useStack } from "@/hooks/useStack";
import ServiceIcon from "@/components/ui/ServiceIcon";

const PRESETS: Record<string, string[]> = {
  MERN: ["mongodb-atlas", "render", "cloudflare", "sendgrid"],
  "Next+Supabase": ["vercel", "supabase", "resend", "sentry", "upstash"],
  "AI Dev": ["openai", "anthropic", "pinecone", "vercel", "supabase", "replicate"],
};

export default function StackSelector({
  allSlugs,
  services = [],
  compact = false,
}: {
  allSlugs: string[];
  services?: { slug: string; name: string; icon?: string }[];
  compact?: boolean;
}) {
  const { stack, toggle, setAll, clear } = useStack();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = allSlugs.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  const bySlug = new Map(services.map((s) => [s.slug, s]));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Choose your stack"
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      >
        <Layers size={15} aria-hidden="true" />
        {compact ? "Stack" : "My stack"}
        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
          {stack.length}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <input
              type="search"
              aria-label="Filter stack services"
              placeholder="Filter 50+ services…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-2 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />

            <p className="px-1 pt-1 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Presets
            </p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {Object.entries(PRESETS).map(([name, slugs]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setAll(slugs.filter((s) => allSlugs.includes(s)))}
                  className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-xs hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:hover:text-emerald-400"
                >
                  {name}
                </button>
              ))}
            </div>

            <div
              role="listbox"
              aria-label="Services"
              aria-multiselectable="true"
              className="max-h-56 overflow-y-auto rounded-lg border border-zinc-100 dark:border-zinc-800"
            >
              {filtered.map((slug) => {
                const active = stack.includes(slug);
                const meta = bySlug.get(slug);
                return (
                  <button
                    key={slug}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => toggle(slug)}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left font-mono text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <ServiceIcon
                      icon={meta?.icon}
                      name={meta?.name ?? slug}
                      size="sm"
                    />
                    <span
                      className={`flex-1 ${active ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
                    >
                      {meta?.name ?? slug}
                    </span>
                    {active && <Check size={14} className="text-emerald-500" aria-hidden="true" />}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-zinc-400">
                  No services match that filter.
                </p>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAll(allSlugs)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={clear}
                className="text-xs font-medium text-zinc-500 hover:text-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

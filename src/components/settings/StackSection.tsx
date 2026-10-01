"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useStack } from "@/hooks/useStack";
import Search from "@/components/ui/Search";
import ServiceIcon from "@/components/ui/ServiceIcon";

const PRESETS: Record<string, string[]> = {
  MERN: ["mongodb-atlas", "render", "cloudflare", "sendgrid"],
  "Next+Supabase": ["vercel", "supabase", "resend", "sentry", "upstash"],
  "AI Dev": ["openai", "anthropic", "pinecone", "vercel", "supabase", "replicate"],
};

export default function StackSection({
  services,
}: {
  services: { slug: string; name: string; category: string; icon?: string }[];
}) {
  const { stack, toggle, setAll, clear } = useStack();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? services.filter((s) =>
        `${s.name} ${s.slug} ${s.category}`.toLowerCase().includes(q),
      )
    : services;

  return (
    <section
      aria-labelledby="stack-heading"
      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="stack-heading" className="text-base font-semibold">
            My stack
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Pick the services you depend on.{" "}
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {stack.length} selected
            </span>{" "}
            — saved in this browser, used by the “My stack only” filter.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAll(services.map((s) => s.slug))}
            className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-50 hover:text-red-600 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Stack presets">
        {Object.entries(PRESETS).map(([name, slugs]) => (
          <button
            key={name}
            type="button"
            onClick={() => setAll(slugs.filter((s) => services.some((x) => x.slug === s)))}
            className="rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:hover:text-emerald-400"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <Search
          value={query}
          onChange={setQuery}
          placeholder="Search services…"
          label="Search stack services"
        />
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2" role="group" aria-label="Services">
        {filtered.map((s) => {
          const on = stack.includes(s.slug);
          return (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => toggle(s.slug)}
                aria-pressed={on}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                  on
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:border-emerald-400/40"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    on
                      ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                      : "border-zinc-300 text-transparent dark:border-zinc-600"
                  }`}
                  aria-hidden="true"
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                <ServiceIcon icon={s.icon} name={s.name} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{s.name}</span>
                  <span className="block font-mono text-[11px] text-zinc-400">
                    {s.slug} · {s.category}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-3 text-center text-sm text-zinc-400">
          No services match “{query}”.
        </p>
      )}
    </section>
  );
}

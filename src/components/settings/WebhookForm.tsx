"use client";

import { useEffect, useState } from "react";
import { Link2, Plus, Trash2 } from "lucide-react";

interface Webhook {
  id: string;
  url: string;
  events: string[];
}

const EVENT_OPTIONS = ["down", "degraded", "recovered"];

export default function WebhookForm() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("isitdowndev:webhooks:v1");
      if (raw) setWebhooks(JSON.parse(raw) as Webhook[]);
    } catch {
      /* keep empty */
    }
  }, []);

  function persist(next: Webhook[]) {
    setWebhooks(next);
    try {
      localStorage.setItem("isitdowndev:webhooks:v1", JSON.stringify(next));
    } catch {
      /* non-fatal */
    }
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setError("Enter a valid URL starting with https://");
      return;
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      setError("Webhook URL must use http or https.");
      return;
    }
    persist([
      ...webhooks,
      { id: `wh_${Date.now()}`, url: parsed.toString(), events: ["down"] },
    ]);
    setUrl("");
  }

  function toggleEvent(id: string, event: string) {
    persist(
      webhooks.map((w) =>
        w.id === id
          ? {
              ...w,
              events: w.events.includes(event)
                ? w.events.filter((e) => e !== event)
                : [...w.events, event],
            }
          : w,
      ),
    );
  }

  return (
    <section
      aria-labelledby="webhook-heading"
      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 id="webhook-heading" className="flex items-center gap-2 text-base font-semibold">
        <Link2 size={16} aria-hidden="true" />
        Webhooks
      </h2>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Post JSON to your own endpoint when a tracked service changes state. Stored only in
        this browser.
      </p>

      <form onSubmit={add} className="mt-4 flex flex-col gap-2 sm:flex-row" noValidate>
        <label htmlFor="webhook-url" className="sr-only">
          Webhook URL
        </label>
        <input
          id="webhook-url"
          type="url"
          inputMode="url"
          placeholder="https://your-app.com/hooks/status"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "webhook-error" : undefined}
          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={15} aria-hidden="true" />
          Add
        </button>
      </form>
      {error && (
        <p id="webhook-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {webhooks.length === 0 ? (
        <p className="mt-4 rounded-xl bg-zinc-50 px-3 py-3 text-sm text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
          No webhooks yet. Add one to pipe outage events into Slack, Discord, or your own
          runbook tooling.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {webhooks.map((w) => (
            <li
              key={w.id}
              className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-2">
                <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-zinc-700 dark:text-zinc-200">
                  {w.url}
                </code>
                <button
                  type="button"
                  onClick={() => persist(webhooks.filter((x) => x.id !== w.id))}
                  aria-label={`Remove webhook ${w.url}`}
                  className="rounded-md p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={`Events for ${w.url}`}>
                {EVENT_OPTIONS.map((ev) => {
                  const on = w.events.includes(ev);
                  return (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => toggleEvent(w.id, ev)}
                      aria-pressed={on}
                      className={`rounded-full px-2.5 py-1 font-mono text-xs font-medium ${
                        on
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {ev}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

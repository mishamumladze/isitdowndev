"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

export default function AlertSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported] = useState(
    () => typeof window !== "undefined" && "Notification" in window,
  );
  const [prefs, setPrefs] = useState({ down: true, degraded: true, recovered: true });

  useEffect(() => {
    if (supported) setPermission(Notification.permission);
    try {
      const raw = localStorage.getItem("isitdowndev:alerts:v1");
      if (raw) setPrefs({ ...prefs, ...JSON.parse(raw) });
    } catch {
      /* keep defaults */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  function toggle(key: keyof typeof prefs) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("isitdowndev:alerts:v1", JSON.stringify(next));
      } catch {
        /* non-fatal */
      }
      return next;
    });
  }

  async function enable() {
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      new Notification("isitdowndev alerts on", {
        body: "You will get a ping when a tracked service goes down.",
      });
    }
  }

  const rows = [
    { key: "down" as const, title: "Service down", hint: "Immediate alert when a service fails checks." },
    { key: "degraded" as const, title: "Degraded performance", hint: "Slow responses or partial outages." },
    { key: "recovered" as const, title: "Recovered", hint: "Let me know when a service is back to normal." },
  ];

  return (
    <section
      aria-labelledby="alert-heading"
      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="alert-heading" className="text-base font-semibold">
            Browser alerts
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {supported
              ? `Notifications are ${permission === "granted" ? "on" : permission === "denied" ? "blocked in your browser settings" : "off"}.`
              : "This browser does not support notifications."}
          </p>
        </div>
        {supported && permission !== "granted" && (
          <button
            type="button"
            onClick={enable}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            <Bell size={15} aria-hidden="true" />
            Enable alerts
          </button>
        )}
        {supported && permission === "granted" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Bell size={13} aria-hidden="true" />
            Alerts on
          </span>
        )}
        {!supported && <BellOff size={18} className="text-zinc-400" aria-hidden="true" />}
      </div>

      <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium">{row.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{row.hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[row.key]}
              aria-label={row.title}
              onClick={() => toggle(row.key)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                prefs[row.key] ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  prefs[row.key] ? "translate-x-5" : "translate-x-0.5"
                }`}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

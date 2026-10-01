import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-zinc-950">
            <Activity size={14} strokeWidth={2.5} />
          </span>
          <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">isitdowndev</span>
            {" — "}one board for every tool you ship with.
          </p>
        </div>
        <nav className="flex items-center gap-5 text-sm font-medium" aria-label="Footer">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/timeline"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Timeline
          </Link>
          <Link
            href="/settings"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Settings
          </Link>
        </nav>
      </div>
    </footer>
  );
}

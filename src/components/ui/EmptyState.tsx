import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
      {icon && <div className="mb-1 text-zinc-400 dark:text-zinc-500">{icon}</div>}
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      {hint && <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

"use client";

import { Search as SearchIcon, X } from "lucide-react";

export default function Search({
  value,
  onChange,
  placeholder = "Search services…",
  label = "Search services",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="relative">
      <SearchIcon
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pr-9 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "isitdowndev:stack:v1";

export function useStack() {
  const [stack, setStack] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setStack(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setStack([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(stack));
    } catch {
      /* storage full or blocked — stack just won't persist */
    }
  }, [stack, loaded]);

  const toggle = useCallback((slug: string) => {
    setStack((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const setAll = useCallback((slugs: string[]) => setStack(slugs), []);
  const clear = useCallback(() => setStack([]), []);

  return { stack, loaded, toggle, setAll, clear };
}

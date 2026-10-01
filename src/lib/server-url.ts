import { headers } from "next/headers";

export async function serverBaseUrl(): Promise<string> {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    }
  } catch {
    /* headers unavailable during static prerender — fall through */
  }
  const port = process.env.PORT ?? "3000";
  return `http://localhost:${port}`;
}

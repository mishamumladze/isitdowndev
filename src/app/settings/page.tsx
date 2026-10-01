import AlertSettings from "@/components/settings/AlertSettings";
import WebhookForm from "@/components/settings/WebhookForm";
import StackSection from "@/components/settings/StackSection";
import { serverBaseUrl } from "@/lib/server-url";
import type { Svc } from "@/types";

async function getServices(): Promise<Svc[]> {
  try {
    const res = await fetch(`${await serverBaseUrl()}/api/services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.services ?? []);
  } catch {
    return [];
  }
}

export default async function SettingsPage() {
  const services = await getServices();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <header>
        <p
          className="font-mono text-xs font-semibold tracking-widest text-emerald-600 uppercase
            dark:text-emerald-400"
        >
          Preferences
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-[15px] text-zinc-600 dark:text-zinc-300">
          Your stack, alerts, and webhooks. Everything here is stored in this browser — no account
          needed.
        </p>
      </header>

      <StackSection services={services} />
      <AlertSettings />
      <WebhookForm />
    </main>
  );
}

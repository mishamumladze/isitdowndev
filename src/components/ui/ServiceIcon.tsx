import {
  siAlgolia,
  siAnthropic,
  siAuth0,
  siClerk,
  siCloudflare,
  siDatadog,
  siDigitalocean,
  siDiscord,
  siDocker,
  siFigma,
  siFirebase,
  siFlydotio,
  siGithub,
  siGooglecloud,
  siHuggingface,
  siJsdelivr,
  siLinear,
  siMixpanel,
  siMongodb,
  siNeon,
  siNetlify,
  siNewrelic,
  siNotion,
  siNpm,
  siOkta,
  siPlanetscale,
  siPosthog,
  siPusher,
  siRailway,
  siRedis,
  siRender,
  siResend,
  siSentry,
  siShopify,
  siStripe,
  siSupabase,
  siUpstash,
  siVercel,
  siReplicate,
} from "simple-icons";

const ICONS: Record<string, { path: string; hex: string; title: string }> = {
  stripe: siStripe,
  github: siGithub,
  vercel: siVercel,
  supabase: siSupabase,
  firebase: siFirebase,
  googlecloud: siGooglecloud,
  mongodb: siMongodb,
  algolia: siAlgolia,
  auth0: siAuth0,
  notion: siNotion,
  discord: siDiscord,
  shopify: siShopify,
  figma: siFigma,
  linear: siLinear,
  datadog: siDatadog,
  newrelic: siNewrelic,
  cloudflare: siCloudflare,
  netlify: siNetlify,
  railway: siRailway,
  render: siRender,
  flydotio: siFlydotio,
  planetscale: siPlanetscale,
  neon: siNeon,
  redis: siRedis,
  upstash: siUpstash,
  resend: siResend,
  pusher: siPusher,
  sentry: siSentry,
  posthog: siPosthog,
  mixpanel: siMixpanel,
  anthropic: siAnthropic,
  huggingface: siHuggingface,
  replicate: siReplicate,
  okta: siOkta,
  clerk: siClerk,
  npm: siNpm,
  docker: siDocker,
  jsdelivr: siJsdelivr,
  digitalocean: siDigitalocean,
};

const SIZES = {
  sm: { box: "h-7 w-7", icon: 15, text: "text-[11px]" },
  md: { box: "h-9 w-9", icon: 20, text: "text-sm" },
  lg: { box: "h-12 w-12", icon: 28, text: "text-lg" },
} as const;

export default function ServiceIcon({
  icon,
  name,
  size = "md",
}: {
  icon?: string;
  name: string;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  const entry = icon ? ICONS[icon] : undefined;
  if (!entry) {
    return (
      <span
        aria-hidden="true"
        className={`flex ${s.box} shrink-0 items-center justify-center rounded-xl bg-zinc-100 font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300 ${s.text}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={`${name} icon`}
      title={name}
      className={`flex ${s.box} shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-zinc-200 dark:bg-white dark:ring-zinc-200`}
    >
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 24 24"
        fill={`#${entry.hex}`}
        aria-hidden="true"
      >
        <path d={entry.path} />
      </svg>
    </span>
  );
}

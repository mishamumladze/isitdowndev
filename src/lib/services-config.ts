export type Svc = {
  slug: string;
  name: string;
  category: string;
  apiUrl?: string;
  statusUrl: string;
  docsUrl?: string;
  logo?: string;
  icon?: string;
};

export const SERVICES: Svc[] = [
  { slug: "stripe", name: "Stripe", category: "Payments", apiUrl: "https://status.stripe.com/api/v2/summary.json", statusUrl: "https://status.stripe.com", docsUrl: "https://docs.stripe.com", icon: "stripe" },
  { slug: "github", name: "GitHub", category: "Developer Tools", apiUrl: "https://www.githubstatus.com/api/v2/summary.json", statusUrl: "https://www.githubstatus.com", docsUrl: "https://docs.github.com", icon: "github" },
  { slug: "openai", name: "OpenAI", category: "AI", apiUrl: "https://status.openai.com/api/v2/summary.json", statusUrl: "https://status.openai.com", docsUrl: "https://platform.openai.com/docs" },
  { slug: "vercel", name: "Vercel", category: "Hosting", apiUrl: "https://www.vercel-status.com/api/v2/summary.json", statusUrl: "https://www.vercel-status.com", docsUrl: "https://vercel.com/docs", icon: "vercel" },
  { slug: "supabase", name: "Supabase", category: "Backend / Database", apiUrl: "https://status.supabase.com/api/v2/summary.json", statusUrl: "https://status.supabase.com", docsUrl: "https://supabase.com/docs", icon: "supabase" },
  { slug: "firebase", name: "Firebase", category: "Backend / Database", statusUrl: "https://status.firebase.google.com", docsUrl: "https://firebase.google.com/docs", icon: "firebase" },
  { slug: "aws", name: "AWS", category: "Cloud", apiUrl: "https://status.aws.amazon.com/api/v2/summary.json", statusUrl: "https://health.aws.amazon.com/health/status", docsUrl: "https://docs.aws.amazon.com" },
  { slug: "gcp", name: "Google Cloud", category: "Cloud", statusUrl: "https://status.cloud.google.com", docsUrl: "https://cloud.google.com/docs", icon: "googlecloud" },
  { slug: "azure", name: "Azure", category: "Cloud", statusUrl: "https://azure.status.microsoft", docsUrl: "https://learn.microsoft.com/azure" },
  { slug: "heroku", name: "Heroku", category: "Hosting", apiUrl: "https://status.heroku.com/api/v2/summary.json", statusUrl: "https://status.heroku.com", docsUrl: "https://devcenter.heroku.com" },
  { slug: "mongodb-atlas", name: "MongoDB Atlas", category: "Database", apiUrl: "https://status.mongodb.com/api/v2/summary.json", statusUrl: "https://status.mongodb.com", docsUrl: "https://www.mongodb.com/docs/atlas", icon: "mongodb" },
  { slug: "twilio", name: "Twilio", category: "Messaging", apiUrl: "https://status.twilio.com/api/v2/summary.json", statusUrl: "https://status.twilio.com", docsUrl: "https://www.twilio.com/docs" },
  { slug: "sendgrid", name: "SendGrid", category: "Email", apiUrl: "https://status.sendgrid.com/api/v2/summary.json", statusUrl: "https://status.sendgrid.com", docsUrl: "https://docs.sendgrid.com" },
  { slug: "algolia", name: "Algolia", category: "Search", apiUrl: "https://status.algolia.com/api/v2/summary.json", statusUrl: "https://status.algolia.com", docsUrl: "https://www.algolia.com/doc", icon: "algolia" },
  { slug: "auth0", name: "Auth0", category: "Auth", apiUrl: "https://status.auth0.com/api/v2/summary.json", statusUrl: "https://status.auth0.com", docsUrl: "https://auth0.com/docs", icon: "auth0" },
  { slug: "notion", name: "Notion", category: "Productivity", apiUrl: "https://status.notion.so/api/v2/summary.json", statusUrl: "https://status.notion.so", docsUrl: "https://developers.notion.com", icon: "notion" },
  { slug: "discord", name: "Discord", category: "Messaging", apiUrl: "https://discordstatus.com/api/v2/summary.json", statusUrl: "https://discordstatus.com", docsUrl: "https://discord.com/developers/docs", icon: "discord" },
  { slug: "slack", name: "Slack", category: "Messaging", apiUrl: "https://status.slack.com/api/v2.0.0/current", statusUrl: "https://status.slack.com", docsUrl: "https://api.slack.com" },
  { slug: "shopify", name: "Shopify", category: "E-commerce", apiUrl: "https://www.shopifystatus.com/api/v2/summary.json", statusUrl: "https://www.shopifystatus.com", docsUrl: "https://shopify.dev/docs", icon: "shopify" },
  { slug: "figma", name: "Figma", category: "Design", apiUrl: "https://status.figma.com/api/v2/summary.json", statusUrl: "https://status.figma.com", docsUrl: "https://developers.figma.com", icon: "figma" },
  { slug: "linear", name: "Linear", category: "Productivity", apiUrl: "https://status.linear.app/api/v2/summary.json", statusUrl: "https://status.linear.app", docsUrl: "https://developers.linear.app", icon: "linear" },
  { slug: "datadog", name: "Datadog", category: "Monitoring", apiUrl: "https://status.datadoghq.com/api/v2/summary.json", statusUrl: "https://status.datadoghq.com", docsUrl: "https://docs.datadoghq.com", icon: "datadog" },
  { slug: "new-relic", name: "New Relic", category: "Monitoring", apiUrl: "https://status.newrelic.com/api/v2/summary.json", statusUrl: "https://status.newrelic.com", docsUrl: "https://docs.newrelic.com", icon: "newrelic" },
  { slug: "cloudflare", name: "Cloudflare", category: "Infrastructure", apiUrl: "https://www.cloudflarestatus.com/api/v2/summary.json", statusUrl: "https://www.cloudflarestatus.com", docsUrl: "https://developers.cloudflare.com", icon: "cloudflare" },
  { slug: "netlify", name: "Netlify", category: "Hosting", apiUrl: "https://www.netlifystatus.com/api/v2/summary.json", statusUrl: "https://www.netlifystatus.com", docsUrl: "https://docs.netlify.com", icon: "netlify" },
  { slug: "railway", name: "Railway", category: "Hosting", apiUrl: "https://status.railway.app/api/v2/summary.json", statusUrl: "https://status.railway.com", docsUrl: "https://docs.railway.com", icon: "railway" },
  { slug: "render", name: "Render", category: "Hosting", apiUrl: "https://status.render.com/api/v2/summary.json", statusUrl: "https://status.render.com", docsUrl: "https://docs.render.com", icon: "render" },
  { slug: "fly-io", name: "Fly.io", category: "Hosting", apiUrl: "https://status.flyio.net/api/v2/summary.json", statusUrl: "https://status.flyio.net", docsUrl: "https://fly.io/docs", icon: "flydotio" },
  { slug: "planetscale", name: "PlanetScale", category: "Database", apiUrl: "https://status.planetscale.com/api/v2/summary.json", statusUrl: "https://status.planetscale.com", docsUrl: "https://planetscale.com/docs", icon: "planetscale" },
  { slug: "neon", name: "Neon", category: "Database", statusUrl: "https://neonstatus.com", docsUrl: "https://neon.tech/docs", icon: "neon" },
  { slug: "redis-cloud", name: "Redis Cloud", category: "Database", apiUrl: "https://status.redis.com/api/v2/summary.json", statusUrl: "https://status.redis.com", docsUrl: "https://redis.io/docs", icon: "redis" },
  { slug: "upstash", name: "Upstash", category: "Database", apiUrl: "https://status.upstash.com/api/v2/summary.json", statusUrl: "https://status.upstash.com", docsUrl: "https://upstash.com/docs", icon: "upstash" },
  { slug: "resend", name: "Resend", category: "Email", apiUrl: "https://resend-status.com/api/v2/summary.json", statusUrl: "https://resend-status.com", docsUrl: "https://resend.com/docs", icon: "resend" },
  { slug: "postmark", name: "Postmark", category: "Email", apiUrl: "https://status.postmarkapp.com/api/v2/summary.json", statusUrl: "https://status.postmarkapp.com", docsUrl: "https://postmarkapp.com/developer" },
  { slug: "pusher", name: "Pusher", category: "Realtime", apiUrl: "https://status.pusher.com/api/v2/summary.json", statusUrl: "https://status.pusher.com", docsUrl: "https://pusher.com/docs", icon: "pusher" },
  { slug: "ably", name: "Ably", category: "Realtime", apiUrl: "https://status.ably.io/api/v2/summary.json", statusUrl: "https://status.ably.io", docsUrl: "https://ably.com/docs" },
  { slug: "sentry", name: "Sentry", category: "Monitoring", apiUrl: "https://status.sentry.io/api/v2/summary.json", statusUrl: "https://status.sentry.io", docsUrl: "https://docs.sentry.io", icon: "sentry" },
  { slug: "posthog", name: "PostHog", category: "Analytics", apiUrl: "https://status.posthog.com/api/v2/summary.json", statusUrl: "https://status.posthog.com", docsUrl: "https://posthog.com/docs", icon: "posthog" },
  { slug: "mixpanel", name: "Mixpanel", category: "Analytics", statusUrl: "https://status.mixpanel.com", docsUrl: "https://docs.mixpanel.com", icon: "mixpanel" },
  { slug: "segment", name: "Segment", category: "Analytics", apiUrl: "https://status.segment.com/api/v2/summary.json", statusUrl: "https://status.segment.com", docsUrl: "https://segment.com/docs" },
  { slug: "anthropic", name: "Anthropic", category: "AI", apiUrl: "https://status.anthropic.com/api/v2/summary.json", statusUrl: "https://status.anthropic.com", docsUrl: "https://docs.anthropic.com", icon: "anthropic" },
  { slug: "cohere", name: "Cohere", category: "AI", apiUrl: "https://status.cohere.com/api/v2/summary.json", statusUrl: "https://status.cohere.com", docsUrl: "https://docs.cohere.com" },
  { slug: "huggingface", name: "Hugging Face", category: "AI", apiUrl: "https://status.huggingface.co/api/v2/summary.json", statusUrl: "https://status.huggingface.co", docsUrl: "https://huggingface.co/docs", icon: "huggingface" },
  { slug: "replicate", name: "Replicate", category: "AI", apiUrl: "https://status.replicate.com/api/v2/summary.json", statusUrl: "https://status.replicate.com", docsUrl: "https://replicate.com/docs", icon: "replicate" },
  { slug: "pinecone", name: "Pinecone", category: "AI", apiUrl: "https://status.pinecone.io/api/v2/summary.json", statusUrl: "https://status.pinecone.io", docsUrl: "https://docs.pinecone.io" },
  { slug: "okta", name: "Okta", category: "Auth", statusUrl: "https://status.okta.com", docsUrl: "https://developer.okta.com/docs", icon: "okta" },
  { slug: "clerk", name: "Clerk", category: "Auth", apiUrl: "https://status.clerk.com/api/v2/summary.json", statusUrl: "https://status.clerk.com", docsUrl: "https://clerk.com/docs", icon: "clerk" },
  { slug: "npm", name: "npm", category: "Developer Tools", apiUrl: "https://status.npmjs.org/api/v2/summary.json", statusUrl: "https://status.npmjs.org", docsUrl: "https://docs.npmjs.com", icon: "npm" },
  { slug: "docker-hub", name: "Docker Hub", category: "Developer Tools", apiUrl: "https://status.docker.com/api/v2/summary.json", statusUrl: "https://status.docker.com", docsUrl: "https://docs.docker.com", icon: "docker" },
  { slug: "npm-registry", name: "jsDelivr", category: "CDN", apiUrl: "https://status.jsdelivr.com/api/v2/summary.json", statusUrl: "https://status.jsdelivr.com", docsUrl: "https://www.jsdelivr.com/docs", icon: "jsdelivr" },
  { slug: "digitalocean", name: "DigitalOcean", category: "Cloud", apiUrl: "https://status.digitalocean.com/api/v2/summary.json", statusUrl: "https://status.digitalocean.com", docsUrl: "https://docs.digitalocean.com", icon: "digitalocean" },
  { slug: "linode", name: "Linode", category: "Cloud", apiUrl: "https://status.linode.com/api/v2/summary.json", statusUrl: "https://status.linode.com", docsUrl: "https://www.linode.com/docs" },
];

export const SERVICE_MAP = new Map(SERVICES.map((s) => [s.slug, s]));

export const PRESETS: Record<string, string[]> = {
  MERN: ["mongodb-atlas", "render", "cloudflare", "sendgrid"],
  "Next+Supabase": ["vercel", "supabase", "resend", "sentry", "upstash"],
  "AI Dev": ["openai", "anthropic", "pinecone", "vercel", "supabase", "replicate"],
};

// The public address of the site, used to build absolute URLs for search engines and
// link previews (canonical links, the sitemap, the Open Graph image).
// Set SITE_URL in the hosting environment, for example SITE_URL=https://example.com.
// On Vercel the production domain is picked up automatically. Locally it falls back to
// the dev server address.
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");

export const siteName = "កត់ទុក · Kot Tuk";

// Khmer first (the default language of the pages), then English, because both languages
// are served from the same address.
export const siteDescription = "កត់ទុក — កន្លែងផ្ទាល់ខ្លួនសម្រាប់កត់ត្រា និងតាមដានកិច្ចការរបស់អ្នក។ Kot Tuk is a personal task manager: set priorities, track your progress and reorder your day.";

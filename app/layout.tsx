import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import { LanguageRoot } from "@/components/language-root";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
});

// Defaults for every page. A page can override any of these in its own metadata.
// The Open Graph image comes from app/opengraph-image.tsx.
export const metadata: Metadata = {
  // Lets the other fields use relative paths such as "/login".
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — បញ្ជីកិច្ចការផ្ទាល់ខ្លួន`, template: "%s · កត់ទុក" },
  description: siteDescription,
  applicationName: "Kot Tuk",
  keywords: ["កត់ទុក", "បញ្ជីកិច្ចការ", "កម្មវិធីកត់ត្រាកិច្ចការ", "Kot Tuk", "task manager", "to-do list", "Khmer to-do app"],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — បញ្ជីកិច្ចការផ្ទាល់ខ្លួន`,
    description: siteDescription,
    locale: "km_KH",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — បញ្ជីកិច្ចការផ្ទាល់ខ្លួន`,
    description: siteDescription,
  },
};

// The pages are prerendered in Khmer, and the visitor's language is only known in the
// browser (localStorage, see lib/i18n.ts). This runs before the first paint and records
// the saved language on <html>. The CSS in globals.css then hides every part of the page
// that is still in another language, until React has switched that part's texts, so an
// English visitor never sees Khmer first. The timeout shows the page anyway if React
// never loads. The key "language" and the value "en" must match lib/i18n.ts.
const languageScript = `(function(){try{if(localStorage.getItem("language")==="en"){var d=document.documentElement;d.setAttribute("data-saved-language","en");setTimeout(function(){if(!d.hasAttribute("data-language-ready"))d.removeAttribute("data-saved-language")},10000)}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="km"
      className={`${kantumruy.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageScript }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <LanguageRoot />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import { LanguageRoot } from "@/components/language-root";
import "./globals.css";

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
});

export const metadata: Metadata = {
  title: { default: "កត់ទុក", template: "%s · កត់ទុក" },
  description: "កត់ទុក — កន្លែងផ្ទាល់ខ្លួនសម្រាប់កត់ត្រា និងតាមដានកិច្ចការរបស់អ្នក។",
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

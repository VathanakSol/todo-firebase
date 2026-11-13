"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { getLanguage, useLanguage } from "@/lib/i18n";

// Keeps <html lang> and the browser tab title in step with the chosen language, and
// renders the toast container with a translated label. The titles in each page's
// metadata are the Khmer defaults that search engines and the first paint see.
export function LanguageRoot() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  // Keeps the saved language recorded on <html>, where the inline script in app/layout.tsx
  // first put it. The CSS hides any part of the page still in another language. A layout
  // effect runs before the browser paints, so the wrong language is never visible.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-saved-language", getLanguage());
    root.setAttribute("data-language-ready", "");
  }, [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    const page = pathname === "/login" ? t.auth.login.submit : pathname === "/register" ? t.auth.register.submit : pathname === "/settings" ? t.settings.title : null;
    document.title = page ? `${page} · ${t.common.siteName}` : t.common.siteName;
  }, [language, pathname, t]);
  return (
    <Toaster
      className="within-toaster"
      position="top-center"
      closeButton
      offset={24}
      toastOptions={{
        classNames: { toast: "within-toast" },
        closeButtonAriaLabel: t.common.dismissNotification,
      }}
    />
  );
}

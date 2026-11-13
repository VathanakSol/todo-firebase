"use client";

import { useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/lib/i18n";

// The 3D notebook is decorative, so it loads separately from the form.
const TaskOrb = dynamic(() => import("@/components/task-orb"), { ssr: false });

// Shared frame for the login and register pages.
export function AuthShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { language, t } = useLanguage();

  // Visitors who are already signed in when the page loads go straight to the
  // workspace. Sign-ins that happen on the page are redirected by the form,
  // after the profile has been saved.
  useEffect(() => {
    let active = true;
    void auth.authStateReady().then(() => { if (active && auth.currentUser) router.replace("/"); });
    return () => { active = false; };
  }, [router]);

  return (
    <main data-language={language} className="auth-page">
      <div className="auth-layout">
        <aside className="auth-visual">
          <Link href="/" className="brand"><span className="brand-mark"><Check aria-hidden="true" size={17} /></span> {t.common.siteName}</Link>
          <div className="auth-visual-scene"><TaskOrb reducedMotion={reducedMotion !== false} /></div>
          <p className="auth-visual-copy">{t.hero.titleLead} <em>{t.hero.titleAccent}</em><span>{t.hero.tagline}</span></p>
        </aside>
        <section className="login-card"><div className="auth-language"><LanguageSwitch /></div>{children}</section>
      </div>
    </main>
  );
}

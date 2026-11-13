"use client";

import Link from "next/link";
import { Check, LogIn } from "lucide-react";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { ClosingCta, CtaButtons } from "@/components/home-cta";
import { HowItWorks } from "@/components/how-it-works";
import { LanguageSwitch } from "@/components/language-switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { TodoWorkspace } from "@/features/todos/components/todo-workspace";
import { useAuth } from "../hooks/use-auth";

export function AuthGate() {
  const { user, authLoading, handleSignOut } = useAuth();
  const { language, t } = useLanguage();
  // data-language keeps the prerendered Khmer hidden from English visitors (see lib/i18n.ts).
  if (authLoading) return (
    <main data-language={language} className="flex min-h-screen items-center justify-center px-6">
      <div role="status" className="flex flex-col items-center gap-4 text-center text-sm text-[#718076]">
        <span aria-hidden="true" className="h-9 w-9 rounded-full border-2 border-[#dce7dc] border-t-[#527c5e] motion-safe:animate-spin" />
        <p>{t.auth.checking}</p>
      </div>
    </main>
  );
  if (!user) return (
    <main data-language={language} className="min-h-screen">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Check aria-hidden="true" size={17} /></span> {t.common.siteName} <span className="brand-label">{t.common.brandLabel}</span></div>
        <div className="topbar-actions">
          <LanguageSwitch />
          <Button variant="ghost" asChild><Link href="/login"><LogIn aria-hidden="true" /> {t.auth.signIn}</Link></Button>
        </div>
      </header>
      <section className="mx-auto max-w-[1120px] px-6 pt-14 pb-24 sm:pt-20">
        <Hero><CtaButtons className="mt-7" /></Hero>
        <Features />
        <HowItWorks />
        <ClosingCta />
      </section>
      <footer className="footer">{t.common.footer} <span>✳</span></footer>
    </main>
  );
  return <TodoWorkspace key={user.uid} uid={user.uid} displayName={user.displayName} onSignOut={handleSignOut} />;
}

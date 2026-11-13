"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

// The two ways into the app for a visitor: create an account (primary) or sign in.
export function CtaButtons({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button asChild className="h-11 rounded-[10px] bg-[#345f4c] px-5 text-sm text-white hover:bg-[#2b5040]">
        <Link href="/register">{t.cta.create} <ArrowRight aria-hidden="true" /></Link>
      </Button>
      <Button asChild variant="outline" className="h-11 rounded-[10px] border-[#dfe5dc] bg-transparent px-5 text-sm text-[#304d3a] hover:bg-[#f1f6ef]">
        <Link href="/login">{t.auth.signIn}</Link>
      </Button>
    </div>
  );
}

// The last section of the public home page, so visitors who scrolled down can start from there.
export function ClosingCta() {
  const { t } = useLanguage();
  return (
    <section aria-labelledby="closing-cta-title" className="mt-20 flex flex-col items-center rounded-3xl bg-[#e9f1e7] px-6 py-14 text-center">
      <h2 id="closing-cta-title" className="text-2xl font-semibold tracking-tight text-[#253029] sm:text-3xl">{t.cta.title}</h2>
      <p className="mt-3 max-w-md text-[15px] text-[#6f8475]">{t.cta.text}</p>
      <CtaButtons className="mt-7 justify-center" />
    </section>
  );
}

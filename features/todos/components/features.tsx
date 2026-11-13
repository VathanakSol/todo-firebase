"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useLanguage } from "@/lib/i18n";
import { FeatureKind } from "./feature-object";


const FeatureObject = dynamic(() => import("./feature-object"), { ssr: false });
const KINDS: FeatureKind[] = ["priority", "progress", "reorder"];

export function Features() {
  const reducedMotion = useReducedMotion() !== false;
  const { t } = useLanguage();
  const [active, setActive] = useState<FeatureKind | null>(null);

  return (
    <section aria-labelledby="features-title" className="mt-20">
      <h2 id="features-title" className="eyebrow">{t.features.title}</h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-3">
        {KINDS.map((kind) => (
          <li
            key={kind}
            className="rounded-xl border border-[#dce7dc] bg-[#fbfcf8] p-5"
            onPointerEnter={() => setActive(kind)}
            onPointerLeave={() => setActive(null)}
          >
            <div className="h-40">
              <FeatureObject kind={kind} reducedMotion={reducedMotion} active={active === kind} />
            </div>
            <h3 className="mt-3 font-semibold text-[#34493a]">{t.features.items[kind].title}</h3>
            <p className="mt-1 text-sm text-[#718076]">{t.features.items[kind].text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

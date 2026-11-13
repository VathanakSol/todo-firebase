"use client";

import { CircleCheck, ListPlus, UserPlus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/lib/i18n";

// One icon per step, in the same order as the texts in the dictionary.
const ICONS = [UserPlus, ListPlus, CircleCheck];

// Tells a new visitor what to do first, as a vertical timeline. On phones the line runs
// down the left; on wider screens it runs down the middle and the steps alternate sides.
export function HowItWorks() {
  const { t } = useLanguage();
  const animated = useReducedMotion() === false;
  const last = t.howItWorks.items.length - 1;

  return (
    <section aria-labelledby="how-it-works-title" className="mt-20">
      <h2 id="how-it-works-title" className="eyebrow sm:text-center">{t.howItWorks.title}</h2>
      <ol className="mt-8">
        {t.howItWorks.items.map((item, index) => {
          const Icon = ICONS[index];
          const onLeft = index % 2 === 0;
          return (
            <li key={index} className="grid grid-cols-[auto_1fr] gap-x-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-8">
              {/* The icon on the line, and the piece of line leading to the next step. */}
              <div className="flex flex-col items-center sm:col-start-2 sm:row-start-1">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-[#345f4c] text-white">
                  <Icon aria-hidden="true" size={22} />
                </span>
                {index < last && <span aria-hidden="true" className="my-2 w-px flex-1 bg-[#cfdccd]" />}
              </div>
              <motion.div
                className={`rounded-[20px] border border-[#e6e9e1] bg-white p-5 shadow-[0_1px_2px_rgba(38,65,46,0.04),0_16px_40px_-28px_rgba(38,65,46,0.22)] sm:row-start-1 ${index < last ? "mb-8" : ""} ${onLeft ? "sm:col-start-1 sm:text-right" : "sm:col-start-3"}`}
                // Each step rises in once, when it is scrolled into view.
                initial={animated ? { opacity: 0, y: 24 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="text-[11px] font-bold tracking-[1.4px] text-[#74917c]">{t.howItWorks.step(index + 1)}</p>
                <h3 className="mt-1 text-lg font-semibold text-[#253029]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#718076]">{item.text}</p>
              </motion.div>
              {/* A large pale number fills the empty side on wider screens. */}
              <span aria-hidden="true" className={`hidden h-12 items-center text-6xl font-semibold leading-none text-[#e1eadf] sm:row-start-1 sm:flex ${onLeft ? "sm:col-start-3" : "sm:col-start-1 sm:justify-end"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

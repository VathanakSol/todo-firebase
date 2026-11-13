"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useLanguage } from "@/lib/i18n";

const TaskOrb = dynamic(() => import("@/components/task-orb"), { ssr: false });

// The blocks appear one after another; inside the title, the words do the same.
const sequence: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
const titleSequence: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const wordRise: Variants = { hidden: { opacity: 0, y: 28, rotate: 4 }, show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 18 } } };

// Split a line into words. Khmer is written without spaces, so the browser's word
// segmenter is used when available; punctuation stays attached to the word before it.
function splitWords(text: string, locale: string) {
  if (typeof Intl.Segmenter !== "function") return text.split(/(\s+)/).filter(Boolean);
  const parts: string[] = [];
  for (const { segment, isWordLike } of new Intl.Segmenter(locale, { granularity: "word" }).segment(text)) {
    if (isWordLike || !segment.trim() || parts.length === 0) parts.push(segment);
    else parts[parts.length - 1] += segment;
  }
  return parts;
}

function TitleLine({ text, locale, interactive, draggable }: { text: string; locale: string; interactive: boolean; draggable: boolean }) {
  return (
    <>
      {splitWords(text, locale).map((word, index) => word.trim() ? (
        <motion.span
          key={`${index}-${word}`}
          className="hero-word"
          variants={wordRise}
          whileHover={interactive ? { y: -8, rotate: -3, scale: 1.04 } : undefined}
          whileTap={interactive ? { scale: 0.96 } : undefined}
          // Words can be pulled around and spring back into place.
          drag={draggable}
          dragSnapToOrigin
          dragElastic={0.5}
          whileDrag={{ scale: 1.1, rotate: 4, zIndex: 1 }}
        >
          {word}
        </motion.span>
      ) : word)}
    </>
  );
}

export function Hero({ children }: { children?: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  // Dragging is for mouse and trackpad only, so touch users can still scroll past the title.
  const [finePointer] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);
  const interactive = reducedMotion === false;

  return (
    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
      {/* The key replays the entrance when the language changes. With reduced motion everything is simply shown. */}
      <motion.div key={t.locale} variants={sequence} initial={interactive ? "hidden" : false} animate="show">
        <motion.div className="eyebrow" variants={rise}>{t.hero.eyebrow}</motion.div>
        {/* Screen readers get the whole title at once instead of word by word. */}
        <motion.h1 className="hero-title" variants={titleSequence} aria-label={`${t.hero.titleLead} ${t.hero.titleAccent}`}>
          <span aria-hidden="true">
            <TitleLine text={t.hero.titleLead} locale={t.locale} interactive={interactive} draggable={interactive && finePointer} />
            <br />
            <em><TitleLine text={t.hero.titleAccent} locale={t.locale} interactive={interactive} draggable={interactive && finePointer} /></em>
          </span>
        </motion.h1>
        <motion.p className="intro" variants={rise}>{t.hero.intro}</motion.p>
        {/* Anything passed in (the home page's buttons) rises in after the intro. */}
        {children && <motion.div variants={rise}>{children}</motion.div>}
      </motion.div>
      <TaskOrb size="lg" reducedMotion={reducedMotion !== false} />
    </div>
  );
}

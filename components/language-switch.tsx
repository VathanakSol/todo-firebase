"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { setLanguage, useLanguage } from "@/lib/i18n";

// Shows the language you can switch TO: its flag, and its name written in that
// language so its speakers recognise it.
export function LanguageSwitch() {
  const { language, t } = useLanguage();
  const other = language === "km" ? "en" : "km";
  return (
    <Button variant="ghost" type="button" className="language-switch" lang={other} aria-label={t.common.switchLanguage} onClick={() => setLanguage(other)}>
      {other === "en" ? <UnitedKingdomFlag /> : <CambodiaFlag />} {t.common.otherLanguage}
    </Button>
  );
}

// The flags are decorative (the button already has a text label). "size-auto" stops the
// shared Button styles from forcing icons into a square.
function CambodiaFlag() {
  return (
    <svg className="flag-icon size-auto" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <path fill="#032ea1" d="M0 0h60v40H0z" />
      <path fill="#e00025" d="M0 10h60v20H0z" />
      {/* Simplified Angkor Wat: three towers on a stepped base. */}
      <g fill="#fff">
        <path d="M17 25.5h26V28H17zM19 22.5h22v3H19z" />
        <path d="M21 22.5v-4l1.5-3 1.5 3v4zM27.5 22.5V17l2.5-4.5 2.5 4.5v5.5zM36 22.5v-4l1.5-3 1.5 3v4z" />
      </g>
    </svg>
  );
}

function UnitedKingdomFlag() {
  const clipId = useId();
  return (
    <svg className="flag-icon size-auto" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <clipPath id={clipId}><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath>
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path stroke="#fff" strokeWidth="6" d="m0 0 60 30M60 0 0 30" />
      <path stroke="#c8102e" strokeWidth="4" clipPath={`url(#${clipId})`} d="m0 0 60 30M60 0 0 30" />
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path stroke="#c8102e" strokeWidth="6" d="M30 0v30M0 15h60" />
    </svg>
  );
}

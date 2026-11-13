import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { Todo, TodoPriority } from "../types";

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const priorities: TodoPriority[] = ["high", "medium", "low"];

export function TodoProgress({ todos, reducedMotion }: { todos: Todo[]; reducedMotion: boolean }) {
  const { t } = useLanguage();
  const [showPriority, setShowPriority] = useState(false);
  const priorityId = useId();
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const transition = { duration: reducedMotion ? 0 : 0.5, ease: "easeOut" as const };

  return (
    <div className="panel stats">
      <section>
        <div className="stats-label">{t.todos.yourProgress}</div>
        <div className="progress-ring" role="img" aria-label={t.todos.progressSummary(completed, total, percent)}>
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle className="ring-track" cx="70" cy="70" r={RADIUS} />
            {/* Rotated so the ring starts filling from the top. */}
            <motion.circle className="ring-value" cx="70" cy="70" r={RADIUS} transform="rotate(-90 70 70)" strokeDasharray={CIRCUMFERENCE} initial={false} animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100), opacity: percent ? 1 : 0 }} transition={transition} />
          </svg>
          <div className="ring-center"><strong>{percent}%</strong><span>{t.todos.done}</span></div>
        </div>
        <p className="stats-caption">{t.todos.captionBefore}<strong>{completed}</strong>{t.todos.captionAfter(total)}</p>
      </section>

      <section>
        <button type="button" className="stats-label stats-toggle" aria-expanded={showPriority} aria-controls={priorityId} onClick={() => setShowPriority((current) => !current)}>
          {t.todos.byPriority} <ChevronDown size={15} aria-hidden="true" />
        </button>
        {/* Height animates between 0 and the list's natural height when toggled. */}
        <AnimatePresence initial={false}>
        {showPriority && <motion.div id={priorityId} className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}>
        <ul className="priority-stats">
          {priorities.map((value) => {
            const label = t.todos.priority[value];
            const group = todos.filter((todo) => todo.priority === value);
            const done = group.filter((todo) => todo.completed).length;
            return (
              <li key={value} title={t.todos.priorityProgress(label, done, group.length)}>
                <span className="priority-stats-name"><span className={`priority-dot priority-dot-${value}`} aria-hidden="true" />{label}</span>
                <span className="meter" aria-hidden="true"><motion.span initial={false} animate={{ width: `${group.length ? (done / group.length) * 100 : 0}%` }} transition={transition} /></span>
                <span className="priority-stats-count">{done}/{group.length}<span className="sr-only">{t.todos.completedSuffix}</span></span>
              </li>
            );
          })}
        </ul>
        </motion.div>}
        </AnimatePresence>
      </section>
    </div>
  );
}

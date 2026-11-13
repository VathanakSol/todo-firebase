"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { Check, LogOut, Settings } from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { Button } from "@/components/ui/button";
import { useLanguage, type Dictionary } from "@/lib/i18n";
import { useTodos } from "../hooks/use-todos";
import type { TodoFilter } from "../types";
import { TodoForm } from "./todo-form";
import { TodoFilters } from "./todo-filters";
import { TodoList } from "./todo-list";
import { TodoProgress } from "./todo-progress";

function greeting(hour: number, greetings: Dictionary["todos"]["greeting"]) {
  return hour < 12 ? greetings.morning : hour < 18 ? greetings.afternoon : greetings.evening;
}

export function TodoWorkspace({ uid, displayName, onSignOut }: { uid: string; displayName: string | null; onSignOut: () => Promise<void> }) {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const { todos, addTodo, toggleTodo, deleteTodo, saveTodo, reorderTodos, reordering } = useTodos(uid);
  const [filter, setFilter] = useState<TodoFilter>("all");
  // Read the clock once so the greeting, date and weekly chart agree.
  const [today] = useState(() => new Date());
  const visibleTodos = todos.filter((todo) => filter === "all" || (filter === "completed" ? todo.completed : !todo.completed));

  return (
    <main className="min-h-screen">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Check aria-hidden="true" size={17} /></span> {t.common.siteName} <span className="brand-label">{t.common.brandLabel}</span></div>
        <div className="topbar-actions">
          <LanguageSwitch />
          {/* On small screens only the icon shows; the label stays available to screen readers. */}
          <Button variant="ghost" asChild><Link href="/settings"><Settings aria-hidden="true" /> <span className="max-sm:sr-only">{t.settings.open}</span></Link></Button>
          <Button variant="ghost" onClick={onSignOut}><LogOut aria-hidden="true" /> {t.auth.signOut}</Button>
        </div>
      </header>
      <div className="workspace">
        <div className="workspace-head">
          <div className="eyebrow">{today.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}</div>
          <h1 className="workspace-title">{greeting(today.getHours(), t.todos.greeting)}{displayName ? `, ${displayName}` : ""}</h1>
        </div>
        <div className="workspace-grid">
          <section className="panel">
            <TodoForm onAdd={addTodo} />
            <TodoFilters filter={filter} onChange={setFilter} />
            <TodoList todos={visibleTodos} reducedMotion={!!reducedMotion} onToggle={toggleTodo} onDelete={deleteTodo} onSave={saveTodo} reordering={reordering} onReorder={reorderTodos} />
          </section>
          <aside className="workspace-side" aria-label={t.todos.progressRegion}>
            <TodoProgress todos={todos}reducedMotion={!!reducedMotion} />
          </aside>
        </div>
      </div>
      <footer className="footer">{t.common.footer} <span>✳</span></footer>
    </main>
  );
}

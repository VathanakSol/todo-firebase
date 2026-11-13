"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import type { TodoPriority } from "../types";
import { PrioritySelect } from "./priority-select";

export function TodoForm({ onAdd }: { onAdd: (text: string, priority: TodoPriority) => Promise<boolean> }) {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const submitted = text;
    if (await onAdd(submitted, priority)) setText((current) => current === submitted ? "" : current);
  }
  return (
    <form className="add-form" onSubmit={submit}>
      <Input className="h-auto border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0" value={text} onChange={(event) => setText(event.target.value)} placeholder={t.todos.placeholder} aria-label={t.todos.newTask} />
      <PrioritySelect value={priority} onChange={setPriority} />
      <Button type="submit" className="h-[40px]"><Plus aria-hidden="true" /> {t.todos.addTask}</Button>
    </form>
  );
}

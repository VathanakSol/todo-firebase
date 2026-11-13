"use client";

import { useId, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import type { Todo, TodoPriority } from "../types";
import { PrioritySelect } from "./priority-select";

export function TodoItem({ todo, onToggle, onDelete, onSave }: { todo: Todo; onToggle: (todo: Todo) => Promise<void>; onDelete: (id: string) => Promise<void>; onSave: (id: string, text: string, priority: TodoPriority) => Promise<boolean> }) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const formId = useId();
  return (
    <>
      {editing ? <>
        <form id={formId} className="task-edit-submit" onSubmit={async (event) => { event.preventDefault(); if (await onSave(todo.id, text, priority)) setEditing(false); }} />
        <div className="task-edit-main">
          <label className="task-edit-checkbox">
            <input className="task-checkbox" type="checkbox" checked={todo.completed} onChange={() => void onToggle(todo)} aria-label={t.todos.markComplete(todo.text)} />
            <span className="task-checkbox-indicator" aria-hidden="true">{todo.completed && <Check size={14} strokeWidth={3} />}</span>
          </label>
          <Input form={formId} className="task-edit-input focus-visible:ring-0" aria-label={t.todos.editName} value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditing(false); }} autoFocus />
        </div>
      </> : <label>
          <input className="task-checkbox" type="checkbox" checked={todo.completed} onChange={() => void onToggle(todo)} />
          <span className="task-checkbox-indicator" aria-hidden="true">{todo.completed && <Check size={14} strokeWidth={3} />}</span>
          <span className="task-text-wrap"><span className="task-text">{todo.text}</span></span>
        </label>}
      <span className="task-priority">
        {editing ? <PrioritySelect value={priority} onChange={setPriority} badge /> : <span className={`priority-badge priority-${todo.priority}`} aria-label={t.todos.priorityOf(t.todos.priority[todo.priority])}>
          {t.todos.priority[todo.priority]}
        </span>}
      </span>
      <div className="task-actions">
        {editing ? <>
          <Button key="save" variant="ghost" size="icon" type="submit" form={formId} disabled={!text.trim()} aria-label={t.todos.save}><Check aria-hidden="true" /></Button>
          <Button key="cancel" variant="ghost" size="icon" type="button" aria-label={t.todos.cancel} onClick={() => setEditing(false)}><X aria-hidden="true" /></Button>
        </> : <>
          <Button key="edit" variant="ghost" size="icon" type="button" aria-label={t.todos.edit(todo.text)} onClick={() => { setText(todo.text); setPriority(todo.priority); setEditing(true); }}><Pencil aria-hidden="true" /></Button>
          <Button key="delete" variant="ghost" size="icon" type="button" aria-label={t.todos.remove(todo.text)} onClick={() => void onDelete(todo.id)}><Trash2 aria-hidden="true" /></Button>
        </>}
      </div>
    </>
  );
}

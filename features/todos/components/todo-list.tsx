import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { TodoItem } from "./todo-item";
import type { Todo, TodoPriority } from "../types";

export function TodoList({ todos, reducedMotion, onToggle, onDelete, onSave, reordering, onReorder }: { todos: Todo[]; reducedMotion: boolean; onToggle: (todo: Todo) => Promise<void>; onDelete: (id: string) => Promise<void>; onSave: (id: string, text: string, priority: TodoPriority) => Promise<boolean>; reordering: boolean; onReorder: (fromId: string, toId: string) => Promise<void> }) {
  const { t } = useLanguage();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  return (
    <ul className="task-list">
      {todos.length === 0 && <li className="empty-state">{t.todos.empty}</li>}
      <AnimatePresence initial={false}>
        {todos.map((todo, index) => (
          <motion.li key={todo.id} layout={reducedMotion ? false : "position"} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: draggedId === todo.id ? 0.5 : 1, y: 0, backgroundColor: dropTarget === todo.id && draggedId !== todo.id ? "#edf5ec" : "#ffffff", boxShadow: dropTarget === todo.id && draggedId !== todo.id ? "inset 3px 0 0 #6d9977" : "inset 0px 0 0 transparent" }} exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2, layout: { type: "spring", stiffness: 240, damping: 24 } }} onDragOver={(event) => { if (draggedId && !reordering) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; if (dropTarget !== todo.id) setDropTarget(todo.id); } }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(null); }} onDrop={(event) => { event.preventDefault(); if (draggedId && !reordering) void onReorder(draggedId, todo.id); setDraggedId(null); setDropTarget(null); }}>
            <div className="reorder-controls">
              <button className="drag-handle" type="button" aria-label={t.todos.move(todo.text)} aria-disabled={reordering} draggable={!reordering} onDragStart={(event) => { setDraggedId(todo.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", todo.id); }} onDragEnd={() => { setDraggedId(null); setDropTarget(null); }} onKeyDown={(event) => {
                const target = event.key === "ArrowUp" ? index - 1 : event.key === "ArrowDown" ? index + 1 : -1;
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                  if (!reordering && target >= 0 && target < todos.length) void onReorder(todo.id, todos[target].id);
                }
              }}><GripVertical size={18} aria-hidden="true" /></button>
            </div>
            <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onSave={onSave} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

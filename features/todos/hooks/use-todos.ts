"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { translations } from "@/lib/i18n";
import { createTodo, removeTodo, saveTodoOrder, setTodoCompleted, subscribeToTodos, updateTodo } from "../services/todo-service";
import type { Todo, TodoPriority } from "../types";

export function useTodos(uid: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [reordering, setReordering] = useState(false);

  useEffect(() => subscribeToTodos(uid, setTodos, () => toast.error(translations().todos.loadFailed)), [uid]);

  async function addTodo(text: string, priority: TodoPriority) {
    if (!text.trim()) { toast.error(translations().todos.enterTask); return false; }
    try {
      await createTodo(uid, text.trim(), priority);
      toast.success(translations().todos.added);
      return true;
    } catch {
      toast.error(translations().todos.addFailed);
      return false;
    }
  }

  async function toggleTodo(todo: Todo) {
    try {
      await setTodoCompleted(uid, todo.id, !todo.completed);
      toast.success(todo.completed ? translations().todos.markedActive : translations().todos.completed);
    } catch { toast.error(translations().todos.updateFailed); }
  }

  async function deleteTodo(id: string) {
    try {
      await removeTodo(uid, id);
      toast.success(translations().todos.deleted);
    } catch { toast.error(translations().todos.deleteFailed); }
  }

  async function saveTodo(id: string, text: string, priority: TodoPriority) {
    if (!text.trim()) return false;
    try {
      await updateTodo(uid, id, { text: text.trim(), priority });
      toast.success(translations().todos.updated);
      return true;
    } catch {
      toast.error(translations().todos.saveFailed);
      return false;
    }
  }

  async function reorderTodos(fromId: string, toId: string) {
    if (reordering || fromId === toId) return;
    const from = todos.findIndex((todo) => todo.id === fromId);
    const to = todos.findIndex((todo) => todo.id === toId);
    if (from < 0 || to < 0) return;
    const reordered = [...todos];
    reordered.splice(to, 0, ...reordered.splice(from, 1));
    setReordering(true);
    try {
      await saveTodoOrder(uid, reordered);
    } catch {
      toast.error(translations().todos.orderFailed);
    } finally {
      setReordering(false);
    }
  }

  return { todos, addTodo, toggleTodo, deleteTodo, saveTodo, reorderTodos, reordering };
}

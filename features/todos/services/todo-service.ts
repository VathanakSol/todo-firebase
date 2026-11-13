import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Todo, TodoPriority } from "../types";

const todosCollection = (uid: string) => collection(db, "users", uid, "todos");
const todoDocument = (uid: string, id: string) => doc(db, "users", uid, "todos", id);

export function subscribeToTodos(uid: string, onChange: (todos: Todo[]) => void, onError: () => void) {
  return onSnapshot(query(todosCollection(uid), orderBy("createdAt", "desc")), (snapshot) => {
    const items = snapshot.docs.map((item) => {
      // "estimate" fills in a just-written server timestamp before the server confirms it.
      const data = item.data({ serverTimestamps: "estimate" });
      const priority: TodoPriority = data.priority === "low" || data.priority === "high" ? data.priority : "medium";
      // Older tasks have no completedAt, so they simply do not appear in the weekly chart.
      const completedAt = data.completed && data.completedAt instanceof Timestamp ? data.completedAt.toMillis() : null;
      return { id: item.id, text: data.text, completed: data.completed ?? false, priority, completedAt, sortOrder: typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder) ? data.sortOrder : null };
    });
    // Unordered and newly created tasks retain their original newest-first order.
    items.sort((a, b) => (a.sortOrder ?? -1) - (b.sortOrder ?? -1));
    onChange(items);
  }, onError);
}

export function createTodo(uid: string, text: string, priority: TodoPriority) {
  return addDoc(todosCollection(uid), { text, priority, completed: false, createdAt: serverTimestamp() });
}

export function updateTodo(uid: string, id: string, data: Partial<Pick<Todo, "text" | "priority">>) {
  return updateDoc(todoDocument(uid, id), data);
}

// Records when a task was completed so the weekly chart can count it.
export function setTodoCompleted(uid: string, id: string, completed: boolean) {
  return updateDoc(todoDocument(uid, id), { completed, completedAt: completed ? serverTimestamp() : null });
}

export function removeTodo(uid: string, id: string) {
  return deleteDoc(todoDocument(uid, id));
}

// One-time read of every task with its dates, for the download on the settings page.
export async function fetchTodosForExport(uid: string) {
  const snapshot = await getDocs(todosCollection(uid));
  const isoDate = (value: unknown) => value instanceof Timestamp ? value.toDate().toISOString() : null;
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      const priority: TodoPriority = data.priority === "low" || data.priority === "high" ? data.priority : "medium";
      return { text: String(data.text ?? ""), completed: data.completed === true, priority, createdAt: isoDate(data.createdAt), completedAt: isoDate(data.completedAt) };
    })
    // Newest first; ISO dates sort correctly as text, and tasks without a date go last.
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

// Deletes the user's tasks (all of them, or only the completed ones) and resolves to how
// many were deleted. Firestore accepts at most 500 writes per batch.
export async function removeTodos(uid: string, onlyCompleted: boolean) {
  const snapshot = await getDocs(onlyCompleted ? query(todosCollection(uid), where("completed", "==", true)) : todosCollection(uid));
  for (let start = 0; start < snapshot.docs.length; start += 500) {
    const batch = writeBatch(db);
    snapshot.docs.slice(start, start + 500).forEach((item) => batch.delete(item.ref));
    await batch.commit();
  }
  return snapshot.size;
}

export function saveTodoOrder(uid: string, todos: Todo[]) {
  if (todos.length > 500) throw new Error("Too many tasks to reorder at once.");
  const batch = writeBatch(db);
  todos.forEach((todo, index) => batch.update(todoDocument(uid, todo.id), { sortOrder: index }));
  return batch.commit();
}

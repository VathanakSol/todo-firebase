"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type Todo = { id: string; text: string; done: boolean };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodos([]);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "todos"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setTodos(snap.docs.map((d) => ({ id: d.id, text: d.data().text, done: d.data().done ?? false })))
    );
  }, [user]);

  // Adding To do
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    await addDoc(collection(db, "users", user.uid, "todos"), {
      text: text.trim(),
      done: false,
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  async function toggleTodo(todo: Todo) {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "todos", todo.id), {
      done: !todo.done,
    })
  }

  async function removeTodo(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "todos", id));
  }

  if (!user) {
    return (
      <main style={{ padding: 40 }}>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <p>
        Hello, {user.displayName}{" "}
        <button onClick={() => signOut(auth)}>Sign out</button>
      </p>
      <form onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New to-do"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t)}
            />{" "}
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
              {t.text}
            </span>{" "}
            <button onClick={() => removeTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
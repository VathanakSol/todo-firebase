"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import { ArrowLeft, Check, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitch } from "@/components/language-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useTodos } from "@/features/todos/hooks/use-todos";
import { fetchTodosForExport, removeTodos } from "@/features/todos/services/todo-service";
import { translations, useLanguage } from "@/lib/i18n";
import { deleteAccount, updateDisplayName, usesPassword } from "../services/account-service";
import { ConfirmDialog } from "./confirm-dialog";

const primaryButton = "h-10 rounded-[10px] bg-[#345f4c] px-4 text-white hover:bg-[#2b5040]";
const outlineButton = "h-10 rounded-[10px] border-[#dfe5dc] bg-transparent px-4 text-[#304d3a] hover:bg-[#f1f6ef]";
const dangerOutlineButton = "h-10 rounded-[10px] border-[#e6c5bd] bg-transparent px-4 text-[#9c5143] hover:bg-[#faeae5] hover:text-[#9c5143]";

// Hands the browser a file to save.
function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// The settings page is only for signed-in users; everyone else is sent away.
export function SettingsPage() {
  const { user, authLoading } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();
  // Visitors who are not signed in go to the login page. After deleting their account,
  // a user goes to the public home page instead.
  const destination = useRef("/login");

  useEffect(() => {
    if (!authLoading && !user) router.replace(destination.current);
  }, [authLoading, user, router]);

  // data-language keeps the prerendered Khmer hidden from English visitors (see lib/i18n.ts).
  if (!user) return (
    <main data-language={language} className="flex min-h-screen items-center justify-center px-6">
      <div role="status" className="flex flex-col items-center gap-4 text-center text-sm text-[#718076]">
        <span aria-hidden="true" className="h-9 w-9 rounded-full border-2 border-[#dce7dc] border-t-[#527c5e] motion-safe:animate-spin" />
        <p>{t.auth.checking}</p>
      </div>
    </main>
  );
  // The key resets the form if a different user signs in.
  return <SettingsContent key={user.uid} user={user} onAccountDeleting={() => { destination.current = "/"; }} />;
}

function SettingsContent({ user, onAccountDeleting }: { user: User; onAccountDeleting: () => void }) {
  const { language, t } = useLanguage();
  const text = t.settings;
  const id = useId();
  const { todos } = useTodos(user.uid);
  const completedCount = todos.filter((todo) => todo.completed).length;
  const [name, setName] = useState(user.displayName ?? "");
  const [password, setPassword] = useState("");
  // Only one action runs at a time, and only one confirmation is open at a time.
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<"completed" | "all" | "account" | null>(null);
  const withPassword = usesPassword(user);

  async function saveName(event: FormEvent) {
    event.preventDefault();
    const messages = translations().settings.profile;
    if (!name.trim()) { toast.error(messages.nameRequired); return; }
    setBusy(true);
    try {
      await updateDisplayName(user, name.trim());
      setName(name.trim());
      toast.success(messages.saved);
    } catch {
      // The field keeps what the user typed.
      toast.error(messages.saveFailed);
    } finally {
      setBusy(false);
    }
  }

  async function exportTasks() {
    setBusy(true);
    try {
      const tasks = await fetchTodosForExport(user.uid);
      const messages = translations().settings.data;
      if (tasks.length === 0) { toast.error(messages.nothingToExport); return; }
      const exportedAt = new Date().toISOString();
      download(`tasks-${exportedAt.slice(0, 10)}.json`, JSON.stringify({ exportedAt, tasks }, null, 2));
      toast.success(messages.exported);
    } catch {
      toast.error(translations().settings.data.exportFailed);
    } finally {
      setBusy(false);
    }
  }

  async function deleteTasks(onlyCompleted: boolean) {
    setBusy(true);
    try {
      const count = await removeTodos(user.uid, onlyCompleted);
      toast.success(translations().settings.data.deleted(count));
      setConfirming(null);
    } catch {
      toast.error(translations().settings.data.deleteFailed);
    } finally {
      setBusy(false);
    }
  }

  async function removeAccount() {
    setBusy(true);
    onAccountDeleting();
    try {
      await deleteAccount(user, password);
      // Signing out happens as part of the deletion; SettingsPage then leaves this page.
      toast.success(translations().settings.account.deleted);
    } catch (error) {
      const messages = translations().settings.account;
      const code = error instanceof FirebaseError ? error.code : "";
      toast.error(code === "auth/wrong-password" || code === "auth/invalid-credential" ? messages.wrongPassword : messages.deleteFailed);
      setBusy(false);
    }
  }

  return (
    <main data-language={language} className="min-h-screen">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark"><Check aria-hidden="true" size={17} /></span> {t.common.siteName}</Link>
        <div className="topbar-actions">
          <LanguageSwitch />
          <Button variant="ghost" asChild><Link href="/"><ArrowLeft aria-hidden="true" /> {text.back}</Link></Button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-6 pt-9 pb-20">
        <div>
          <div className="eyebrow">{text.eyebrow}</div>
          <h1 className="workspace-title">{text.title}</h1>
        </div>

        <section className="panel" aria-labelledby={`${id}-profile`}>
          <h2 id={`${id}-profile`} className="text-lg font-semibold text-[#253029]">{text.profile.title}</h2>
          <p className="mt-1 text-sm text-[#718076]">{text.profile.text}</p>
          <form className="mt-5 flex flex-col gap-4" onSubmit={saveName}>
            <div className="auth-field">
              <label htmlFor={`${id}-name`}>{text.profile.name}</label>
              <Input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={60} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#4b5a50]">{text.profile.email}</div>
              <div className="mt-1 text-sm text-[#718076] [overflow-wrap:anywhere]">{user.email}</div>
            </div>
            <Button type="submit" className={`${primaryButton} self-start`} disabled={busy}>{text.profile.save}</Button>
          </form>
        </section>

        <section className="panel" aria-labelledby={`${id}-data`}>
          <h2 id={`${id}-data`} className="text-lg font-semibold text-[#253029]">{text.data.title}</h2>
          <p className="mt-1 text-sm text-[#718076]">{text.data.summary(todos.length, completedCount)}</p>
          <p className="mt-4 text-sm text-[#718076]">{text.data.exportText}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button type="button" variant="outline" className={outlineButton} disabled={busy} onClick={exportTasks}><Download aria-hidden="true" /> {text.data.export}</Button>
            <Button type="button" variant="outline" className={dangerOutlineButton} disabled={busy || completedCount === 0} aria-haspopup="dialog" onClick={() => setConfirming("completed")}><Trash2 aria-hidden="true" /> {text.data.deleteCompleted}</Button>
            <Button type="button" variant="outline" className={dangerOutlineButton} disabled={busy || todos.length === 0} aria-haspopup="dialog" onClick={() => setConfirming("all")}><Trash2 aria-hidden="true" /> {text.data.deleteAll}</Button>
          </div>
        </section>

        <section className="panel" aria-labelledby={`${id}-account`}>
          <h2 id={`${id}-account`} className="text-lg font-semibold text-[#253029]">{text.account.title}</h2>
          <p className="mt-1 text-sm text-[#718076]">{text.account.text}</p>
          <Button type="button" variant="outline" className={`${dangerOutlineButton} mt-4`} disabled={busy} aria-haspopup="dialog" onClick={() => setConfirming("account")}>{text.account.delete}</Button>
        </section>
      </div>

      {/* The confirmations open as modals on top of the page. */}
      <ConfirmDialog
        open={confirming === "completed" || confirming === "all"}
        onClose={() => setConfirming(null)}
        title={confirming === "all" ? text.data.deleteAll : text.data.deleteCompleted}
        description={confirming === "all" ? text.data.confirmAll(todos.length) : text.data.confirmCompleted(completedCount)}
        confirmLabel={text.data.confirm}
        cancelLabel={text.cancel}
        busy={busy}
        onConfirm={() => deleteTasks(confirming === "completed")}
      />
      <ConfirmDialog
        open={confirming === "account"}
        onClose={() => { setConfirming(null); setPassword(""); }}
        title={text.account.title}
        description={`${text.account.confirmText} ${withPassword ? text.account.passwordHint : text.account.googleHint}`}
        confirmLabel={text.account.confirm}
        cancelLabel={text.cancel}
        busy={busy}
        onConfirm={removeAccount}
      >
        {withPassword && (
          <div className="auth-field mt-4">
            <label htmlFor={`${id}-password`}>{t.auth.password}</label>
            <Input id={`${id}-password`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </div>
        )}
      </ConfirmDialog>
      <footer className="footer">{t.common.footer} <span>✳</span></footer>
    </main>
  );
}

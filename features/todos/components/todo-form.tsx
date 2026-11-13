"use client";

import { useState } from "react";
import { AlertCircle, LoaderCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import type { TodoPriority } from "../types";
import { PrioritySelect } from "./priority-select";
import { getSuggestionError, suggestTaskSteps, type SuggestionError } from "../services/todo-ai-service";

export function TodoForm({ onAdd }: { onAdd: (text: string, priority: TodoPriority) => Promise<boolean> }) {
  const { t, language } = useLanguage();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<SuggestionError | null>(null);
  const errorMessages: Record<SuggestionError, string> = language === "km" ? {
    configuration: "មុខងារ AI មិនទាន់ត្រូវបានកំណត់រួចរាល់ទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។",
    permission: "មិនអាចផ្ទៀងផ្ទាត់ការចូលប្រើ AI បានទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។",
    quota: "ការប្រើប្រាស់ AI បានឈានដល់កម្រិតកំណត់។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    service: "សេវា AI មិនអាចប្រើបានជាបណ្ដោះអាសន្ន។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    network: "មិនមានការតភ្ជាប់អ៊ីនធឺណិតទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។",
    response: "AI មិនអាចផ្ដល់ជំហានដែលអាចប្រើបានទេ។ សូមកែពាក្យកិច្ចការ ហើយព្យាយាមម្តងទៀត។",
    unknown: "មិនអាចបង្កើតជំហានបានទេ។ សូមព្យាយាមម្តងទៀត។",
  } : {
    configuration: "AI suggestions aren't configured yet. Please contact the app administrator.",
    permission: "AI access could not be verified. Please contact the app administrator.",
    quota: "The AI usage limit has been reached. Please try again later.",
    service: "The AI service is temporarily unavailable. Please try again later.",
    network: "You're offline. Check your connection and try again.",
    response: "AI couldn't return usable steps. Try rewording your task.",
    unknown: "Could not generate steps. Please try again.",
  };
  const labels = language === "km" ? {
    suggest: "ស្នើជំហានដោយ AI", loading: "កំពុងបង្កើតជំហាន...", title: "ជំហានដែលបានណែនាំសម្រាប់", add: "បន្ថែម", dismiss: "បិទការណែនាំ", error: "មិនអាចបង្កើតការណែនាំបានទេ។ សូមព្យាយាមម្តងទៀត។", privacy: "អត្ថបទកិច្ចការរបស់អ្នកនឹងត្រូវផ្ញើទៅ Gemini។",
  } : {
    suggest: "Suggest steps with AI", loading: "Generating steps...", title: "Suggested steps for", add: "Add", dismiss: "Dismiss suggestions", error: "Could not generate suggestions. Please try again.", privacy: "Your task text will be sent to Gemini.",
  };
  async function suggest() {
    if (!text.trim() || loading) return;
    const task = text.trim();
    setLoading(true);
    setRetrying(false);
    setError(null);
    try {
      const steps = await suggestTaskSteps(task, language, () => setRetrying(true));
      setSource(task);
      setSuggestions(steps);
    } catch (cause) {
      setError(getSuggestionError(cause));
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }
  async function addSuggestion(step: string, index: number) {
    if (saving !== null) return;
    setSaving(index);
    try {
      if (await onAdd(step, priority)) setSuggestions((current) => current.filter((_, i) => i !== index));
    } finally { setSaving(null); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const submitted = text;
    if (await onAdd(submitted, priority)) setText((current) => current === submitted ? "" : current);
  }
  return (
    <div>
    <form className="add-form" onSubmit={submit}>
      <Input className="h-auto border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0" value={text} onChange={(event) => setText(event.target.value)} placeholder={t.todos.placeholder} aria-label={t.todos.newTask} />
      <PrioritySelect value={priority} onChange={setPriority} />
      <Button type="submit" className="h-[40px]"><Plus aria-hidden="true" /> {t.todos.addTask}</Button>
    </form>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" onClick={suggest} disabled={!text.trim() || loading} aria-busy={loading} className="disabled:opacity-100 disabled:text-[#52725f]">
        {loading ? <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" /> : <Sparkles aria-hidden="true" />} {loading ? labels.loading : labels.suggest}
      </Button>
      <span className="text-xs text-[#718076]">{labels.privacy}</span>
    </div>
    {error && (
      <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{errorMessages[error]}</p>
      </div>
    )}
    <div role="status" aria-live="polite">
      {loading && (
        <div className="mt-4 rounded-xl border border-[#e4ebe2] bg-[#f9fbf8] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[#52725f]">
            <Sparkles aria-hidden="true" className="size-4" /> {retrying ? (language === "km" ? "សេវា AI កំពុងមមាញឹក។ កំពុងព្យាយាមម្តងទៀត..." : "AI is busy. Trying again...") : labels.loading}
          </div>
          <div aria-hidden="true" className="mt-4 space-y-3 motion-safe:animate-pulse">
            <div className="h-2.5 w-4/5 rounded-full bg-[#dfe9dd]" />
            <div className="h-2.5 w-3/5 rounded-full bg-[#dfe9dd]" />
            <div className="h-2.5 w-2/3 rounded-full bg-[#dfe9dd]" />
          </div>
        </div>
      )}
    </div>
    {suggestions.length > 0 && (
      <section className="mt-4 rounded-xl border border-[#e4ebe2] bg-[#f9fbf8] p-4" aria-label={labels.suggest}>
        <p className="break-words text-sm font-medium">{labels.title}: {source}</p>
        <ul className="mt-2 space-y-2">
          {suggestions.map((step, index) => (
            <li key={`${index}-${step}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 break-words">{step}</span>
              <Button type="button" size="sm" variant="outline" disabled={saving !== null} onClick={() => addSuggestion(step, index)} aria-label={`${labels.add}: ${step}`}><Plus aria-hidden="true" /> {labels.add}</Button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="ghost" className="mt-2" disabled={saving !== null} onClick={() => setSuggestions([])}>{labels.dismiss}</Button>
      </section>
    )}
    </div>
  );
}

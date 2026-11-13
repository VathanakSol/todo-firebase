import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import type { TodoFilter } from "../types";

export function TodoFilters({ filter, onChange }: { filter: TodoFilter; onChange: (filter: TodoFilter) => void }) {
  const { t } = useLanguage();
  return (
    <div className="filters" role="group" aria-label={t.todos.filterTasks}>
      {(["all", "active", "completed"] as const).map((value) => (
        <Button key={value} variant="ghost" type="button" aria-pressed={filter === value} onClick={() => onChange(value)}>
          {t.todos.filters[value]}
        </Button>
      ))}
    </div>
  );
}

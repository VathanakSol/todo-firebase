"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "radix-ui";
import { useLanguage } from "@/lib/i18n";
import type { TodoPriority } from "../types";

const options: TodoPriority[] = ["low", "medium", "high"];

export function PrioritySelect({ value, onChange, badge = false }: { value: TodoPriority; onChange: (priority: TodoPriority) => void; badge?: boolean }) {
  const { t } = useLanguage();
  return (
    <Select.Root value={value} onValueChange={(next) => onChange(next as TodoPriority)}>
      <Select.Trigger aria-label={t.todos.taskPriority} className={badge ? `priority-select priority-select-badge priority-${value}` : "priority-select"}>
        {!badge && <span className={`priority-dot priority-dot-${value}`} aria-hidden="true" />}
        <Select.Value />
        <Select.Icon className="priority-chevron"><ChevronDown size={15} aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="priority-menu" position="popper" sideOffset={8} align="end" collisionPadding={12}>
          <Select.Viewport>
            <div className="priority-menu-label" aria-hidden="true">{t.todos.setPriority}</div>
            {options.map((option) => (
              <Select.Item className="priority-option" key={option} value={option}>
                <span className={`priority-option-icon priority-option-icon-${option}`} aria-hidden="true"><span className={`priority-dot priority-dot-${option}`} /></span>
                <span className="priority-option-copy"><Select.ItemText>{t.todos.priority[option]}</Select.ItemText><span className="priority-option-description">{t.todos.priorityDescription[option]}</span></span>
                <Select.ItemIndicator className="priority-option-check"><Check size={15} aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

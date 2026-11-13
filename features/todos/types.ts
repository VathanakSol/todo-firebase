export type TodoPriority = "low" | "medium" | "high";
export type Todo = { id: string; text: string; completed: boolean; priority: TodoPriority; /** Milliseconds since epoch; null for active tasks and tasks completed before this field existed. */ completedAt: number | null };
export type TodoFilter = "all" | "active" | "completed";

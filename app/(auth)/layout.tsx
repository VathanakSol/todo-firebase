import type { ReactNode } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";

// Shared layout for /login and /register. The (auth) folder is a route group,
// so it does not appear in the URL.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}

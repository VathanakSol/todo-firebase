import type { Metadata } from "next";
import { AuthGate } from "@/features/auth/components/auth-gate";

// The title and description come from the root layout.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <AuthGate />;
}

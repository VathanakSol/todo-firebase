import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "បង្កើតគណនី" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}

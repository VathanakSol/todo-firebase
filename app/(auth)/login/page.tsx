import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "ចូលគណនី",
  description: "ចូលគណនីកត់ទុករបស់អ្នក ដើម្បីបន្តបញ្ជីកិច្ចការ។ Sign in to Kot Tuk to continue your task list.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

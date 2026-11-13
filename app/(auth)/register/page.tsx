import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "បង្កើតគណនី",
  description: "បង្កើតគណនីកត់ទុក ហើយចាប់ផ្តើមបញ្ជីកិច្ចការរបស់អ្នក។ Create a Kot Tuk account and start your task list.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}

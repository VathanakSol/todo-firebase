import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/components/settings-page";

// A private page: search engines are asked not to list it.
export const metadata: Metadata = { title: "ការកំណត់", robots: { index: false, follow: false } };

export default function Settings() {
  return <SettingsPage />;
}

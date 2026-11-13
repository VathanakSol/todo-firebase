import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = { title: "ការកំណត់" };

export default function Settings() {
  return <SettingsPage />;
}

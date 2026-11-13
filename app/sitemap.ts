import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Served as /sitemap.xml: the pages a visitor can open without signing in.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/login`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/register`, changeFrequency: "yearly", priority: 0.5 },
  ];
}

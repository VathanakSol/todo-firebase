import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Served as /robots.txt. The settings page is private, so crawlers are asked to skip it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/settings" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/domain";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/login", "/auth/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

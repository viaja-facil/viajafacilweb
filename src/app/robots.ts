import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/reservas/", "/perfil/", "/booking/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"],
        allow: "/",
      },
    ],
    sitemap: "https://viajafacil.app/sitemap.xml",
  };
}

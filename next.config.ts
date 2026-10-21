import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Spanish lives at the root and English under /en. Every page is built under
  // app/[lang], so root paths are served from /es without changing the URL.
  async redirects() {
    return [
      // /es/... is the same page as /...: keep one address for it. (Image routes stay put.)
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/:path((?!.*opengraph-image).*)", destination: "/:path", permanent: true },
      // English addresses for the legal pages: one address each.
      { source: "/en/aviso-legal", destination: "/en/legal-notice", permanent: true },
      { source: "/en/privacidad", destination: "/en/privacy", permanent: true },
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        { source: "/", destination: "/es" },
        // The legal pages are built from their Spanish folders in both languages.
        { source: "/en/legal-notice", destination: "/en/aviso-legal" },
        { source: "/en/privacy", destination: "/en/privacidad" },
        // Anything that is not already under a language prefix.
        { source: "/:path((?!en(?:/|$)|es(?:/|$)).+)", destination: "/es/:path" },
      ],
    };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

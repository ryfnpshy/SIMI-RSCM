import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Semua rute dashboard bergantung pada sesi, jadi setiap halaman memang
    // memblokir saat navigasi (blocking-prerender-dynamic). Matikan validasi
    // implisit Cache Components supaya dev tidak melaporkannya sebagai error di
    // tiap halaman. Segmen yang kelak memakai `export const instant` tetap
    // divalidasi.
    instantInsights: { validationLevel: "manual-warning" },
  },
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/login", permanent: false }];
  },
};

export default nextConfig;

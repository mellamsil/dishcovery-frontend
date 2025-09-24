import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    // Use subpath only in production (e.g., GitHub Pages)
    base: isProd ? "/dishcovery-frontend/" : "/",
    plugins: [
      react(),
      {
        // After build, copy index.html → 404.html (for React Router on GitHub Pages)
        name: "copy-index-to-404",
        closeBundle() {
          try {
            copyFileSync("dist/index.html", "dist/404.html");
            console.log("404.html generated from index.html");
          } catch (err) {
            console.error("Failed to copy index.html to 404.html", err);
          }
        },
      },
    ],
    server: {
      port: 3000,
      proxy: {
        "/api": "http://localhost:5000",
      },
    },
  };
});

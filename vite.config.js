import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";

// https://vite.dev/config/
export default defineConfig({
  base: "/dishcovery-frontend/", // required for GitHub Pages
  plugins: [
    react(),
    {
      // Custom hook: copies index.html → 404.html after build
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
});

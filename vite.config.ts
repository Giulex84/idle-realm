import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  publicDir: "public", // forzato esplicitamente
  plugins: [react()],
  build: {
    copyPublicDir: true, // ⬅️ CHIAVE
  },
});

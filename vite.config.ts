import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Use relative asset paths so the built output works when served from
  // any subdirectory (e.g. Live Server, GitHub Pages, or opening via a file URL).
  base: "./",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});

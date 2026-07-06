import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/rachio-irrigation-card.ts",
      formats: ["es"],
      fileName: () => "rachio-irrigation-card.js",
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});

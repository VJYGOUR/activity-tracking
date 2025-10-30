import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// For React 19, you might not need the React plugin
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});

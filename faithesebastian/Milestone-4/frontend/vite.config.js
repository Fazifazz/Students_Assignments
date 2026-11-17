import { defineConfig } from "vite";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = Number(env.PORT) || 4001;

  return {
    root: "frontend",
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      proxy: {
        "/api": env.VITE_API_PROXY || `http://localhost:${apiPort}`
      }
    },
    build: {
      outDir: "dist",
      emptyOutDir: true
    }
  };
});

/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function resolvePort(mode: string, cwd: string): { port: number; strictPort: boolean } {
  const fromFiles = loadEnv(mode, cwd, "").PORT;
  const raw = process.env.PORT ?? fromFiles ?? "";
  const parsed = Number.parseInt(String(raw), 10);
  const port = Number.isFinite(parsed) && parsed > 0 ? parsed : 5173;
  const strictPort = String(raw).trim().length > 0;
  return { port, strictPort };
}

export default defineConfig(({ mode }) => {
  const { port, strictPort } = resolvePort(mode, process.cwd());

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
    server: {
      port,
      host: true,
      strictPort,
    },
    preview: {
      port,
      host: true,
      strictPort,
    },
  };
});

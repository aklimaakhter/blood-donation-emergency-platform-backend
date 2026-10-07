import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/vercel.ts" },
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "api",
  bundle: true,
  external: ["pg-native"],
});
// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/server.ts"],
//   format: ["esm"],
//   target: ["esnext"],
//   platform: "node",
//   outDir: "dist",
//   bundle: true,
//   minify: true,
//   banner: {
//     js: /* ts */ `
//    import { createRequire } from 'module';
//    const require = createRequire(import.meta.url);
//     `,
//   },
// });

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
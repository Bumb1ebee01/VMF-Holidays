import { defineConfig } from "vitest/config";

// Unit tests cover pure logic in `lib/` only — money math, access control, and
// business rules. No jsdom/React stack: nothing here renders a component, and
// leaving it out keeps the suite fast. Add @vitejs/plugin-react + jsdom if we
// ever test components (see node_modules/next/dist/docs/.../testing/vitest.md).
export default defineConfig({
  // Resolves the "@/..." alias from tsconfig — native in Vite 7+, no plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});

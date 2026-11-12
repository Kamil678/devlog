import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["backend/**/*.test.js"],
    environment: "node",
    hookTimeout: 60000,
    fileParallelism: false,
  },
});

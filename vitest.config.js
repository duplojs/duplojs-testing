import {defineConfig} from "vitest/config";

export default defineConfig({
	test: {
		watch: false,
		include: ["testing/**/*.test.ts"],
		globals: true,
		setupFiles: "testing/setup.ts",
		coverage: {
			provider: "istanbul",
			reporter: ["html", "text", "json-summary"],
			include: ["testing"]
		}
	},
});

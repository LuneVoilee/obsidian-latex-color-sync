import esbuild from "esbuild";

const args = process.argv.slice(2);
const isProduction = args.includes("production");
const isWatch = args.includes("--watch");

const ctx = await esbuild.context({
	entryPoints: ["src/main.js"],
	outfile: "main.js",
	bundle: true,
	format: "cjs",
	platform: "node",
	target: "es2018",
	sourcemap: isProduction ? false : "inline",
	legalComments: "none",
	external: ["obsidian", "electron", "@codemirror/state", "@codemirror/view", "@codemirror/language"]
});

try {
	if (isWatch) {
		await ctx.watch();
		console.log("[esbuild] watching src/** and outputting main.js");
	} else {
		await ctx.rebuild();
		await ctx.dispose();
		console.log("[esbuild] built main.js");
	}
} catch (error) {
	await ctx.dispose();
	console.error("[esbuild] build failed");
	console.error(error);
	process.exit(1);
}

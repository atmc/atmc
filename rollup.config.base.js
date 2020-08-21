import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import replace from "@rollup/plugin-replace";
import * as path from "path";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

const tsPlugin = ts({
	transpiler: "babel",
	cwd: path.join(__dirname, "../.."),
	tsconfig: path.join(__dirname, "tsconfig.json"),
});

const externals = ["@atmc/core", "@atmc/css", "@atmc/gatsby-plugin", "@atmc/ssr"];

const plugins = [
	tsPlugin,
	resolve({
		browser: true,
		extensions: ["*", ".mjs", ".js", ".json", ".ts", ".tsx"],
	}),
	commonjs({
		include: /node_modules/,
	}),
];

export function buildNode(entryFile = "./src/index.ts") {
	return [
		{
			input: entryFile,
			output: [
				{
					file: `./dist/bundle.mjs`,
					format: "esm",
				},
				{
					file: `./dist/bundle.js`,
					format: "cjs",
					externalLiveBindings: false,
				},
			],
			plugins: [...plugins, terser()],
			external: [/^@babel\/runtime\//, ...externals],
		},
	];
}

export function buildDeno(entryFile = "./src/index.ts") {
	return [
		{
			input: entryFile,
			output: {
				file: `./dist/bundle.mjs`,
				format: "esm",
				banner: `/// <reference types="./dist/bundle.d.ts" />`,
			},
			plugins: [
				...plugins,
				replace({
					"process.env.NODE_ENV": "production",
					"typeof window": "typeof document",
				}),
			],
			external: [/^@babel\/runtime\//, ...externals],
		},
	];
}

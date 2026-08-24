import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import { glob } from "glob";

// Get all TypeScript files in src, excluding test files
const inputFiles = glob.sync("src/**/*.ts", {
  ignore: ["src/**/*.test.ts", "src/**/*.spec.ts", "**/vitest.setup.ts"],
});

// Create input object with file names as keys and paths as values
const input = inputFiles.reduce((acc, file) => {
  const relativePath = path.relative("src", file);
  const key = relativePath.replace(path.extname(relativePath), "");
  acc[key] = file;
  return acc;
}, {});

// CommonJS build
const cjsConfig = {
  input,
  output: {
    dir: "dist",
    format: "cjs",
    entryFileNames: "[name].js",
    chunkFileNames: "[name]-[hash].js",
    exports: "named",
    preserveModules: true,
    preserveModulesRoot: "src",
    interop: "auto",
  },
  plugins: [
    resolve(),
    commonjs(),
    esbuild({
      target: "es2020",
      minify: true,
    }),
  ],
};

// ESM build
const esmConfig = {
  input,
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name].mjs",
    chunkFileNames: "[name]-[hash].mjs",
    exports: "named",
    preserveModules: true,
    preserveModulesRoot: "src",
    interop: "auto",
    generatedCode: {
      symbols: true,
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    esbuild({
      target: "es2020",
      minify: true,
    }),
  ],
};

// UMD build (Standalone for browsers)
const umdConfig = {
  input: "src/index.ts",
  output: {
    file: "dist/ecosy-logger.umd.js",
    format: "umd",
    name: "EcosyLogger", // Global variable attached to window
    sourcemap: true,
    exports: "named",
  },
  plugins: [
    resolve(),
    commonjs(),
    esbuild({
      target: "es2020",
      minify: true,
    }),
  ],
};

export default [cjsConfig, esmConfig, umdConfig];

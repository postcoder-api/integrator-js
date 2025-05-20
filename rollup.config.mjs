import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-import-css";

const config = {
  input: "src/index.ts",
  output: {
    file: "build/integrator.min.js",
  },
  plugins: [
    css({ minify: true }),
    babel({
      babelHelpers: "bundled",
      extensions: [".ts"],
    }),
    typescript(),
  ],
};

export default config;

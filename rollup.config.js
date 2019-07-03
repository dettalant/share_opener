import typescript from "rollup-plugin-typescript2";
import buble from "rollup-plugin-buble";
import { uglify } from "rollup-plugin-uglify";

const plugins = [
  typescript(),
  buble(),
];

let fileName = "./dist/share_opener";

if (process.env.NODE_ENV === "production") {
  fileName += ".min";
  plugins.push(uglify())
}

export default {
  input: "./src/index.ts",
  output: {
    file: fileName + ".js",
    format: "iife",
    name: "share_opener",
  },
  plugins
};

import { Configuration } from "webpack";
import { resolve } from "path";

export default () => {
  const config: Configuration = {
    entry: {
      index: "./src/index.ts"
    },
    output: {
      path: resolve(__dirname, "./dist"),
      libraryTarget: "commonjs"
    },
    mode: "production",
    // devtool: "source-map",
    target: "node",
    resolve: {
      extensions: [".js", ".ts", ".json"]
    },
    externals: [],
    node: {
      fs: true,
      net: true,
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    }
  };
  return config;
};

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  resolve: {
    extensions: [".js", ".jsx"], // 이렇게 추가해주면 밑에서 확장자를 적어주지 않아도 알아서 맞는 파일을 잘 찾는다.
  },
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "build"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        loader: "file-loader",
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "babel-loader",
        exclude: "/node_modules",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-private-property-in-object", "@babel/plugin-transform-private-property-in-object"],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      template: "./public/index.html",
      filename: "index.html",
      chunks: ["css", "index", "app", "system", "monitor"],
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  stats: {
    errorDetails: true,
  },
};

import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import "webpack-dev-server";
import dotenv from "dotenv";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const webpackConfig = (argv: { mode: string }): webpack.Configuration => {
  //.env.local 파일에서 환경변수 로드
  dotenv.config({ path: "./.env.local" });

  const isProduction = argv.mode === "production";

  const config: webpack.Configuration = {
    mode: isProduction ? "production" : "development",
    entry: ["./src/index.ts", "./src/styles/style.css"],
    devtool: isProduction ? "source-map" : "eval-source-map",
    devServer: {
      static: "./dist",
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      usedExports: true,
      sideEffects: true,
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        minify: isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "[name].[contenthash].css" : "[name].css",
      }),
      new CopyPlugin({
        patterns: [{ from: "assets", to: "images" }],
      }),
      new webpack.EnvironmentPlugin(["APP_SERVICE_KEY", "KAKAO_REST_API_KEY"]),
    ],
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "[name].bundle.js",
      chunkFilename: isProduction
        ? "[name].[contenthash].js"
        : "[name].chunk.js",
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "images/[name][ext]",
      clean: true,
    },
  };

  return config;
};

export default webpackConfig;

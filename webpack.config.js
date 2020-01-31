const path = require("path");
const webpack = require("webpack");
const fg = require("fast-glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

const isDevMode = process.env.NODE_ENV === "development";

const config = {
    devtool: isDevMode ? "eval-source-map" : false,
    context: path.resolve(__dirname, "./src"),
    entry: {
        sidebar: "./sidebar/index.js",
        background: "./background/index.js",
        contentscripts: "./contentscripts/index.js"
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: ".",
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    extractCSS: !isDevMode
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                use: [
                    isDevMode
                        ? "vue-style-loader"
                        : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    isDevMode
                        ? "vue-style-loader"
                        : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader?indentedSyntax"
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    isDevMode
                        ? "vue-style-loader"
                        : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "stylus-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    isDevMode
                        ? "vue-style-loader"
                        : MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
            bulma$: "bulma/css/bulma.css"
        }
        // extensions: ['.js'],
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyWebpackPlugin([
            { from: "assets", to: "assets" },
            { from: "manifest.json", to: "manifest.json", flatten: true }
        ]),
        new HtmlWebpackPlugin({
            title: "Popup",
            template: "./index.html",
            filename: "sidebar.html",
            chunks: ["sidebar"]
        })
    ]
};

/**
 * Adjust rendererConfig for production settings
 */
if (isDevMode) {
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new ExtensionReloader({
            contentScript: "contentScripts",
            background: "background",
            extensionPage: "sidebar"
        })
    );
} else {
    config.plugins.push(
        new ScriptExtHtmlWebpackPlugin({
            async: [/runtime/],
            defaultAttribute: "defer"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new PurgecssPlugin({
            paths: fg.sync([`./src/**/*`], {
                onlyFiles: true,
                absolute: true
            })
        })
        // new CopyWebpackPlugin([
        //   {
        //     from: path.join(__dirname, '../src/data'),
        //     to: path.join(__dirname, '../dist/data'),
        //   },
        // ])
    );
}

module.exports = config;

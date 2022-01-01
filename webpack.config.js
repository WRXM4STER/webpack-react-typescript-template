const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const getBabelOptions = (preset) => {
    const presets = [
        '@babel/preset-env',
        "@babel/preset-react"
    ]
    if (preset) presets.push(preset)
    return {
        presets,
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }
}

module.exports = {
    context:path.resolve(__dirname,"src"),
    entry:{
        main:['@babel/polyfill','./index.tsx']
    },
    output:{
        path:path.resolve(__dirname,'build'),
        filename:'[name].[contenthash].js',
        clean:true
    },
    resolve:{
        extensions:['.js','.jsx',".png",'.ts','.tsx'],
        alias:{
            Assets:path.resolve(__dirname,"src/assets/")
        }
    },
    optimization:{
        splitChunks: {
            chunks:"all"
        },
        minimize: true,
        minimizer:[
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    },
    devServer: {
        port:3000
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:path.resolve(__dirname,"public/index.html")
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname,"public/favicon.ico"), to: path.resolve(__dirname,"build") }
            ],
        }),
        new MiniCssExtractPlugin({
            filename:'[name].[contenthash].css'
        })
    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,"css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: getBabelOptions()
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: getBabelOptions()
                }
            },
            {
                test: /\.ts?x$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: getBabelOptions("@babel/preset-typescript")
                }
            }
        ]
    }
}
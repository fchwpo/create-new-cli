const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const production = process.env.NODE_ENV == 'production';
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    entry: './src/components/index.jsx',
    mode: production ? 'production' : 'development',
    ...(!production && { devtool: 'source-map' }),
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff|woff2|svg|gif|otf)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: function name(fileName) {
                            fileName = fileName.replace(
                                /.*(node_modules|src\/font)\//i,
                                '',
                            );
                            fileName = fileName.replace(
                                /\.(.+)/,
                                '.[contenthash:8].$1?1-VZJ-ver',
                            );
                            return fileName;
                        },
                        publicPath: '../',
                    },
                },
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            publicPath: '/',
        }),
        new MiniCssExtractPlugin({
            filename: `styles/${
                production ? '' : 'dev.'
            }[name].[contenthash:8].css`,
        }),
    ],
};

var path = require('path');
var mainPath = path.resolve(__dirname, 'js', 'index.js');
var autoprefixer = require('autoprefixer');
var Dotenv = require('dotenv-webpack');

module.exports = {
    entry: ['babel-polyfill', mainPath],
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'http://localhost:9090/assets/',
        filename: 'bundle.js',
    },
    mode: 'development',
    resolve: {
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function() {
                            return [autoprefixer];
                        },
                    },
                }, {
                    loader: 'less-loader',
                    options: {
                        globalVars: {
                            nodeModulesPath: '~',
                            coreModulePath: '~',
                        },
                    },
                }],
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'env', 'babel-preset-stage-0'],
                    },
                }],
            },
            {
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                use: [{
                    loader: 'svg-url-loader',
                }],
            },
        ],
    },
    devServer: {
        stats: 'errors-only',
        disableHostCheck: true,
    },
    plugins: [
        new Dotenv(),
    ],
};

var Webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'dist/resources');
var mainPath = path.resolve(__dirname, 'js', 'index.js');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var autoprefixer = require('autoprefixer');
var Dotenv = require('dotenv-webpack');

var config = function () {
    var extractLess = new MiniCssExtractPlugin({
        filename: 'styles.css',
        disable: false,
    });

    return {
        // We change to normal source mapping
        devtool: 'source-map',
        entry: ['babel-polyfill', mainPath],
        output: {
            path: buildPath,
            filename: 'bundle-prod.js',
        },
        mode: 'production',
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
                        loader: MiniCssExtractPlugin.loader,
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
        plugins: [
            extractLess,
            new Webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
            }),
            new Dotenv(),
        ],
    };
};

module.exports = config;

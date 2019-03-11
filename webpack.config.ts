var LiveReloadPlugin = require('webpack-livereload-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = [
    {
        entry: [
            "babel-polyfill",
            './client/agent.jsx'
        ],
        module: {
            rules: [{
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            }, {
                test: /\.html$/,
                use: [
                    {
                    loader: "html-loader"
                    }
                ]
            }]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        output: {
            path: __dirname + '/public/js',
            filename: 'agent.js'
        },
        plugins: [
            new LiveReloadPlugin({
                ignore : '.ts$'
            }),
            new HtmlWebPackPlugin({
              template: "./html/agent.html",
              filename: __dirname + '/public/agent.html'
            })
        ],
        devtool: 'source-map'
    },
    {
        entry: [
            "babel-polyfill",
            './client/user.jsx'
        ],
        module: {
            rules: [{
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            }, {
                test: /\.html$/,
                use: [
                    {
                    loader: "html-loader"
                    }
                ]
            }]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        output: {
            path: __dirname + '/public/js',
            filename: 'user.js'
        },
        plugins: [
            new LiveReloadPlugin({
                ignore : '.ts$'
            }),
            new HtmlWebPackPlugin({
              template: "./html/user.html",
              filename: __dirname + '/public/user.html'
            })
        ],
        devtool: 'source-map'
    }
];

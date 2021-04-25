const webpack = require('webpack');
const RemoveSourceMapUrlWebpackPlugin = require('@rbarilani/remove-source-map-url-webpack-plugin');

module.exports = {
    watch: true,
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'main.bundle.js',
        clean: true
    },

    // https://stackoverflow.com/questions/15097945/do-source-maps-work-for-chrome-extensions/23438324#23438324
    // https://bugs.chromium.org/p/chromium/issues/detail?id=212374
    // devtool: 'source-map',
    devtool: false,

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    plugins: [
        // https://stackoverflow.com/questions/42196819/disable-hide-download-the-react-devtools/48324794#48324794
        new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
        }),

        new RemoveSourceMapUrlWebpackPlugin({
            test: /main\.bundle\.js$/
        })
    ]
};

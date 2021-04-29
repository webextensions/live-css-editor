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
    devtool: false,                             // Recommended for production mode for a WebExtension
    // devtool: 'eval-cheap-module-source-map', // Recommended for development mode for a webpage/WebExtension
    // devtool: 'source-map',                   // Recommended for production mode for a webpage (this mode does not work well for a WebExtension)

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader' //,
                    // 'eslint-loader'
                ]
            }
        ]
    },

    plugins: [
        // https://stackoverflow.com/questions/42196819/disable-hide-download-the-react-devtools/48324794#48324794
        new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
        }),

        // This plugin is useful for removing (unwanted) sourcemap references. Which otherwise can lead to warnings in
        // console.
        // For example:
        //     When including some libraries, there might be references to "//# sourceMappingURL=..." which might not be
        //     possible to load / map-into-another-form for WebExtensions (Ref:
        //     https://bugs.chromium.org/p/chromium/issues/detail?id=212374)
        //
        //     Without this plugin, if you import 'react-command-palette' (Ref:
        //     https://www.unpkg.com/react-command-palette@0.16.2/dist/index.js) and the sourcemap reference from inside
        //     that library file (eg: "//# sourceMappingURL=index.js.map") is not transformed into another appropriate
        //     sourcemap (probably because sourcemaps are kept disabled when building for WebExtension), then it would
        //     attempt to load the sourcemap from an invalid path which would lead to a warning in console.
        new RemoveSourceMapUrlWebpackPlugin({
            test: /main\.bundle\.js$/
        })
    ]
};

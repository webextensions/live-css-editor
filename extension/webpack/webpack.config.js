const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveSourceMapUrlWebpackPlugin = require('@rbarilani/remove-source-map-url-webpack-plugin');

const copyWebpackPlugin = require('copy-webpack-plugin');

const notifyCompletionStatus = require('./utils/notify-completion-status.js');

const projectRoot = path.join(__dirname, '..');
const nodeModulesAtProjectRoot = path.resolve(projectRoot, 'node_modules');

const BABEL_OPTIONS = {
    // plugins: ['transform-es2015-modules-commonjs'],

    presets: [
        [
            "@babel/preset-env",
            {
                // Webpack understands the native import syntax, and uses it for tree shaking
                // https://babeljs.io/docs/en/babel-preset-env#modules
                // https://webhint.io/docs/user-guide/hints/hint-webpack-config/modules-false-babel/
                modules: false,

                // Currently, we wish to keep the transpilation to minimum, hence we are using this configuration for "browsers"
                // https://babeljs.io/docs/en/babel-preset-env#targets
                targets: {
                    // firefox: '68',
                    // chrome: '83'

                    browsers: [
                        "last 7 chrome versions",
                        "last 10 firefox versions",
                        "firefox esr"
                    ]
                    // "browsers": ["> 0.5%, last 2 versions, Firefox ESR, not dead"]
                    // Online REPL:
                    //     https://browserl.ist/
                }
            }
        ],
        '@babel/preset-react'
    ]
};

module.exports = function (env) {
    const build = env && env.build || {};
    const watch = build.watch || false;
    const buildFor = build.buildFor || 'publish'; // 'web' / 'development' / 'publish'

    const webpackConfig = {
        watch,
        watchOptions: {
            aggregateTimeout: 250
        },
        mode: 'development',
        entry: {
            main: './src/main.js',
            'background-magicss': './background-magicss.js',
            'alert': './alert.js',
            options: './src/options/options.js',
            'load-editor': './scripts/load-editor.js',
            'external-editor-base': './external-editor-base.js',
            'load-reapply': './scripts/load-reapply.js'
        },
        output: {
            path: __dirname + '/../../extension-dist/dist',
            publicPath: '/',
            filename: '[name].bundle.js',
            clean: true
        },

        // https://stackoverflow.com/questions/15097945/do-source-maps-work-for-chrome-extensions/23438324#23438324
        // https://bugs.chromium.org/p/chromium/issues/detail?id=212374
        devtool: (function () {
            // Note: Getting the same value for `devtool` to work for `CSS` and `JS` does not seem to be working.
            //       'source-map' works for `CSS`, but not for `JS` (for a WebExtension).
            //       'eval-cheap-module-source-map' does not work for `CSS`.

            if (buildFor === 'web') {
                return 'source-map';                      // This mode does not work for a WebExtension
            } else if (buildFor === 'development') {
                // return 'eval-cheap-module-source-map'; // Recommended for development mode for a WebExtension Manifest V2
                // return 'eval-source-map';              // Recommended for development mode for a WebExtension Manifest V2
                return 'inline-source-map';               // Recommended for development mode for a WebExtension Manifest V2 / V3
            } else { // buildFor === 'publish'
                return false;                             // Recommended for production mode for a WebExtension
            }
        })(),

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    // exclude: /node_modules/,
                    exclude: function (modulePath) {
                        if (modulePath.indexOf(nodeModulesAtProjectRoot) === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    use: [
                        {
                            loader: 'babel-loader',
                            options: BABEL_OPTIONS
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.png$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.css$/,
                    use: [
                        // {
                        //     loader: MiniCssExtractPlugin.loader
                        // },
                        MiniCssExtractPlugin.loader,
                        //
                        // 'css-loader'
                        {
                            // https://adamrackis.dev/css-modules/
                            loader: 'css-loader',
                            options: {
                                // sourceMap: true, // The sourcemap generation (with relatively simple configuration)
                                //                  // depends on `devtool` option's value, which has some issues (added
                                //                  // note under the `devtool` option)
                                // https://webpack.js.org/loaders/css-loader/#object-2
                                modules: {
                                    // auto: function (resourcePath) {
                                    //     if (
                                    //         // TODO: Create a separate "vendor.css" or similarly named file
                                    //         resourcePath.indexOf('frontend/node_modules/')             >= 0 ||
                                    //         resourcePath.indexOf('frontend/src/resources/3rdparty/')   >= 0
                                    //     ) {
                                    //         return false;
                                    //     } else {
                                    //         return true;
                                    //     }
                                    // },
                                    auto: function (resourcePath) {
                                        if (
                                            // // TODO: Create a separate "vendor.css" or similarly named file
                                            resourcePath.includes('extension/scripts/') ||
                                            resourcePath.includes('extension/src/node_modules/Loading/Loading.css')
                                        ) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    },
                                    localIdentName: '[name]__[local]--[hash:base64:5]'
                                }
                            }
                        }
                    ]
                },
            ]
        },

        optimization: {
            minimize: false,
            usedExports: true,
            innerGraph: true
        },

        resolve: {
            fallback: {
                // Required to remove a warning where webpack says that it doesn't automatically polyfill native node
                // modules ('crypto' in this case)
                crypto: false
            }
        }
    };

    const plugins = [
        // https://stackoverflow.com/questions/42196819/disable-hide-download-the-react-devtools/48324794#48324794
        new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
        }),

        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
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
        }),

        // https://webpack.js.org/api/compiler-hooks/#hooks
        // https://github.com/kossnocorp/on-build-webpack/issues/5#issuecomment-432192978
        // https://stackoverflow.com/questions/30312715/run-command-after-webpack-build/49786887#49786887
        ({
            apply: (compiler) => {
                compiler.hooks.done.tap('done', (stats) => {
                    notifyCompletionStatus(stats);
                });
            }
        })
    ];

    // Just a block
    {
        const projectRoot = path.resolve(__dirname, '..', '..');
        const extensionRoot = path.resolve(projectRoot, 'extension');
        const targetExtensionDir = path.resolve(projectRoot, 'extension-dist');
        plugins.push(
            new copyWebpackPlugin(
                {
                    patterns: (function () {
                        const arr = [
                            { from: path.join(extensionRoot, 'README-FOR-EXTENSION-REVIEWERS.md'),        to: targetExtensionDir                           },
                            { from: path.join(extensionRoot, 'external-editor.css'),                      to: targetExtensionDir                           },
                            { from: path.join(extensionRoot, 'external-editor-base.js'),                  to: targetExtensionDir                           },
                            { from: path.join(extensionRoot, '*.html'),                                   to: targetExtensionDir                           },
                            { from: path.join(extensionRoot, 'manifest*.json'),                           to: targetExtensionDir                           },
                            { from: path.join(extensionRoot, 'icons/*.png'),                              to: path.resolve(targetExtensionDir)             },
                            { from: path.join(extensionRoot, 'icons/*.svg'),                              to: path.resolve(targetExtensionDir)             },
                            { from: path.join(extensionRoot, '_locales'),                                 to: path.resolve(targetExtensionDir, '_locales') },
                            { from: path.join(extensionRoot, 'scripts', 'appVersion.js'),                 to: path.resolve(targetExtensionDir, 'scripts', 'appVersion.js') },
                            { from: path.join(extensionRoot, 'scripts', 'platformInfoOs-android.js'),     to: path.resolve(targetExtensionDir, 'scripts', 'platformInfoOs-android.js') },
                            { from: path.join(extensionRoot, 'scripts', 'platformInfoOs-non-android.js'), to: path.resolve(targetExtensionDir, 'scripts', 'platformInfoOs-non-android.js') },
                            {
                                from: path.join(extensionRoot,       'scripts', '3rdparty', 'basic-less-with-sourcemap-support.browserified.js'),
                                to: path.resolve(targetExtensionDir, 'scripts', '3rdparty', 'basic-less-with-sourcemap-support.browserified.js')
                            },
                            {
                                // Sass
                                from: path.join(extensionRoot,       'scripts', '3rdparty', 'sass', 'sass.sync.min.js'),
                                to: path.resolve(targetExtensionDir, 'scripts', '3rdparty', 'sass', 'sass.sync.min.js')

                            }
                        ];
                        return arr;
                    }())
                },
                {
                    copyUnmodified: false
                }
            )
        );
    }

    webpackConfig.plugins = plugins;

    return webpackConfig;
};

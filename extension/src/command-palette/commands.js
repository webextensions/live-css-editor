/* global extLib */

const commands = (
    [
        (function () {
            var editor = window.MagiCSSEditor;

            const iconOb = window.execIconToShowForRateUs(editor);

            const
                CHROME  = 'chrome',
                EDGE    = 'edge',
                FIREFOX = 'firefox',
                OPERA   = 'opera',
                handledBrowsers = [CHROME, EDGE, FIREFOX, OPERA];
            if (
                iconOb &&
                handledBrowsers.includes(iconOb.browser) &&
                iconOb.href
            ) {
                const commandOb = {};
                const {
                    browser,
                    href
                } = iconOb;

                let name,
                    iconCls;
                if (browser === 'chrome') {
                    name = 'Rate us on Chrome Web Store';
                    iconCls = 'magicss-use-icon-chrome';
                } else if (browser === 'edge') {
                    name = 'Rate us on Microsoft Store';
                    iconCls = 'magicss-use-logo-microsoft-store-gray';
                } else if (browser === 'firefox') {
                    name = 'Rate us on Firefox Add-ons Store';
                    iconCls = 'magicss-use-logo-firefox-add-ons-store-gray';
                } else if (browser === 'opera') {
                    name = 'Rate us on Opera Add-ons Store';
                    iconCls = 'magicss-use-logo-opera-add-ons-store-gray';
                }
                commandOb.name = name;
                commandOb.iconCls = iconCls;

                commandOb.command = function () {
                    window.open(href);
                };

                return commandOb;
            } else {
                return null;
            }
        })(),
        ...(function () {
            // TODO: DUPLICATE: Code duplication for browser detection in commands.js, ext-lib.js, magicss.js and options.js
            var isChrome = false,
                isEdge = false,
                isFirefox = false,
                isOpera = false,
                isChromiumBased = false;

            // Note that we are checking for "Edg/" which is the test required for identifying Chromium based Edge browser
            if (/Edg\//.test(navigator.appVersion)) {           // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
                isEdge = true;
            } else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
                isOpera = true;
            } else if (/Chrome/.test(navigator.appVersion)) {
                isChrome = true;
            } else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
                isFirefox = true;
            }
            if (isEdge || isOpera || isChrome) {
                isChromiumBased = true; // eslint-disable-line no-unused-vars
            }

            var extensionUrl = {
                chrome: 'https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol',
                edge: 'https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg',
                firefox: 'https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/',
                opera: 'https://addons.opera.com/extensions/details/live-editor-for-css-and-less-magic-css/'
            };

            return [
                {
                    skip: isChrome ? true : false,
                    name: 'Magic CSS for Chrome',
                    iconCls: 'magicss-use-icon-chrome',
                    command() {
                        window.open(extensionUrl.chrome);
                    }
                },
                {
                    skip: isEdge ? true : false,
                    name: 'Magic CSS for Edge',
                    iconCls: 'magicss-use-icon-edge-gray',
                    command() {
                        window.open(extensionUrl.edge);
                    }
                },
                {
                    skip: isFirefox ? true : false,
                    name: 'Magic CSS for Firefox',
                    iconCls: 'magicss-use-icon-firefox-gray',
                    command() {
                        window.open(extensionUrl.firefox);
                    }
                },
                {
                    skip: isOpera ? true : false,
                    name: 'Magic CSS for Opera',
                    iconCls: 'magicss-use-logo-opera-gray',
                    command() {
                        window.open(extensionUrl.opera);
                    }
                }
            ];
        }()),
        {
            name: window.flagAllowSassUi ? 'Convert this code from Less/Sass to CSS' : 'Convert this code from Less to CSS',
            iconCls: 'magicss-less-or-sass-to-css',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;

                    await window.execConvertToCssAction(editor);
                });
            }
        },
        {
            name: 'Beautify code',
            iconCls: 'magicss-use-icon-beautify-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;

                    await window.execBeautifyCssAction(editor);
                });
            }
        },
        {
            name: 'Minify code',
            iconCls: 'magicss-use-icon-minify-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;

                    await window.execMinifyCssAction(editor);
                });
            }
        },

        {
            id: 'show-line-numbers',
            name: 'Show line numbers',
            iconCls: 'magicss-use-icon-show-line-numbers-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execShowLineNumbersAction(editor);
                });
            }
        },
        {
            id: 'hide-line-numbers',
            name: 'Hide line numbers',
            iconCls: 'magicss-use-icon-hide-line-numbers-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execHideLineNumbersAction(editor);
                });
            }
        },

        {
            id: 'enable-css-linting',
            name: 'Enable CSS linting',
            iconCls: 'magicss-use-icon-enable-css-linting-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execEnableCssLintingAction(editor);
                });
            }
        },
        {
            id: 'disable-css-linting',
            name: 'Disable CSS linting',
            iconCls: 'magicss-use-icon-disable-css-linting-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execDisableCssLintingAction(editor);
                });
            }
        },

        {
            name: 'Tweet',
            iconCls: 'magicss-use-logo-twitter-gray',
            command() {
                const extensionUrl = window.extensionUrl;
                const url = 'http://twitter.com/intent/tweet?url=' + encodeURIComponent(extensionUrl.forThisBrowser) + '&text=' + encodeURIComponent(extLib.TR('Extension_Name', 'Live editor for CSS, Less & Sass - Magic CSS')) + ' (for Chrome%2C Edge %26 Firefox) ... web devs check it out!&via=webextensions';
                window.open(url);
            }
        },
        {
            name: 'Share',
            iconCls: 'magicss-use-logo-facebook-gray',
            command() {
                const extensionUrl = window.extensionUrl;
                const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(extensionUrl.forThisBrowser);
                window.open(url);
            }
        },
        {
            name: 'Contribute / Report issue',
            iconCls: 'magicss-use-logo-github-gray',
            command() {
                window.open('https://github.com/webextensions/live-css-editor');
            }
        },
        {
            name: 'More options',
            iconCls: 'magicss-options',
            command() {
                var editor = window.MagiCSSEditor;
                window.execMoreOptionsAction(editor);
            }
        }
    ]
)
    .filter(x => x)
    .filter(function (item) {
        if (item.skip) {
            return false;
        } else {
            return true;
        }
    });

export { commands };

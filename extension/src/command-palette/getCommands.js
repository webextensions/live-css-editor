import { getBrowser } from 'helpmate/dist/browser/getBrowser.js';
import {
    isCopyToClipboardSupported,
    copyToClipboard
} from 'helpmate/dist/browser/copyToClipboard.js';

import { sendMessageForGa } from '../../scripts/magicss/metrics/sendMessageForGa.js';

import { TR } from '../../scripts/utils/i18n.js';
import { alertNote } from '../../scripts/utils/alertNote.js';

import {
    APP_$_OPEN_SEARCH_ICONS
} from 'reducers/actionTypes.js';

const timeout = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const forceBlur = async function () {
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.visibility = 'hidden';
    input.style.opacity = '0';

    document.body.appendChild(input);
    input.focus();
    await timeout(0);
    document.body.removeChild(input);
};

const extensionUrl = {
    chrome: 'https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg',
    firefox: 'https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/',
    opera: 'https://addons.opera.com/extensions/details/live-editor-for-css-and-less-magic-css/'
};
const getExecIconToShowForRateUs = async function () {
    let icon = null;
    const browserDetails = await getBrowser();
    const browserName = browserDetails.name;
    if (
        browserName === 'chrome' ||
        browserName === 'edge' ||
        browserName === 'firefox' ||
        browserName === 'opera'
    ) {
        if (browserName === 'chrome') {
            icon = {
                browser: 'chrome',
                href: extensionUrl.chrome + '/reviews'
            };
        } else if (browserName === 'edge') {
            icon = {
                browser: 'edge',
                href: extensionUrl.edge
            };
        } else if (browserName === 'firefox') {
            icon = {
                browser: 'firefox',
                href: extensionUrl.firefox + 'reviews/'
            };
        } else if (browserName === 'opera') {
            icon = {
                browser: 'opera',
                href: extensionUrl.opera + '#feedback-container'
            };
        }
    }
    return icon;
};

const getCommands = async (setRefreshedAt) => (
    [
        await (async function () {
            const iconOb = await getExecIconToShowForRateUs();

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
                    operationId,
                    iconCls;
                if (browser === 'chrome') {
                    name = 'Rate us on Chrome Web Store';
                    operationId = 'rate-on-chrome-web-store';
                    iconCls = 'magicss-use-icon-chrome';
                } else if (browser === 'edge') {
                    name = 'Rate us on Microsoft Store';
                    operationId = 'rate-on-microsoft-store';
                    iconCls = 'magicss-use-logo-microsoft-store-gray';
                } else if (browser === 'firefox') {
                    name = 'Rate us on Firefox Add-ons Store';
                    operationId = 'rate-on-firefox-web-store';
                    iconCls = 'magicss-use-logo-firefox-add-ons-store-gray';
                } else if (browser === 'opera') {
                    name = 'Rate us on Opera Add-ons Store';
                    operationId = 'rate-on-opera-add-ons-store',
                    iconCls = 'magicss-use-logo-opera-add-ons-store-gray';
                }
                commandOb.name = name;
                commandOb.operationId = operationId;
                commandOb.iconCls = iconCls;

                commandOb.command = function () {
                    window.open(href);

                    sendMessageForGa(['_trackEvent', 'commandPalette', 'rateUsOn_' + browser]);
                };

                return commandOb;
            } else {
                return null;
            }
        })(),

        {
            name: 'Get icons',
            isNew: true,
            iconCls: 'magicss-use-logo-thenounproject-gray',
            command() {
                setTimeout(async function () {
                    await forceBlur();

                    window.redux_store.dispatch({
                        type: APP_$_OPEN_SEARCH_ICONS
                    });

                    sendMessageForGa(['_trackEvent', 'commandPalette', 'openGetIcon']);
                });
            }
        },

        {
            operationId: 'less-or-sass-to-css',
            name: window.flagAllowSassUi ? 'Convert this code from Less/Sass to CSS' : 'Convert this code from Less to CSS',
            iconCls: 'magicss-less-or-sass-to-css',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;

                    await window.execConvertToCssAction(editor);

                    sendMessageForGa(['_trackEvent', 'commandPalette', 'lessOrSassToCss']);
                });
            }
        },
        {
            operationId: 'beautify-code',
            name: 'Beautify code',
            iconCls: 'magicss-use-icon-beautify-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;

                    await window.execBeautifyCssAction(editor);

                    sendMessageForGa(['_trackEvent', 'commandPalette', 'beautifyCode']);
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

                    sendMessageForGa(['_trackEvent', 'commandPalette', 'minifyCode']);
                });
            }
        },

        {
            skip: isCopyToClipboardSupported() ? false : true,
            operationId: 'copy-code',
            name: 'Copy code',
            iconCls: 'magicss-use-icon-copy-gray',
            command() {
                setTimeout(async function () {
                    const editor = window.MagiCSSEditor;
                    const textValue = editor.getTextValue();

                    if (textValue) {
                        const flag = await copyToClipboard(textValue);
                        if (flag) {
                            alertNote('Copied code to clipboard', 2500);
                            sendMessageForGa(['_trackEvent', 'commandPalette', 'copiedCodeToClipboard']);
                        } else {
                            alertNote('Failed to copy to clipboard', 2500);
                            sendMessageForGa(['_trackEvent', 'commandPalette', 'failedToCopyCodeToClipboard']);
                        }
                    } else {
                        alertNote('There is no code to copy', 2500);
                        sendMessageForGa(['_trackEvent', 'commandPalette', 'noCodeToCopyToClipboard']);
                    }
                });
            }
        },

        {
            id: 'show-line-numbers',
            operationId: 'toggle-line-numbers',
            name: 'Show line numbers',
            iconCls: 'magicss-use-icon-show-line-numbers-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execShowLineNumbersAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'showLineNumbers']);
                    setRefreshedAt(Date.now());
                });
            }
        },
        {
            id: 'hide-line-numbers',
            operationId: 'toggle-line-numbers',
            name: 'Hide line numbers',
            iconCls: 'magicss-use-icon-hide-line-numbers-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execHideLineNumbersAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'hideLineNumbers']);
                    setRefreshedAt(Date.now());
                });
            }
        },

        {
            id: 'enable-line-wrap',
            operationId: 'toggle-line-wrap',
            name: 'Enable line wrap',
            iconCls: 'magicss-use-icon-enable-line-wrap-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execEnableLineWrapAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'enableLineWrap']);
                    setRefreshedAt(Date.now());
                });
            }
        },
        {
            id: 'disable-line-wrap',
            operationId: 'toggle-line-wrap',
            name: 'Disable line wrap',
            iconCls: 'magicss-use-icon-disable-line-wrap-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execDisableLineWrapAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'disableLineWrap']);
                    setRefreshedAt(Date.now());
                });
            }
        },

        {
            id: 'enable-css-linting',
            operationId: 'toggle-css-linting',
            name: 'Enable CSS linting',
            iconCls: 'magicss-use-icon-enable-css-linting-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execEnableCssLintingAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'enableCssLinting']);
                    setRefreshedAt(Date.now());
                });
            }
        },
        {
            id: 'disable-css-linting',
            operationId: 'toggle-css-linting',
            name: 'Disable CSS linting',
            iconCls: 'magicss-use-icon-disable-css-linting-gray',
            command() {
                setTimeout(async function () {
                    var editor = window.MagiCSSEditor;
                    await window.execDisableCssLintingAction(editor);
                    sendMessageForGa(['_trackEvent', 'commandPalette', 'disableCssLinting']);
                    setRefreshedAt(Date.now());
                });
            }
        },

        {
            operationId: 'tweet',
            name: 'Tweet',
            iconCls: 'magicss-use-logo-twitter-gray',
            command() {
                const extensionUrl = window.extensionUrl;
                const url = 'http://twitter.com/intent/tweet?url=' + encodeURIComponent(extensionUrl.forThisBrowser) + '&text=' + encodeURIComponent(TR('Extension_Name', 'Live editor for CSS, Less & Sass - Magic CSS')) + ' (for Chrome%2C Edge %26 Firefox) ... web devs check it out!&via=webextensions';
                window.open(url);
                sendMessageForGa(['_trackEvent', 'commandPalette', 'tweet']);
            }
        },
        {
            operationId: 'share-on-facebook',
            name: 'Share',
            iconCls: 'magicss-use-logo-facebook-gray',
            command() {
                const extensionUrl = window.extensionUrl;
                const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(extensionUrl.forThisBrowser);
                window.open(url);
                sendMessageForGa(['_trackEvent', 'commandPalette', 'shareOnFacebook']);
            }
        },
        {
            operationId: 'link-github',
            name: 'Contribute / Report issue',
            iconCls: 'magicss-use-logo-github-gray',
            command() {
                window.open('https://github.com/webextensions/live-css-editor');
                sendMessageForGa(['_trackEvent', 'commandPalette', 'openGithub']);
            }
        },
        ...(await (async function () {
            const browserDetails = await getBrowser();
            const browserName = browserDetails.name;

            return [
                {
                    // skip: isChrome ? true : false,
                    skip: browserName === 'chrome',
                    operationId: 'link-chrome',
                    name: 'Magic CSS for Chrome',
                    iconCls: 'magicss-use-icon-chrome',
                    command() {
                        window.open(extensionUrl.chrome);
                        sendMessageForGa(['_trackEvent', 'commandPalette', 'extensionForChrome']);
                    }
                },
                {
                    skip: browserName === 'edge',
                    operationId: 'link-edge',
                    name: 'Magic CSS for Edge',
                    iconCls: 'magicss-use-icon-edge-gray',
                    command() {
                        window.open(extensionUrl.edge);
                        sendMessageForGa(['_trackEvent', 'commandPalette', 'extensionForEdge']);
                    }
                },
                {
                    skip: browserName === 'firefox',
                    operationId: 'link-firefox',
                    name: 'Magic CSS for Firefox',
                    iconCls: 'magicss-use-icon-firefox-gray',
                    command() {
                        window.open(extensionUrl.firefox);
                        sendMessageForGa(['_trackEvent', 'commandPalette', 'extensionForFirefox']);
                    }
                },
                {
                    skip: browserName === 'opera',
                    operationId: 'link-opera',
                    name: 'Magic CSS for Opera',
                    iconCls: 'magicss-use-logo-opera-gray',
                    command() {
                        window.open(extensionUrl.opera);
                        sendMessageForGa(['_trackEvent', 'commandPalette', 'extensionForOpera']);
                    }
                }
            ];
        }())),
        {
            operationId: 'more-options',
            name: 'More options',
            iconCls: 'magicss-options',
            command() {
                var editor = window.MagiCSSEditor;
                window.execMoreOptionsAction(editor);
                sendMessageForGa(['_trackEvent', 'commandPalette', 'extensionOptionsPage']);
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

export { getCommands };

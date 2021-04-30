/* global extLib */

const commands = [
    {
        name: 'Magic CSS for Chrome',
        iconCls: 'magicss-use-icon-chrome',
        command() {
            window.open('https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol');
        }
    },
    {
        name: 'Magic CSS for Edge',
        iconCls: 'magicss-use-icon-edge-gray',
        command() {
            window.open('https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg');
        }
    },
    {
        name: 'Magic CSS for Firefox',
        iconCls: 'magicss-use-icon-firefox-gray',
        command() {
            window.open('https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/');
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
    }
];

export { commands };

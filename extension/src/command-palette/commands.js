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
    }
];

export { commands };

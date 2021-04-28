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
    }
];

export { commands };

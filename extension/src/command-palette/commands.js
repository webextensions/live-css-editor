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
        command() {
            window.open('https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg');
        }
    },
    {
        name: 'Magic CSS for Firefox',
        command() {
            window.open('https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/');
        }
    },
    {
        name: 'Create color theme (Adobe Color)',
        command() {
            window.open('https://color.adobe.com/create/color-wheel');
        }
    },
    {
        name: 'Analyze CSS',
        command() {
            window.open('https://cssstats.com/');
        }
    },
    {
        name: 'CSS optimization test',
        command() {
            window.open('https://www.giftofspeed.com/css-delivery/');
        }
    },
    {
        name: 'Convert CSS to XPath',
        command() {
            window.open('https://css2xpath.github.io/');
        }
    },
    {
        name: 'CSS Houdini',
        command() {
            window.open('https://houdini.how/');
        }
    },
    {
        name: 'CSS reset template',
        command() {
            window.open('https://www.unpkg.com/styles-reset/styles-reset.css');
        }
    }
];

export { commands };

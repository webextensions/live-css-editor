/*globals chrome, alert, extLib */

var main = function () {
    var pageType = (document.body.tagName === 'FRAMESET') ? 'FRAMESET' : 'BODY',
        allFrames = (pageType === 'FRAMESET');

    var pathScripts = 'scripts/',
        path3rdparty = pathScripts + '3rdparty/',
        path3rdpartyCustomFixes = pathScripts + '3rdparty-custom-fixes/',
        pathMagicss = pathScripts + 'magicss/',
        pathEditor = pathMagicss + 'editor/',
        pathCodeMirror = path3rdparty + 'codemirror/';

    var runningInBrowserExtension = (document.location.protocol === "chrome-extension:" || document.location.protocol === "moz-extension:" || document.location.protocol === "ms-browser-extension:") ? true : false;
    // Also see: http://stackoverflow.com/questions/7507277/detecting-if-code-is-being-run-as-a-chrome-extension/22563123#22563123
    // var runningInChromeExtension = window.chrome && chrome.runtime && chrome.runtime.id;

    extLib.loadJSCSS([
        {
            src: path3rdparty + 'async.js',
            skip: typeof async === "undefined" || runningInBrowserExtension ? false : true
        },

        path3rdparty + 'css.escape.js',

        path3rdparty + 'fiber.js',

        pathCodeMirror + 'codemirror.css',
        pathCodeMirror + 'magicss-codemirror.css',
        pathCodeMirror + 'codemirror.js',
        pathCodeMirror + 'mode/css.js',
        pathCodeMirror + 'addons/display/placeholder.js',
        pathCodeMirror + 'addons/selection/active-line.js',
        pathCodeMirror + 'addons/edit/closebrackets.js',

        path3rdparty + 'csslint/csslint.js',
        path3rdpartyCustomFixes + 'csslint/ignore-some-rules.js',
        pathCodeMirror + 'addons/lint/lint.css',
        path3rdpartyCustomFixes + 'codemirror-addon-lint/tooltip.css',
        pathCodeMirror + 'addons/lint/lint.js',
        pathCodeMirror + 'addons/lint/css-lint.js',

        pathCodeMirror + 'addons/hint/show-hint.css',
        pathCodeMirror + 'addons/hint/show-hint.js',
        pathCodeMirror + 'addons/hint/css-hint.js',

        // https://github.com/easylogic/codemirror-colorpicker
        pathCodeMirror + 'addons/colorpicker/colorpicker.css',
        pathCodeMirror + 'addons/colorpicker/colorview.js',
        pathCodeMirror + 'addons/colorpicker/colorpicker.js',

        path3rdparty + 'jquery-ui-1.12.1-custom.css',

        {
            src: path3rdparty + 'jquery-3.2.1.js',
            skip: typeof jQuery === "undefined" || runningInBrowserExtension ? false : true
        },

        path3rdparty + 'jquery-ui-1.12.1-custom.js',

        path3rdparty + 'amplify.js',

        path3rdparty + 'tooltipster/tooltipster.css',
        path3rdparty + 'tooltipster/jquery.tooltipster.js',

        path3rdpartyCustomFixes + 'csspretty/pre-csspretty.js',
        path3rdparty + 'csspretty/csspretty.js',
        // Alternatively, use cssbeautify & Yahoo's CSS Min libraries
        // path3rdparty + 'cssbeautify/cssbeautify.js',
        // path3rdparty + 'yui-cssmin/cssmin.js',

        // http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.5/less.js
        // path3rdparty + 'less.js',
        path3rdparty + 'less.browserified.js',

        path3rdparty + 'source-map.js',

        // http://www.miyconst.com/Blog/View/14/conver-css-to-less-with-css2less-js
        // path3rdparty + 'css2less/linq.js',
        // path3rdparty + 'css2less/css2less.js',

        {
            src: pathScripts + 'chrome-extension-lib/ext-lib.js',
            skip: typeof extLib === "undefined" || runningInBrowserExtension ? false : true
        },

        pathScripts + 'utils.js',

        pathEditor + 'editor.css',
        pathEditor + 'editor.js',

        pathMagicss + 'magicss.css',
        pathMagicss + 'generate-selector.js',
        pathMagicss + 'magicss.js'
    ], allFrames);
};

var prerequisitesReady = function (main) {
    var TR = extLib.TR;
    if (typeof chrome !== "undefined" && chrome && chrome.browserAction) {
        chrome.browserAction.onClicked.addListener(function (tab) {
            var url = tab.url;

            if (
                url && (
                    url.indexOf('chrome://') === 0 ||
                    url.indexOf('https://chrome.google.com/webstore/') === 0 ||
                    url.indexOf('view-source:') === 0 ||
                    url.indexOf('about:') === 0
                )
            ) {
                alert(
                    TR('Include_MagicssDoesNotOperateOnSomeTabs', 'Magic CSS does not operate on Chrome extension pages and some other native tabs.') +
                    '\n\n' +
                    TR('Include_CanRunOnOtherPages', 'You can run it on other web pages and websites.')
                );
                return;
            }

            if (chrome.permissions) {
                chrome.permissions.getAll(function (permissionsOb) {
                    if (((permissionsOb || {}).permissions || []).indexOf('activeTab') >= 0) {
                        main();
                    } else {
                        chrome.permissions.request(
                            {
                                origins: [url]
                            },
                            function (granted) {
                                if (granted) {
                                    main();
                                } else {
                                    if (url.indexOf('file:///') === 0) {
                                        alert(
                                            TR('Include_ToExecuteMagicssEditor', 'To execute Live editor for CSS and LESS (Magic CSS) on:') +
                                            '\n        ' + url +
                                            '\n\n' + TR('Include_YouNeedToGoTo', 'You need to go to:') +
                                            '\n        chrome://extensions' +
                                            '\n\n' + TR('Include_GrantPermisssions', 'And grant permissions by checking "Allow access to file URLs" for this extension')
                                        );
                                    } else {
                                        alert(
                                            TR('Include_UnableToStart', 'Unable to start') +
                                            '\n        ' + TR('Extension_Name', 'Live editor for CSS and LESS - Magic CSS') + '\n\n' +
                                            TR('Include_RequiresYourPermission', 'It requires your permission to execute on:') +
                                            '\n        ' + url
                                        );
                                    }
                                }
                            }
                        );
                    }
                });
            } else {
                try {
                    main();
                } catch (e) {
                    // TODO
                    console.log('TODO: Caught unexpected error in Magic CSS extension');
                }
            }
        });
    } else {
        // If the script is loaded in normal web page, run it after page load
        document.addEventListener('DOMContentLoaded', function() {
            main();
        });
    }
};

prerequisitesReady(function () {
    main();
});

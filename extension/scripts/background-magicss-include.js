/*globals chrome, alert, extLib, jQuery */

var USER_PREFERENCE_ALL_FRAMES = 'all-frames',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION = 'show-reapplying-styles-notification',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT = 'show-reapplying-styles-notification-at';

console.log('If you notice any issues/errors here, kindly report them at:\n    https://github.com/webextensions/live-css-editor/issues');

// https://github.com/webextensions/live-css-editor/issues/5
// Apparently, when a user plays around with Chrome devtools for a webpage, intermittently,
// we notice that the listeners were going missing. Probably because, somehow, the extension
// was getting reloaded and since previously, we were attaching the listeners only when the
// user loaded the extension in a webpage, the events were not getting reattached on reload.
// So, for fixing that, now we are attaching the events as soon as the extension loads.

if (!window.openOptionsPageListenerAdded) {
    if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                if (request.openOptionsPage) {
                    // https://developer.chrome.com/extensions/optionsV2
                    if (chrome.runtime.openOptionsPage) {
                        chrome.runtime.openOptionsPage();
                    } else {
                        window.open(chrome.runtime.getURL('options.html'));
                    }
                }
            }
        );
        window.openOptionsPageListenerAdded = true;
    }
}

if (!window.loadRemoteJsListenerAdded) {
    if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.loadRemoteJs) {
                    // https://stackoverflow.com/questions/18169666/remote-script-as-content-script-in-chrome-extension
                    jQuery
                        .get(request.loadRemoteJs, null, null, 'text')
                        .done(function(remoteCode){
                            if (request.preRunReplace) {
                                for (var i = 0; i < request.preRunReplace.length; i++) {
                                    remoteCode = remoteCode.replace(request.preRunReplace[i].oldText, request.preRunReplace[i].newText);
                                }
                            }
                            getAllFrames(function (allFrames) {
                                chrome.tabs.executeScript(
                                    sender.tab.id,
                                    { code: remoteCode, allFrames: allFrames},
                                    function(){
                                        sendResponse();
                                    }
                                );
                            });
                        })
                        .fail(function() {
                            sendResponse('error');
                        });

                    // https://developer.chrome.com/extensions/messaging
                    // Need to return true from the event listener to indicate that we wish to send a response asynchronously
                    return true;
                } else if (request.requestPermissions) {
                    var url = request.url;
                    chrome.permissions.request(
                        {
                            permissions: ['webNavigation'],
                            origins: [url]
                        },
                        function (granted) {
                            if (granted) {
                                sendResponse('request-granted');

                                onDOMContentLoadedHandler();
                            } else {
                                sendResponse('request-not-granted');
                            }
                        }
                    );

                    // https://developer.chrome.com/extensions/messaging
                    // Need to return true from the event listener to indicate that we wish to send a response asynchronously
                    return true;
                }
            }
        );
        window.loadRemoteJsListenerAdded = true;
    }
}


var getFromChromeStorage = function (property, cb) {
    var chromeStorage = chrome.storage.sync || chrome.storage.local;

    chromeStorage.get(property, function (values) {
        if (values) {
            cb(values[property]);
        } else {
            cb(undefined);
        }
    });
};

var getAllFrames = function (cb) {
    getFromChromeStorage(USER_PREFERENCE_ALL_FRAMES, function (value) {
        if (value === 'yes') {
            cb(true);
        } else {
            cb(false);
        }
    });
};

var reapplyCss = function (tabId) {
    getFromChromeStorage(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION, function (value) {
        var showReapplyingStylesNotification = true;
        if (value === 'no') {
            showReapplyingStylesNotification = false;
        }

        getFromChromeStorage(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT, function (value) {
            var showReapplyingStylesNotificationAt = 'top-right';
            if (['bottom-right', 'bottom-left', 'top-left'].indexOf(value) >= 0) {
                showReapplyingStylesNotificationAt = value;
            }
            getAllFrames(function (allFrames) {
                var pathScripts = 'scripts/',
                    path3rdparty = pathScripts + '3rdparty/';

                var arrScripts = [];
                if (!showReapplyingStylesNotification) {
                    arrScripts.push({
                        type: 'js',
                        sourceText: 'window.hideReapplyingStylesNotification = true;'
                    });
                } else {
                    arrScripts.push({
                        type: 'js',
                        sourceText: 'window.showReapplyingStylesNotificationAt = "' + showReapplyingStylesNotificationAt + '";'
                    });
                }
                arrScripts.push(path3rdparty + 'amplify-store.js');
                arrScripts.push(pathScripts + 'utils.js');
                arrScripts.push(pathScripts + 'reapply-css.js');
                extLib.loadJSCSS(arrScripts, allFrames, tabId);
            });
        });
    });
};

var main = function (tabId) {
    getAllFrames(function (allFrames) {
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
                type: 'js',
                sourceText: 'window.magicCssVersion = ' + JSON.stringify(chrome.runtime.getManifest().version) + ';'
            },
            {
                src: path3rdparty + 'jquery.js',
                skip: typeof jQuery !== "undefined" || runningInBrowserExtension ? false : true
            },
            {
                src: pathScripts + 'chrome-extension-lib/ext-lib.js',
                skip: typeof extLib !== "undefined" || runningInBrowserExtension ? false : true
            },

            pathScripts + 'utils.js',
            pathScripts + 'loading-magic-css.js',

            {
                src: path3rdparty + 'async.js',
                skip: typeof async === "undefined" || runningInBrowserExtension ? false : true
            },

            path3rdparty + 'css.escape.js',

            pathCodeMirror + 'codemirror.css',
            path3rdpartyCustomFixes + 'codemirror/magicss-codemirror.css',
            pathCodeMirror + 'codemirror.js',
            pathCodeMirror + 'mode/css.js',
            pathCodeMirror + 'addons/display/placeholder.js',
            pathCodeMirror + 'addons/selection/active-line.js',
            pathCodeMirror + 'addons/edit/closebrackets.js',
            pathCodeMirror + 'addons/edit/matchbrackets.js',

            path3rdparty + 'csslint/csslint.js',
            path3rdpartyCustomFixes + 'csslint/ignore-some-rules.js',
            pathCodeMirror + 'addons/lint/lint.css',
            path3rdpartyCustomFixes + 'codemirror/addons/lint/tooltip.css',
            pathCodeMirror + 'addons/lint/lint.js',
            pathCodeMirror + 'addons/lint/css-lint_customized.js',

            pathCodeMirror + 'addons/hint/show-hint.css',
            pathCodeMirror + 'addons/hint/show-hint_customized.js',
            pathCodeMirror + 'addons/hint/css-hint_customized.js',

            // https://github.com/easylogic/codemirror-colorpicker
            pathCodeMirror + 'addons/colorpicker/colorpicker.css',
            pathCodeMirror + 'addons/colorpicker/colorview.js',
            pathCodeMirror + 'addons/colorpicker/colorpicker.js',

            pathCodeMirror + 'addons/emmet/emmet-codemirror-plugin.js',

            path3rdparty + 'jquery-ui_customized.css',
            path3rdparty + 'jquery-ui.js',
            path3rdparty + 'jquery.ui.touch-punch_customized.js',

            path3rdparty + 'socket.io/socket.io.slim.js',

            path3rdparty + 'amplify-store.js',

            path3rdparty + 'tooltipster/tooltipster.css',
            path3rdparty + 'tooltipster/jquery.tooltipster.js',

            path3rdparty + 'toastr/toastr.css',
            path3rdparty + 'toastr/toastr_customized.js',

            path3rdparty + 'magicsuggest/magicsuggest.css',
            path3rdparty + 'magicsuggest/magicsuggest.js',

            path3rdpartyCustomFixes + 'csspretty/pre-csspretty.js',
            path3rdparty + 'csspretty/csspretty.js',
            // Alternatively, use cssbeautify & Yahoo's CSS Min libraries
            // path3rdparty + 'cssbeautify/cssbeautify.js',
            // path3rdparty + 'yui-cssmin/cssmin.js',

            // http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.5/less.js
            // path3rdparty + 'less.js',
            path3rdparty + 'basic-less-with-sourcemap-support.browserified.uglified.js',

            path3rdparty + 'source-map.js',

            // http://www.miyconst.com/Blog/View/14/conver-css-to-less-with-css2less-js
            // path3rdparty + 'css2less/linq.js',
            // path3rdparty + 'css2less/css2less.js',

            pathEditor + 'editor.css',
            pathEditor + 'editor.js',

            pathMagicss + 'magicss.css',
            pathMagicss + 'generate-selector.js',
            pathMagicss + 'magicss.js'
        ], allFrames, tabId);
    });
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
                                            TR('Include_ToExecuteMagicssEditor', 'To execute Live editor for CSS, Less & Sass (Magic CSS) on:') +
                                            '\n        ' + url +
                                            '\n\n' + TR('Include_YouNeedToGoTo', 'You need to go to:') +
                                            '\n        chrome://extensions' +
                                            '\n\n' + TR('Include_GrantPermisssions', 'And grant permissions by checking "Allow access to file URLs" for this extension')
                                        );
                                    } else {
                                        alert(
                                            TR('Include_UnableToStart', 'Unable to start') +
                                            '\n        ' + TR('Extension_Name', 'Live editor for CSS, Less & Sass - Magic CSS') + '\n\n' +
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

var parseUrl = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

var generatePermissionPattern = function (url) {
    var parsedUrl = parseUrl(url),
        pattern = '';

    if (parsedUrl.protocol === 'file:') {
        pattern = 'file:///*';
    } else if (['http:', 'https:', 'ftp:'].indexOf(parsedUrl.protocol) >= 0) {
        pattern = parsedUrl.protocol + '//' + parsedUrl.hostname + (parsedUrl.port ? (':' + parsedUrl.port) : '') + '/*';
    } else {
        pattern = url;
    }
    return pattern;
};

var onDOMContentLoadedHandler = function () {
    if (!window.onDOMContentLoadedListenerAdded) {
        if (chrome.webNavigation) {
            chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
                var tabId = details.tabId,
                    url = details.url;

                var permissionsPattern = generatePermissionPattern(url);
                chrome.tabs.get(tabId, function (tab) {
                    // This check (accessing chrome.runtime.lastError) is required to avoid an unnecessary error log in Chrome when the tab doesn't exist
                    // Reference: https://stackoverflow.com/questions/16571393/the-best-way-to-check-if-tab-with-exact-id-exists-in-chrome/27532535#27532535
                    if (chrome.runtime.lastError) {
                        // do nothing
                    } else {
                        // tab.url would not be available for a new tab (eg: new tab opened by Ctrl + T)
                        if (tab && tab.url) {
                            // details.frameId === 0 means the top most frame (the webpage)
                            if (permissionsPattern && details.frameId === 0) {
                                chrome.permissions.contains({
                                    origins: [permissionsPattern]
                                }, function (result) {
                                    if (result) {
                                        reapplyCss(tabId);
                                    } else {
                                        // do nothing because we don't have enough permissions
                                    }
                                });
                            }
                        }
                    }
                });
            });
            window.onDOMContentLoadedListenerAdded = true;
        }
    }
};

onDOMContentLoadedHandler();

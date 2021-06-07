/* global chrome, extLib, jQuery */

var USER_PREFERENCE_ALL_FRAMES = 'all-frames',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION = 'show-reapplying-styles-notification',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT = 'show-reapplying-styles-notification-at';

var TR = extLib.TR;

const tabConnectivityMap = {};
if (window.flagEditorInExternalWindow) {
    // do nothing
} else {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) { // eslint-disable-line no-unused-vars
            if (request.openExternalEditor) {
                const tabOriginWithSlash = (
                    // Even though the chrome.permissions.request API parameter is called "origins",
                    // it doesn't respect the origins without trailing slash. Hence, we append a slash, if required.
                    sender.origin.match(/\/$/) ?
                        sender.origin :
                        sender.origin + '/'
                );

                let width = request.width || 400,
                    height = request.height || 400;
                const windowForExternalEditor = (
                    window
                        .open(
                            (
                                `${chrome.runtime.getURL('external-editor.html')}` +
                                `?tabId=${sender.tab.id}` +
                                `&tabTitle=${encodeURIComponent(request.tabTitle)}` +
                                `&tabOriginWithSlash=${encodeURIComponent(tabOriginWithSlash)}` +
                                `&magicssHostSessionUuid=${encodeURIComponent(request.magicssHostSessionUuid)}`
                            ),
                            `Magic CSS (Random Name: ${Math.random()})`,
                            `width=${width},height=${height},scrollbars=yes,resizable=yes` // scrollbars=yes is required for some browsers (like FF & IE)
                        )
                );
                windowForExternalEditor.focus();

                tabConnectivityMap[sender.tab.id] = windowForExternalEditor;
            } else if (request.closeExternalEditor) {
                const windowForExternalEditor = tabConnectivityMap[sender.tab.id];
                if (windowForExternalEditor) {
                    windowForExternalEditor.close();
                }
                delete tabConnectivityMap[sender.tab.id];
            }
        }
    );

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) { // eslint-disable-line no-unused-vars
            if (request.type === 'magicss') {
                chrome.tabs.sendMessage(
                    request.tabId,
                    {
                        magicssHostSessionUuid: request.magicssHostSessionUuid,
                        type: request.type,
                        subType: request.subType,
                        payload: request.payload
                    },
                    function(response) {
                        // This if condition check is required to avoid unwanted warnings
                        // TODO: FIXME: Is there some better solution possible?
                        if (chrome.runtime.lastError) {
                            // Currently doing nothing
                        }

                        sendResponse(response);
                    }
                );

                // Need to return true to run "sendResponse" in async manner
                // Ref: https://developer.chrome.com/docs/extensions/mv2/messaging/#simple
                return true;
            }
        }
    );

    if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) { // eslint-disable-line no-unused-vars
                if (request.type === 'magicss-bg') {
                    if (request.subType === 'ajax') {
                        const ajaxOb = JSON.parse(JSON.stringify(request.payload));
                        ajaxOb.error = function (jqXhr, textStatus, error) {
                            sendResponse([
                                {
                                    jqXhr,
                                    textStatus,
                                    error
                                },
                                null,
                                {
                                    status: jqXhr.status,
                                    responseText: jqXhr.responseText
                                }
                            ]);
                        };
                        ajaxOb.success = function (data, textStatus, jqXhr) { // eslint-disable-line no-unused-vars
                            sendResponse([
                                null,
                                data,
                                {
                                    status: jqXhr.status,
                                    contentType: jqXhr.getResponseHeader('content-type'),
                                    responseText: jqXhr.responseText
                                }
                            ]);
                        };
                        jQuery.ajax(ajaxOb);

                        return true;
                    }
                } else if (request.type === 'magicss-dependency') {
                    if (request.subType === 'load-dependency') {
                        setTimeout(async () => {
                            const [err] = await extLib.loadJsCssAsync({ // eslint-disable-line no-unused-vars
                                source: request.payload,
                                tabId: sender.tab.id,
                                frameId: sender.frameId,
                                allFrames: false
                            });

                            sendResponse();
                        });

                        // Need to return true to run "sendResponse" in async manner
                        // Ref: https://developer.chrome.com/docs/extensions/mv2/messaging/#simple
                        return true;
                    }
                }
            }
        );
    }
}

if (window.flagEditorInExternalWindow) {
    // do nothing
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Set icon for dark mode of browser
        chrome.browserAction.setIcon({
            path: {
                "16":  "icons/icon-dark-scheme-16.png",
                "24":  "icons/icon-dark-scheme-24.png",
                "32":  "icons/icon-dark-scheme-32.png",
                "40":  "icons/icon-dark-scheme-40.png",
                "48":  "icons/icon-dark-scheme-48.png",
                "128": "icons/icon-dark-scheme-128.png",
                "256": "icons/icon-dark-scheme-256.png"
            }
        });
    }
}

console.log('If you notice any issues/errors here, kindly report them at:\n    https://github.com/webextensions/live-css-editor/issues');
var runningInChromiumLikeEnvironment = function () {
    if (window.location.href.indexOf('chrome-extension://') === 0) {
        return true;
    } else {
        return false;
    }
};

var runningInFirefoxLikeEnvironment = function () {
    if (window.location.href.indexOf('moz-extension://') === 0) {
        return true;
    } else {
        return false;
    }
};

var runningInOldEdgeLikeEnvironment = function () {
    if (window.location.href.indexOf('ms-browser-extension://') === 0) {
        return true;
    } else {
        return false;
    }
};

var informUser = function (config) {
    var message = config.message,
        tab = config.tab || {},
        tabId = tab.id,
        badgeText = config.badgeText,
        badgeBackgroundColor = config.badgeBackgroundColor;

    console.log(message);

    if (tabId) {
        chrome.browserAction.setTitle({ tabId: tabId, title: message });
        if (badgeText) {
            chrome.browserAction.setBadgeText({ tabId: tabId, text: badgeText });
        }
        if (badgeBackgroundColor) {
            chrome.browserAction.setBadgeBackgroundColor({ tabId: tabId, color: badgeBackgroundColor });
        }
    }

    // Note:
    //     alert() does not work on Firefox
    //     https://bugzilla.mozilla.org/show_bug.cgi?id=1203394
    if (runningInChromiumLikeEnvironment()) {
        alert(message);
    }
};

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
                    if (window.flagEditorInExternalWindow) {
                        return;
                    }
                    if (runningInOldEdgeLikeEnvironment()) {
                        // We use full permissions on old Microsoft Edge
                        sendResponse('request-granted');
                        onDOMContentLoadedHandler();
                    } else {
                        var tabOriginWithSlash = request.tabOriginWithSlash;

                        const permissionsOb = {};
                        if (request.requestWebNavigation) {
                            permissionsOb.permissions = ['webNavigation'];
                        }
                        permissionsOb.origins = [tabOriginWithSlash];

                        chrome.permissions.request(
                            permissionsOb,
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
            }
        );
        window.loadRemoteJsListenerAdded = true;
    }
}

if (!window.apiHelperForContentScriptAdded) {
    if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.type === 'checkPermissionForOrigin') {
                    const originWithSlash = request.payload;
                    chrome.permissions.contains({
                        origins: [originWithSlash]
                    }, function (result) {
                        sendResponse({ flagPermissions: result });
                    });

                    // https://developer.chrome.com/extensions/messaging
                    // Need to return true from the event listener to indicate that we wish to send a response asynchronously
                    return true;
                }
            }
        );
        window.apiHelperForContentScriptAdded = true;
    }
}

var getFromChromeStorage = function (property, cb) {
    var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

    chromeStorageForExtensionData.get(property, function (values) {
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
                arrScripts.push(pathScripts + 'migrate-storage.js');
                arrScripts.push(pathScripts + 'reapply-css.js');

                extLib.loadMultipleJsCss({
                    treatAsNormalWebpage: window.treatAsNormalWebpage,
                    arrSources: arrScripts,
                    allFrames,
                    tabId,
                    runAt: 'document_start'
                });
            });
        });
    });
};

// By the time "platformInfoOs" variable would be used, its value would be set appropriately.
var platformInfoOs = '';
try {
    chrome.runtime.getPlatformInfo(function (platformInfo) {
        platformInfoOs = platformInfo.os;
    });
} catch (e) {
    platformInfoOs = 'unavailable';
}

var main = function (tab) {     // eslint-disable-line no-unused-vars
    var isChrome = false,       // eslint-disable-line no-unused-vars
        isEdge = false,         // eslint-disable-line no-unused-vars
        isFirefox = false,      // eslint-disable-line no-unused-vars
        isOpera = false;
    if (/Edge/.test(navigator.appVersion)) {            // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
        isEdge = true;          // eslint-disable-line no-unused-vars
    } else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
        isOpera = true;
    } else if (/Chrome/.test(navigator.appVersion)) {
        isChrome = true;        // eslint-disable-line no-unused-vars
    } else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
        isFirefox = true;       // eslint-disable-line no-unused-vars
    }

    getAllFrames(function (allFrames) {
        var pathDist = 'dist/',
            pathScripts = 'scripts/',
            path3rdparty = pathScripts + '3rdparty/',
            path3rdpartyCustomFixes = pathScripts + '3rdparty-custom-fixes/',
            pathMagicss = pathScripts + 'magicss/',
            pathEditor = pathMagicss + 'editor/',
            pathCodeMirror = path3rdparty + 'codemirror/';

        var runningInBrowserExtension = (document.location.protocol === "chrome-extension:" || document.location.protocol === "moz-extension:" || document.location.protocol === "ms-browser-extension:") ? true : false;
        // Also see: http://stackoverflow.com/questions/7507277/detecting-if-code-is-being-run-as-a-chrome-extension/22563123#22563123
        // var runningInChromeExtension = window.chrome && chrome.runtime && chrome.runtime.id;

        extLib.loadMultipleJsCss({
            treatAsNormalWebpage: window.treatAsNormalWebpage,
            arrSources: [
                pathScripts + 'appVersion.js',
                // {
                //     type: 'js',
                //     sourceText: 'window.magicCssVersion = ' + JSON.stringify(chrome.runtime.getManifest().version) + ';'
                // },

                (
                    platformInfoOs === 'android' ?
                        pathScripts + 'platformInfoOs-android.js' :
                        pathScripts + 'platformInfoOs-non-android.js'
                ),
                // {
                //     type: 'js',
                //     sourceText: 'window.platformInfoOs = "' + platformInfoOs + '";'
                // },

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

                path3rdparty + 'css.escape.js',

                pathCodeMirror + 'codemirror.css',
                pathCodeMirror + 'theme/ambiance.css',
                path3rdpartyCustomFixes + 'codemirror/magicss-codemirror.css',
                pathCodeMirror + 'codemirror.js',
                pathCodeMirror + 'mode/css.js',
                pathCodeMirror + 'addons/display/placeholder.js',
                pathCodeMirror + 'addons/selection/active-line.js',
                pathCodeMirror + 'addons/edit/closebrackets.js',
                pathCodeMirror + 'addons/edit/matchbrackets.js',

                // This is required for some cases in multi-selection (using Ctrl+D)
                pathCodeMirror + 'addons/search/searchcursor.js',

                pathCodeMirror + 'addons/comment/comment.js',

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
                pathCodeMirror + 'addons/colorpicker/colorview_customized.js',
                pathCodeMirror + 'addons/colorpicker/colorpicker.js',

                pathCodeMirror + 'addons/emmet/emmet-codemirror-plugin.js',

                pathCodeMirror + 'keymap/sublime.js',

                path3rdparty + 'jquery-ui_customized.css',
                path3rdparty + 'jquery-ui.js',
                path3rdparty + 'jquery.ui.touch-punch_customized.js',

                path3rdparty + 'socket.io/socket.io.slim.js',

                path3rdparty + 'amplify-store.js',
                pathScripts + 'migrate-storage.js',

                path3rdparty + 'tooltipster/tooltipster.css',
                path3rdparty + 'tooltipster/jquery.tooltipster.js',
                path3rdparty + 'tooltipster/tooltipster-scrollableTip.js',

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
                // // TODO: Remove this piece of commented out code. Now loading 'less' dynamically via `loadIfNotAvailable`
                // path3rdparty + 'basic-less-with-sourcemap-support.browserified.js',

                {
                    src: path3rdparty + 'sass/sass.sync.min.js',
                    skip: (runningInBrowserExtension && isOpera) ? false : true
                },

                path3rdparty + 'source-map.js',

                // http://www.miyconst.com/Blog/View/14/conver-css-to-less-with-css2less-js
                // path3rdparty + 'css2less/linq.js',
                // path3rdparty + 'css2less/css2less.js',

                pathEditor + 'editor.css',
                pathEditor + 'editor.js',

                pathMagicss + 'magicss.css',
                pathDist + 'main.bundle.css', // TODO: FIXME: Ideally, this should be loaded only on demand, like main.bundle.js

                pathMagicss + 'generate-selector.js',

                pathMagicss + 'magicss.js'
            ],
            allFrames,
            tabId: undefined,
            done: function () {
                // Currently doing nothing
            }
        });
    });
};

var isRestrictedUrl = function (url) {
    url = url || '';
    // References:
    //     https://stackoverflow.com/questions/11613371/chrome-extension-content-script-on-https-chrome-google-com-webstore/11614440#11614440
    //     https://bugs.chromium.org/p/chromium/issues/detail?id=356652
    //     https://github.com/gorhill/uMatrix/wiki/Privileged-Pages
    var restrictedPatterns = [
        "chrome://",
        "view-source:",
        "about:",

        "chrome-extension://",
        "moz-extension://",
        "ms-browser-extension://",

        "https://chrome.google.com/webstore/",

        "https://addons.opera.com/",

        // To get the list of restricted domains, in Firefox, go to:
        //     about:config > extensions.webextensions.restrictedDomains
        // References:
        //     https://hg.mozilla.org/mozilla-central/rev/39e131181d44
        //     https://bugzilla.mozilla.org/show_bug.cgi?id=1415644
        //     https://bugzilla.mozilla.org/show_bug.cgi?id=1310082#c24
        //     https://www.ghacks.net/2017/10/27/how-to-enable-firefox-webextensions-on-mozilla-websites/
        //     https://www.reddit.com/r/firefox/comments/84mghw/firefox_60_beta_lost_the_amo_working_extensions/
        "https://accounts-static.cdn.mozilla.net/",
        "https://accounts.firefox.com/",
        "https://addons.cdn.mozilla.net/",
        "https://addons.mozilla.org/",
        "https://api.accounts.firefox.com/",
        "https://content.cdn.mozilla.net/",
        "https://content.cdn.mozilla.net/",
        "https://discovery.addons.mozilla.org/",
        "https://input.mozilla.org/",
        "https://install.mozilla.org/",
        "https://oauth.accounts.firefox.com/",
        "https://profile.accounts.firefox.com/",
        "https://support.mozilla.org/",
        "https://sync.services.mozilla.com/",
        "https://testpilot.firefox.com/"
    ];

    var flagRestricted = restrictedPatterns.some(function (restrictedPattern) {
        if (url.indexOf(restrictedPattern) === 0) {
            return true;
        }
    });
    return flagRestricted;
};

var prerequisitesReady = function (main) {
    if (typeof chrome !== "undefined" && chrome && chrome.browserAction) {
        chrome.browserAction.onClicked.addListener(function (tab) {
            var url = tab.url;

            if (isRestrictedUrl(url)) {
                let message = (
                    TR('Include_MagicssDoesNotOperateOnSomeTabs', 'For security reasons, Magic CSS does not operate on:') +
                    '\n' + url +
                    '\n\n' + TR('Include_CanRunOnOtherPages', 'You can run it on other websites and web pages.')
                );

                informUser({
                    message: message,
                    tab: tab,
                    badgeText: 'X',
                    badgeBackgroundColor: '#b00'
                });

                return;
            }

            var goAhead = function () {
                if (chrome.permissions) {
                    chrome.permissions.getAll(function (permissionsOb) {
                        if (((permissionsOb || {}).permissions || []).indexOf('activeTab') >= 0) {
                            main(tab);
                        } else {
                            chrome.permissions.request(
                                {
                                    origins: [url]
                                },
                                function (granted) {
                                    if (granted) {
                                        main(tab);
                                    } else {
                                        let message = (
                                            TR('Include_UnableToStart', 'Unable to start') +
                                            '\n        ' + TR('Extension_Name', 'Live editor for CSS, Less & Sass - Magic CSS') + '\n\n' +
                                            TR('Include_RequiresYourPermission', 'It requires your permission to execute on:') +
                                            '\n        ' + url
                                        );

                                        informUser({
                                            message: message,
                                            tab: tab,
                                            badgeText: '?',
                                            badgeBackgroundColor: '#bb0'
                                        });
                                    }
                                }
                            );
                        }
                    });
                } else {
                    try {
                        main(tab);
                    } catch (e) {
                        console.log('TODO: Caught unexpected error in Magic CSS extension');
                    }
                }
            };

            if (url.indexOf('file:///') === 0) {
                if (runningInFirefoxLikeEnvironment()) {
                    goAhead();
                } else if (runningInChromiumLikeEnvironment()) {
                    chrome.extension.isAllowedFileSchemeAccess(function (isAllowedAccess) {
                        if (isAllowedAccess) {
                            goAhead();
                        } else {
                            var message = (
                                TR('Include_ToExecuteMagicssEditor', 'To execute Live editor for CSS, Less & Sass (Magic CSS) on:') +
                                '\n    ' + url +
                                '\n\n' + TR('Include_YouNeedToGoTo', 'You need to go to:') +
                                '\n    chrome://extensions' +
                                '\n\n' + TR('Include_GrantPermisssions', 'And grant permissions by enabling "Allow access to file URLs" for this extension')
                            );
                            informUser({
                                message: message,
                                tab: tab,
                                badgeText: '?',
                                badgeBackgroundColor: '#bb0'
                            });
                        }
                    });
                } else {
                    var message = (
                        'For your browser, "Live editor for CSS, Less & Sass" (Magic CSS) does not support running on:' +
                        '\n    ' + url
                    );
                    informUser({
                        message: message,
                        tab: tab,
                        badgeText: '!',
                        badgeBackgroundColor: '#b00'
                    });
                    return;
                }
            } else {
                goAhead();
            }
        });
    } else {
        // If the script is loaded in normal web page, run it after page load
        document.addEventListener('DOMContentLoaded', function() {
            main();
        });
    }
};

if (window.flagEditorInExternalWindow) {
    main();
} else {
    prerequisitesReady(function (tab) {
        main(tab);
    });
}

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
            (function () {
                if (runningInOldEdgeLikeEnvironment()) {
                    // .onDOMContentLoaded() appears to work better for old Microsoft Edge
                    // .onCommitted() on old Microsoft Edge seems to be not loading the styles under some situations
                    return chrome.webNavigation.onDOMContentLoaded;
                } else {
                    return chrome.webNavigation.onCommitted;
                }
            }()).addListener(function(details) {
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
                        if (runningInOldEdgeLikeEnvironment()) {
                            reapplyCss(tabId);
                        } else if (runningInFirefoxLikeEnvironment()) { // TODO: Move to optional_permissions when Firefox supports it and refactor this code
                            reapplyCss(tabId);
                        } else if (tab && tab.url) {
                            // Old logic:
                            //     "if (permissionsPattern && details.frameId === 0) {"
                            //     details.frameId === 0 means the top most frame (the webpage)
                            if (
                                permissionsPattern &&
                                !isRestrictedUrl(url) // url (details.url) points to the frame URL
                            ) {
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

if (window.flagEditorInExternalWindow) {
    // do nothing
} else {
    onDOMContentLoadedHandler();
}

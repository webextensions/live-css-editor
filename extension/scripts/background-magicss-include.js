/* global chrome */

import { getBrowserStrategyGetManifest } from 'helpmate/dist/browser/getBrowser.js';

import {
    chromeStorageLocalGet,
    chromeStorageLocalSet,
    chromeStorageLocalRemove,
    chromeStorageSyncGet,
    chromeStorageSyncRemove,
    chromeStorageGet
} from './utils/chromeStorage.js';

import { TR } from './utils/i18n.js';
import { isValidUuidV4 } from './utils/isValidUuidV4.js';
import { randomUUID } from './utils/randomUUID.js';

import { extLib } from './chrome-extension-lib/ext-lib.js';
import { basisNumberFromUuid } from './utils/basisNumberFromUuid.js';

import { mainFnMetricsHandler } from './appUtils/mainFnMetricsHandler.js';
import { myWin } from './appUtils/myWin.js';

var USER_PREFERENCE_ALL_FRAMES = 'all-frames';

var fallbackConfig = {
    "mode": "offline",
    "account": {
        "signInUrl": "https://www.webextensions.org/sign-in"
    },
    "nextUpdate": 7 * 24 * 60 * 60 * 1000,
    "features": {
        "showAccountStatus": {
            "enabled": false
        },
        "useUninstallUrl": {
            "enabled": false
        },
        "rateUs": {
            "enabled": false,
            "range": {
                "from": -1,
                "to": -1
            }
        }
    },
    "version": "8.20.3"
};
let remoteConfig = JSON.parse(JSON.stringify(fallbackConfig));
myWin.remoteConfig = remoteConfig;
var instanceUuid = null;
var instanceBasisNumber = -1;

myWin.remoteConfigLoadedFromRemote = new Promise((resolve, reject) => {
    myWin.remoteConfigLoadedFromRemoteResolve = resolve;
    myWin.remoteConfigLoadedFromRemoteReject = reject;
});

// DEVHELPER: Useful for debugging purposes
/*
// Usage (inside function and condition which is going to eventually call sendResponse in (async) callback):
//     sendResponse = wrapSendResponse({
//         sendResponse,
//         id: '<unique-id-for-each-message-type-being-handled>', // To compare the logs
//         verbose: true
//     });
const wrapSendResponse = function ({
    sendResponse,
    id,
    verbose
}) {
    console.log(`Wrapping message with id: ${id}`);
    return function (data) {
        let verboseValueToUse = verbose;
        // verboseValueToUse = true;
        // verboseValueToUse = false;
        if (verboseValueToUse) {
            console.log('sendResponse', id, data);
        }
        sendResponse(data);
    };
};
/* */

// eslint-disable-next-line no-unused-vars
var devHelper = function () {
    // Running the code under a setTimeout so that in the console, the return value of this function (undefined) is
    // logged first and doesn't come in between the other log entries
    setTimeout(async function () {
        console.log('========================================');

        console.log('    instanceUuid:', instanceUuid);
        console.log('    instanceBasisNumber:', instanceBasisNumber);

        console.log('    fallbackConfig:', fallbackConfig);

        const storedConfig = await chromeStorageLocalGet('remoteConfig');
        console.log('    storedConfig:', storedConfig);

        console.log('    remoteConfig:', remoteConfig);

        const executionCounterLocal = await chromeStorageLocalGet('magicss-execution-counter');
        console.log('    executionCounterLocal:', executionCounterLocal);

        const executionCounterSync = await chromeStorageSyncGet('magicss-execution-counter');
        console.log('    executionCounterSync:', executionCounterSync);

        const allChromeStorageLocalData = await chromeStorageLocalGet(null);
        console.log('    allChromeStorageLocalData:', allChromeStorageLocalData);

        const allChromeStorageSyncData = await chromeStorageSyncGet(null);
        console.log('    allChromeStorageSyncData:', allChromeStorageSyncData);

        console.log('========================================');
    });
};
globalThis.devHelper = devHelper;
devHelper.clearSomeStorage = async function () {
    await chromeStorageLocalRemove('magicss-execution-counter');
    await chromeStorageSyncRemove('magicss-execution-counter');

    await chromeStorageLocalRemove('instance-uuid');

    await chromeStorageLocalRemove('remoteConfig');
};

if (myWin.flagEditorInExternalWindow) {
    // do nothing
} else {
    // Use this for the cases where the code should never reach in imaginable scenarios.
    const requestUserViaConsoleToReportUnexpectedError = function (e) {
        console.error(e);
        console.error([
            'An unexpected error was encountered by Magic CSS.',
            'Kindly report this issue at:',
            '    https://github.com/webextensions/live-css-editor/issues'
        ].join('\n'));
    };

    const flagDevMode = (function () {
        let flag = false;
        try {
            // TODO: Verify that this works well across browsers
            // https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode/20227975#20227975
            flag = (!('update_url' in chrome.runtime.getManifest()));
        } catch (e) {
            requestUserViaConsoleToReportUnexpectedError(e);
        }
        return flag;
    })();

    const ajaxGet = async function ({ url }) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return [null, data];
            } else {
                return [
                    'error-in-fetching-data-from: ' + url,
                    {
                        response
                    }
                ];
            }
        } catch (err) {
            return [err];
        }
    };

    const fetchRemoteConfig = async function () {
        let configUrl;
        const extensionVersion = chrome.runtime.getManifest().version;
        if (flagDevMode) {
            configUrl = `http://localapi.webextensions.org:3400/magic-css/config?version=latest`;
        } else {
            configUrl = `https://api.webextensions.org/magic-css/config?version=${extensionVersion}`;
        }

        let [err, fetchedConfig] = await ajaxGet({ url: configUrl });
        if (err) {
            console.error(`Error in fetching remoteConfig from: ${configUrl}`);
            console.error('Error details:');
            console.error(err);
        } else {
            (async () => {
                await mainFnMetricsHandler({ event: 'configFetch' });
            })();
        }
        return [err, fetchedConfig];
    };

    const getStoredConfigIfValid = async function () {
        const storedConfig = await chromeStorageLocalGet('remoteConfig');

        // https://github.com/substack/semver-compare/blob/152c863e7c2615f9e9e81a9a370b672afaa3819a/index.js
        const semverCompare = function (a, b) {
            var pa = a.split('.');
            var pb = b.split('.');
            for (var i = 0; i < 3; i++) {
                var na = Number(pa[i]);
                var nb = Number(pb[i]);
                if (na > nb) return 1;
                if (nb > na) return -1;
                if (!isNaN(na) && isNaN(nb)) return 1;
                if (isNaN(na) && !isNaN(nb)) return -1;
            }
            return 0;
        };
        const semverGte = function (a, b) {
            if (semverCompare(a, b) >= 0) {
                return true;
            } else {
                return false;
            }
        };

        const isValid = function (config) {
            const extensionVersion = chrome.runtime.getManifest().version;

            if (semverGte(config.version, extensionVersion)) {
                return true;
            } else {
                return false;
            }
        };

        const isRecent = function (config) {
            const
                now = Date.now(),
                timeDiff = config.nextUpdateAt - now,
                absoluteTimeDiff = Math.abs(timeDiff);
            if (config.nextUpdateAt) {
                if (timeDiff <= 0) {
                    return false;
                } else {
                    if (absoluteTimeDiff < config.nextUpdate) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

        const flagDebug = false; // DEV-HELPER: Useful when developing / debugging
        if (flagDebug) {
            return null;
        }

        if (storedConfig && isValid(storedConfig) && isRecent(storedConfig)) {
            return storedConfig;
        } else {
            return null;
        }
    };

    const updateRemoteConfig = async function () {
        const storedConfig = await getStoredConfigIfValid();

        if (storedConfig) {
            remoteConfig = storedConfig;
            myWin.remoteConfig = remoteConfig;
            console.info('Applied stored config:', storedConfig);
            if (storedConfig.mode === 'online') {
                myWin.remoteConfigLoadedFromRemoteResolve();
            }
        } else {
            const [err, fetchedConfig] = await fetchRemoteConfig();

            if (err) {
                myWin.remoteConfigLoadedFromRemoteReject();
            } else {
                fetchedConfig.nextUpdateAt = Date.now() + fetchedConfig.nextUpdate;
                remoteConfig = fetchedConfig;
                myWin.remoteConfig = remoteConfig;
                console.info('Applied config from remote:', fetchedConfig);

                try {
                    chrome.storage.local.set({ 'remoteConfig': remoteConfig }, function() {
                        // do nothing
                    });
                } catch (e) {
                    // do nothing
                }
                myWin.remoteConfigLoadedFromRemoteResolve();
            }
        }
    };
    myWin.updateRemoteConfig = updateRemoteConfig;

    (async () => {
        const INSTANCE_UUID = 'instance-uuid';
        instanceUuid = await chromeStorageLocalGet(INSTANCE_UUID);

        if (!isValidUuidV4(instanceUuid)) {
            instanceUuid = randomUUID();
            await chromeStorageLocalSet(INSTANCE_UUID, instanceUuid);
        }

        instanceBasisNumber = basisNumberFromUuid(instanceUuid);

        const fn = async function () {
            await updateRemoteConfig();

            setTimeout(async function () {
                fn();
            }, (remoteConfig.nextUpdate || 7 * 24 * 60 * 60 * 1000));
        };
        await fn();
    })();

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) { // eslint-disable-line no-unused-vars
            const { type } = request;

            if (type === 'magicss-config') {
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {},
                    function() {
                        // This if condition check is required to avoid unwanted warnings
                        // TODO: FIXME: Is there some better solution possible?
                        if (chrome.runtime.lastError) {
                            // Currently doing nothing
                        }

                        // DEV-HELPER: Useful when developing / debugging
                        if (false) { // eslint-disable-line no-constant-condition
                            setTimeout(async () => {
                                await updateRemoteConfig();
                                sendResponse(remoteConfig);
                            });
                        } else {
                            sendResponse(remoteConfig);
                        }
                    }
                );
                // Need to return true to run "sendResponse" in async manner
                // Ref: https://developer.chrome.com/docs/extensions/mv2/messaging/#simple
                return true;
            } else if (type === 'magicss-instance-info') {
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {},
                    function() {
                        // This if condition check is required to avoid unwanted warnings
                        // TODO: FIXME: Is there some better solution possible?
                        if (chrome.runtime.lastError) {
                            // Currently doing nothing
                        }

                        sendResponse([instanceUuid, instanceBasisNumber]);
                    }
                );
                // Need to return true to run "sendResponse" in async manner
                // Ref: https://developer.chrome.com/docs/extensions/mv2/messaging/#simple
                return true;
            }
        }
    );
}

const tabConnectivityMap = {};
if (myWin.flagEditorInExternalWindow) {
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

                (async () => {
                    // const windowForExternalEditor = (
                    //     window
                    //         .open(
                    //             (
                    //                 `${chrome.runtime.getURL('external-editor.html')}` +
                    //                 `?tabId=${sender.tab.id}` +
                    //                 `&tabTitle=${encodeURIComponent(request.tabTitle)}` +
                    //                 `&tabOriginWithSlash=${encodeURIComponent(tabOriginWithSlash)}` +
                    //                 `&magicssHostSessionUuid=${encodeURIComponent(request.magicssHostSessionUuid)}`
                    //             ),
                    //             `Magic CSS (Random Name: ${Math.random()})`,
                    //             `width=${width},height=${height},scrollbars=yes,resizable=yes` // scrollbars=yes is required for some browsers (like FF & IE)
                    //         )
                    // );
                    const windowForExternalEditor = await chrome.windows.create({
                        url: (
                            `${chrome.runtime.getURL('external-editor.html')}` +
                                `?tabId=${sender.tab.id}` +
                                `&tabTitle=${encodeURIComponent(request.tabTitle)}` +
                                `&tabOriginWithSlash=${encodeURIComponent(tabOriginWithSlash)}` +
                                `&magicssHostSessionUuid=${encodeURIComponent(request.magicssHostSessionUuid)}`
                        ),
                        width,
                        height,
                        type: 'popup',
                        focused: true
                    });

                    // windowForExternalEditor.focus();

                    tabConnectivityMap[sender.tab.id] = windowForExternalEditor;
                })();
            } else if (request.closeExternalEditor) {
                (async () => {
                    const windowForExternalEditor = tabConnectivityMap[sender.tab.id];
                    if (windowForExternalEditor) {
                        await chrome.windows.remove(windowForExternalEditor.id);
                    }
                    delete tabConnectivityMap[sender.tab.id];
                })();
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

                        (async () => {
                            let response = null;
                            let responseText = null;
                            try {
                                response = await fetch(ajaxOb.url, {
                                    method: ajaxOb.type,
                                    headers: ajaxOb.headers,
                                    body: ajaxOb.data
                                });
                                responseText = await response.text();

                                if (!response.ok) {
                                    throw new Error('Response is not ok');
                                }

                                let responseToReturn = null;
                                if (
                                    request.subTypeOptions &&
                                    request.subTypeOptions.provideResponseAs === 'json'
                                ) {
                                    responseToReturn = JSON.parse(responseText);
                                } else {
                                    responseToReturn = responseText;
                                }
                                sendResponse([
                                    null,
                                    responseToReturn,
                                    {
                                        status: response.status,
                                        contentType: response.headers.get('content-type'),
                                        responseText
                                    }
                                ]);
                            } catch (err) {
                                if (!responseText) {
                                    try {
                                        responseText = await response.text();
                                    } catch (e) {
                                        // do nothing
                                    }
                                }
                                sendResponse([
                                    err,
                                    null,
                                    {
                                        status: response?.status || 0,
                                        contentType: response?.headers?.get?.('content-type'),
                                        responseText
                                    }
                                ]);
                            }
                        })();

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

/*
// Not used anymore

if (myWin.flagEditorInExternalWindow) {
    // do nothing
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Set icon for dark mode of browser
        chrome.action.setIcon({
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
/* */

console.log('Welcome :)');

console.log('If you notice any issues/errors here, kindly report them at:\n    https://github.com/webextensions/live-css-editor/issues');

// var runningInChromiumExtensionLikeEnvironment = function () {
//     if (window.location.href.indexOf('chrome-extension://') === 0) {
//         return true;
//     } else {
//         return false;
//     }
// };

var runningInFirefoxExtensionLikeEnvironment = function () {
    // if (window.location.href.indexOf('moz-extension://') === 0) {
    //     return true;
    // } else {
    //     return false;
    // }

    const browser = getBrowserStrategyGetManifest();
    if (browser.name === 'firefox') {
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
        chrome.action.setTitle({ tabId: tabId, title: message });
        if (badgeText) {
            chrome.action.setBadgeText({ tabId: tabId, text: badgeText });
        }
        if (badgeBackgroundColor) {
            chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: badgeBackgroundColor });
        }
    }

    // Note:
    //     alert() does not work on Firefox
    //     https://bugzilla.mozilla.org/show_bug.cgi?id=1203394
    // if (runningInChromiumLikeEnvironment()) {
    if (!runningInFirefoxExtensionLikeEnvironment()) {
        // alert(message);
        (async () => {
            await chrome.offscreen.createDocument({
                url: (
                    chrome.runtime.getURL('alert.html') +
                    '?message=' + encodeURIComponent(message)
                ),
                reasons: ['DISPLAY_MEDIA'],
                justification: 'show an alert that extension does not work on various special pages'
            });
            await chrome.offscreen.closeDocument();
        })();
    }
};

// https://github.com/webextensions/live-css-editor/issues/5
// Apparently, when a user plays around with Chrome devtools for a webpage, intermittently,
// we notice that the listeners were going missing. Probably because, somehow, the extension
// was getting reloaded and since previously, we were attaching the listeners only when the
// user loaded the extension in a webpage, the events were not getting reattached on reload.
// So, for fixing that, now we are attaching the events as soon as the extension loads.

if (!myWin.openOptionsPageListenerAdded) {
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
        myWin.openOptionsPageListenerAdded = true;
    }
}

if (!myWin.loadRemoteJsListenerAdded) {
    if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.loadRemoteJs) {
                    (async () => {
                        try {
                            const response = await fetch(request.loadRemoteJs);
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }

                            let remoteCode = await response.text();
                            if (request.preRunReplace) {
                                for (var i = 0; i < request.preRunReplace.length; i++) {
                                    remoteCode = remoteCode.replace(request.preRunReplace[i].oldText, request.preRunReplace[i].newText);
                                }
                            }
                            (async () => {
                                // const allFrames = await getAllFramesAsync();
                                // chrome.tabs.executeScript(
                                //     sender.tab.id,
                                //     { code: remoteCode, allFrames: allFrames},
                                //     function(){
                                //         sendResponse();
                                //     }
                                // );

                                // Does not work in Manifest V3
                                // Future solution: https://github.com/w3c/webextensions/blob/main/proposals/user-scripts-api.md
                                sendResponse('error');
                            })();
                        } catch (error) {
                            sendResponse('error');
                        }
                    })();

                    // https://developer.chrome.com/extensions/messaging
                    // Need to return true from the event listener to indicate that we wish to send a response asynchronously
                    return true;
                } else if (request.requestPermissions) {
                    if (myWin.flagEditorInExternalWindow) {
                        return;
                    }

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
        );
        myWin.loadRemoteJsListenerAdded = true;
    }
}

if (!myWin.apiHelperForContentScriptAdded) {
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
        myWin.apiHelperForContentScriptAdded = true;
    }
}

var getFromChromeStorageAsync = async function (property) {
    var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

    const value = await chromeStorageGet(chromeStorageForExtensionData, property);
    return value;
};

var getAllFramesAsync = async function () {
    const value = await getFromChromeStorageAsync(USER_PREFERENCE_ALL_FRAMES);
    return value === 'yes';
};

var reapplyCss = async function (tabId) {
    const allFrames = await getAllFramesAsync();

    var // pathScripts = 'scripts/',
        // path3rdparty = pathScripts + '3rdparty/',
        pathDist = 'dist/';

    var arrScripts = [];

    // arrScripts.push(path3rdparty + 'amplify-store.js');
    // arrScripts.push(pathScripts + 'utils.js');
    // arrScripts.push(pathScripts + 'migrate-storage.js');
    // arrScripts.push(pathScripts + 'reapply-css.js');
    arrScripts.push(pathDist + 'load-reapply.bundle.js');

    extLib.loadMultipleJsCss({
        treatAsNormalWebpage: myWin.treatAsNormalWebpage,
        arrSources: arrScripts,
        allFrames,
        tabId,
        runAt: 'document_start'
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
    var pathDist = 'dist/',
        pathScripts = 'scripts/'
        // path3rdparty = pathScripts + '3rdparty/',
        // path3rdpartyCustomFixes = pathScripts + '3rdparty-custom-fixes/',
        // pathMagicss = pathScripts + 'magicss/',
        // pathEditor = pathMagicss + 'editor/',
        // pathCodeMirror = path3rdparty + 'codemirror/'
        ;

    // var runningInBrowserExtension = (document.location.protocol === "chrome-extension:" || document.location.protocol === "moz-extension:" || document.location.protocol === "ms-browser-extension:") ? true : false;
    // Also see: http://stackoverflow.com/questions/7507277/detecting-if-code-is-being-run-as-a-chrome-extension/22563123#22563123
    // var runningInChromeExtension = window.chrome && chrome.runtime && chrome.runtime.id;

    (async () => {
        const [tabActiveCurrentWindow] = await chrome.tabs.query({ active: true, currentWindow: true });
        let tabId = tabActiveCurrentWindow?.id;
        if (!tabId) {
            const [tabActiveLastFocusedWindow] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            tabId = tabActiveLastFocusedWindow?.id;
        }

        const allFrames = await getAllFramesAsync();

        extLib.loadMultipleJsCss({
            treatAsNormalWebpage: myWin.treatAsNormalWebpage,
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

                pathDist + 'load-editor.bundle.js',
                pathDist + 'load-editor.bundle.css'

                /*
                {
                    src: path3rdparty + 'jquery.js',
                    skip: typeof jQuery !== "undefined" || runningInBrowserExtension ? false : true
                },
                // {
                //     src: pathScripts + 'chrome-extension-lib/ext-lib.js',
                //     skip: typeof extLib !== "undefined" || runningInBrowserExtension ? false : true
                // },

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

                // Commented out so that Opera users can use Sass the way it is loaded in Chrome (when installed from Chrome Web Store)
                // {
                //     src: path3rdparty + 'sass/sass.sync.min.js',
                //     skip: (runningInBrowserExtension && isOpera) ? false : true
                // },

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
                /* */
            ],
            allFrames,
            // tabId: undefined,
            tabId,
            done: function () {
                // Currently doing nothing
            }
        });
    })();
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
    if (typeof chrome !== "undefined" && chrome && chrome.action) {
        chrome.action.onClicked.addListener(function (tab) {
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
                if (runningInFirefoxExtensionLikeEnvironment()) {
                    goAhead();
                } else { // if (runningInChromiumExtensionLikeEnvironment()) {
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
                } // else {
                //     var message = (
                //         'For your browser, "Live editor for CSS, Less & Sass" (Magic CSS) does not support running on:' +
                //         '\n    ' + url
                //     );
                //     informUser({
                //         message: message,
                //         tab: tab,
                //         badgeText: '!',
                //         badgeBackgroundColor: '#b00'
                //     });
                //     return;
                // }
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

if (myWin.flagEditorInExternalWindow) {
    main();
} else {
    prerequisitesReady(function (tab) {
        main(tab);
    });
}

var parseUrl = function(href) {
    // var l = document.createElement("a");
    // l.href = href;
    // return l;

    var url = new URL(href);
    return url;
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
    if (!myWin.onDOMContentLoadedListenerAdded) {
        if (chrome.webNavigation) {
            chrome.webNavigation.onCommitted.addListener(function(details) {
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
                        if (runningInFirefoxExtensionLikeEnvironment()) { // TODO: Move to optional_permissions when Firefox supports it and refactor this code
                            (async () => {
                                await reapplyCss(tabId);
                            })();
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
                                        (async () => {
                                            await reapplyCss(tabId);
                                        })();
                                    } else {
                                        // do nothing because we don't have enough permissions
                                    }
                                });
                            }
                        }
                    }
                });
            });
            myWin.onDOMContentLoadedListenerAdded = true;
        }
    }
};

if (myWin.flagEditorInExternalWindow) {
    // do nothing
} else {
    onDOMContentLoadedHandler();
}

if (myWin.flagEditorInExternalWindow) {
    // do nothing
} else {
    // DEVHELPER: Useful for debugging purposes
    /*
    (async () => {
        const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await timeout(1000);

        debugger;
        console.log('The Service Worker will deregister in 10 seconds.');
        await timeout(10000);
        await self.registration.unregister();
        console.log('Service Worker is deregistered now.');
    })();
    /* */
}

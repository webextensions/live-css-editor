/* global chrome */

import mixpanel from 'mixpanel-browser';

import { chromeStorageLocalGet } from './utils/chromeStorage.js';
import { isValidUuidV4 } from './utils/isValidUuidV4.js';

import { mainFnMetricsHandler } from './appUtils/mainFnMetricsHandler.js';

// // Useful for debugging purposes
// import { myWin } from './appUtils/myWin.js';
// myWin.mixpanel = mixpanel;

const INSTANCE_UUID = 'instance-uuid';

let gaListenerAdded = false;
let metricsListenerAdded = false;

/*
const flagDevMode = (function () {
    let flag = false;
    try {
        // TODO: Verify that this works well across browsers
        // https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode/20227975#20227975
        flag = (!('update_url' in chrome.runtime.getManifest()));
    } catch (e) {
        // do nothing
    }
    return flag;
})();
/* */

const isDevMode = function (extension) {
    if (extension.installType === chrome.management.ExtensionInstallType['DEVELOPMENT']) { // 'development'
        return true;
    } else {
        return false;
    }
};

(function() {
    try {
        chrome.management.getSelf(function (extension) {
            /* */
            // We may wish to enable/disable it for development and debugging depending on the functionality we are working on
            if (isDevMode(extension)) { // 'development'
                return;
            }
            /* */

            try {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
                const getRandomIntInclusive = function (min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
                };

                // Some random delay which should not be too high since the background page of the extension can become inactive after a few seconds
                const delay = getRandomIntInclusive(2250, 4500);
                setTimeout(
                    function () {
                        (async function () {
                            const instanceUuid = await chromeStorageLocalGet(INSTANCE_UUID);
                            if (isValidUuidV4(instanceUuid)) {
                                const MIXPANEL_PROJECT_TOKEN = '672f8c9aa876de5834bc48330f074412';
                                if (isDevMode(extension)) {
                                    mixpanel.init(MIXPANEL_PROJECT_TOKEN, { debug: true });
                                } else {
                                    mixpanel.init(MIXPANEL_PROJECT_TOKEN);
                                }
                                mixpanel.identify(instanceUuid);
                            }
                        }());
                    },
                    // Load with a delay since this network request is not required for showing the UI of the extension
                    delay
                );
            } catch (e) {
                // do nothing
            }
        });
    } catch (e) {
        // do nothing
    }

    if (!gaListenerAdded) {
        if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                    if (request.type === 'mixpanel') {
                        if (request.subType === 'event') {
                            const evt = request.payload;

                            // `mixpanel._flags` seems to be getting set when we call the mixpanel.init() method, without
                            // calling `mixpanel.init()`, we can't do tracking.
                            // TODO: We may wish to improve this logic of `if(...)` condition
                            if (mixpanel._flags) {
                                mixpanel.track(evt.name, evt);
                            }
                        }
                    }
                }
            );
            gaListenerAdded = true;
        }
    }

    if (!metricsListenerAdded) {
        if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                    if (request.type === 'metrics') {
                        (async () => {
                            const payload = request.payload || {};
                            const event = payload.event;

                            await mainFnMetricsHandler({ event });
                        })();
                    }
                }
            );
            metricsListenerAdded = true;
        }
    }
})();

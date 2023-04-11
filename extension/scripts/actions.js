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

const computeFlagRunningInDevMode = async function () {
    const extension = await chrome.management.getSelf();
    let flag = null;
    if (isDevMode(extension)) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
};

const setupMixpanel = async function () {
    const flagRunningInDevMode = await computeFlagRunningInDevMode();

    if (flagRunningInDevMode) {
        // DEV: DEBUG: We may wish to enable/disable it for development and debugging depending on the functionality we are working on
        return false;
    }

    try {
        const instanceUuid = await chromeStorageLocalGet(INSTANCE_UUID);
        if (isValidUuidV4(instanceUuid)) {
            const MIXPANEL_PROJECT_TOKEN = '672f8c9aa876de5834bc48330f074412';
            if (flagRunningInDevMode) {
                mixpanel.init(
                    MIXPANEL_PROJECT_TOKEN,
                    {
                        api_host: "http://localhost:8040",
                        api_method: 'GET',
                        api_payload_format: 'json',
                        debug: true
                    }
                );
            } else {
                mixpanel.init(MIXPANEL_PROJECT_TOKEN);
            }
            mixpanel.identify(instanceUuid);
            return true;
        }
    } catch (e) {
        // do nothing
    }
    return false;
};
let flagMixpanelSetupDone = false;

(function() {
    if (!gaListenerAdded) {
        if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                    if (request.type === 'mixpanel') {
                        if (request.subType === 'event') {
                            const evt = request.payload;

                            (async () => {
                                if (!flagMixpanelSetupDone) {
                                    flagMixpanelSetupDone = await setupMixpanel();
                                }

                                if (flagMixpanelSetupDone) {
                                    mixpanel.track(evt.name, evt);
                                }
                            })();
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

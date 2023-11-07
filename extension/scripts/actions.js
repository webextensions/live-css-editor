/* global chrome */

import mixpanel from 'mixpanel-browser';

import { chromeStorageLocalGet } from './utils/chromeStorage.js';
import { isValidUuidV4 } from './utils/isValidUuidV4.js';

import { isFeatureEnabled } from './appUtils/isFeatureEnabled.js';
import { mainFnMetricsHandler } from './appUtils/mainFnMetricsHandler.js';

import { myWin } from './appUtils/myWin.js';

// // Useful for debugging purposes
// myWin.mixpanel = mixpanel;

const INSTANCE_UUID = 'instance-uuid';

let mpListenerAdded = false;
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
        // DEV-HELPER: We may wish to enable/disable it for development and debugging depending on the functionality we are working on
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
    if (!mpListenerAdded) {
        if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                    if (request.type === 'mixpanel') {
                        (async () => {
                            // If the service worker had shut down and started again due to this listener, then we shall
                            // wait for the remote config to be updated (loaded)
                            if (myWin.remoteConfig.mode === 'offline') {
                                await myWin.updateRemoteConfig();
                            }

                            if (await isFeatureEnabled(myWin?.remoteConfig?.features?.useMixpanel?.enabled)) {
                                if (request.subType === 'event') {
                                    const evt = request.payload;

                                    if (!flagMixpanelSetupDone) {
                                        flagMixpanelSetupDone = await setupMixpanel();
                                    }

                                    if (flagMixpanelSetupDone) {
                                        mixpanel.track(evt.name, evt);
                                    }
                                }
                            }
                        })();
                    }
                }
            );
            mpListenerAdded = true;
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

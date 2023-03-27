/* globals chrome */

import { chromeStorageLocalGet } from './utils/chromeStorage.js';

import { mainFnMetricsHandler } from './appUtils/mainFnMetricsHandler.js';

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

(function() {
    // https://developer.chrome.com/docs/extensions/mv2/tut_analytics/
    // https://developer.chrome.com/docs/extensions/mv3/tut_analytics/

    // window._gaq = window._gaq || [];
    // window._gaq.push(['_setAccount', 'UA-198813835-4']);
    // window._gaq.push(['_gat._forceSSL']); // https://stackoverflow.com/questions/37799578/google-analytics-force-https-to-prevent-307-internal-redirect/37799579#37799579

    // // Global site tag (gtag.js)
    // window.dataLayer = window.dataLayer || [];
    // function gtag() {
    //     window.dataLayer.push(arguments);
    // }
    // gtag('js', new Date());
    // gtag('config', '<MEASUREMENT-ID-GOES-HERE>'); // TODO: Provide Measurement ID here

    try {
        chrome.management.getSelf(function (extension) {
            // We may wish to enable/disable it during development/debugging depending on the functionality we are working on
            if (extension.installType === chrome.management.ExtensionInstallType['DEVELOPMENT']) { // 'development'
                return;
            }

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
                        const ga = document.createElement('script');
                        ga.type = 'text/javascript';
                        ga.async = true;
                        ga.src = 'https://ssl.google-analytics.com/ga.js';
                        const s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(ga, s);

                        (async function () {
                            // TODO: REUSE: Move this under "extLib"
                            const isValidUuidV4 = function (str) {
                                const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                                if (v4Regex.test(str)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };

                            const instanceUuid = await chromeStorageLocalGet(INSTANCE_UUID);
                            if (isValidUuidV4(instanceUuid)) {
                                window._gaq.push(['set', 'userId', instanceUuid]);
                            }
                        }());

                        // // Global site tag (gtag.js)
                        // // TODO: Add https://www.googletagmanager.com for "content_security_policy" in manifest-generator.mjs when enabling this
                        // // WAIT: For moving to GA4, we have to wait till this gets fixed
                        // //  * https://issuetracker.google.com/issues/174954288
                        // // Further references:
                        // //  * https://stackoverflow.com/questions/50010945/how-to-make-gtag-to-work-in-chrome-extension
                        // //  * https://stackoverflow.com/questions/45502706/gtm-pushing-events-data-to-gtm-datalayer-not-sending-anything-to-https-www-g/45560244#45560244
                        // //  * https://www.simoahava.com/gtm-tips/gtmtips-deploy-gtm-chrome-extension/
                        // const ga = document.createElement('script');
                        // ga.type = 'text/javascript';
                        // ga.async = true;
                        // ga.src = 'https://www.googletagmanager.com/gtag/js?id=<MEASUREMENT-ID-GOES-HERE>'; // TODO: Provide Measurement ID here
                        // const s = document.getElementsByTagName('script')[0];
                        // s.parentNode.insertBefore(ga, s);
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
                    if (request.type === 'ga') {
                        window._gaq.push(request.payload);

                        // // Global site tag (gtag.js)
                        // window.dataLayer.push({'event': 'dummy-event'});
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

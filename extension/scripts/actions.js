/* globals chrome, extLib, jQuery, remoteConfig */

// TODO: Share constants across files (like magicss.js, editor.js and options.js) (probably keep them in a separate file as global variables)
const USER_PREFERENCE_THEME = 'theme';
const USER_PREFERENCE_STORAGE_MODE = 'storage-mode';
const USER_PREFERENCE_DEFAULT_LANGUAGE_MODE = 'default-language-mode';
const USER_PREFERENCE_USE_TAB_FOR_INDENTATION = 'use-tab-for-indentation';
const USER_PREFERENCE_INDENTATION_SPACES_COUNT = 'indentation-spaces-count';

const INSTANCE_UUID = 'instance-uuid';

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

const ajaxGet = async function ({ url }) {
    return new Promise((resolve) => {
        jQuery.ajax({
            url,
            method: 'get',
            success: function (data) {
                resolve([null, data]);
            },
            error: function (err) {
                resolve([err]);
            }
        });
    });
};

const chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;
const getExtensionDataAsync = function (property) {
    return new Promise(function (resolve) {
        chromeStorageForExtensionData.get(property, function (values) {
            if (property) {
                resolve(values[property]);
            } else {
                resolve(values);
            }
        });
    });
};

const getChromeLocalStorageDataAsync = function (property) {
    return new Promise(function (resolve) {
        chrome.storage.local.get(property, function (values) {
            if (property) {
                resolve(values[property]);
            } else {
                resolve(values);
            }
        });
    });
};

// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js/38241481#38241481
const getOS = function () {
    let os = 'unknown';
    try {
        const
            userAgent = window.navigator.userAgent,
            userAgentData = window.navigator.userAgentData || {},
            platform = userAgentData.platform || window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'macOS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (/Linux/.test(platform)) {
            os = 'Linux';
        }
    } catch (e) {
        // do nothing
    }
    return os;
};

// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser/16938481#16938481
const getBrowserViaUserAgent = function () {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
};

const getBrowser = function () {
    let response = {
        browser: '',
        browserWithVersion: ''
    };
    try {
        const userAgentData = window.navigator.userAgentData || {};
        const brands = userAgentData.brands || [];

        for (const ob of brands) {
            const brand = ((brand) => {
                if (brand === 'Google Chrome') {
                    return 'Chrome';
                } else if (brand === 'Microsoft Edge') {
                    return 'Edge';
                } else {
                    return brand;
                }
            })(ob.brand);
            if (
                brand === 'Chrome' ||
                brand === 'Edge' ||
                brand === 'Brave' ||
                brand === 'Opera' ||
                (
                    brand === 'Chromium' &&
                    !response.browser
                )
            ) {
                response = {
                    browser: brand,
                    browserWithVersion: brand + ' ' + ob.version
                };
            }
        }

        if (!response.browser) {
            const { name, version } = getBrowserViaUserAgent();
            response = {
                browser: name,
                browserWithVersion: name + ' ' + version
            };
        }
    } catch (e) {
        response = {
            browser: 'error',
            browserWithVersion: 'error'
        };
    }

    if (!response.browser) {
        response = {
            browser: 'unexpected',
            browserWithVersion: 'unexpected'
        };
    }

    return response;
};

window.timeout = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

window.getUuid = async function () {
    let uuid;

    for (let i = 0; i < 5; i++) {
        uuid = await extLib.chromeStorageLocalGet(INSTANCE_UUID);
        if (uuid) {
            break;
        }
        await window.timeout(1000);
    }

    if (uuid) {
        return [null, uuid];
    } else {
        const errToReport = new Error(`Unable to fetch the ${INSTANCE_UUID}`);
        console.error(errToReport);
        return [errToReport];
    }
};

window.basisNumberFromUuid = function (uuid) {
    const uuidWithoutHyphen = uuid.replace(/-/g, '');
    let basisString = BigInt(`0x${uuidWithoutHyphen}`).toString();
    basisString = basisString.slice(basisString.length - 4);
    const basisNumber = parseInt(basisString) + 1;
    return basisNumber;
};

window.isFeatureEnabled = async function (enabledOrConditions) {
    let flag = false;

    const instanceUuid = await extLib.chromeStorageLocalGet(INSTANCE_UUID);
    const basisNumber = window.basisNumberFromUuid(instanceUuid);

    if (enabledOrConditions === true) {
        flag = true;
    } else if (Array.isArray(enabledOrConditions)) {
        const conditions = enabledOrConditions;
        for (const condition of conditions) {
            if (Array.isArray(condition)) {
                const [from, to] = condition;
                if (from <= basisNumber && basisNumber <= to) {
                    flag = true;
                    break;
                }
            } else if (typeof condition === 'string') {
                if (instanceUuid.indexOf(condition) >= 0) {
                    flag = true;
                    break;
                }
            }
        }
    }

    return flag;
};

window.detailsGenerator = async function () {
    try {
        const [err, uuid] = await window.getUuid();

        if (err) {
            const errorToReport = new Error('Error: Failed to generate details due to missing uuid', { cause: err });
            console.error(errorToReport);
            return [errorToReport];
        }

        const { browser, browserWithVersion } = getBrowser();

        let details = {
            uuid,
            launchesCount: (await getExtensionDataAsync('magicss-execution-counter')) || 0,
            version: chrome.runtime.getManifest().version,
            lang: navigator.language,
            langsList: navigator.languages,
            os: getOS(),
            browser,
            browserVersion: browserWithVersion,
            ua: navigator.userAgent,
            editMode: (await getExtensionDataAsync(USER_PREFERENCE_DEFAULT_LANGUAGE_MODE)) || 'css',
            theme: (await getExtensionDataAsync(USER_PREFERENCE_THEME)) || 'light',
            indent: await (async () => {
                if ((await getExtensionDataAsync(USER_PREFERENCE_USE_TAB_FOR_INDENTATION)) === 'yes') {
                    return 'tab';
                } else {
                    return 'spaces-' + ((await getExtensionDataAsync(USER_PREFERENCE_INDENTATION_SPACES_COUNT)) || 4);
                }
            })(),
            storage: (await getExtensionDataAsync(USER_PREFERENCE_STORAGE_MODE)) || 'chrome.storage.local',
            originsCount: await (async () => {
                try {
                    const response = await getChromeLocalStorageDataAsync(null);
                    let keys = Object.keys(response);
                    const origins = keys.filter((key) => {
                        if (key.indexOf('(') === 0 && key.indexOf(') ') !== -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }).map((key) => {
                        return key.split('(')[1].split(') ')[0];
                    });
                    const uniqueOrigins = [...new Set(origins)];

                    return uniqueOrigins.length;
                } catch (e) {
                    return -1;
                }
            })()
        };

        return [null, details];
    } catch (e) {
        console.error(e);
        console.error('Error: Failed to generate details due to the error logged above');
        return [e];
    }
};

window.metricsUrlGenerator = async function ({ event, details, uninstallPathOnServer }) {
    if (uninstallPathOnServer) {
        const url = uninstallPathOnServer + '?uuid=' + details.uuid;
        return url;
    } else {
        const detailsParam = JSON.stringify(details);
        const parameters = {
            v: '1.0.0',
            appId: 'magic-css',
            event,
            details: detailsParam
        };
        const queryString = new URLSearchParams(parameters).toString();

        // The code would reach here only when the config is loaded from remote
        const metricsApiServer = remoteConfig.config.metricsApi.server;
        const metricsApiCollectionPath = remoteConfig.config.metricsApi.collectionPath;

        const url = metricsApiServer + metricsApiCollectionPath + '?' + queryString;
        return url;
    }
};

window.ongoingRequests = window.ongoingRequests || 0;
window.mainFnMetricsHandler = async function ({ event }) {
    try {
        await window.remoteConfigLoadedFromRemote;

        if (
            remoteConfig.features &&
            remoteConfig.features.useMetrics &&
            await window.isFeatureEnabled(remoteConfig.features.useMetrics.enabled)
        ) {
            const [err, details] = await window.detailsGenerator();

            if (err) {
                const errorToReport = new Error('Error: Unable to record metrics', { cause: err });
                console.log(errorToReport);
                return [errorToReport];
            }
            const url = await window.metricsUrlGenerator({
                event,
                details
            });

            // Allow only one request at a time
            let delay = 5;
            while (true) { // eslint-disable-line no-constant-condition
                if (window.ongoingRequests >= 1) {
                    delay *= 2;
                    await window.timeout(delay);
                } else {
                    break;
                }
            }

            window.ongoingRequests++;
            let [errAjax] = await ajaxGet({
                url
            });
            window.ongoingRequests--;
            if (errAjax) {
                console.error('Error in recording metrics:');
                console.error(errAjax);
            }
        }
    } catch (e) {
        // do nothing
    }
};

(function() {
    // https://developer.chrome.com/docs/extensions/mv2/tut_analytics/
    // https://developer.chrome.com/docs/extensions/mv3/tut_analytics/

    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', 'UA-198813835-4']);
    window._gaq.push(['_gat._forceSSL']); // https://stackoverflow.com/questions/37799578/google-analytics-force-https-to-prevent-307-internal-redirect/37799579#37799579

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

                            const instanceUuid = await extLib.chromeStorageLocalGet(INSTANCE_UUID);
                            if (isValidUuidV4(instanceUuid)) {
                                window._gaq.push(['set', 'userId', instanceUuid]);
                            }
                        }());

                        // // Global site tag (gtag.js)
                        // // TODO: Add https://www.googletagmanager.com for "content_security_policy" in manifest-generator.js when enabling this
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

    if (!window.gaListenerAdded) {
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
            window.gaListenerAdded = true;
        }
    }

    if (!window.metricsListenerAdded) {
        if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {      // eslint-disable-line no-unused-vars
                    if (request.type === 'metrics') {
                        (async () => {
                            const payload = request.payload || {};
                            const event = payload.event;

                            await window.mainFnMetricsHandler({ event });
                        })();
                    }
                }
            );
            window.metricsListenerAdded = true;
        }
    }
})();

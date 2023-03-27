/* globals chrome, remoteConfig */

import * as jQuery from '../3rdparty/jquery.js';

import { getUuid } from './getUuid.js';
import { isFeatureEnabled } from './isFeatureEnabled.js';
import { metricsUrlGenerator } from './metricsUrlGenerator.js';
import { myWin } from './myWin.js';

// TODO: Share constants across files (like magicss.js, editor.js and options.js) (probably keep them in a separate file as global variables)
const USER_PREFERENCE_THEME = 'theme';
const USER_PREFERENCE_STORAGE_MODE = 'storage-mode';
const USER_PREFERENCE_DEFAULT_LANGUAGE_MODE = 'default-language-mode';
const USER_PREFERENCE_USE_TAB_FOR_INDENTATION = 'use-tab-for-indentation';
const USER_PREFERENCE_INDENTATION_SPACES_COUNT = 'indentation-spaces-count';

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

const timeout = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

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

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Platform#directives
        if (
            [
                'Android',
                'Chrome OS',
                'Chromium OS',
                'iOS',
                'Linux',
                'macOS',
                'Windows'
            ].includes(platform)
        ) {
            os = platform;
        } else if (macosPlatforms.indexOf(platform) !== -1) {
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

const detailsGenerator = async function () {
    try {
        const [err, uuid] = await getUuid();

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

let ongoingRequests = 0;
const mainFnMetricsHandler = async function ({ event }) {
    try {
        await myWin.remoteConfigLoadedFromRemote;

        if (
            remoteConfig.features &&
            remoteConfig.features.useMetrics &&
            await isFeatureEnabled(remoteConfig.features.useMetrics.enabled)
        ) {
            const [err, details] = await detailsGenerator();

            if (err) {
                const errorToReport = new Error('Error: Unable to record metrics', { cause: err });
                console.log(errorToReport);
                return [errorToReport];
            }
            const url = await metricsUrlGenerator({
                remoteConfig,
                event,
                details
            });

            // Allow only one request at a time
            let delay = 5;
            while (true) { // eslint-disable-line no-constant-condition
                if (ongoingRequests >= 1) {
                    delay *= 2;
                    await timeout(delay);
                } else {
                    break;
                }
            }

            ongoingRequests++;
            let [errAjax] = await ajaxGet({
                url
            });
            ongoingRequests--;
            if (errAjax) {
                console.error('Error in recording metrics:');
                console.error(errAjax);
            }
        }
    } catch (e) {
        // do nothing
    }
};

export { mainFnMetricsHandler };

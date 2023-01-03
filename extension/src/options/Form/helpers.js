/* global utils, chrome */

const chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

const notifyUser = function () {
    utils.alertNote('Your change would apply next time onwards :-)', 2500);
};

const isSassUiAllowed = (function () {
    let flagAllowSassUi = null;
    return function () {
        if (flagAllowSassUi === null) {
            // TODO: DUPLICATE: Code duplication for browser detection in commands.js, ext-lib.js, magicss.js and options.js
            let isChrome = false,
                isEdge = false,
                isFirefox = false,
                isOpera = false,
                isChromiumBased = false;

            // Note that we are checking for "Edg/" which is the test required for identifying Chromium based Edge browser
            if (/Edg\//.test(navigator.appVersion)) {           // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
                isEdge = true; // eslint-disable-line no-unused-vars
            } else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
                isOpera = true; // eslint-disable-line no-unused-vars
            } else if (/Chrome/.test(navigator.appVersion)) {
                isChrome = true; // eslint-disable-line no-unused-vars
            } else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
                isFirefox = true;
            }
            if (isEdge || isOpera || isChrome) {
                isChromiumBased = true; // eslint-disable-line no-unused-vars
            }

            flagAllowSassUi = isFirefox ? false : true;
        }
        return flagAllowSassUi;
    };
})();

export {
    chromeStorageForExtensionData,
    notifyUser,
    isSassUiAllowed
};

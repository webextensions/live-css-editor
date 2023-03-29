/* global chrome */

const TR = function (key, defaultValue) {
    if (
        typeof chrome !== 'undefined' &&
        chrome?.i18n?.getMessage
    ) {
        return chrome.i18n.getMessage(key);
    } else {
        if (defaultValue) {
            return defaultValue;
        } else {
            console.warn('No default value available for key: ' + key);
            return '';
        }
    }
};

export { TR };

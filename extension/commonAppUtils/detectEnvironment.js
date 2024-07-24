/* global chrome */

const runningInKiwiExtensionLikeEnvironment = function () {
    // An error shouldn't occur. This try...catch block is just for extra safety.
    try {
        const manifest = chrome.runtime.getManifest();
        if (manifest.name.indexOf('Kiwi Browser') !== -1) {
            return true;
        }
    } catch (e) {
        // do nothing
    }

    return false;
};

export {
    runningInKiwiExtensionLikeEnvironment
};

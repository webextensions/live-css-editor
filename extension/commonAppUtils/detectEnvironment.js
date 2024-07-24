/* global chrome */

let flagRunningInKiwiExtensionLikeEnvironment = null;
const runningInKiwiExtensionLikeEnvironment = function () {
    if (flagRunningInKiwiExtensionLikeEnvironment !== null) {
        return flagRunningInKiwiExtensionLikeEnvironment;
    }

    // An error shouldn't occur. This try...catch block is just for extra safety.
    try {
        const manifest = chrome.runtime.getManifest();
        if (manifest.name.indexOf('Kiwi Browser') !== -1) {
            flagRunningInKiwiExtensionLikeEnvironment = true;
        } else {
            flagRunningInKiwiExtensionLikeEnvironment = false;
        }
    } catch (e) {
        flagRunningInKiwiExtensionLikeEnvironment = false;
    }

    return flagRunningInKiwiExtensionLikeEnvironment;
};

export {
    runningInKiwiExtensionLikeEnvironment
};

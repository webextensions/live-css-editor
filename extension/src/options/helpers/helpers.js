/* global utils, chrome */

// TODO: DUPLICATE: Move this to a common file (Used elsewhere with name "flagDevMode")
const FLAG_DEV_MODE = (function () {
    let flag = false;
    try {
        const manifest = chrome.runtime.getManifest();
        // TODO: Verify that this works well across browsers
        // https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode/20227975#20227975
        flag = (!('update_url' in manifest));
    } catch (e) {
        // do nothing
    }
    return flag;
})();

const chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

const notifyUser = function () {
    utils.alertNote('Your change would apply next time onwards :-)', 2500);
};

export {
    FLAG_DEV_MODE,
    chromeStorageForExtensionData,
    notifyUser
};

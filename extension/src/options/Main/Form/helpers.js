/* global chrome */

import { getBrowser } from 'helpmate/dist/browser/getBrowser.js';
import { alertNote } from '../../../../scripts/utils/alertNote.js';

const chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

const notifyUser = function () {
    alertNote('Your change would apply next time onwards :-)', 2500);
};

const isSassUiAllowed = (function () {
    let flagAllowSassUi = null;
    return async function () {
        if (flagAllowSassUi === null) {
            const browserDetails = await getBrowser();
            if (browserDetails.name === 'firefox') {
                flagAllowSassUi = false;
            } else {
                flagAllowSassUi = true;
            }
        }
        return flagAllowSassUi;
    };
})();

export {
    chromeStorageForExtensionData,
    notifyUser,
    isSassUiAllowed
};

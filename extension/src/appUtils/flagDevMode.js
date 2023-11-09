/* global chrome */

import { requestUserViaConsoleToReportUnexpectedError } from './requestUserViaConsoleToReportUnexpectedError.js';

export const flagDevMode = (function () {
    let flag = false;
    try {
        // TODO: Verify that this works well across browsers
        // https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode/20227975#20227975
        flag = (!('update_url' in chrome.runtime.getManifest()));
    } catch (e) {
        requestUserViaConsoleToReportUnexpectedError(e);
    }
    return flag;
})();

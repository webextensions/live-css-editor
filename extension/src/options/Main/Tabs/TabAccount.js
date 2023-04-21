/* global chrome */

import React from 'react';

// Use this for the cases where the code should never reach in imaginable scenarios.
const requestUserViaConsoleToReportUnexpectedError = function (e) {
    console.error(e);
    console.error([
        'An unexpected error was encountered by Magic CSS.',
        'Kindly report this issue at:',
        '    https://github.com/webextensions/live-css-editor/issues'
    ].join('\n'));
};
const flagDevMode = (function () {
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

const TabAccount = function () {
    let iframeSrc = 'https://www.webextensions.org/connect';
    if (flagDevMode) {
        iframeSrc = 'https://local.webextensions.org:4443/connect';
    }

    iframeSrc += (
        '?appId=magic-css' +
        '&appVersion=' + chrome.runtime.getManifest().version
    );

    return (
        <div>
            <iframe
                src={iframeSrc}

                // // Allow clipboard acces
                // allow="clipboard-write"

                style={{
                    width: '100%',
                    height: 475,
                    border: 0
                }}
            />
        </div>
    );
};

export { TabAccount };

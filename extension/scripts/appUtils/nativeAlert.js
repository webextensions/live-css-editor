/* global chrome  */

export const nativeAlert = async (message) => {
    await chrome.offscreen.createDocument({
        url: (
            chrome.runtime.getURL('alert.html') +
            '?message=' + encodeURIComponent(message)
        ),
        reasons: ['DISPLAY_MEDIA'],
        justification: 'show an alert that extension does not work on various special pages'
    });
    await chrome.offscreen.closeDocument();
};

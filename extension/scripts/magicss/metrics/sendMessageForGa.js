/* global chrome */

const sendMessageForGa = function (payload) {
    try {
        chrome.runtime.sendMessage({
            type: 'ga',
            payload
        });
    } catch (e) {
        // do nothing
    }
};
window.sendMessageForGa = sendMessageForGa;

export { sendMessageForGa };

/* global chrome */

/*
    For example:
        sendEventMessageForMetrics({
            name: 'openGetIcon',
            spot: 'commandPalette'
        });
*/
const sendEventMessageForMetrics = function (payload) {
    try {
        if (payload) {
            if (
                typeof payload.metricsTarget === 'undefined' ||
                payload.metricsTarget === 'mixpanel'
            ) {
                // eslint-disable-next-line no-unused-vars
                const { metricsTarget, ...evt } = payload;
                chrome.runtime.sendMessage({
                    type: 'mixpanel',
                    subType: 'event',
                    payload: evt
                });
            }
        }
    } catch (e) {
        // do nothing
    }
};
window.sendEventMessageForMetrics = sendEventMessageForMetrics;

export { sendEventMessageForMetrics };

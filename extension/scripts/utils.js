/* global jQuery */

'use strict';

var utils = window.utils || {};

if (!utils.defined) {
    utils.defined = true;

    utils.attachPublishSubscribe = function (attachToObject) {
        var o = jQuery({});
        jQuery.each({
            trigger: 'publish',
            on: 'subscribe',
            off: 'unsubscribe'
        }, function (key, val) {
            attachToObject[val] = function () {
                o[key].apply(o, arguments);
            };
        });
    };
}

if (!utils.attachPublishSubscribeDone) {
    if (typeof jQuery !== 'undefined') {
        utils.attachPublishSubscribeDone = true;
        utils.attachPublishSubscribe(jQuery);
    }
}

// // The following line has been commented out temporarily. See: FIXME.md
// 'This string is added to the end of this file to handle a weird bug/behavior for Firefox. Without this, if "reapply styles automatically" feature is activated, then it would not work and an error would occur in the background script. Reference: https://stackoverflow.com/questions/44567525/inject-scripts-error-script-returned-non-structured-clonable-data-on-firefox-ex/56597154#56597154';

export { utils };

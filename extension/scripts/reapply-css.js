/* global utils, amplify */

(async function () {
    var showReapplyingStylesNotification = true;
    if (window.hideReapplyingStylesNotification === true) {
        showReapplyingStylesNotification = false;
    }
    // TODO: Refactor/Reuse the definition of "userPreference"
    var userPreference = function (pref, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
            var prefix = 'MagiCSS-bookmarklet-';
            if (value === undefined) {
                resolve(amplify.store(prefix + pref) || '');
            } else {
                amplify.store(prefix + pref, value);
                resolve(_this);
            }
        });
    };

    var localStorageDisableStyles = 'disable-styles';
    var disableStyles = await userPreference(localStorageDisableStyles) === 'yes';

    var localStorageApplyStylesAutomatically = 'apply-styles-automatically';
    var applyStylesAutomatically = await userPreference(localStorageApplyStylesAutomatically) === 'yes';

    var localStorageLastAppliedCss = 'last-applied-css';
    var cssText = (await userPreference(localStorageLastAppliedCss)).trim();

    if (cssText && applyStylesAutomatically && !disableStyles) {
        var showReapplyingStylesNotificationAt = (window.showReapplyingStylesNotificationAt || 'top-right').split('-');
        var verticalAlignment = showReapplyingStylesNotificationAt[0] || 'top',
            horizontalAlignment = showReapplyingStylesNotificationAt[1] || 'right';
        var alertNoteConfig = {
            unobtrusive: true,
            verticalAlignment: verticalAlignment,
            horizontalAlignment: horizontalAlignment
        };

        try {
            var id = 'MagiCSS-bookmarklet',
                newStyleTagId = id + '-html-id',
                newStyleTag = new utils.StyleTag({
                    id: newStyleTagId,
                    parentTag: 'body',
                    attributes: [{
                        name: 'data-style-created-by',
                        value: 'magicss'
                    }],
                    overwriteExistingStyleTagWithSameId: true
                });

            newStyleTag.cssText = cssText;

            newStyleTag.disabled = disableStyles;
            // When reapplying styles, try to load them ASAP
            newStyleTag.applyTag();
            // When reapplying styles, ensure that the style tag gets moved towards the bottom of the page (DOM structure) once the page load is complete
            document.addEventListener("DOMContentLoaded", function() {
                newStyleTag.applyTag();
            });

            if (showReapplyingStylesNotification) {
                utils.alertNote(
                    'Activated styles provided in Magic CSS.<br/><span style="font-weight:normal;">Run Magic CSS extension to make any changes.</span>',
                    5000,
                    alertNoteConfig
                );
            }
        } catch (e) {
            // The code should never reach here. Just being cautious :-)
            console.log('An unexpected error was encountered by Magic CSS.');
            console.log(e);
            console.log('Kindly report this issue at:\n    https://github.com/webextensions/live-css-editor/issues');
            utils.alertNote(
                'Error: Unable to auto-apply Magic CSS styles' +
                '<br/>Kindly report this issue at <a target="_blank" href="https://github.com/webextensions/live-css-editor/issues">GitHub repository for Magic CSS</a>',
                10000
            );
        }
    }
}());

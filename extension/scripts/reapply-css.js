/* global chrome */

import { runMigration } from './migrate-storage.js';

import { alertNote } from './utils/alertNote.js';
import { chromeStorageGet } from './utils/chromeStorage.js';
import { StyleTag } from './utils/StyleTag.js';

import { amplify } from './3rdparty/amplify-store.js';

(async function () {
    await runMigration();

    var USER_PREFERENCE_STORAGE_MODE = 'storage-mode';

    var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

    var whichStoreToUse = await chromeStorageGet(chromeStorageForExtensionData, USER_PREFERENCE_STORAGE_MODE);
    if (whichStoreToUse === 'localStorage') {
        // do nothing
    } else if (whichStoreToUse === 'chrome.storage.sync') {
        // do nothing
    } else {
        whichStoreToUse = 'chrome.storage.local';
    }

    var chromeStorage;
    if (whichStoreToUse === 'chrome.storage.sync') {
        chromeStorage = chrome.storage.sync;
    } else {
        chromeStorage = chrome.storage.local;
    }

    // TODO: Refactor/Reuse the definition of "userPreference"
    var getUserPreference = function (pref) {
        return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
            if (whichStoreToUse === 'chrome.storage.local' || whichStoreToUse === 'chrome.storage.sync') {
                let prefix = 'live-css-';
                var propertyName = `(${window.location.origin}) ${prefix}${pref}`;
                chromeStorage.get(propertyName, function (values) {
                    resolve(values[propertyName] || '');
                });
            } else {
                let prefix = 'MagiCSS-bookmarklet-';
                resolve(amplify.store(prefix + pref) || '');
            }
        });
    };

    var showReapplyingStylesNotification = true;
    {
        const showReapplyingStylesNotificationOption = await chromeStorageGet(chromeStorageForExtensionData, 'show-reapplying-styles-notification');
        if (showReapplyingStylesNotificationOption === 'no') {
            showReapplyingStylesNotification = false;
        }
    }

    var localStorageDisableStyles = 'disable-styles';
    var disableStyles = await getUserPreference(localStorageDisableStyles) === 'yes';

    var localStorageApplyStylesAutomatically = 'apply-styles-automatically';
    var applyStylesAutomatically = await getUserPreference(localStorageApplyStylesAutomatically) === 'yes';

    var localStorageLastAppliedCss = 'last-applied-css';
    var cssText = (await getUserPreference(localStorageLastAppliedCss)).trim();

    if (cssText && applyStylesAutomatically && !disableStyles) {
        var showReapplyingStylesNotificationAt = await chromeStorageGet(chromeStorageForExtensionData, 'show-reapplying-styles-notification-at');
        showReapplyingStylesNotificationAt = (showReapplyingStylesNotificationAt || 'top-right').split('-');

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
                newStyleTag = new StyleTag({
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
                alertNote(
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
            alertNote(
                'Error: Unable to auto-apply Magic CSS styles' +
                '<br/>Kindly report this issue at <a target="_blank" href="https://github.com/webextensions/live-css-editor/issues">GitHub repository for Magic CSS</a>',
                10000
            );
        }
    }
}());

/* global chrome, utils */

/* eslint-disable require-atomic-updates */

var USER_PREFERENCE_STORAGE_MODE = 'storage-mode';

var dataMigration = {
    arrPropNames: [
        'apply-styles-automatically',
        'disable-styles',
        'language-mode',
        'language-mode-non-file',
        'last-applied-css',
        'live-css-server-hostname',
        'live-css-server-port',
        'show-line-numbers',
        'textarea-value',
        'ui-position-left',
        'ui-position-top',
        'ui-size-height',
        'ui-size-width',
        'use-css-linting',
        'file-to-edit',
        'watching-css-files'
    ],
    oldDataPrefix: 'MagiCSS-bookmarklet-',
    newDataPrefix: 'live-css-'
};

dataMigration.arrPropNamesForLocalStorage = dataMigration.arrPropNames.map(function (propName) {
    return `__amplify__${dataMigration.oldDataPrefix}${propName}`;
});

dataMigration.arrPropNamesForChromeStorageLocal = dataMigration.arrPropNames.map(function (propName) {
    return `(${window.location.origin}) ${dataMigration.newDataPrefix}${propName}`;
});

var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

var runMigration = async function () {
    var whichStoreToUse = await utils.chromeStorageGet(chromeStorageForExtensionData, USER_PREFERENCE_STORAGE_MODE);
    if (whichStoreToUse === 'localStorage') {
        // do nothing
    } else {
        whichStoreToUse = 'chrome.storage.local';
    }

    try {
        if (whichStoreToUse === 'chrome.storage.local') {
            for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
                let propNameForLocalStorage = dataMigration.arrPropNamesForLocalStorage[i];
                let propNameForChromeStorageLocal = dataMigration.arrPropNamesForChromeStorageLocal[i];
                let valueFromLocalStorage = localStorage[propNameForLocalStorage];
                let valueFromChromeStorageLocal = await utils.chromeStorageLocalGet(propNameForChromeStorageLocal);

                if (!valueFromChromeStorageLocal) {
                    let json = {};
                    try {
                        json = JSON.parse(valueFromLocalStorage);
                    } catch (e) {
                        // TODO: Handle this error
                    }
                    if (json.data) {
                        await utils.chromeStorageLocalSet(propNameForChromeStorageLocal, json.data);
                    }
                }
                delete localStorage[propNameForLocalStorage];
            }
        } else {
            for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
                let propNameForLocalStorage = dataMigration.arrPropNamesForLocalStorage[i];
                let propNameForChromeStorageLocal = dataMigration.arrPropNamesForChromeStorageLocal[i];
                let valueFromLocalStorage = localStorage[propNameForLocalStorage];
                let valueFromChromeStorageLocal = await utils.chromeStorageLocalGet(propNameForChromeStorageLocal);

                if (!valueFromLocalStorage) {
                    if (valueFromChromeStorageLocal) {
                        localStorage[propNameForLocalStorage] = JSON.stringify({
                            data: valueFromChromeStorageLocal,
                            expires: null
                        });
                    }
                }
                await utils.chromeStorageLocalRemove(propNameForChromeStorageLocal);
            }
        }
    } catch (e) {
        // TODO: Handle this error
    }
};

(async function () {
    await runMigration();
}());

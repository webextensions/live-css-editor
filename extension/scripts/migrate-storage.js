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

dataMigration.arrPropNamesForChromeStorage = dataMigration.arrPropNames.map(function (propName) {
    return `(${window.location.origin}) ${dataMigration.newDataPrefix}${propName}`;
});

var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

var runMigration = async function () {
    var whichStoreToUse = await utils.chromeStorageGet(chromeStorageForExtensionData, USER_PREFERENCE_STORAGE_MODE);
    if (whichStoreToUse === 'localStorage') {
        // do nothing
    } else if (whichStoreToUse === 'chrome.storage.sync') {
        // do nothing
    } else {
        whichStoreToUse = 'chrome.storage.local';
    }

    const migrateDataFromLocalStorageToChromeStorage = async function (chromeStorageType) {
        for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
            let propNameForLocalStorage = dataMigration.arrPropNamesForLocalStorage[i];
            let propNameForChromeStorage = dataMigration.arrPropNamesForChromeStorage[i];
            let valueFromLocalStorage = localStorage[propNameForLocalStorage];
            let valueFromChromeStorage;
            if (chromeStorageType === 'chrome.storage.sync') {
                valueFromChromeStorage = await utils.chromeStorageSyncGet(propNameForChromeStorage);
            } else {
                valueFromChromeStorage = await utils.chromeStorageLocalGet(propNameForChromeStorage);
            }

            if (!valueFromChromeStorage) {
                let json = {};
                try {
                    json = JSON.parse(valueFromLocalStorage);
                } catch (e) {
                    // TODO: Handle this error
                }
                if (json.data) {
                    if (chromeStorageType === 'chrome.storage.sync') {
                        await utils.chromeStorageSyncSet(propNameForChromeStorage, json.data);
                    } else {
                        await utils.chromeStorageLocalSet(propNameForChromeStorage, json.data);
                    }
                }
            }
            delete localStorage[propNameForLocalStorage];
        }
    };

    const migrateDataFromChromeStorageToLocalStorage = async function (chromeStorageType) {
        for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
            let propNameForLocalStorage = dataMigration.arrPropNamesForLocalStorage[i];
            let propNameForChromeStorage = dataMigration.arrPropNamesForChromeStorage[i];
            let valueFromLocalStorage = localStorage[propNameForLocalStorage];
            let valueFromChromeStorage;
            if (chromeStorageType === 'chrome.storage.sync') {
                valueFromChromeStorage = await utils.chromeStorageSyncGet(propNameForChromeStorage);
            } else {
                valueFromChromeStorage = await utils.chromeStorageLocalGet(propNameForChromeStorage);
            }

            if (!valueFromLocalStorage) {
                if (valueFromChromeStorage) {
                    localStorage[propNameForLocalStorage] = JSON.stringify({
                        data: valueFromChromeStorage,
                        expires: null
                    });
                }
            }
            if (typeof valueFromChromeStorage !== 'undefined') {
                if (chromeStorageType === 'chrome.storage.sync') {
                    await utils.chromeStorageSyncRemove(propNameForChromeStorage);
                } else {
                    await utils.chromeStorageLocalRemove(propNameForChromeStorage);
                }
            }
        }
    };

    const migrateDataFromChromeStorageToChromeStorage = async function (sourceChromeStorageType, destinationChromeStorageType) {
        for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
            let propNameForChromeStorage = dataMigration.arrPropNamesForChromeStorage[i];

            let valueFromSourceStorage;
            if (sourceChromeStorageType === 'chrome.storage.sync') {
                valueFromSourceStorage = await utils.chromeStorageSyncGet(propNameForChromeStorage);
            } else {
                valueFromSourceStorage = await utils.chromeStorageLocalGet(propNameForChromeStorage);
            }

            let valueFromDestinationStorage;
            if (destinationChromeStorageType === 'chrome.storage.sync') {
                valueFromDestinationStorage = await utils.chromeStorageSyncGet(propNameForChromeStorage);
            } else {
                valueFromDestinationStorage = await utils.chromeStorageLocalGet(propNameForChromeStorage);
            }

            if (!valueFromDestinationStorage) {
                if (valueFromSourceStorage) {
                    if (destinationChromeStorageType === 'chrome.storage.sync') {
                        await utils.chromeStorageSyncSet(propNameForChromeStorage, valueFromSourceStorage);
                    } else {
                        await utils.chromeStorageLocalSet(propNameForChromeStorage, valueFromSourceStorage);
                    }
                }
            }

            if (typeof valueFromSourceStorage !== 'undefined') {
                if (sourceChromeStorageType === 'chrome.storage.sync') {
                    await utils.chromeStorageSyncRemove(propNameForChromeStorage);
                } else {
                    await utils.chromeStorageLocalRemove(propNameForChromeStorage);
                }
            }
        }
    };

    try {
        if (whichStoreToUse === 'chrome.storage.local') {
            await migrateDataFromLocalStorageToChromeStorage('chrome.storage.local');
            await migrateDataFromChromeStorageToChromeStorage('chrome.storage.sync', 'chrome.storage.local');
        } else if (whichStoreToUse === 'chrome.storage.sync') {
            await migrateDataFromLocalStorageToChromeStorage('chrome.storage.sync');
            await migrateDataFromChromeStorageToChromeStorage('chrome.storage.local', 'chrome.storage.sync');
        } else {
            await migrateDataFromChromeStorageToLocalStorage('chrome.storage.local');
            await migrateDataFromChromeStorageToLocalStorage('chrome.storage.sync');
        }
    } catch (e) {
        // TODO: Handle this error
    }
};

(async function () {
    await runMigration();
}());

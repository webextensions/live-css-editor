/* global chrome */

/* eslint-disable require-atomic-updates */

var USER_PREFERENCE_STORAGE_MODE = 'storage-mode';

var dataMigration = {
    arrPropNames: [
        'apply-styles-automatically',
        'disable-styles',
        'language-mode',
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

var chromeStorageGet = async function (storageObject, prop) {
    return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
        storageObject.get(prop, function (values) {
            resolve(values[prop]);
        });
    });
};

var chromeStorageSet = async function (storageObject, prop, value) {
    return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
        storageObject.set(
            {
                [prop]: value
            },
            function () {
                resolve();
            }
        );
    });
};

var chromeStorageRemove = async function (storageObject, prop) {
    return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
        storageObject.remove(prop, function () {
            resolve();
        });
    });
};

var chromeStorageLocalGet = async function (prop) {
    const value = await chromeStorageGet(chrome.storage.local, prop);
    return value;
};

var chromeStorageLocalSet = async function (prop, value) {
    await chromeStorageSet(chrome.storage.local, prop, value);
};

var chromeStorageLocalRemove = async function (prop, value) {
    await chromeStorageRemove(chrome.storage.local, prop, value);
};

(async function () {
    var whichStoreToUse = await chromeStorageGet(chromeStorageForExtensionData, USER_PREFERENCE_STORAGE_MODE);
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
                let valueFromChromeStorageLocal = await chromeStorageLocalGet(propNameForChromeStorageLocal);

                if (!valueFromChromeStorageLocal) {
                    let json = {};
                    try {
                        json = JSON.parse(valueFromLocalStorage);
                    } catch (e) {
                        // TODO: Handle this error
                    }
                    if (json.data) {
                        await chromeStorageLocalSet(propNameForChromeStorageLocal, json.data);
                    }
                }
                delete localStorage[propNameForLocalStorage];
            }
        } else {
            for (let i = 0; i < dataMigration.arrPropNames.length; i++) {
                let propNameForLocalStorage = dataMigration.arrPropNamesForLocalStorage[i];
                let propNameForChromeStorageLocal = dataMigration.arrPropNamesForChromeStorageLocal[i];
                let valueFromLocalStorage = localStorage[propNameForLocalStorage];
                let valueFromChromeStorageLocal = await chromeStorageLocalGet(propNameForChromeStorageLocal);

                if (!valueFromLocalStorage) {
                    if (valueFromChromeStorageLocal) {
                        localStorage[propNameForLocalStorage] = JSON.stringify({
                            data: valueFromChromeStorageLocal,
                            expires: null
                        });
                    }
                }
                await chromeStorageLocalRemove(propNameForChromeStorageLocal);
            }
        }
    } catch (e) {
        // TODO: Handle this error
    }
}());

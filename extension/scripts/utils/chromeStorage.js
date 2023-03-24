/* global chrome */

export const chromeStorageGet = function (storageObject, prop) {
    return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
        storageObject.get(prop, function (values) {
            resolve(values[prop]);
        });
    });
};

export const chromeStorageSet = function (storageObject, prop, value) {
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

export const chromeStorageRemove = function (storageObject, prop) {
    return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
        storageObject.remove(prop, function () {
            resolve();
        });
    });
};

export const chromeStorageLocalGet = async function (prop) {
    const value = await chromeStorageGet(chrome.storage.local, prop);
    return value;
};
export const chromeStorageSyncGet = async function (prop) {
    const value = await chromeStorageGet(chrome.storage.sync, prop);
    return value;
};

export const chromeStorageLocalSet = async function (prop, value) {
    await chromeStorageSet(chrome.storage.local, prop, value);
};
export const chromeStorageSyncSet = async function (prop, value) {
    await chromeStorageSet(chrome.storage.sync, prop, value);
};

export const chromeStorageLocalRemove = async function (prop, value) {
    await chromeStorageRemove(chrome.storage.local, prop, value);
};
export const chromeStorageSyncRemove = async function (prop, value) {
    await chromeStorageRemove(chrome.storage.sync, prop, value);
};

/* global chrome */

import {
    APP_$_OPEN_SEARCH_ICONS,
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION,
    APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET
} from 'reducers/actionTypes.js';

const USER_PREFERENCE_NOUN_PROJECT_API_ACCESS_KEY = 'noun-project-api-access-key';
const USER_PREFERENCE_NOUN_PROJECT_API_SECRET = 'noun-project-api-secret';

const chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

const searchIconsInitialState = {
    open: false,
    openConfiguration: false,

    accessKey: window.loadedConfigFromBrowserStorage[USER_PREFERENCE_NOUN_PROJECT_API_ACCESS_KEY],
    secret:    window.loadedConfigFromBrowserStorage[USER_PREFERENCE_NOUN_PROJECT_API_SECRET]
};

const searchIconsReducer = (draft = searchIconsInitialState, action) => {
    const {
        type,
        payload // eslint-disable-line no-unused-vars
    } = action;

    switch (type) {
        case APP_$_OPEN_SEARCH_ICONS:
            draft.open = true;
            break;
        case APP_$_CLOSE_SEARCH_ICONS:
            draft.open = false;
            break;
        case APP_$_OPEN_SEARCH_ICONS_CONFIGURATION:
            draft.openConfiguration = true;
            break;
        case APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION:
            draft.openConfiguration = false;
            break;
        case APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY:
            draft.accessKey = payload;
            setTimeout(function () {
                chromeStorageForExtensionData.set({
                    [USER_PREFERENCE_NOUN_PROJECT_API_ACCESS_KEY]: payload
                });
            });
            break;
        case APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET:
            draft.secret = payload;
            setTimeout(function () {
                chromeStorageForExtensionData.set({
                    [USER_PREFERENCE_NOUN_PROJECT_API_SECRET]: payload
                });
            });
            break;
    }

    return draft;
};

export { searchIconsReducer };

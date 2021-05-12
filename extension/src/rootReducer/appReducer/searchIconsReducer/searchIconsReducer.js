import {
    APP_$_OPEN_SEARCH_ICONS,
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION,
    APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET
} from 'reducers/actionTypes.js';

const searchIconsInitialState = {
    open: false,
    openConfiguration: false,

    accessKey: '',
    secret: ''
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
            break;
        case APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET:
            draft.secret = payload;
            break;
    }

    return draft;
};

export { searchIconsReducer };

import {
    APP_$_OPEN_SEARCH_ICONS,
    APP_$_CLOSE_SEARCH_ICONS
} from 'reducers/actionTypes.js';

const searchIconsInitialState = {};

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
    }

    return draft;
};

export { searchIconsReducer };

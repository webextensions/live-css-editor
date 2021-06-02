import {
    APP_$_OPEN_COMMAND_PALETTE,
    APP_$_CLOSE_COMMAND_PALETTE
} from 'reducers/actionTypes.js';

const commandPaletteInitialState = {};

const commandPaletteReducer = (draft = commandPaletteInitialState, action) => {
    const {
        type,
        payload // eslint-disable-line no-unused-vars
    } = action;

    switch (type) {
        case APP_$_OPEN_COMMAND_PALETTE:
            draft.open = true;
            break;
        case APP_$_CLOSE_COMMAND_PALETTE:
            draft.open = false;
            break;
    }

    return draft;
};

export { commandPaletteReducer };

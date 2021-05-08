const initialAppState = {};

import { searchIconsReducer } from './searchIconsReducer/searchIconsReducer.js';
import { commandPaletteReducer } from './commandPaletteReducer/commandPaletteReducer.js';

const appReducer = (draft = initialAppState, action) => {
    // const {
    //     type,
    //     payload
    // } = action;

    draft.app.commandPalette = commandPaletteReducer(draft.app.commandPalette, action);
    draft.app.searchIcons = searchIconsReducer(draft.app.searchIcons, action);

    return draft;
};

export { appReducer };

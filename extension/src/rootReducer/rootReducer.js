import { produce } from 'immer';

import { appReducer } from './appReducer/appReducer.js';

const rootInitialState = {
    app: {}
};
const rootReducer = function (state = rootInitialState, action) {
    return (
        produce(state, function (draft) {
            return appReducer(draft, action);
        })
    );
};

export { rootReducer };

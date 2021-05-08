import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { Actions } from './actions.js';

import { SearchIcons } from './dialogs/searchIcons/searchIcons.js';

import { store } from './store.js';

const Main = function () {
    return (
        <div>
            <Provider store={store}>
                <Actions />
                <SearchIcons />
            </Provider>
        </div>
    );
};

window.reactMain = function () {
    ReactDOM.render(
        <Main />,
        document.getElementsByClassName('magicss-command-palette-root')[0]
    );
};

window.reactMain();

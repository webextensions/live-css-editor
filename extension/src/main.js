import React from 'react';
import { createRoot } from 'react-dom/client';


import { Provider } from 'react-redux';

import { Actions } from './actions.js';

import { SearchIcons } from './dialogs/searchIcons/searchIcons.js';
import { SearchIconsConfiguration } from './dialogs/searchIcons/searchIconsConfiguration.js';

import { store } from './store.js';

const Main = function () {
    return (
        <div>
            <Provider store={store}>
                <Actions />
                <SearchIcons />
                <SearchIconsConfiguration />
            </Provider>
        </div>
    );
};

window.reactMain = function () {
    // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
    const container = document.getElementsByClassName('magicss-command-palette-root')[0];
    const root = createRoot(container); // createRoot(container!) if you use TypeScript

    root.render(<Main />);
};

window.reactMain();

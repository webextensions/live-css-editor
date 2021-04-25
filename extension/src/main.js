import React from 'react';
import ReactDOM from 'react-dom';

import { Actions } from './actions.js';

class Main extends React.Component {
    render() {
        return (
            <div>
                <Actions />
            </div>
        );
    }
}

window.reactMain = function () {
    if (window.reactMain.loaded) {
        return;
    }
    window.reactMain.loaded = true;

    ReactDOM.render(
        <Main />,
        document.getElementsByClassName('magicss-command-palette-root')[0]
    );
};

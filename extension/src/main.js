import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Actions } from './actions.js';

const Main = function (props) {
    return (
        <div>
            <Actions
                open={props.open}
                onClose={function () {
                    if (props.onClose) {
                        props.onClose();
                    }
                }}
            />
        </div>
    );
};
Main.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

window.reactMain = function (options) {
    ReactDOM.render(
        <Main
            open={options.open}
            onClose={function () {
                window.reactMain({
                    open: false
                });
            }}
        />,
        document.getElementsByClassName('magicss-command-palette-root')[0]
    );
};

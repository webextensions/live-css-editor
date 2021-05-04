import React from 'react';
import PropTypes from 'prop-types';

import { CommandPalette } from './command-palette/command-palette.js';

const Actions = function (props) {
    return (
        <div>
            <CommandPalette
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
Actions.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export { Actions };

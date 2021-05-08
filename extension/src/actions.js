import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CommandPalette } from './command-palette/command-palette.js';

import {
    APP_$_CLOSE_COMMAND_PALETTE
} from 'reducers/actionTypes.js';

function mapStateToProps(state) {
    return {
        open: state.app.commandPalette.open
    };
}

const Actions = function (props) {
    return (
        <div>
            <CommandPalette
                open={props.open}
                onClose={function () {
                    props.dispatch({
                        type: APP_$_CLOSE_COMMAND_PALETTE
                    });
                }}
            />
        </div>
    );
};
Actions.propTypes = {
    open: PropTypes.bool,
    dispatch: PropTypes.func
};

const _Actions = connect(mapStateToProps)(Actions);

export { _Actions as Actions };

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField/index.js';

import Button from '@material-ui/core/Button/index.js';
import Dialog from '@material-ui/core/Dialog/index.js';
import DialogActions from '@material-ui/core/DialogActions/index.js';
import DialogContent from '@material-ui/core/DialogContent/index.js';
import DialogTitle from '@material-ui/core/DialogTitle/index.js';

import {
    APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION,
    APP_$_OPEN_SEARCH_ICONS,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY,
    APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET
} from 'reducers/actionTypes.js';

import './searchIconsConfiguration.css';

function mapStateToProps(state) {
    return {
        open: state.app.searchIcons.openConfiguration,
        accessKey: state.app.searchIcons.accessKey, // Using "accessKey" since it can't be named as "key" becaused that is a reserved prop name
        secret: state.app.searchIcons.secret
    };
}

const SearchIconsConfiguration = function (props) {
    const {
        open,
        accessKey,
        secret
    } = props;

    const setAccessKey = function (accessKey) {
        props.dispatch({
            type: APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY,
            payload: accessKey
        });
    };
    const setSecret = function (secret) {
        props.dispatch({
            type: APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET,
            payload: secret
        });
    };

    if (open) {
        const handleClose = () => {
            props.dispatch({ type: APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION });
            props.dispatch({ type: APP_$_OPEN_SEARCH_ICONS });
        };

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    disableBackdropClick
                    className="magicss-dialog-search-icons"
                    PaperProps={{
                        style: {
                            maxWidth: 450
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        <span>
                            Configure Access for Noun Project API
                        </span>
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            <div>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    label="Key"
                                    placeholder="e.g., 0123456789abcdef0123456789abcdef"
                                    value={accessKey}
                                    autoFocus
                                    onChange={(evt) => {
                                        setAccessKey(evt.target.value);
                                    }}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: 25 }}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    label="Secret"
                                    placeholder="e.g., 0123456789abcdef0123456789abcdef"
                                    value={secret}
                                    onChange={(evt) => {
                                        setSecret(evt.target.value);
                                    }}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </div>

                            <div style={{ marginTop: 25, fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
                                <span style={{ fontWeight: 'bold' }}>Note:</span> The &quot;Key&quot; and &quot;Secret&quot; are saved in sync storage provided by your browser. They would be synced across your other logged in browser sessions.
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } else {
        return null;
    }
};
SearchIconsConfiguration.propTypes = {
    open: PropTypes.bool,
    dispatch: PropTypes.func
};

const _SearchIconsConfiguration = connect(mapStateToProps)(SearchIconsConfiguration);

export { _SearchIconsConfiguration as SearchIconsConfiguration };

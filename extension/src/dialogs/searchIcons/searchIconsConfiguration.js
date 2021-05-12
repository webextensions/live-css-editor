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

        const styleForStepTitle = {
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginRight: 5,
            minWidth: 42
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
                            maxWidth: 475
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        <span>
                            Configure Access for Noun Project API
                        </span>
                    </DialogTitle>
                    <DialogContent>
                        <div
                            style={{
                                fontFamily: 'Arial, sans-serif',
                                fontSize: 12
                            }}
                        >
                            <div style={{ display: 'flex' }}>
                                <div style={styleForStepTitle}>
                                    Step 1:
                                </div>
                                <div>
                                    Go to Developers page on <a target="_blank" rel="noreferrer" href="https://thenounproject.com/developers/">The Noun Project</a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 2:
                                </div>
                                <div>
                                    Choose your plan and register for API access
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 3:
                                </div>
                                <div>
                                    Create an application under the <a target="_blank" rel="noreferrer" href="https://thenounproject.com/developers/apps/">Manage Apps section</a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 4:
                                </div>
                                <div>
                                    Paste below the &quot;Key&quot; and &quot;Secret&quot; from the Key Management section in the page for the application
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ marginTop: 25 }}>
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

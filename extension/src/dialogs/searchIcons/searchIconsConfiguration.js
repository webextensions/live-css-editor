/* globals chrome, utils, sendMessageForGa */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useDidMount } from 'rooks';

import TextField from '@material-ui/core/TextField/index.js';

import Button from '@material-ui/core/Button/index.js';
import Dialog from '@material-ui/core/Dialog/index.js';
import DialogActions from '@material-ui/core/DialogActions/index.js';
import DialogContent from '@material-ui/core/DialogContent/index.js';
import DialogTitle from '@material-ui/core/DialogTitle/index.js';

import OAuth from 'oauth-1.0a';
import hmacSha1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';

import MediaQuery from 'react-responsive';

import { Loading } from 'Loading/Loading.js';

import { READYSTATE, STATUSCODE, UNINITIALIZED, LOADING, LOADED, ERROR } from 'constants/readyStates.js';

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

    const [extAccessToNounProjectApi, setExtAccessToNounProjectApi] = useState({
        status: 'unknown'
    });

    useDidMount(async () => {
        chrome.runtime.sendMessage(
            {
                type: 'checkPermissionForOrigin',
                payload: 'https://api.thenounproject.com/'
            },
            function ({ flagPermissions }) {
                if (flagPermissions) {
                    setExtAccessToNounProjectApi({
                        status: 'has-access'
                    });
                } else {
                    setExtAccessToNounProjectApi({
                        status: 'no-access'
                    });
                }
            }
        );
    });

    const [testConnectionStatus, setTestConnectionStatus] = useState({
        [READYSTATE]: UNINITIALIZED
    });

    const setAccessKey = function (accessKey) {
        props.dispatch({
            type: APP_$_SEARCH_ICONS_CONFIGURATION_SET_ACCESS_KEY,
            payload: {
                accessKey
            }
        });

        setTestConnectionStatus({
            [READYSTATE]: UNINITIALIZED
        });
    };
    const setSecret = function (secret) {
        props.dispatch({
            type: APP_$_SEARCH_ICONS_CONFIGURATION_SET_SECRET,
            payload: {
                secret
            }
        });

        setTestConnectionStatus({
            [READYSTATE]: UNINITIALIZED
        });
    };

    if (open) {
        const handleClose = () => {
            props.dispatch({ type: APP_$_CLOSE_SEARCH_ICONS_CONFIGURATION });
            props.dispatch({ type: APP_$_OPEN_SEARCH_ICONS });
        };

        const doTestConnection = async function () {
            sendMessageForGa(['_trackEvent', 'getIcons', 'testConnectionInitiated']);

            // http://lti.tools/oauth/
            const oauth = OAuth({
                consumer: {
                    key: accessKey,
                    secret
                },
                signature_method: 'HMAC-SHA1',
                hash_function(base_string, key) {
                    const hash = hmacSha1(base_string, key);
                    const output = Base64.stringify(hash);
                    return output;
                }
            });

            const request_data = {
                url: `https://api.thenounproject.com/oauth/usage`,
                method: 'GET'
            };
            const headers = oauth.toHeader(oauth.authorize(request_data));

            setTestConnectionStatus({
                [READYSTATE]: LOADING
            });

            const [err, data, coreResponse] = await window.chromeRuntimeMessageToBackgroundScript({
                type: 'magicss-bg',
                subType: 'ajax',
                payload: {
                    url: request_data.url,
                    type: request_data.method,
                    headers
                }
            });

            if (err) {
                setTestConnectionStatus({
                    [READYSTATE]: ERROR,
                    [STATUSCODE]: coreResponse.status,
                });
                sendMessageForGa(['_trackEvent', 'getIcons', 'testConnectionError']);
            } else {
                setTestConnectionStatus({
                    [READYSTATE]: LOADED,
                    [STATUSCODE]: coreResponse.status,
                    data
                });
                sendMessageForGa(['_trackEvent', 'getIcons', 'testConnectionSuccess']);
            }
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
                    disableScrollLock // https://github.com/mui-org/material-ui/issues/10000#issuecomment-559116355
                    open={open}
                    onClose={handleClose}
                    disableBackdropClick
                    className="magicss-base-element magicss-material-ui-dialog magicss-dialog-search-icons magicss-dialog-search-icons-configuration"
                    PaperProps={{
                        style: {
                            maxWidth: 475
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        <span
                            style={{
                                fontSize: 20,                /* https://code.visualstudio.com/ */
                                letterSpacing: 0.15,         /* https://code.visualstudio.com/ */
                                color: 'rgba(0, 0, 0, 0.87)' /* https://lesscss.org/ */
                            }}
                        >
                            Noun Project API Configuration
                        </span>
                    </DialogTitle>
                    <DialogContent style={{ minHeight: 75 }}>
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
                                    <React.Fragment>
                                        {
                                            extAccessToNounProjectApi.status === 'has-access' &&
                                            <span style={{ color: 'green' }}>
                                                ✔
                                            </span>
                                        }
                                    </React.Fragment> <a
                                        target="_blank"
                                        rel="noreferrer"
                                        style={(function () {
                                            const style = {
                                                cursor: 'pointer',
                                                color: '#3f51b5',
                                                textDecoration: 'underline',
                                                fontWeight: 'normal' /* https://www.linkedin.com/feed/ */
                                            };

                                            if (extAccessToNounProjectApi.status === 'has-access') {
                                                style.color = 'rgba(0, 0, 0, 0.87)';
                                            }

                                            return style;
                                        }())}
                                        onClick={function () {
                                            chrome.runtime.sendMessage(
                                                {
                                                    type: 'checkPermissionForOrigin',
                                                    payload: 'https://api.thenounproject.com/'
                                                },
                                                function ({ flagPermissions }) {
                                                    if (flagPermissions) {
                                                        setExtAccessToNounProjectApi({
                                                            status: 'has-access'
                                                        });

                                                        utils.alertNote('<span style="color:#3f51b5;">✔</span> The required permissions are already granted');
                                                    } else {
                                                        setExtAccessToNounProjectApi({
                                                            status: 'no-access'
                                                        });

                                                        chrome.runtime.sendMessage(
                                                            {
                                                                requestPermissions: true,
                                                                tabOriginWithSlash: 'https://api.thenounproject.com/'
                                                            },
                                                            async function asyncCallback(status) {
                                                                // TODO: Check if this check for "chrome.runtime.lastError" is useful in some way
                                                                if (chrome.runtime.lastError) {
                                                                    console.log('Error message reported by Magic CSS:', chrome.runtime.lastError);
                                                                    utils.alertNote(
                                                                        'Error! Unexpected error encountered by Magic CSS extension.<br />You may need to reload webpage & Magic CSS and try again.',
                                                                        10000
                                                                    );
                                                                }

                                                                if (status === 'request-granted') {
                                                                    setExtAccessToNounProjectApi({
                                                                        status: 'has-access'
                                                                    });

                                                                    utils.alertNote('<span style="color:#3f51b5;">✔</span> The required permissions have been granted');
                                                                } else if (status === 'request-not-granted') {
                                                                    utils.alertNote('<span style="color:#800000;">✘</span> You need to provide permissions for Noun Project API Configuration', 10000);
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }}
                                    >Allow this extension access</a> to api.thenounproject.com
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 2:
                                </div>
                                <div>
                                    Go to the API page on <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://thenounproject.com/developers/"
                                        style={{
                                            color: '#3f51b5',
                                            textDecoration: 'underline',
                                            fontWeight: 'normal' /* https://www.linkedin.com/feed/ */
                                        }}
                                    >The Noun Project</a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 3:
                                </div>
                                <div>
                                    Choose your plan and register for API access
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 4:
                                </div>
                                <div>
                                    Create an application under the <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://thenounproject.com/developers/apps/"
                                        style={{
                                            color: '#3f51b5',
                                            textDecoration: 'underline',
                                            fontWeight: 'normal' /* https://www.linkedin.com/feed/ */
                                        }}
                                    >Manage Apps section</a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <div style={styleForStepTitle}>
                                    Step 5:
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
                                    spellCheck={false}
                                    disabled={extAccessToNounProjectApi.status !== 'has-access'}
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
                                    spellCheck={false}
                                    disabled={extAccessToNounProjectApi.status !== 'has-access'}
                                    onChange={(evt) => {
                                        setSecret(evt.target.value);
                                    }}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </div>

                            <div style={{ marginTop: 25, fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
                                <span style={{ fontWeight: 'bold' }}>Note:</span> The &quot;Key&quot; and &quot;Secret&quot; are saved in Sync/Local storage provided by your browser. Data from Sync storage is synchronized across your other logged in browser sessions.
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <div style={{ margin: '8px 16px', display: 'flex', width: '100%' }}>
                            <div style={{ display: 'flex', flexGrow: 1 }}>
                                <Button
                                    onClick={doTestConnection}
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    disabled={ !accessKey || !secret }
                                    style={{
                                        fontSize: 14 /* https://code.visualstudio.com/ */
                                    }}
                                >
                                    <MediaQuery maxWidth={499}>
                                        Test
                                    </MediaQuery>
                                    <MediaQuery minWidth={500}>
                                        Test Connection
                                    </MediaQuery>
                                </Button>
                                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, display: 'flex' }}>
                                    {function () {
                                        const readyState = testConnectionStatus[READYSTATE];
                                        if (readyState === UNINITIALIZED) {
                                            return null;
                                        } else if (readyState === ERROR) {
                                            const statusCode = testConnectionStatus[STATUSCODE];
                                            return (
                                                <div style={{ marginLeft: 15, marginRight: 15, display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ color: '#ff0000' }}>
                                                        {(function () {
                                                            if (statusCode === 0) {
                                                                return 'Network error';
                                                            } else if (statusCode === 401 || statusCode === 403) {
                                                                return 'Authentication error';
                                                            } else {
                                                                return 'Error';
                                                            }
                                                        }())}
                                                    </span>
                                                </div>
                                            );
                                        } else if (readyState === LOADED) {
                                            return (
                                                <div style={{ marginLeft: 15, marginRight: 15, display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ color: '#008000' }}>
                                                        Success
                                                    </span>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div style={{ marginLeft: 15, marginRight: 15, display: 'flex', alignItems: 'center' }}>
                                                    <Loading type="line-scale" />
                                                </div>
                                            );
                                        }
                                    }()}
                                </div>
                            </div>
                            <div>
                                <Button
                                    onClick={handleClose}
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    style={{
                                        fontSize: 14 /* https://code.visualstudio.com/ */
                                    }}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
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

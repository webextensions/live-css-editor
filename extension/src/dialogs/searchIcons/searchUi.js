import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField/index.js';
import Button from '@material-ui/core/Button/index.js';
import SearchIcon from '@material-ui/icons/Search.js';

import OAuth from 'oauth-1.0a';
import hmacSha1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';

import { Loading } from 'Loading/Loading.js';

import './searchUi.css';

import {
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
} from 'reducers/actionTypes.js';

import { READYSTATE, STATUSCODE, UNINITIALIZED, LOADING, LOADED, ERROR } from 'constants/readyStates.js';

const ListOfIcons = function (props) {
    const {
        icons
    } = props;

    const [selectedIndex, setSelectedIndex] = useState(null);

    return (
        <div
            style={{
                display: 'flex',
                flexGrow: 1
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    display: 'grid',
                    gridAutoColumns: 'auto',
                    gridGap: 10,
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 100px) )',
                    overflow: 'auto'
                }}
            >
                {
                    icons.map(function (icon, index) {
                        const {
                            preview_url
                        } = icon;

                        const className = classNames({
                            iconIsSelected: selectedIndex === index ? true : false
                        });

                        return (
                            <div
                                key={index}
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginTop: 10,
                                    marginBottom: 10,
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                }}
                                className={className}
                            >
                                <img
                                    src={preview_url}
                                    style={{
                                        maxWidth: 40,
                                        maxHeight: 40,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        );
                    })
                }
            </div>
            <div
                style={{
                    width: 300,
                    overflow: 'auto'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    Preview
                </div>
                <div>
                    {
                        typeof selectedIndex === 'number' &&
                        <div
                            style={{
                                wordBreak: 'break-word'
                            }}
                        >
                            <div>
                                {(function () {
                                    const icon = icons[selectedIndex];

                                    return (
                                        <div>
                                            <div>
                                                <img src={icon.preview_url} style={{ width: 100 }} />
                                            </div>

                                            <div>
                                                <a target="_blank" rel="noreferrer" href={icon.icon_url}>
                                                    {icon.term}
                                                </a>
                                                &nbsp;by&nbsp;
                                                <a target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.uploader.permalink}/`}>
                                                    {icon.uploader.name}
                                                </a>
                                                &nbsp;from&nbsp;
                                                <a target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.permalink}/`}>
                                                    Noun Project
                                                </a>
                                            </div>

                                            <div>
                                                <a target="_blank" rel="noreferrer" href={icon.icon_url}>
                                                    Download
                                                </a>
                                            </div>
                                            <div>
                                                License: {icon.license_description}
                                            </div>
                                        </div>
                                    );
                                }())}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};
ListOfIcons.propTypes = {
    icons: PropTypes.array.isRequired
};

const SearchOutput = function (props) {
    const {
        flagConfigurationDone,
        output
    } = props;
    const { data } = output;
    const readyState = output[READYSTATE];

    const styleObForCenterAligning = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const styleForOneLineMessage = {
        fontFamily: 'sans-serif',
        color: '#777',
        padding: 20,
        textAlign: 'center',
        wordBreak: 'break-word'
    };

    const buttonConfigure = (
        <Button
            variant="contained"
            color="primary"
            size="medium"
            style={{
                paddingTop: 8,
                paddingBottom: 7
            }}
            onClick={function () {
                window.redux_store.dispatch({
                    type: APP_$_CLOSE_SEARCH_ICONS
                });
                window.redux_store.dispatch({
                    type: APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
                });
            }}
        >
            Configure
        </Button>
    );

    if (!flagConfigurationDone) {
        return (
            <div style={styleObForCenterAligning}>
                <div style={styleForOneLineMessage}>
                    {buttonConfigure}
                </div>
            </div>
        );
    } else if (readyState === ERROR) {
        return (
            <div style={styleObForCenterAligning}>
                <div style={styleForOneLineMessage}>
                    {(function () {
                        const statusCode = output[STATUSCODE];
                        const {
                            searchInput
                        } = output;
                        const directSearchUrl = `https://thenounproject.com/search/?q=${encodeURIComponent(searchInput).replace(/%20/g, '+')}`;
                        if (statusCode === 401 || statusCode === 403) {
                            return (
                                <React.Fragment>
                                    <div>
                                        Error: Unable to access API
                                    </div>
                                    <div style={{ marginTop: 10, maxWidth: 450 }}>
                                        Please ensure that you have configured the Noun&nbsp;Project&nbsp;API access details correctly.
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        {buttonConfigure}
                                    </div>
                                </React.Fragment>
                            );
                        } else if (statusCode === 404) {
                            return (
                                <React.Fragment>
                                    <div>
                                        No results found (via API)
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        Try for more results at&nbsp;
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={directSearchUrl}
                                            style={{
                                                color: '#777'
                                            }}
                                        >
                                            {directSearchUrl}
                                        </a>
                                    </div>
                                </React.Fragment>
                            );
                        } else {
                            return (
                                <React.Fragment>
                                    <div>
                                        An unexpected error occurred.
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        Please try again.
                                    </div>
                                </React.Fragment>
                            );
                        }
                    }())}
                </div>
            </div>
        );
    } else if (readyState === UNINITIALIZED) {
        return (
            <div style={styleObForCenterAligning}>
                <div style={styleForOneLineMessage}>
                    Search for an icon above
                </div>
            </div>
        );
    } else if (readyState === LOADED) {
        const icons = data.icons || [];
        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <ListOfIcons icons={icons} />
            </div>
        );
    } else {
        return (
            <div style={styleObForCenterAligning}>
                <Loading type="line-scale" />
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        accessKey: state.app.searchIcons.accessKey, // Using "accessKey" since it can't be named as "key" becaused that is a reserved prop name
        secret: state.app.searchIcons.secret
    };
}

const SearchUi = function (props) {
    const {
        accessKey,
        secret
    } = props;
    const flagAccessKeyAndSecretExist = (accessKey && secret) ? true : false;

    const [searchText, setSearchText] = useState('');

    const [output, setOutput] = useState({
        [READYSTATE]: UNINITIALIZED
    });

    const doSearch = async function () {
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
            // url: `https://api.thenounproject.com/icons/${encodeURIComponent(searchText)}`,
            url: `https://api.thenounproject.com/icons/${encodeURIComponent(searchText)}?limit_to_public_domain=1`,
            method: 'GET'
        };
        const headers = oauth.toHeader(oauth.authorize(request_data));

        setOutput({
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
            setOutput({
                [READYSTATE]: ERROR,
                [STATUSCODE]: coreResponse.status,
                searchInput: searchText
            });
        } else {
            setOutput({
                [READYSTATE]: LOADED,
                [STATUSCODE]: coreResponse.status,
                searchInput: searchText,
                data
            });
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                }}
            >
                <div style={{ display: 'flex', paddingTop: 5 }}>
                    <div style={{ flexGrow: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            label="Search for icons..."
                            placeholder="e.g., phone"
                            value={searchText}
                            autoFocus
                            onChange={(evt) => {
                                setSearchText(evt.target.value);
                            }}
                            onKeyPress={(evt) => {
                                if (evt.key === 'Enter') {
                                    evt.preventDefault();

                                    if (searchText) {
                                        setTimeout(async function () {
                                            doSearch();
                                        });
                                    }
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginLeft: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            startIcon={<SearchIcon />}
                            style={{
                                paddingTop: 8,
                                paddingBottom: 7
                            }}
                            disabled={!searchText || !flagAccessKeyAndSecretExist}
                            onClick={function () {
                                setTimeout(async function () {
                                    doSearch();
                                });
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div style={{ marginTop: 20, flexGrow: 1, display: 'flex', overflow: 'auto' }}>
                    <div
                        style={{
                            boxSizing: 'border-box',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: 4,
                            flexGrow: 1
                        }}
                    >
                        <SearchOutput flagConfigurationDone={flagAccessKeyAndSecretExist} output={output} />
                    </div>
                </div>
            </div>
        </div>
    );
};
SearchUi.propTypes = {
    accessKey: PropTypes.string.isRequired,
    secret: PropTypes.string.isRequired
};

const _SearchUi = connect(mapStateToProps)(SearchUi);

export { _SearchUi as SearchUi };

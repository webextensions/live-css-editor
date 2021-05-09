import React, { useState } from 'react';
import PropTypes from 'prop-types';

import OAuth from 'oauth-1.0a';
import hmacSha1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';

import TextField from '@material-ui/core/TextField/index.js';
import Button from '@material-ui/core/Button/index.js';
import SearchIcon from '@material-ui/icons/Search.js';

import { Loading } from 'Loading/Loading.js';

import './searchUi.css';

import { READYSTATE, UNINITIALIZED, LOADING, LOADED, ERROR } from 'constants/readyStates.js';

const ListOfIcons = function (props) {
    const { icons } = props;

    return (
        <div
            style={{
                display: 'grid',
                gridAutoColumns: 'auto',
                gridGap: 10,
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 100px) )'
            }}
        >
            {
                icons.map(function (icon, index) {
                    const {
                        preview_url
                    } = icon;
                    return (
                        <div
                            key={index}
                            style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: 10,
                                marginBottom: 10
                            }}
                        >
                            <img
                                src={preview_url}
                                style={{
                                    maxWidth: 24,
                                    maxHeight: 24
                                }}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
};
ListOfIcons.propTypes = {
    icons: PropTypes.array.isRequired
};

const SearchOutput = function (props) {
    const { output } = props;
    const { data } = output;
    const readyState = output[READYSTATE];

    const styleObForCenterAligning = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    if (readyState === ERROR) {
        return (
            <div style={styleObForCenterAligning}>
                An error occurred
            </div>
        );
    } else if (readyState === UNINITIALIZED) {
        return (
            <div style={styleObForCenterAligning}>
                Try searching for something above
            </div>
        );
    } else if (readyState === LOADED) {
        const icons = data.icons || [];
        return (
            <div>
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

const SearchUi = function (/* props */) {
    const [key, setKey] = useState('');
    const [secret, setSecret] = useState('');
    const [searchText, setSearchText] = useState('');

    const [output, setOutput] = useState({
        [READYSTATE]: UNINITIALIZED
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div style={{ display: 'flex', marginBottom: 20 }}>
                <div>
                    <input
                        value={key}
                        placeholder="Key"
                        onChange={(evt) => {
                            setKey(evt.target.value);
                        }}
                    />
                </div>
                <div>
                    <input
                        value={secret}
                        placeholder="Secret"
                        onChange={(evt) => {
                            setSecret(evt.target.value);
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            label="Search for icons..."
                            placeholder="e.g., phone"
                            value={searchText}
                            onChange={(evt) => {
                                setSearchText(evt.target.value);
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
                            onClick={function () {
                                setTimeout(async function () {
                                    // http://lti.tools/oauth/
                                    const oauth = OAuth({
                                        consumer: { key, secret },
                                        signature_method: 'HMAC-SHA1',
                                        hash_function(base_string, key) {
                                            const hash = hmacSha1(base_string, key);
                                            const output = Base64.stringify(hash);
                                            return output;
                                        },
                                    });

                                    const request_data = {
                                        url: `https://api.thenounproject.com/icons/${encodeURIComponent(searchText)}`,
                                        method: 'GET'
                                    };

                                    const headers = oauth.toHeader(oauth.authorize(request_data));

                                    setOutput({
                                        [READYSTATE]: LOADING
                                    });
                                    const [err, data] = await window.chromeRuntimeMessageToBackgroundScript({
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
                                            [READYSTATE]: ERROR
                                        });
                                    } else {
                                        setOutput({
                                            [READYSTATE]: LOADED,
                                            data
                                        });
                                    }
                                });
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div style={{ marginTop: 20, flexGrow: 1 }}>
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: 4,
                            height: '100%'
                        }}
                    >
                        <SearchOutput output={output} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SearchUi };

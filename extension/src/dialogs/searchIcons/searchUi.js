import React, { useState } from 'react';

import OAuth from 'oauth-1.0a';
import hmacSha1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';

import TextField from '@material-ui/core/TextField/index.js';
import Button from '@material-ui/core/Button/index.js';
import SearchIcon from '@material-ui/icons/Search.js';

import './searchUi.css';

const SearchUi = function (/* props */) {
    const [key, setKey] = useState('');
    const [secret, setSecret] = useState('');
    const [searchText, setSearchText] = useState('');

    const [output, setOutput] = useState('');

    return (
        <div>
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

            <div>
                <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            label="Which icon are you looking for?"
                            placeholder="eg: phone"
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

                                    setOutput('Loading...');
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
                                        setOutput('An error occurred');
                                    } else {
                                        setOutput(JSON.stringify(data, null, '    '));
                                    }
                                });
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div style={{ marginTop: 20 }}>
                    <textarea
                        value={output}
                        readOnly
                        style={{
                            width: 500,
                            height: 300
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export { SearchUi };

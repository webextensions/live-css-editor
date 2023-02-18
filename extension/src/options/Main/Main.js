/* eslint-disable react/jsx-no-target-blank */

import React from 'react';

// import { FLAG_DEV_MODE } from '../helpers/helpers.js';
import { Form } from './Form/Form.js';

// const optionsPageUrl = (
//     typeof chrome !== 'undefined' &&
//     typeof chrome.runtime !== 'undefined' &&
//     chrome.runtime.getURL('options.html')
// );

const Main = function () {
    return (
        <div>
            <Form />

            {/* {
                FLAG_DEV_MODE &&
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 20,
                        marginBottom: 20
                    }}
                >
                    <div>
                        <a
                            href={optionsPageUrl}
                            target="_blank"
                        >
                            Open
                        </a> this options page in new tab for debugging purposes.
                    </div>
                    <div style={{ marginTop: 5 }}>
                        <a
                            href="#"
                            onClick={function (event) {
                                event.preventDefault();
                                if (chrome.runtime.openOptionsPage) {
                                    // https://developer.chrome.com/extensions/optionsV2
                                    chrome.runtime.openOptionsPage();
                                }
                            }}
                        >
                            Open
                        </a> options page under &quot;Extension options&quot;
                    </div>
                </div>
            } */}
        </div>
    );
};

export { Main };

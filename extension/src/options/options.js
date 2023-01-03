/* globals chrome */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { FLAG_DEV_MODE } from './helpers/helpers.js';
import { Form } from './Form/Form.js';

const optionsPageUrl = chrome.runtime.getURL('options.html');

const Main = function () {
    return (
        <div>
            {
                FLAG_DEV_MODE &&
                <div>
                    <div>
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
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
            }
            <Form />
        </div>
    );
};

const renderReactApp = function () {
    // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
    const container = document.getElementById('root');
    const root = createRoot(container); // createRoot(container!) if you use TypeScript

    root.render(<Main />);
};

renderReactApp();

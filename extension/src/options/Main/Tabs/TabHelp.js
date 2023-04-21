/* eslint-disable react/jsx-no-target-blank */

import React from 'react';

import { GenericAccordion } from 'GenericAccordion/GenericAccordion.js';

import styles from './TabHelp.css';

const listOfFaqs = [
    {
        question: 'What is this extension useful for?',
        answer: (
            <div>
                <div>
                    This extension provides a live editor for CSS/Less/Sass code. It allows you to preview changes as you write code and live edit CSS snippets or files which get saved and applied instantly.
                </div>
                <br />
                <div>
                    <div>
                        It also features:
                    </div>
                    <div>
                        <ul style={{ marginLeft: 40 }}>
                            <li>Option to reapply styles automatically</li>
                            <li>CSS reloader</li>
                            <li>Syntax highlighting</li>
                            <li>Auto-generate CSS selectors with point-and-click</li>
                            <li>Autocomplete for CSS selectors, properties and values</li>
                            <li>Emmet support that helps in writing the CSS code faster</li>
                            <li>Color picker</li>
                            <li>Beautify / Format code</li>
                            <li>Highlight DOM elements matching the CSS selectors</li>
                            <li>Lint CSS code</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        question: 'How do I launch this extension?',
        answer: (
            <div>
                You can go to a web page ( eg: <a target="_blank" href="http://localhost/">http://localhost/</a> ) and to launch this extension for that page, you may click on the extension icon in your browser toolbar. Alternatively, you can also use the keyboard shortcut <span style={{ fontWeight: 'bold' }}>Alt+Shift+C</span>.
            </div>
        )
    },
    {
        question: 'How do I edit the CSS for a web page?',
        answer: 'This extension provides a live editor for CSS/Less/Sass code. You can write the CSS code in the editor and the changes would be instantly applied to the web page you are on.'
    },
    {
        question: 'How do I save my changes and apply them on page reload?',
        answer: (
            <div>
                <div>
                    This extension automatically saves your changes as you write the code.
                </div>
                <br />
                <div>
                    If you wish to reapply your changes on page reload, then you can enable the <span style={{ fontWeight: 'bold' }}>Reapply styles automatically</span> option by clicking on the <span style={{ fontWeight: 'bold' }}>Pin icon</span> in the live code editor.
                </div>
            </div>
        )
    },
    {
        question: 'Which permissions are required by the extension?',
        answer: (
            <div>
                <div>
                    {`By default, this extension doesn't execute any code in a browser tab. Even for serving its core functionality, this extension doesn't require you to approve any permissions.`}
                </div>
                <div>
                    <br />
                    <div>
                        However, if you want to use some of the advanced features, like:
                    </div>
                    <div>
                        <ul style={{ marginLeft: 40 }}>
                            <li>
                                Apply styles automatically
                            </li>
                            <li>
                                Access to some third-party APIs / sites
                            </li>
                        </ul>
                    </div>
                    <div>
                        then you will be requested for granting the following permissions:
                    </div>
                    <div>
                        <ul style={{ marginLeft: 40 }}>
                            <li>
                                Read your browsing history
                            </li>
                            <li>
                                Read and change your data on specific websites
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        question: 'Are there any known issues with the extension?',
        answer: (
            <div>
                <div>
                    {`Since the UI of this extension runs within the web page, the generic CSS written by the author of that web page may conflict with the UI of this extension. While we have tried to minimize the conflicts, there may be some cases where the UI of this extension may not look perfect on some specific web pages.`}
                </div>
                <br />
                <div>
                    {`In such cases, you may use the "Edit in external window" feature as a workaround. For a proper fix, kindly report the issue at: `}
                    <a href="https://github.com/webextensions/live-css-editor/issues" target="_blank">https://github.com/webextensions/live-css-editor/issues</a>
                </div>
            </div>
        )
    },
    {
        question: (
            <div>
                {'I provided code like `'}
                <span
                    style={{
                        fontFamily: 'monospace'
                    }}
                >
                    {`div { display: none !important; }`}
                </span>
                {'` and now the extension is not visible. How do I reset my changes?'}
            </div>
        ),
        answer: (
            <div>
                {'Launch the extension second time in the same session. This will disable the provided code and the extension would become visible again.'}
            </div>
        )
    },
    {
        question: 'Is this extension available on other browsers?',
        answer: (
            <div>
                <div>
                    {`You can find this extension in the following browser stores:`}
                </div>
                <div>
                    <ul style={{ marginLeft: 40 }}>
                        <li>
                            <a href="https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol" target="_blank" rel="nofollow noopener noreferrer">
                                Chrome
                            </a>
                        </li>
                        <li>
                            <a href="https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg" target="_blank" rel="nofollow noopener noreferrer">
                                Edge
                            </a>
                        </li>
                        <li>
                            <a href="https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/" target="_blank" rel="nofollow noopener noreferrer">
                                Firefox
                            </a>
                        </li>
                        <li>
                            <a href="https://addons.opera.com/extensions/details/live-editor-for-css-and-less-magic-css/" target="_blank" rel="nofollow noopener noreferrer">
                                Opera
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        question: 'How do I get help or report a bug?',
        answer: (
            <div>
                <ul style={{ marginLeft: 40 }}>
                    <li>
                        The product details are available at:
                        <br />
                        <a href="https://github.com/webextensions/live-css-editor/wiki" target="_blank">https://github.com/webextensions/live-css-editor/wiki</a>
                    </li>
                    <li>
                        To report a bug or provide a suggestion, kindly create a new issue at:
                        <br />
                        <a href="https://github.com/webextensions/live-css-editor/issues" target="_blank">https://github.com/webextensions/live-css-editor/issues</a>
                    </li>
                </ul>
            </div>
        )
    }
];

const FAQs = function () {
    return (
        <div>
            {listOfFaqs.map((faq, index) => {
                return (
                    <div key={index} className={styles.faqItem}>
                        <GenericAccordion title={faq.question}>
                            <div style={{ lineHeight: 1.8 }}>
                                {faq.answer}
                            </div>
                        </GenericAccordion>
                    </div>
                );
            })}
        </div>
    );
};

const TabHelp = function () {
    return (
        <div className={styles.TabHelp}>
            <FAQs />
        </div>
    );
};

export { TabHelp };

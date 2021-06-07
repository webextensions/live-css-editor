/* globals sendMessageForGa */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField/index.js';
import Button from '@material-ui/core/Button/index.js';
import SearchIcon from '@material-ui/icons/Search.js';

import OAuth from 'oauth-1.0a';
import hmacSha1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';

import {
    RovingTabIndexProvider,
    useRovingTabIndex,
    useFocusEffect
} from 'react-roving-tabindex';

import { useWindowSize } from '@react-hook/window-size';

import { Loading } from 'Loading/Loading.js';

import './searchUi.css';

import {
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
} from 'reducers/actionTypes.js';

import { READYSTATE, STATUSCODE, UNINITIALIZED, LOADING, LOADED, ERROR } from 'constants/readyStates.js';

const READYSTATE_FURTHER = 'READYSTATE_FURTHER';
const STATUSCODE_FURTHER = 'STATUSCODE_FURTHER';

// TODO: DUPLICATE: This piece of code is duplicated in commands.js
const copy = async function (simpleText) {
    try {
        await navigator.clipboard.writeText(simpleText);
        return true;
    } catch (e) {
        return false;
    }
};

const IconEntry = ({ children, rowIndex, onFocus, className }) => {
    // The ref of the input to be controlled.
    const ref = useRef(null);

    // handleKeyDown and handleClick are stable for the lifetime of the component:
    const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
        ref,     // Don't change the value of this ref
        false,   // This sets "disabled" as false
        rowIndex
    );

    // Use some mechanism to set focus on the button if it gets focus.
    // In this case, the included useFocusEffect hook is used.
    useFocusEffect(focused, ref);

    return (
        <a
            ref={ref}
            tabIndex={tabIndex} // tabIndex must be applied here
            onKeyDown={handleKeyDown}
            onFocus={(evt) => {
                if (onFocus) {
                    onFocus(evt);
                }
            }}
            onClick={handleClick}
            role="gridcell"
            style={{
                display: 'block',
                cursor: 'pointer',
                borderWidth: 0 /* https://sass-lang.com/ */
            }}
            className={className}
        >
            {children}
        </a>
    );
};
IconEntry.propTypes = {
    children: PropTypes.node.isRequired,
    rowIndex: PropTypes.number.isRequired,
    onFocus: PropTypes.func.isRequired,
    className: PropTypes.string
};

const ListOfIcons = function (props) {
    const {
        icons,
        doSearch,
        output
    } = props;

    // Required to re-render upon window resize so that the grid column count gets updated. Otherwise, before first
    // re-render, the focus traversal with keyboard would move with respect to old positioning.
    useWindowSize();

    const [selectedIndex, setSelectedIndex] = useState(null);

    // https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid/58393617#58393617
    // https://codepen.io/Robbendebiene/pen/pooyOyd
    const [columnCount, setColumnCount] = useState(1);

    const refGrid = useRef(null);

    useEffect(() => {
        const gridComputedStyle = window.getComputedStyle(refGrid.current);
        const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;

        setColumnCount(gridColumnCount);
    });

    const [svgContents, setSvgContents] = useState({
        [READYSTATE]: UNINITIALIZED
    });
    const ensureLoad = async function (iconUrl) {
        if (svgContents[READYSTATE] === LOADED) {
            // do nothing
        } else {
            setSvgContents({
                [READYSTATE]: LOADING
            });

            sendMessageForGa(['_trackEvent', 'getIcons', 'receiveSvgIconDataInitiated']);
            const [err, data, coreResponse] = ( // eslint-disable-line no-unused-vars
                await window.chromeRuntimeMessageToBackgroundScript({
                    type: 'magicss-bg',
                    subType: 'ajax',
                    payload: {
                        url: iconUrl
                    }
                })
            );

            if (err) {
                setSvgContents({
                    [READYSTATE]: ERROR,
                    status: '✘ Failed to get icon data'
                });
                sendMessageForGa(['_trackEvent', 'getIcons', 'receiveSvgIconDataError']);
            } else if (coreResponse && coreResponse.status === 200 && coreResponse.responseText) {
                const svgInResponse = coreResponse.responseText;

                setSvgContents({
                    [READYSTATE]: LOADED,
                    svgXml: svgInResponse,
                    contentType: coreResponse.contentType
                });
                sendMessageForGa(['_trackEvent', 'getIcons', 'receiveSvgIconDataSuccess']);
            } else {
                // Unexpected error
                setSvgContents({
                    [READYSTATE]: ERROR,
                    status: '✘ Failed to get icon data'
                });
                sendMessageForGa(['_trackEvent', 'getIcons', 'receiveSvgIconDataErrorUnexpected']);
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexGrow: 1
            }}
        >
            <div
                ref={refGrid}
                style={{
                    flexGrow: 1,
                    display: 'grid',
                    gridAutoColumns: 'auto',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 80px) )',
                    gridAutoRows: 80,
                    overflow: 'auto',
                    padding: 10
                }}
                role="grid"
            >
                <RovingTabIndexProvider>
                    {
                        icons.map(function (icon, index) {
                            const {
                                preview_url
                            } = icon;

                            const className = classNames({
                                magicssSearchResultEntryIcon: true,
                                iconIsSelected: selectedIndex === index ? true : false
                            });

                            return (
                                <IconEntry
                                    key={index}
                                    rowIndex={parseInt(index / columnCount)}
                                    onFocus={() => {
                                        if (selectedIndex === index) {
                                            // do nothing
                                        } else {
                                            setSelectedIndex(index);
                                            setSvgContents({
                                                [READYSTATE]: UNINITIALIZED
                                            });
                                        }
                                    }}
                                    className={className}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        <div
                                            className="magicssSearchResultEntryIconBorderLayer"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <img
                                                src={preview_url}
                                                style={{
                                                    maxWidth: 40,
                                                    maxHeight: 40,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderWidth: 0 /* https://moderncss.dev/ */
                                                }}
                                            />
                                        </div>
                                    </div>
                                </IconEntry>
                            );
                        })
                    }
                </RovingTabIndexProvider>
                {
                    (
                        icons.length % 50 === 0 &&
                        icons.length >= 50         // Added just for robustness
                    ) &&
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        style={{
                            paddingTop: 8,
                            paddingBottom: 7
                        }}
                        disabled={function () {
                            if (output[READYSTATE_FURTHER] === LOADING) {
                                return true;
                            } else {
                                return false;
                            }
                        }()}
                        onClick={function () {
                            setTimeout(async function () {
                                const pageNumber = 1 + parseInt(icons.length / 50);
                                doSearch({ page: pageNumber });
                            });
                        }}
                    >
                        {function () {
                            if (output[READYSTATE_FURTHER] === LOADING) {
                                return <Loading type="line-scale" />;
                            } else {
                                if (output[READYSTATE_FURTHER] === ERROR) {
                                    return (
                                        <div>
                                            <div
                                                style={{
                                                    textTransform: 'none',
                                                    fontSize: 13,
                                                    letterSpacing: 0.4 /* https://code.visualstudio.com/ */
                                                }}
                                            >
                                                More
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    textTransform: 'none',
                                                    color: '#444',
                                                    textDecoration: 'underline',
                                                    letterSpacing: 0.4 /* https://code.visualstudio.com/ */
                                                }}
                                            >
                                                Retry
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            style={{
                                                textTransform: 'none',
                                                fontSize: 13,
                                                letterSpacing: 0.4 /* https://code.visualstudio.com/ */
                                            }}
                                        >
                                            More
                                        </div>
                                    );
                                }
                            }
                        }()}
                    </Button>
                }
            </div>
            <div
                className="magicss-search-icon-preview"
                style={{
                    width: 300,
                    overflow: 'auto',
                    borderLeft: '1px solid rgba(0, 0, 0, 0.23)'
                }}
            >
                <div style={{ height: '100%' }}>
                    {
                        selectedIndex === null &&
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontFamily: 'Arial, sans-serif',
                                color: '#777'
                            }}
                        >
                            Please select an icon to get its details
                        </div>
                    }
                    {
                        typeof selectedIndex === 'number' &&
                        <div
                            style={{
                                padding: '30px 10px',
                                wordBreak: 'break-word'
                            }}
                        >
                            <div>
                                {(function () {
                                    const icon = icons[selectedIndex];

                                    return (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <a target="_blank" rel="noreferrer" href={icon.icon_url}>
                                                    <img src={icon.preview_url} style={{ display: 'block', width: 100, height: 100 }} />
                                                </a>
                                            </div>

                                            <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                                <table className="magicss-icon-description">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>Download: </td>
                                                            <td style={{ color: '#888', textAlign: 'left' }}>
                                                                <a style={{ textDecoration: 'none', color: '#3f51b5' }} target="_blank" rel="noreferrer" href={icon.icon_url}>
                                                                    {icon.term}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>By: </td>
                                                            <td style={{ textAlign: 'left' }}>
                                                                <a style={{ color: '#888', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.uploader.permalink}/`}>
                                                                    {icon.uploader.name}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>From: </td>
                                                            <td style={{ textAlign: 'left' }}>
                                                                <a style={{ color: '#888', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.permalink}/`}>
                                                                    Noun Project
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>License: </td>
                                                            <td style={{ color: '#888', textAlign: 'left' }}>
                                                                {(
                                                                    icon.license_description === 'public-domain' ?
                                                                        'Public domain' :
                                                                        icon.license_description
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div style={{ marginTop: 20, textAlign: 'center' }}>
                                                {(function () {
                                                    let btnComponents = null;

                                                    let disabled = false;
                                                    if (svgContents[READYSTATE] === LOADING) {
                                                        disabled = true;
                                                    }
                                                    btnComponents = (
                                                        <React.Fragment>
                                                            <div>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={disabled}
                                                                    style={{
                                                                        fontSize: 13 /* https://code.visualstudio.com/ */
                                                                    }}
                                                                    onClick={async () => {
                                                                        await ensureLoad(icon.icon_url);

                                                                        setSvgContents(function (prevState) {
                                                                            if (prevState[READYSTATE] === LOADED) {
                                                                                setTimeout(async function () {
                                                                                    const editor = window.MagiCSSEditor;

                                                                                    const code = editor.getTextValue();

                                                                                    const dataUrl = `data:${prevState['contentType']};base64,` + btoa(prevState['svgXml']);

                                                                                    let strToInsert = [
                                                                                        'selector-goes-here {',
                                                                                        `\t/* Source: https://thenounproject.com${icon.permalink}/ */`,
                                                                                        '\tbackground-image: url("' + dataUrl + '");',
                                                                                        '',
                                                                                        '\tbackground-repeat: no-repeat;',
                                                                                        '\tbackground-size: contain;',
                                                                                        '\twidth: 24px;',
                                                                                        '\theight: 24px;',
                                                                                        '}',
                                                                                        '',
                                                                                        ''
                                                                                    ].join('\n');
                                                                                    if (window.indentWithTabs) {
                                                                                        // do nothing
                                                                                    } else {
                                                                                        strToInsert = strToInsert.replace(/\t/g, ' '.repeat(window.indentUnit));
                                                                                    }
                                                                                    await editor.setTextValue(strToInsert + code);
                                                                                    await editor.reInitTextComponent({pleaseIgnoreCursorActivity: true});

                                                                                    editor.setCursor({ line: 0, ch: 0 }, {pleaseIgnoreCursorActivity: true});
                                                                                    editor.cm.setSelection({ line: 0, ch: 0 }, { line: 0, ch: 18 });
                                                                                    editor.focus();

                                                                                    window.redux_store.dispatch({
                                                                                        type: APP_$_CLOSE_SEARCH_ICONS
                                                                                    });

                                                                                    sendMessageForGa(['_trackEvent', 'getIcons', 'svgIconInsertedInEditor']);
                                                                                });


                                                                                return {
                                                                                    ...prevState,
                                                                                    status: '✔ Inserted CSS'
                                                                                };
                                                                            } else {
                                                                                return prevState;
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    Insert in editor
                                                                </Button>
                                                            </div>

                                                            <div style={{ marginTop: 15 }}>
                                                                <Button
                                                                    className="magicss-search-icons-copy-svg"
                                                                    variant="text"
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={disabled}
                                                                    style={{
                                                                        fontSize: 13 /* https://code.visualstudio.com/ */
                                                                    }}
                                                                    onClick={async () => {
                                                                        await ensureLoad(icon.icon_url);

                                                                        setSvgContents(function (prevState) {
                                                                            if (prevState[READYSTATE] === LOADED) {
                                                                                setTimeout(async function () {
                                                                                    const flag = await copy(prevState['svgXml']);
                                                                                    if (!flag) {
                                                                                        sendMessageForGa(['_trackEvent', 'getIcons', 'svgIconCopyError']);
                                                                                        setSvgContents(function (prevState) {
                                                                                            return {
                                                                                                ...prevState,
                                                                                                status: '✘ Failed to copy'
                                                                                            };
                                                                                        });
                                                                                    }
                                                                                });
                                                                                sendMessageForGa(['_trackEvent', 'getIcons', 'svgIconCopySuccess']);
                                                                                return {
                                                                                    ...prevState,
                                                                                    status: '✔ Copied SVG'
                                                                                };
                                                                            } else {
                                                                                return prevState;
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    Copy SVG
                                                                </Button>
                                                                <Button
                                                                    className="magicss-search-icons-copy-data-url"
                                                                    variant="text"
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={disabled}
                                                                    style={{
                                                                        marginLeft: 10,
                                                                        fontSize: 13 /* https://code.visualstudio.com/ */
                                                                    }}
                                                                    onClick={async () => {
                                                                        await ensureLoad(icon.icon_url);

                                                                        setSvgContents(function (prevState) {
                                                                            if (prevState[READYSTATE] === LOADED) {
                                                                                setTimeout(async function () {
                                                                                    const dataUrl = `data:${prevState['contentType']};base64,` + btoa(prevState['svgXml']);
                                                                                    const flag = await copy(dataUrl);
                                                                                    if (!flag) {
                                                                                        sendMessageForGa(['_trackEvent', 'getIcons', 'svgIconCopyDataUrlError']);
                                                                                        setSvgContents(function (prevState) {
                                                                                            return {
                                                                                                ...prevState,
                                                                                                status: '✘ Failed to copy'
                                                                                            };
                                                                                        });
                                                                                    }
                                                                                });
                                                                                sendMessageForGa(['_trackEvent', 'getIcons', 'svgIconCopyDataUrlSuccess']);
                                                                                return {
                                                                                    ...prevState,
                                                                                    status: '✔ Copied Data URL'
                                                                                };
                                                                            } else {
                                                                                return prevState;
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    Copy Data URL
                                                                </Button>
                                                            </div>
                                                        </React.Fragment>
                                                    );

                                                    let cmpStatus = null;
                                                    if (svgContents[READYSTATE] === LOADING) {
                                                        cmpStatus = (
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5, color: '#f00', fontSize: 12 }}>
                                                                <Loading type="line-scale" />
                                                            </div>
                                                        );
                                                    } else if (svgContents[READYSTATE] === ERROR) {
                                                        if (svgContents['status']) {
                                                            cmpStatus = (
                                                                <div style={{ marginTop: 5, color: '#f00', fontSize: 12 }}>
                                                                    {svgContents['status']}
                                                                </div>
                                                            );
                                                        }
                                                    } else if (svgContents[READYSTATE] === LOADED) {
                                                        if (svgContents['status']) {
                                                            let color = '#008000';
                                                            // TODO: Improve this if condition as this one is fragile
                                                            if (svgContents['status'].indexOf('✘') === 0) {
                                                                color = '#f00';
                                                            }
                                                            cmpStatus = (
                                                                <div
                                                                    className="magicss-search-icons-svg-contents-copy-status"
                                                                    style={{ marginTop: 5, color, fontSize: 12 }}
                                                                >
                                                                    {svgContents['status']}
                                                                </div>
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <React.Fragment>
                                                            {btnComponents}
                                                            {cmpStatus}
                                                        </React.Fragment>
                                                    );
                                                }())}
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
    icons: PropTypes.array.isRequired,
    doSearch: PropTypes.func.isRequired,
    output: PropTypes.object.isRequired
};

const SearchOutput = function (props) {
    const {
        flagConfigurationDone,
        output,
        doSearch
    } = props;
    const { icons } = output;
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
            size="small"
            style={{
                paddingTop: 8,
                paddingBottom: 7,
                fontSize: 13 /* https://code.visualstudio.com/ */
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
            Configure Access
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
                                    <div className="magic-css-unable-to-access-noun-project-api">
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
                        } else if (statusCode === 0) {
                            return (
                                <React.Fragment>
                                    <div>
                                        A network error occurred.
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        Please check your internet connection and try again.
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
        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <ListOfIcons icons={icons} doSearch={doSearch} output={output} />
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

// https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect/53446665#53446665
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const SearchUi = function (props) {
    const {
        accessKey,
        secret,
        lastOpenedAt
    } = props;
    const flagAccessKeyAndSecretExist = (accessKey && secret) ? true : false;

    const refFirstInput = useRef(null);

    const prevData = usePrevious({ lastOpenedAt });
    useEffect(() => {
        if(prevData && prevData.lastOpenedAt !== lastOpenedAt) {
            const current = refFirstInput.current;
            if (current) {
                const inputEl = current.querySelector('input');
                if (inputEl) {
                    inputEl.select();
                    inputEl.focus();
                }
            }
        }
    }, [lastOpenedAt]);

    const [searchText, setSearchText] = useState('');

    const [output, setOutput] = useState({
        [READYSTATE]: UNINITIALIZED
    });

    const doSearch = async function ({ page }) {
        sendMessageForGa(['_trackEvent', 'getIcons', 'initiatedSearch']);

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
            url: (
                // `https://api.thenounproject.com/icons/${encodeURIComponent(searchText)}`
                `https://api.thenounproject.com/icons/${encodeURIComponent(searchText)}?limit_to_public_domain=1` +
                (page >= 2 ? `&page=${page}` : '')
            ),
            method: 'GET'
        };
        const headers = oauth.toHeader(oauth.authorize(request_data));

        if (page === 1) {
            setOutput({
                [READYSTATE]: LOADING
            });
        } else {
            setOutput({
                ...output,
                [READYSTATE_FURTHER]: LOADING
            });
        }

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
            if (page === 1) {
                setOutput({
                    [READYSTATE]: ERROR,
                    [STATUSCODE]: coreResponse.status,
                    searchInput: searchText
                });
            } else {
                setOutput({
                    ...output,
                    [READYSTATE_FURTHER]: ERROR,
                    [STATUSCODE_FURTHER]: coreResponse.status,
                });
            }
            sendMessageForGa(['_trackEvent', 'getIcons', 'searchError']);
            sendMessageForGa(['_trackEvent', 'getIcons', 'searchErrorForPage' + page]);
        } else {
            if (page === 1) {
                setOutput({
                    [READYSTATE]: LOADED,
                    [STATUSCODE]: coreResponse.status,
                    searchInput: searchText,
                    icons: data.icons
                });
            } else {
                setOutput({
                    ...output,
                    [READYSTATE_FURTHER]: LOADED,
                    [STATUSCODE_FURTHER]: coreResponse.status,
                    icons: output.icons.concat(data.icons)
                });
            }
            sendMessageForGa(['_trackEvent', 'getIcons', 'searchSuccess']);
            sendMessageForGa(['_trackEvent', 'getIcons', 'searchSuccessForPage' + page]);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 125
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
                            ref={refFirstInput}
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
                                            await doSearch({ page: 1 });
                                        });
                                    }
                                }
                            }}
                            className="magicss-search-for-icons-input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginLeft: 20 }}>
                        <Button
                            className="magicss-search-icons-button"
                            variant="contained"
                            color="primary"
                            size="medium"
                            startIcon={<SearchIcon />}
                            style={{
                                paddingTop: 8,
                                paddingBottom: 7,
                                fontSize: 14 /* https://code.visualstudio.com/ */
                            }}
                            disabled={!searchText || !flagAccessKeyAndSecretExist}
                            onClick={function () {
                                setTimeout(async function () {
                                    await doSearch({ page: 1 });
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
                        <SearchOutput
                            flagConfigurationDone={flagAccessKeyAndSecretExist}
                            output={output}
                            doSearch={doSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
SearchUi.propTypes = {
    accessKey: PropTypes.string.isRequired,
    secret: PropTypes.string.isRequired,
    lastOpenedAt: PropTypes.number.isRequired
};

const _SearchUi = connect(mapStateToProps)(SearchUi);

export { _SearchUi as SearchUi };

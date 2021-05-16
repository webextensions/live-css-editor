import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField/index.js';
import Button from '@material-ui/core/Button/index.js';
import SearchIcon from '@material-ui/icons/Search.js';

import copy from 'copy-text-to-clipboard';

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
            style={{ display: 'block', cursor: 'pointer' }}
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
        icons
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

            const [err, data, coreResponse] = await window.chromeRuntimeMessageToBackgroundScript({
                type: 'magicss-bg',
                subType: 'ajax',
                payload: {
                    url: iconUrl
                }
            });

            if (err) {
                setSvgContents({
                    [READYSTATE]: ERROR,
                    status: '✘ Failed to get icon data'
                });
            } else if (coreResponse && coreResponse.status === 200 && coreResponse.responseText) {
                const svgInResponse = coreResponse.responseText;

                setSvgContents({
                    [READYSTATE]: LOADED,
                    svgXml: svgInResponse,
                    contentType: coreResponse.contentType
                });
            } else {
                // Unexpected error
                setSvgContents({
                    [READYSTATE]: ERROR,
                    status: '✘ Failed to get icon data'
                });
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
                                        setSelectedIndex(index);
                                        setSvgContents({
                                            [READYSTATE]: UNINITIALIZED
                                        });
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
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </IconEntry>
                            );
                        })
                    }
                </RovingTabIndexProvider>
            </div>
            <div
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
                                                    <img src={icon.preview_url} style={{ width: 100 }} />
                                                </a>
                                            </div>

                                            <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                                <table className="magicss-icon-description">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>Download: </td>
                                                            <td style={{ color: '#888' }}>
                                                                <a style={{ textDecoration: 'none', color: '#3f51b5' }} target="_blank" rel="noreferrer" href={icon.icon_url}>
                                                                    {icon.term}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>By: </td>
                                                            <td>
                                                                <a style={{ color: '#888', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.uploader.permalink}/`}>
                                                                    {icon.uploader.name}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>From: </td>
                                                            <td>
                                                                <a style={{ color: '#888', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://thenounproject.com${icon.permalink}/`}>
                                                                    Noun Project
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ color: '#aaa', textAlign: 'right' }}>License: </td>
                                                            <td style={{ color: '#888' }}>
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
                                                                    variant="text"
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={disabled}
                                                                    onClick={async () => {
                                                                        await ensureLoad(icon.icon_url);

                                                                        setSvgContents(function (prevState) {
                                                                            if (prevState[READYSTATE] === LOADED) {
                                                                                copy(prevState['svgXml']);
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
                                                                    variant="text"
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={disabled}
                                                                    onClick={async () => {
                                                                        await ensureLoad(icon.icon_url);

                                                                        setSvgContents(function (prevState) {
                                                                            if (prevState[READYSTATE] === LOADED) {
                                                                                const dataUrl = `data:${prevState['contentType']};base64,` + btoa(prevState['svgXml']);
                                                                                copy(dataUrl);
                                                                                return {
                                                                                    ...prevState,
                                                                                    status: '✔ Copied Data URL'
                                                                                };
                                                                            } else {
                                                                                return prevState;
                                                                            }
                                                                        });
                                                                    }}
                                                                    style={{ marginLeft: 10 }}
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
                                                        cmpStatus = (
                                                            <div style={{ marginTop: 5, color: '#f00', fontSize: 12 }}>
                                                                {svgContents['status']}
                                                            </div>
                                                        );
                                                    } else if (svgContents[READYSTATE] === LOADED) {
                                                        cmpStatus = (
                                                            <div style={{ marginTop: 5, color: '#008000', fontSize: 12 }}>
                                                                {svgContents['status']}
                                                            </div>
                                                        );
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
            size="small"
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

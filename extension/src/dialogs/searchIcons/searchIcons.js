import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog/index.js';
import DialogContent from '@material-ui/core/DialogContent/index.js';
import DialogTitle from '@material-ui/core/DialogTitle/index.js';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Joyride from 'react-joyride';

import { SearchUi } from './searchUi.js';

import {
    APP_$_CLOSE_SEARCH_ICONS,
    APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
} from 'reducers/actionTypes.js';

import './searchIcons.css';

function mapStateToProps(state) {
    return {
        open: state.app.searchIcons.open,
        accessKey: state.app.searchIcons.accessKey, // Using "accessKey" since it can't be named as "key" becaused that is a reserved prop name
        secret: state.app.searchIcons.secret
    };
}

const joyrideSteps = [
    {
        target: '.magicss-joyride-configure-icon-search-api',
        content: 'Please configure the access details to start using the API',
        disableBeacon: true,
        styles: {
            buttonNext: {
                padding: '8px 25px',
                fontSize: 14,
                lineHeight: 1.75,
                backgroundColor: '#3f51b5'
            },
            tooltipContent: {
                letterSpacing: 'normal' /* CSS fix for https://developer.mozilla.org/en-US/docs/Web */
            }
        }
    }
];

const SearchIcons = function (props) {
    const {
        open,
        accessKey,
        secret
    } = props;

    const [joyrideCompleted, setJoyrideCompleted] = useState(false);

    const handleClose = () => {
        props.dispatch({ type: APP_$_CLOSE_SEARCH_ICONS });
    };

    let showJoyride = true;
    if (accessKey && secret) {
        showJoyride = false;
    }

    const [openedAtLeastOnce, setOpenedAtLeastOnce] = useState(false);
    useEffect(() => {
        if (open) {
            setOpenedAtLeastOnce(true);
        }
    });

    const [lastOpenedAt, setLastOpenedAt] = useState(0);

    useEffect(() => {
        if (open) {
            setLastOpenedAt(+new Date());
        }
    }, [open]);

    let styleHideIfNotOpen;
    if (open) {
        styleHideIfNotOpen = {};
    } else {
        styleHideIfNotOpen = {
            visibility: 'hidden',
            display: 'none'
        };
    }

    if (openedAtLeastOnce) {
        return (
            <div style={styleHideIfNotOpen}>
                <Dialog
                    open={openedAtLeastOnce}
                    style={styleHideIfNotOpen}

                    onClose={handleClose}
                    disableBackdropClick

                    disableAutoFocus={!open || (showJoyride && !joyrideCompleted)}
                    disableEnforceFocus={!open || (showJoyride && !joyrideCompleted)}
                    // Helpful while debugging
                    // disableAutoFocus={true}
                    // disableEnforceFocus={true}

                    className="magicss-dialog-search-icons"
                    PaperProps={{
                        style: {
                            height: '90vh',
                            width: '90vw'
                        }
                    }}
                    maxWidth={false} // Without this, a max-width limit would be applicable which would limit `width: 90vw`
                >
                    <DialogTitle id="alert-dialog-title">
                        <div style={{ display: 'flex' }}>
                            <div style={{ flexGrow: 1, display: 'flex' }}>
                                <div>
                                    Icons via Noun Project API
                                </div>
                                <div
                                    onClick={function () {
                                        props.dispatch({
                                            type: APP_$_CLOSE_SEARCH_ICONS
                                        });
                                        props.dispatch({
                                            type: APP_$_OPEN_SEARCH_ICONS_CONFIGURATION
                                        });
                                    }}
                                    className="magicss-cog-wheel-icon magicss-joyride-configure-icon-search-api"
                                    title="Configure Access"
                                />
                            </div>
                            <div>
                                <IconButton onClick={handleClose} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>

                        {
                            (
                                showJoyride &&
                                !joyrideCompleted
                            ) &&
                            <Joyride
                                steps={joyrideSteps}
                                spotlightClicks
                                disableScrolling={true}
                                scrollToFirstStep={false}
                                locale={{
                                    close: "OK", // Change the text of the "close" button
                                    last: null   // Required to hide the tooltip
                                }}
                                styles={{
                                    options: {
                                        zIndex: 2147483647
                                    },
                                    tooltipContent: {
                                        fontFamily: 'Arial, sans-serif'
                                    }
                                }}
                                floaterProps = {{
                                    disableAnimation: true
                                }}
                                run={true}
                                callback={function (data) {
                                    const { lifecycle, status } = data;
                                    if (lifecycle === 'complete' && status === 'finished') {
                                        setJoyrideCompleted(true);
                                    }
                                }}
                            />
                        }
                    </DialogTitle>
                    <DialogContent style={{ paddingBottom: 24 }}>
                        <SearchUi lastOpenedAt={lastOpenedAt} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    } else {
        return null;
    }
};
SearchIcons.propTypes = {
    open: PropTypes.bool,
    dispatch: PropTypes.func
};

const _SearchIcons = connect(mapStateToProps)(SearchIcons);

export { _SearchIcons as SearchIcons };

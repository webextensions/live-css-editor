/* global chrome */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';
import IconButton from '@mui/material/IconButton/index.js';

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser.js';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';
import OpenInNewIcon from '@mui/icons-material/OpenInNew.js';

import Tooltip from '@mui/material/Tooltip/index.js';

import {
    useDialogsStore,
    useAuthStore
} from '../../../optionsZustandStore.js';

import { siteOrigin } from '../../../../appUtils/siteOrigin.js';

// import { alertDialog } from 'helpmate/dist/dom/alertDialog.js';
import { ResponsiveDialog } from '../../../../lib/ResponsiveDialog/ResponsiveDialog.js';

import styles from './RegistrationOptions.css';

const MyFrame = function ({ onClose }) {
    const manifest = chrome.runtime.getManifest();
    const iframeSrc = (
        siteOrigin +
        '/connect' +
        '?apiVersion=1.0.0' +
        '&appId=magic-css' +
        '&appVersion=' + encodeURIComponent(manifest.version) +
        '&appType=WebExtension' +
        '&appName=' + encodeURIComponent(manifest.name)
    );

    const handleClose = function () {
        onClose();
    };

    return (
        <div>
            <ResponsiveDialog
                title={
                    <span style={{ fontSize: 20 }}>
                        Connect via webextensions.org
                    </span>
                }
                classNameForTitle="ResponsiveDialogTitle"
                open={true}
                closable={true}
                onClose={handleClose}
                noPrimaryButton={true}
                style={{
                    width: '90%',
                    maxWidth: '90%',
                    height: '90%',
                    maxHeight: '90%'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 165px)',
                        position: 'relative'
                    }}
                >
                    <iframe
                        src={iframeSrc}

                        // // Allow clipboard acces
                        // allow="clipboard-write"

                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: 'calc(100vh - 165px)',
                            zIndex: 1
                        }}
                    />

                    <div
                        style={{
                            height: 'calc(100vh - 146px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div className={styles.dotTyping}></div>
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
};
MyFrame.propTypes = {
    onClose: PropTypes.func.isRequired
};

const RegistrationOptions = () => {
    const flagShowConnectViaDialog = useDialogsStore((state) => {
        return state.flagShowConnectViaDialog;
    });

    const auth = useAuthStore((state) => {
        return state;
    });
    const flagLoggedIn = auth.isLoggedIn();

    if (flagLoggedIn) {
        const hoursNow = (new Date()).getHours();
        const greeting = (() => {
            if (hoursNow >= 4 && hoursNow < 12) {
                return 'Good morning!';
            } else if (hoursNow >= 12 && hoursNow < 18) {
                return 'Good afternoon!';
            } else if (hoursNow >= 18 && hoursNow < 24) {
                return 'Good evening!';
            } else {
                return 'Welcome!';
            }
        })();

        return (
            <div
                className={styles.RegistrationOptions}
                style={{ backgroundColor: 'rgba(0,255,0,0.03)' }}
            >
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        {greeting}
                    </div>

                    <div className={styles.blockMessage}>
                        <div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: 'rgba(0,255,128,0.15)',
                                    border: '1px solid rgba(0,64,0,0.20)',
                                    padding: '3px 10px',
                                    borderRadius: 10
                                }}
                            >
                                <div style={{ display: 'inline-block', height: '20px', marginBottom: -3 }}>
                                    <VerifiedUserIcon style={{ marginBottom: -2 }} />
                                </div>
                                <div style={{ display: 'inline-block', marginLeft: 8, lineHeight: '20px', marginBottom: -3 }}>
                                    Signed in
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 25 }}>
                            You have access to the following features:
                        </div>
                    </div>

                    <div
                        className={styles.blockList}
                        style={{
                            marginTop: 20
                        }}
                    >
                        <ul>
                            <li>Local File Editing</li>
                            <li>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Learning Resources
                                    </div>
                                    <div style={{ marginLeft: 7, marginTop: -2 }}>
                                        <Tooltip
                                            title="Open in new tab"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton
                                                size="small"
                                                target="_blank"
                                                href={`${siteOrigin}/resources/web-development?category=learning-resources`}
                                            >
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Web Development Tools
                                    </div>
                                    <div style={{ marginLeft: 7, marginTop: -2 }}>
                                        <Tooltip
                                            title="Open in new tab"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton
                                                size="small"
                                                target="_blank"
                                                href={`${siteOrigin}/resources/web-development`}
                                            >
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.blockButton}>
                        <div>
                            <Button
                                href={siteOrigin + '/account?refAppId=magic-css'}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                size="large"
                                style={{
                                    minWidth: 160
                                }}
                            >
                                Account Details
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                style={{
                                    marginLeft: 20,
                                    minWidth: 160,
                                    backgroundColor: '#999'
                                }}
                                onClick={async () => {
                                    // TODO: Handle potential errors
                                    await chrome.storage.local.set({
                                        authValue: null
                                    });

                                    auth.logout();
                                }}
                            >
                                Disconnect
                            </Button>
                        </div>
                    </div>
                </div>

                {
                    flagShowConnectViaDialog &&
                    <MyFrame
                        onClose={() => {
                            useDialogsStore.setState({ flagShowConnectViaDialog: false });
                        }}
                    />
                }
            </div>
        );
    } else {
        return (
            <div
                className={styles.RegistrationOptions}
                style={{ backgroundColor: 'rgba(255,0,0,0.03)' }}
            >
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        Sign up / Sign in
                    </div>

                    <div className={styles.blockMessage}>
                        You need to sign in for accessing the following features:
                    </div>

                    <div
                        className={styles.blockList}
                        style={{
                            marginTop: 20
                        }}
                    >
                        <ul>
                            <li>Local File Editing</li>
                            <li>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Learning Resources
                                    </div>
                                    <div style={{ marginLeft: 7, marginTop: -2 }}>
                                        <Tooltip
                                            title="A curated list of resources for learning web development"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small">
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Web Development Tools
                                    </div>
                                    <div style={{ marginLeft: 7, marginTop: -2 }}>
                                        <Tooltip
                                            title="A curated list of web development tools"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small">
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.blockButton}>
                        <Button
                            variant="contained"
                            size="large"
                            style={{
                                minWidth: 160
                            }}
                            onClick={() => {
                                useDialogsStore.setState({ flagShowConnectViaDialog: true });
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </div>

                {
                    flagShowConnectViaDialog &&
                    <MyFrame
                        onClose={() => {
                            useDialogsStore.setState({ flagShowConnectViaDialog: false });
                        }}
                    />
                }
            </div>
        );
    }
};

export { RegistrationOptions };

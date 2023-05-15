/* global chrome */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';

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

    return (
        <div className={styles.RegistrationOptions}>
            <div className={styles.block}>
                <div className={styles.blockHeader}>
                    {
                        flagLoggedIn ?
                            'Signed in' :
                            'Sign up / Sign in'
                    }
                </div>
                <div className={styles.blockList}>
                    <ul>
                        <li>Local File Editing</li>
                        <li>CSS Generators</li>
                        <li>Curated Web Development Tools</li>
                    </ul>
                </div>
                <div className={styles.blockButton}>
                    {(() => {
                        if (flagLoggedIn) {
                            return (
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
                            );
                        } else {
                            return (
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
                            );
                        }
                    })()}
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
};

export { RegistrationOptions };

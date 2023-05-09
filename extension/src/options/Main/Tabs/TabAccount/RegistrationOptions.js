/* global chrome */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';

// import { useAtom } from 'jotai';

import { useDialogsStore } from '../../../optionsZustandStore.js';


// import { alertDialog } from 'helpmate/dist/dom/alertDialog.js';
import { ResponsiveDialog } from '../../../../lib/ResponsiveDialog/ResponsiveDialog.js';

import styles from './RegistrationOptions.css';

// Use this for the cases where the code should never reach in imaginable scenarios.
const requestUserViaConsoleToReportUnexpectedError = function (e) {
    console.error(e);
    console.error([
        'An unexpected error was encountered by Magic CSS.',
        'Kindly report this issue at:',
        '    https://github.com/webextensions/live-css-editor/issues'
    ].join('\n'));
};
const flagDevMode = (function () {
    let flag = false;
    try {
        // TODO: Verify that this works well across browsers
        // https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode/20227975#20227975
        flag = (!('update_url' in chrome.runtime.getManifest()));
    } catch (e) {
        requestUserViaConsoleToReportUnexpectedError(e);
    }
    return flag;
})();

const MyFrame = function ({ onClose }) {
    let iframeSrc = 'https://www.webextensions.org/connect';
    if (flagDevMode) {
        iframeSrc = 'https://local.webextensions.org:4443/connect';
    }

    iframeSrc += (
        '?appId=magic-css' +
        '&appVersion=' + encodeURIComponent(chrome.runtime.getManifest().version) +
        '&appName=' + encodeURIComponent(chrome.runtime.getManifest().name) +
        '&appType=WebExtension' +
        '&apiVersion=1.0.0'
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
    // const [flagShowFrame, setFlagShowFrame] = useState(false);
    // const [flagShowFrame, setFlagShowFrame] = useAtom(showConnectViaDialogAtom);
    const flagShowConnectViaDialog = useDialogsStore((state) => {
        debugger;
        return state.flagShowConnectViaDialog;
    });

    debugger;

    return (
        <div className={styles.RegistrationOptions}>
            <div className={styles.block}>
                <div className={styles.blockHeader}>
                    Sign up / Sign in
                </div>
                <div className={styles.blockList}>
                    <ul>
                        <li>Local File Editing</li>
                        <li>Basic CSS Generators</li>
                        <li>Curated Web Development Tools</li>
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
                            // debugger;
                            // setFlagShowFrame(true);
                            // useDialogsStore.setState((state) => ({ flagShowConnectViaDialog: true }));
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
                        // debugger;
                        // setFlagShowFrame(false);
                        useDialogsStore.setState({ flagShowConnectViaDialog: false });
                    }}
                />
            }
        </div>
    );
};

export { RegistrationOptions };

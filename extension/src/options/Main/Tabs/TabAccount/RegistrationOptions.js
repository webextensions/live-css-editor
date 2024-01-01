/* global chrome */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';
import IconButton from '@mui/material/IconButton/index.js';

import HourglassTopIcon from '@mui/icons-material/HourglassTop.js';
import FlashOnIcon from '@mui/icons-material/FlashOn.js';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser.js';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';
import OpenInNewIcon from '@mui/icons-material/OpenInNew.js';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined.js';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium.js';
import LinkOffIcon from '@mui/icons-material/LinkOff.js';

import AddIcon from '@mui/icons-material/Add.js';
import CheckIcon from '@mui/icons-material/Check.js';
import CircleIcon from '@mui/icons-material/Circle.js';

import Tooltip from '@mui/material/Tooltip/index.js';

import {
    useDialogsStore,
    useAuthStore
} from '../../../optionsZustandStore.js';

import { siteOrigin } from '../../../../appUtils/siteOrigin.js';

// import { alertDialog } from 'helpmate/dist/dom/alertDialog.js';
import { ResponsiveDialog } from '../../../../lib/ResponsiveDialog/ResponsiveDialog.js';

import styles from './RegistrationOptions.css';
import commonStyles from '../../commonStyles.css';

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

const LiEntry = function ({ IconType, iconColor, style, iconStyle, children }) {
    return (
        <li
            className={styles.subscriptionFeatureEntry}
            style={{
                display: 'flex',
                ...style
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {(function () {
                    if (IconType === null) {
                        return <div style={{ width: 16, height: 16 }}></div>;
                    } else {
                        return <IconType style={{ color: iconColor, width: 16, height: 16, ...iconStyle }} />;
                    }
                })()}
            </div>
            <div style={{ marginLeft: 7 }}>
                {children}
            </div>
        </li>
    );
};
LiEntry.propTypes = {
    IconType: PropTypes.any,
    iconColor: PropTypes.string,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    children: PropTypes.node.isRequired
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
                style={{ backgroundColor: 'rgba(0, 255, 0, 0.03)' }}
            >
                <div className={styles.block}>
                    <div className={styles.blockHeader}>
                        {greeting}
                    </div>

                    <div
                        className={commonStyles.gridDesktop2ColumnsMobile1Column}
                        style={{ marginTop: 30, gridGap: 20 }}
                    >
                        <div>
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
                            </div>

                            <div className={styles.blockList}>
                                <div style={{ marginTop: 25, fontWeight: 500 }}>
                                    Activated features:
                                </div>
                                <ul style={{ marginTop: 15 }}>
                                    <LiEntry IconType={CheckIcon}>Local File Editing</LiEntry>
                                    <LiEntry IconType={CheckIcon} style={{ marginTop: 10 }}>Get Icons API Interface</LiEntry>
                                    <LiEntry IconType={CheckIcon} style={{ marginTop: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div>
                                                Learning Resources<span style={{ color: '#bbb', fontSize: 12 }}> -&nbsp;Standard</span>
                                            </div>
                                            <div style={{ marginLeft: 7 }}>
                                                <Tooltip title="Open in new tab" arrow placement="right">
                                                    <IconButton
                                                        size="small"
                                                        target="_blank"
                                                        href={`${siteOrigin}/resources/web-development?category=learning-resources`}
                                                        style={{ padding: 0 }}
                                                    >
                                                        <OpenInNewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </LiEntry>
                                    <LiEntry IconType={CheckIcon} style={{ marginTop: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div>
                                                Web Development Tools<span style={{ color: '#bbb', fontSize: 12 }}> -&nbsp;Standard</span>
                                            </div>
                                            <div style={{ marginLeft: 7 }}>
                                                <Tooltip title="Open in new tab" arrow placement="right">
                                                    <IconButton
                                                        size="small"
                                                        target="_blank"
                                                        href={`${siteOrigin}/resources/web-development`}
                                                        style={{ padding: 0 }}
                                                    >
                                                        <OpenInNewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </LiEntry>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div
                                className={styles.blockList}
                                style={{
                                    border: '1px solid rgba(0, 0, 256, 0.15)',
                                    backgroundColor: 'rgba(0, 0, 256, 0.03)',
                                    height: '100%',
                                    padding: '20px 20px'
                                }}
                            >
                                <div style={{ fontWeight: 500 }}>
                                    Premium features:
                                </div>
                                <ul style={{ marginTop: 15 }}>
                                    <LiEntry IconType={AddIcon}>
                                        Backup / Restore Your Styles
                                    </LiEntry>

                                    <LiEntry IconType={AddIcon} style={{ marginTop: 10 }}>
                                        Learning Resources<span style={{ color: '#bbb', fontSize: 12 }}> -&nbsp;Advanced</span>
                                    </LiEntry>

                                    <LiEntry IconType={AddIcon} style={{ marginTop: 10 }}>
                                        Web Development Tools<span style={{ color: '#bbb', fontSize: 12 }}> -&nbsp;Advanced</span>
                                    </LiEntry>
                                </ul>
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        href={`${siteOrigin}/account?refAppId=magic-css`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="contained"
                                        size="large"
                                        startIcon={<WorkspacePremiumIcon />}
                                        style={{
                                            minWidth: 160
                                        }}
                                    >
                                        Upgrade
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.blockButton}>
                        <div className={commonStyles.gridDesktop2ColumnsMobile1Column} style={{ marginTop: 10, gridGap: 20 }}>
                            <Button
                                href={siteOrigin + '/account?refAppId=magic-css'}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                size="large"
                                startIcon={<VerifiedUserIcon />}
                                style={{
                                    minWidth: 160,
                                    backgroundColor: '#999'
                                }}
                            >
                                Account Details
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                style={{
                                    minWidth: 160,
                                    backgroundColor: '#999'
                                }}
                                startIcon={<LinkOffIcon />}
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

                    <div className={styles.blockMessage} style={{ marginTop: 30 }}>
                        <div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: 'rgba(128,128,0,0.15)',
                                    border: '1px solid rgba(0,64,0,0.20)',
                                    padding: '3px 10px',
                                    borderRadius: 10
                                }}
                            >
                                <div style={{ display: 'inline-block', height: '20px', marginBottom: -3 }}>
                                    <HourglassTopIcon style={{ marginBottom: -2 }} />
                                </div>
                                <div style={{ display: 'inline-block', marginLeft: 8, lineHeight: '20px', marginBottom: -3 }}>
                                    Awaiting sign in
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.blockList}>
                        <div style={{ marginTop: 25, fontWeight: 500 }}>
                            Features available for registered users:
                        </div>
                        <ul style={{ marginTop: 15 }}>
                            <LiEntry IconType={AddIcon} iconStyle={{ color: '#333' }}>Local File Editing</LiEntry>

                            <LiEntry IconType={AddIcon} style={{ marginTop: 10 }} iconStyle={{ color: '#333' }}>Get Icons API Interface</LiEntry>
                            <LiEntry IconType={AddIcon} style={{ marginTop: 10 }} iconStyle={{ color: '#333' }}>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Learning Resources
                                    </div>
                                    <div style={{ marginLeft: 7 }}>
                                        <Tooltip
                                            title="Curated list of web development learning resources"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small" style={{ padding: 0 }}>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </LiEntry>
                            <LiEntry IconType={CircleIcon} style={{ marginTop: 10, marginLeft: 30 }} iconStyle={{ width: 6, height: 6, marginTop: 5, color: '#777' }}>Standard</LiEntry>
                            <LiEntry IconType={CircleIcon} style={{ marginTop: 10, marginLeft: 30 }} iconStyle={{ width: 6, height: 6, marginTop: 5, color: '#777' }}>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Advanced
                                    </div>
                                    <div style={{ marginLeft: 7 }}>
                                        <Tooltip
                                            title="Available with premium subscription"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small" style={{ padding: 0 }}>
                                                <CardMembershipOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </LiEntry>
                            <LiEntry IconType={AddIcon} style={{ marginTop: 10 }} iconStyle={{ color: '#333' }}>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Web Development Tools
                                    </div>
                                    <div style={{ marginLeft: 7 }}>
                                        <Tooltip
                                            title="Curated list of web development tools"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small" style={{ padding: 0 }}>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </LiEntry>
                            <LiEntry IconType={CircleIcon} style={{ marginTop: 10, marginLeft: 30 }} iconStyle={{ width: 6, height: 6, marginTop: 5, color: '#777' }}>Standard</LiEntry>
                            <LiEntry IconType={CircleIcon} style={{ marginTop: 10, marginLeft: 30 }} iconStyle={{ width: 6, height: 6, marginTop: 5, color: '#777' }}>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Advanced
                                    </div>
                                    <div style={{ marginLeft: 7 }}>
                                        <Tooltip
                                            title="Available with premium subscription"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small" style={{ padding: 0 }}>
                                                <CardMembershipOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </LiEntry>
                            <LiEntry IconType={AddIcon} style={{ marginTop: 10 }} iconStyle={{ color: '#333' }}>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        Backup / Restore Your Styles
                                    </div>
                                    <div style={{ marginLeft: 7 }}>
                                        <Tooltip
                                            title="Available with premium subscription"
                                            arrow
                                            placement="right"
                                        >
                                            <IconButton size="small" style={{ padding: 0 }}>
                                                <CardMembershipOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </LiEntry>
                        </ul>
                    </div>
                    <div className={styles.blockButton}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<FlashOnIcon />}
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

/* eslint-disable react/jsx-no-target-blank */

import React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles/index.js';

import { MainTabs } from './MainTabs.js';

// import { FLAG_DEV_MODE } from '../helpers/helpers.js';

import * as styles from './Main.css';

// const optionsPageUrl = (
//     typeof chrome !== 'undefined' &&
//     typeof chrome.runtime !== 'undefined' &&
//     chrome.runtime.getURL('options.html')
// );

const theme = createTheme({
    // https://mui.com/customization/default-theme/
    // https://mui.com/customization/palette/
    // palette: {
    //     primary: {
    //         main: '#1a73e8'
    //     },
    //     secondary: {
    //         main: '#1a73e8'
    //     }
    // },
    components: {
        MuiTooltip: {
            // Set font-size
            styleOverrides: {
                tooltip: {
                    fontSize: '12px'
                }
            }
        } //,
        // MuiButton: {
        //     // Set font-size
        //     styleOverrides: {
        //         root: {
        //             fontSize: '0.875rem'
        //         }
        //     }
        // },
        // MuiTypography: {
        //     // Set font-size
        //     styleOverrides: {
        //         root: {
        //             fontSize: '0.875rem'
        //         }
        //     }
        // }
    }
});

const Main = function () {
    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Main + ' ' + styles.baseBlock}>
                <div className={styles.MainUiWrapper}>
                    <MainTabs />
                </div>

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
        </ThemeProvider>
    );
};

export { Main };

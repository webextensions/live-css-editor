#!/usr/bin/env node
/* eslint-env node */
/* globals chrome, describe, it, before, after */

const path = require('path');

const expect = require('expect');

const puppeteer = require('puppeteer');

const { toMatchImageSnapshot } = require('expect-mocha-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const pathToExtension = path.resolve(__dirname, '..', 'extension');

const _screenshot = async function (handle, options) {
    const image = await handle.screenshot({
        // https://github.com/puppeteer/puppeteer/issues/7043
        // Without "captureBeyondViewport: false", the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
        captureBeyondViewport: false,
        ...options
    });
    return image;
};

const screenshotsDir = path.resolve(__dirname, 'screenshots');
const _matchImageOptions = {
    customSnapshotsDir: screenshotsDir,
    failureThresholdType: 'percent',
};

describe('Cross site UI consistency', async function () {
    let browser;
    let extBackgroundPage;

    const urls = [
        /*
        /* */
        'http://localhost/',
        'https://code.visualstudio.com/',
        'https://css-tricks.com/',
        {
            url: 'https://devdocs.io/css/',
            skipFrom: 'should search for "icon" in command palette'
        },
        'https://developer.mozilla.org/en-US/docs/Web',
        'https://getbootstrap.com/',
        'https://github.com/',
        'https://google.ae/',
        'https://google.com/ncr',
        'https://jquery.com/',
        'https://lesscss.org/',
        'https://materializecss.com/',
        'https://moderncss.dev/',
        'https://reactjs.org/',
        'https://sass-lang.com/',
        'https://twitter.com/webextensions',
        'https://visualstudio.microsoft.com/',
        'https://webextensions.org/',
        'https://www.google.com/chrome/',
        {
            url: 'https://www.instagram.com/',
            skipFrom: 'should load joyride for search icons UI'
        },
        'https://www.linkedin.com/feed/',
        'https://www.mozilla.org/',
        'https://www.phpbb.com/',
        'https://www.sitepoint.com/',
        'https://www.smashingmagazine.com/',
        'https://www.udemy.com/',
        'https://www.youtube.com/'
        /* */
    ];

    before(async () => {
        const puppeteerArgs = [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
            '--show-component-extension-options'
        ];

        browser = await puppeteer.launch({
            headless: false,
            // slowMo: 250,
            // devtools: true,
            defaultViewport: {
                width: 1200,
                height: 600
            },
            args: puppeteerArgs
        });

        // Wait for extension background target
        const extBackgroundTarget = await browser.waitForTarget((t) => {
            return t.type() === 'background_page';
        });
        extBackgroundPage = await extBackgroundTarget.page();
    });

    for (let urlToUse of urls) {
        let markForSkipping = false;
        const getItOrSkip = function (testName, skipFrom) {
            let itOrSkip;
            if (markForSkipping) {
                itOrSkip = it.skip;
            } else if (skipFrom === testName) {
                itOrSkip = it.skip;
                markForSkipping = true;
            } else {
                itOrSkip = it;
            }
            return itOrSkip;
        };

        let url;
        let skipFrom;
        if (typeof urlToUse === 'object') {
            url = urlToUse.url;
            skipFrom = urlToUse.skipFrom;
        } else {
            url = urlToUse;
        }

        const fsNameForUrl = url.replace(/[:/?=%]/g, '-');
        const customDiffDir = path.resolve(screenshotsDir, 'diffs', `__diff_output__${fsNameForUrl}`);

        let page;

        describe(`${url}`, async function () {
            it('should initiate Magic CSS', async function () {
                this.timeout(30 * 1000);

                // https://stackoverflow.com/questions/47744369/puppeteer-opens-an-empty-tab-in-non-headless-mode#comment94423244_47818964
                const pages = await browser.pages({});
                page = pages[0];
                // page = await browser.newPage();

                await page.goto(url);

                await extBackgroundPage.evaluate(function () {
                    chrome.tabs.query({ active: true }, function (tabs) {
                        // Launch extension
                        chrome.browserAction.onClicked.dispatch(tabs[0]);
                    });
                });
            });

            it('should load Magic CSS', async function () {
                await page.waitForSelector('#MagiCSS-bookmarklet .CodeMirror');

                const image = await _screenshot(page, {
                    clip: {
                        x: 25,
                        y: 25,
                        width: 355,
                        height: 273
                    },
                    path: path.resolve(__dirname, 'screenshots', 'all', fsNameForUrl + '.png')
                });

                expect(image).toMatchImageSnapshot(
                    this,
                    {
                        ..._matchImageOptions,
                        customDiffDir,
                        customSnapshotIdentifier: 'magic-css-loaded',
                        failureThreshold: 0.02 // Below 0.02% threshold, there can be some intermittent test failures
                    }
                );
            });

            it('should load command-palette', async function () {
                await page.keyboard.down('Control');
                await page.keyboard.down('Shift');
                await page.keyboard.press('KeyP');
                await page.keyboard.up('Shift');
                await page.keyboard.up('Control');

                await page.waitForSelector('.magicss-command-palette-overlay');

                const elementHandle = await page.$('.magicss-command-palette-overlay .ReactModal__Content > div');

                await page.evaluate(async function () {
                    const timeout = function (ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    };

                    const forceBlur = async function () {
                        const input = document.createElement('input');
                        input.style.position = 'absolute';
                        input.style.opacity = '0';

                        document.body.appendChild(input);
                        input.focus();
                        await timeout(0);
                        document.body.removeChild(input);
                    };

                    await forceBlur();
                });

                await page.waitForTimeout(200); // Delay to let blur happen properly

                const commandPaletteImage = await _screenshot(elementHandle, {
                    path: path.resolve(__dirname, 'screenshots', 'all', 'command-palette-' + fsNameForUrl + '.png')
                });
                expect(commandPaletteImage).toMatchImageSnapshot(
                    this,
                    {
                        ..._matchImageOptions,
                        customDiffDir,
                        customSnapshotIdentifier: 'command-palette',
                        failureThreshold: 0.03 // Below 0.03% threshold, there can be some intermittent test failures
                    }
                );
            });

            getItOrSkip('should search for "icon" in command palette', skipFrom)(
                'should search for "icon" in command palette',
                async function () {
                    await page.focus('.magicss-command-palette-overlay input');
                    await page.keyboard.press('KeyI');
                    await page.keyboard.press('KeyC');
                    await page.keyboard.press('KeyO');
                    await page.keyboard.press('KeyN');

                    const elementHandle = await page.$('.magicss-command-palette-overlay .ReactModal__Content > div');

                    await page.evaluate(async function () {
                        const timeout = function (ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        };

                        const forceBlur = async function () {
                            const input = document.createElement('input');
                            input.style.position = 'absolute';
                            input.style.opacity = '0';

                            document.body.appendChild(input);
                            input.focus();
                            await timeout(0);
                            document.body.removeChild(input);
                        };

                        await forceBlur();
                    });

                    await page.waitForTimeout(200); // Delay to let blur happen properly

                    const commandPaletteSearchIconImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'command-palette-search-icon-' + fsNameForUrl + '.png')
                    });

                    expect(commandPaletteSearchIconImage).toMatchImageSnapshot(
                        this,
                        {
                            ..._matchImageOptions,
                            customDiffDir,
                            customSnapshotIdentifier: 'command-palette-search-icon',
                            failureThreshold: 0.02 // Below 0.02% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            getItOrSkip('should load joyride for search icons UI', skipFrom)(
                'should load joyride for search icons UI',
                async function () {
                    await page.focus('.magicss-command-palette-overlay input');
                    await page.keyboard.press('Enter');

                    const elementHandle = await page.waitForSelector('#react-joyride-step-0 .__floater.__floater__open');
                    await page.waitForTimeout(250); // Let it appear (wait for joyride transition effects to complete)

                    const joyrideInSearchIconImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'joyride-for-search-icons-' + fsNameForUrl + '.png')
                    });

                    expect(joyrideInSearchIconImage).toMatchImageSnapshot(
                        this,
                        {
                            ..._matchImageOptions,
                            customDiffDir,
                            customSnapshotIdentifier: 'joyride-for-search-icons',
                            failureThreshold: 0.02 // Below 0.02% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            getItOrSkip('should load search icons UI', skipFrom)(
                'should load search icons UI',
                async function () {
                    await page.click('.react-joyride__tooltip button[data-action=primary]');

                    const elementHandle = await page.$('.magicss-dialog-search-icons .MuiDialog-paper');
                    const searchIconsUiImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'search-icons-ui-' + fsNameForUrl + '.png')
                    });

                    expect(searchIconsUiImage).toMatchImageSnapshot(
                        this,
                        {
                            ..._matchImageOptions,
                            customDiffDir,
                            customSnapshotIdentifier: 'search-icons-ui',
                            failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            getItOrSkip('should focus main input in search icons UI', skipFrom)(
                'should focus main input in search icons UI',
                async function () {
                    await page.click('.magicss-search-for-icons-input input');

                    await page.waitForTimeout(200); // Wait for completion of material-ui transition effects

                    const elementHandle = await page.$('.magicss-dialog-search-icons .MuiDialog-paper');
                    const searchIconsUiImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'focused-input-search-icons-ui-' + fsNameForUrl + '.png')
                    });

                    expect(searchIconsUiImage).toMatchImageSnapshot(
                        this,
                        {
                            ..._matchImageOptions,
                            customDiffDir,
                            customSnapshotIdentifier: 'focused-input-search-icons-ui',
                            failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            getItOrSkip('should open configure access in search icons UI', skipFrom)(
                'should open configure access in search icons UI',
                async function () {
                    await page.click('.magicss-cog-wheel-icon');

                    const elementHandle = await page.waitForSelector('.magicss-dialog-search-icons-configuration .MuiDialog-paper');

                    await page.waitForTimeout(200); // Wait for completion of material-ui transition effects

                    await page.evaluate(async function () {
                        const timeout = function (ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        };

                        const forceBlur = async function () {
                            const input = document.createElement('input');
                            input.style.position = 'absolute';
                            input.style.opacity = '0';

                            document.body.appendChild(input);
                            input.focus();
                            await timeout(0);
                            document.body.removeChild(input);
                        };

                        await forceBlur();
                    });

                    await page.waitForTimeout(200); // Delay to let blur happen properly

                    const originalOverflow = await page.evaluate(async function () {
                        const originalOverflow = document.documentElement.style.overflow;
                        document.documentElement.style.overflow = 'hidden';
                        return originalOverflow;
                    });

                    const searchIconsConfigurationImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'opened-search-icons-configuration-' + fsNameForUrl + '.png')
                    });

                    try {
                        expect(searchIconsConfigurationImage).toMatchImageSnapshot(
                            this,
                            {
                                ..._matchImageOptions,
                                customDiffDir,
                                customSnapshotIdentifier: 'opened-search-icons-configuration',
                                failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                            }
                        );
                    } catch (e) {
                        expect(searchIconsConfigurationImage).toMatchImageSnapshot(
                            this,
                            {
                                ..._matchImageOptions,
                                customDiffDir,
                                customSnapshotIdentifier: 'opened-search-icons-configuration-2',
                                failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                            }
                        );
                    }

                    await page.evaluate(async function (originalOverflow) {
                        document.documentElement.style.overflow = originalOverflow;
                    }, originalOverflow);
                }
            );

            getItOrSkip('should focus first input field for configure access in search icons UI', skipFrom)(
                'should focus first input field for configure access in search icons UI',
                async function () {
                    await page.focus('.magicss-dialog-search-icons-configuration input');

                    await page.waitForTimeout(250); // Wait for completion of material-ui transition effects

                    const elementHandle = await page.$('.magicss-dialog-search-icons-configuration .MuiDialog-paper');

                    const originalOverflow = await page.evaluate(async function () {
                        const originalOverflow = document.documentElement.style.overflow;
                        document.documentElement.style.overflow = 'hidden';
                        return originalOverflow;
                    });

                    const searchIconsConfigurationImage = await _screenshot(elementHandle, {
                        path: path.resolve(__dirname, 'screenshots', 'all', 'opened-and-focused-search-icons-configuration-' + fsNameForUrl + '.png')
                    });

                    try {
                        expect(searchIconsConfigurationImage).toMatchImageSnapshot(
                            this,
                            {
                                ..._matchImageOptions,
                                customDiffDir,
                                customSnapshotIdentifier: 'opened-and-focused-search-icons-configuration',
                                failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                            }
                        );
                    } catch (e) {
                        expect(searchIconsConfigurationImage).toMatchImageSnapshot(
                            this,
                            {
                                ..._matchImageOptions,
                                customDiffDir,
                                customSnapshotIdentifier: 'opened-and-focused-search-icons-configuration-2',
                                failureThreshold: 0.01 // Below 0.01% threshold, there can be some intermittent test failures
                            }
                        );
                    }

                    await page.evaluate(async function (originalOverflow) {
                        document.documentElement.style.overflow = originalOverflow;
                    }, originalOverflow);
                }
            );
        });
    }

    after(async () => {
        await browser.close();
    });
});

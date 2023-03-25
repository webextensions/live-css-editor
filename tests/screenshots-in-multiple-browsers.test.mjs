#!/usr/bin/env node
/* eslint-env node */
/* globals chrome, describe, it, before, after */

import path from 'path';

import expect from 'expect';

import puppeteer from 'puppeteer';

import { toMatchImageSnapshot } from 'expect-mocha-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const __dirname = path.dirname(import.meta.url).replace('file://', '');
const pathToExtension = path.resolve(__dirname, '..', 'extension-dist');

describe('Cross site UI consistency', async function () {
    this.timeout(2 * 60 * 1000);

    let browser;
    let extBackgroundPage;

    const urls = [
        'http://127.0.0.1/',
        'http://localhost/'
    ];

    const getItOrSkip = function (testName, arrSkip) {
        let itOrSkip;
        if (arrSkip.indexOf(testName) >= 0) {
            itOrSkip = it.skip;
        } else {
            itOrSkip = it;
        }
        return itOrSkip;
    };

    for (let urlToUse of urls) {
        let url;
        let arrSkip;
        if (typeof urlToUse === 'object') {
            url = urlToUse.url;
            arrSkip = urlToUse.skip;
        } else {
            url = urlToUse;
            arrSkip = [];
        }

        let page;

        describe(`${url}`, async function () {
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
                const extBackgroundTarget = await browser.waitForTarget((target) => {
                    return target.type() === 'background_page';
                });
                extBackgroundPage = await extBackgroundTarget.page();
            });

            it('should initiate Magic CSS', async function () {
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

                const image = await page.screenshot({
                    // https://github.com/puppeteer/puppeteer/issues/7043
                    // Without this, the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
                    captureBeyondViewport: false,

                    clip: {
                        x: 25,
                        y: 25,
                        width: 355,
                        height: 273
                    },
                    path: path.resolve(__dirname, 'screenshots', 'all', url.replace(/[:/?=%]/g, '-') + '.png')
                });

                expect(image).toMatchImageSnapshot(
                    this,
                    {
                        customSnapshotsDir: path.resolve(__dirname, 'screenshots'),
                        customSnapshotIdentifier: 'magic-css-loaded',

                        failureThresholdType: 'percent',
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

                const commandPaletteImage = await elementHandle.screenshot({
                    // https://github.com/puppeteer/puppeteer/issues/7043
                    // Without this, the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
                    captureBeyondViewport: false,

                    path: path.resolve(__dirname, 'screenshots', 'all', 'command-palette-' + url.replace(/[:/?=%]/g, '-') + '.png')
                });
                expect(commandPaletteImage).toMatchImageSnapshot(
                    this,
                    {
                        customSnapshotsDir: path.resolve(__dirname, 'screenshots'),
                        customSnapshotIdentifier: 'command-palette',

                        failureThresholdType: 'percent',
                        failureThreshold: 0.03 // Below 0.03% threshold, there can be some intermittent test failures
                    }
                );
            });

            getItOrSkip('should search for icon in command palette', arrSkip)(
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

                    const commandPaletteSearchIconImage = await elementHandle.screenshot({
                        // https://github.com/puppeteer/puppeteer/issues/7043
                        // Without this, the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
                        captureBeyondViewport: false,

                        path: path.resolve(__dirname, 'screenshots', 'all', 'command-palette-search-icon-' + url.replace(/[:/?=%]/g, '-') + '.png')
                    });

                    expect(commandPaletteSearchIconImage).toMatchImageSnapshot(
                        this,
                        {
                            customSnapshotsDir: path.resolve(__dirname, 'screenshots'),
                            customSnapshotIdentifier: 'command-palette-search-icon',

                            failureThresholdType: 'percent',
                            failureThreshold: 0.02 // Below 0.02% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            getItOrSkip('should load joyride for icon search UI', arrSkip)(
                'should load joyride for icon search UI',
                async function () {
                    await page.focus('.magicss-command-palette-overlay input');
                    await page.keyboard.press('Enter');

                    const elementHandle = await page.waitForSelector('#react-joyride-step-0 .__floater.__floater__open');
                    await page.waitForTimeout(200); // Let it appear (wait for joyride transition effects to complete)

                    const joyrideInSearchIconImage = await elementHandle.screenshot({
                        // https://github.com/puppeteer/puppeteer/issues/7043
                        // Without this, the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
                        captureBeyondViewport: false,

                        path: path.resolve(__dirname, 'screenshots', 'all', 'joyride-for-search-icons-' + url.replace(/[:/?=%]/g, '-') + '.png')
                    });

                    expect(joyrideInSearchIconImage).toMatchImageSnapshot(
                        this,
                        {
                            customSnapshotsDir: path.resolve(__dirname, 'screenshots'),
                            customSnapshotIdentifier: 'joyride-for-search-icons',

                            failureThresholdType: 'percent',
                            failureThreshold: 0.02 // Below 0.02% threshold, there can be some intermittent test failures
                        }
                    );
                }
            );

            after(async () => {
                await browser.close();
            });
        });
    }
});

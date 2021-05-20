#!/usr/bin/env node
/* eslint-env node */
/* globals chrome, expect, test, beforeEach, afterEach */

const path = require('path');

const puppeteer = require('puppeteer');

const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

const pathToExtension = path.resolve(__dirname, '..', 'extension');

let browser;

const puppeteerArgs = [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--show-component-extension-options',
];

const urls = [
    'http://localhost/',
    'https://css-tricks.com/',
    'https://devdocs.io/css/',
    'https://getbootstrap.com/',
    'https://github.com/',
    'https://google.com/',
    'https://www.google.com/chrome/',
    'https://www.instagram.com/',
    'https://jquery.com/',
    'https://lesscss.org/',
    'https://www.linkedin.com/feed/',
    'https://materializecss.com/',
    'https://visualstudio.microsoft.com/',
    'https://moderncss.dev/',
    'https://developer.mozilla.org/en-US/docs/Web',
    'https://www.mozilla.org/',
    'https://www.phpbb.com/',
    'https://reactjs.org/',
    'https://sass-lang.com/',
    'https://www.sitepoint.com/',
    'https://www.smashingmagazine.com/',
    'https://twitter.com/webextensions',
    'https://www.udemy.com/',
    'https://code.visualstudio.com/',
    'https://webextensions.org/',
    'https://www.youtube.com/'
];

beforeEach(async () => {
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
});

afterEach(async () => {
    await browser.close();
});

const main = async function () {
    // https://stackoverflow.com/questions/47744369/puppeteer-opens-an-empty-tab-in-non-headless-mode#comment94423244_47818964
    const pages = await browser.pages({});
    const page = pages[0];
    // const page = await browser.newPage();

    // Wait for extension background target
    const extBackgroundTarget = await browser.waitForTarget((t) => {
        return t.type() === 'background_page';
    });
    const extBackgroundPage = await extBackgroundTarget.page();

    for (let url of urls) {
        await page.goto(url);

        await extBackgroundPage.evaluate(function () {
            chrome.tabs.query({ active: true }, function (tabs) {
                // Launch extension
                chrome.browserAction.onClicked.dispatch(tabs[0]);
            });
        });

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

        expect(image).toMatchImageSnapshot({
            customSnapshotsDir: path.resolve(__dirname, 'screenshots'),

            customSnapshotIdentifier: 'magic-css-loaded',

            failureThresholdType: 'percent',
            failureThreshold: 0.02 // Below 0.02% threshold, there were some intermittent test failures
        });

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

        await page.waitForTimeout(200); // Delay to let focus/blur happen properly

        const commandPaletteImage = await elementHandle.screenshot({
            // https://github.com/puppeteer/puppeteer/issues/7043
            // Without this, the screenshots appear to be affected by some unexpected behavior of scroll-for-taking-screenshot
            captureBeyondViewport: false,

            path: path.resolve(__dirname, 'screenshots', 'all', 'command-palette-' + url.replace(/[:/?=%]/g, '-') + '.png')
        });
        expect(commandPaletteImage).toMatchImageSnapshot({
            customSnapshotsDir: path.resolve(__dirname, 'screenshots'),

            customSnapshotIdentifier: 'command-palette',

            failureThresholdType: 'percent',
            failureThreshold: 0.03 // Below 0.03% threshold, there were some intermittent test failures
        });
    }
};

test('Magic CSS loads fine on various websites', async () => {
    await main();
}, 10 * 60 * 1000);

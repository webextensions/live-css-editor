#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const wordWrap = require('word-wrap');

const formatTimestamp = function (t) {
    let str;
    str = new Date(t);
    str = str.toISOString();
    str = str.replace('T', ' ');
    str = str.replace('Z', ' ');
    str = str.substring(0, 19);
    return str;
};

setTimeout(async () => {
    console.log('');
    console.log(chalk.gray.bold(' URL:') + chalk.gray(' https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol'));
    const response = await axios({
        method: 'post',
        url: 'https://chrome.google.com/webstore/reviews/get?pv=20201016',
        data: 'f.req=%5B%22http%3A%2F%2Fchrome.google.com%2Fextensions%2Fpermalink%3Fid%3Difhikkcafabcgolfjegfcgloomalapol%22%2Cnull%2C%5B25%2C0%5D%2C2%2C%5B2%5D%5D'
    });
    let data = response.data;

    data = data.substring(data.indexOf('['));

    let json = JSON.parse(data);
    const reviews = json[1][4];

    for (let i = 0; i < 5 && i < reviews.length; i++) {
        const latestReview = reviews[i];

        const userName = latestReview[2][1];
        const reviewStars = latestReview[3];

        let reviewContents = latestReview[4];
        reviewContents = wordWrap(reviewContents, { indent: '            ', width: 80 });
        reviewContents = reviewContents.trim();

        let reviewAdded = latestReview[6];
        let reviewModified = latestReview[7];

        console.log('');
        console.log(chalk.bold.blue(' Rating') + chalk.gray(' :   ') + '✭ '.repeat(reviewStars));
        console.log(
            chalk.gray(' When   :   ') +
            chalk.gray(
                (
                    (new Date() - reviewAdded) / (24 * 60 * 60 * 1000)
                ).toFixed(2) + ' days ago' +
                (function () {
                    if (reviewModified === reviewAdded) {
                        return '';
                    } else {
                        return ` (Modified: ${formatTimestamp(reviewModified)})`;
                    }
                }())
            )
        );
        console.log(chalk.gray(' By     :   ') + chalk.gray(userName));
        console.log(chalk.gray(' Review :   ') + chalk.gray(reviewContents));
    }
    console.log('');
});

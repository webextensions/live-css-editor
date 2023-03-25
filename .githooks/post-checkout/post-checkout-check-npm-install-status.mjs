#!/usr/bin/env node

// This Git hook finds mismatches between top-level node_modules/ and package.json and informs the user
// One of the commands which you may use to initiate this hook:
//     $ git checkout

var t1 = new Date();

import fs from 'fs';
import path from 'path';
import http from 'https';

import logger from '../logger.mjs';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __dirname = path.dirname(import.meta.url).replace('file://', '');

var returnExitCode = (process.argv[2] === 'returnExitCode');

var semverFilePath = __dirname + '/../semver.js';   // This file needs to be placed outside this folder (post-checkout/),
                                                    // otherwise git-hooks package would attempt to execute it as well

// http://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries/22907134#22907134
function download (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) {
            cb(err.message);
        }
    });
    request.setTimeout(15000, function () {
        // Note: It appears that in some cases of network failure, there is some weird problem with Node JS
        // due to which request.abort() may not work fine (eg: When trying to access a URL and network is
        // enabled in VirtualBox guest machine, but internet is disconnected in host machine).
        // Using process.kill() as a fallback.
        request.abort();
        request.destroy();
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        cb('Timed out');
        process.kill(process.pid, 'SIGKILL');
    });
};

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/171256#171256
function mergeObjects (obj1, obj2) {
    var obj3 = {};
    for (var attr in obj1) {
        obj3[attr] = obj1[attr];
    }
    for (var attr in obj2) {
        obj3[attr] = obj2[attr];
    }
    return obj3;
}

function readFileAsJson (filePath) {
    try {
        var data = fs.readFileSync(filePath, 'utf-8'),
            json = JSON.parse(data);
        return json;
    } catch (e) {
        return null;
    }
}

function exitWithCodeIfRequired(exitCode) {
    if (returnExitCode) {
        process.exit(exitCode);
    } else {
        process.exit(0);
    }
}

var getPathRelativeToCwd = function (strPath) {
    // For calculating the relative path, preferring "process.env.PWD" first since that gives more accurate value on
    // the systems where it is available. Falling back to "process.cwd()" for remaining cases
    // (See: https://github.com/nodejs/node/issues/13668 - process.cwd() does not match the PWD environment variable)
    return path.relative(
        (process.env || {}).PWD || process.cwd(),
        path.resolve(__dirname, strPath)
    );
};

function main (rootPath) {
    var semver = require(semverFilePath);

    var mainPackageJsonPath = path.resolve(rootPath, 'package.json'),
        mainPackageJson = readFileAsJson(mainPackageJsonPath),
        allDependencies = mergeObjects(mainPackageJson.dependencies, mainPackageJson.devDependencies),
        mismatchFound = false,
        invalidFound = false;

    var updateMessages = [];
    Object.keys(allDependencies).forEach(function (packageName, index) {
        var packageJson = readFileAsJson(path.resolve(rootPath, 'node_modules', packageName, 'package.json'));
        var valid = packageJson && semver.valid(packageJson.version);
        if (!valid) {
            invalidFound = true;
        }
        var match = valid && semver.satisfies(packageJson.version, allDependencies[packageName]);
        if (!match) {
            mismatchFound = true;
        }
        if (!valid || !match) {
            updateMessages.push(packageName + ' : ' + ((packageJson && packageJson.version) || 'NA') + ' -> ' + allDependencies[packageName]);
        }
    });

    var t2 = new Date();
    if (!mismatchFound && !invalidFound) {
        // All npm packages are loosely matching. It might be fine to skip running "$ npm install"
        return 0;
    } else {
        logger.warn('\n' + updateMessages.length + '/' + Object.keys(allDependencies).length + ' npm packages need to be updated: (' + ((t2 - t1) / 1000) + ' seconds)');
        logger.info('    ' + updateMessages.join('\n    '));
        logger.warn(
            'You might want to run "$ npm install" for ' +
            getPathRelativeToCwd(mainPackageJsonPath) +
            '\n'
        );
        return 1;
    }
};

function initiateCheck () {
    var rootPath,
        returnCode;

    rootPath = path.resolve(__dirname, '..', '..');
    returnCode = main(rootPath);

    rootPath = path.resolve(rootPath, 'live-css');
    returnCode = main(rootPath) || returnCode;

    exitWithCodeIfRequired(returnCode);
}

try {
    fs.statSync(semverFilePath);
    initiateCheck();
} catch (e) {
    var url = 'https://unpkg.com/semver@6.3.0/semver.js';
    console.log('\nDownloading (timeout: 15s) ' + url + ' (to be used in post-checkout Git hook)');
    download(url, semverFilePath, function (errMsg) {
        if (errMsg) {
            console.log('Error: ' + errMsg);
            console.log('Unable to download semver.js. Skipping detection of top-level mismatches between node_modules/ and package.json.\n');
            exitWithCodeIfRequired(1);
            return;
        }
        initiateCheck();
    });
}

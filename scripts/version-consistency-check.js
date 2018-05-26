#!/usr/bin/env node
/* eslint-env node */

var path = require('path');

var logger = require('note-down');
logger.removeOption('showLogLine');

var extensionPackageJsonPath = '../package.json';
var extensionPackageJson = require(extensionPackageJsonPath);

var getPathRelativeToCwd = function (strPath) {
    return path.relative(process.cwd(), path.resolve(__dirname, strPath));
};

var matchVersions = function (expectedVersion, arrJsonPaths) {
    var mismatchFound = false;
    for (var i = 0; i < arrJsonPaths.length; i++) {
        var jsonPath = arrJsonPaths[i];
        var json = require(jsonPath);
        var relativePath = getPathRelativeToCwd(jsonPath);
        if (json.version !== expectedVersion) {
            logger.warn(' ✗ ' + json.version    + ' : does not match the expected version (' + relativePath + ')');
            mismatchFound = true;
        } else {
            logger.success(' ✓ ' + json.version + ' : matches the expected version (' + relativePath + ')');
        }
    }
    return mismatchFound;
};

logger.info('\nExpected version number (' + extensionPackageJson.version + ') is read from ' + getPathRelativeToCwd(extensionPackageJsonPath) + '\n');

var mismatchFound = matchVersions(
    extensionPackageJson.version,
    [
        '../package-lock.json',
        '../live-css/package.json',
        '../live-css/package-lock.json',
        '../extension/manifest.json',
        '../extension/manifest-chrome.json',
        '../extension/manifest-firefox.json',
        '../extension/manifest-opera.json'
    ]
);

mismatchFound = matchVersions(
    extensionPackageJson.version + '.0',
    [
        '../extension/manifest-edge.json'
    ]
) || mismatchFound;

if (mismatchFound) {
    logger.warn('\n ✗ Version numbers in some of the files do not match');
    logger.warn('\nWe recommend you to fix the mismatch(es).\n');
    process.exit(1);
} else {
    logger.success('\n ✓ All files have matching version numbers\n');
}

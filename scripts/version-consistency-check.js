#!/usr/bin/env node
/* eslint-env node */

var path = require('path');

var { logger } = require('note-down');
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

        var versionsStatus = (function () {
            const statusOb = {
                match: true
            };

            if (json.version !== expectedVersion) {
                statusOb.match = false;
            }

            if(jsonPath.endsWith('package-lock.json')) {
                // Note: The empty property name (['']) is added as per the package-lock.json syntax
                if (json['packages']['']['version'] !== expectedVersion) {
                    statusOb.match = false;
                    statusOb.mismatchReason = 'package-lock.json > "packages" > "" > "version"';
                }
            }

            return statusOb;
        }());

        if (versionsStatus.match) {
            logger.success(' ✓ ' + json.version + ' : matches the expected version (' + relativePath + ')');
        } else {
            if (versionsStatus.mismatchReason) {
                logger.warn(' ✗ ' + json.version    + ' : does not match the expected version (' + relativePath + ') ' + logger.chalk.cyan('(Mismatch: ' + versionsStatus.mismatchReason + ')'));
            } else {
                logger.warn(' ✗ ' + json.version    + ' : does not match the expected version (' + relativePath + ')');
            }
            mismatchFound = true;
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
        '../tests/package.json',
        '../tests/package-lock.json',
        '../extension/manifest.json',
        '../extension/manifest-chrome.json',
        '../extension/manifest-edge.json',
        '../extension/manifest-firefox.json',
        '../extension/manifest-kiwi.json',
        '../extension/manifest-opera.json',
        '../live-css/default.live-css.config.js',
        '../extension/scripts/appVersion.js'
    ]
);

if (mismatchFound) {
    logger.warn('\n ✗ Version numbers in some of the files do not match');
    logger.warn('\nWe recommend you to fix the mismatch(es).\n');
    process.exit(1);
} else {
    logger.success('\n ✓ All files have matching version numbers\n');
}

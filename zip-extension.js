#!/usr/bin/env node
/* eslint-env node */

var fs = require('fs'),
    cpFile = require('cp-file'),
    del = require('del'),
    archiver = require('archiver'),
    chalk = require('chalk');

var processCommand = process.title + ' ' + require('path').relative(__dirname, process.argv[1]);
console.log(chalk.gray([
    '',
    'Format:   ' + processCommand + ' [chrome/edge/firefox]',
    'Examples: ' + processCommand,
    '          ' + processCommand + ' chrome',
    '          ' + processCommand + ' edge',
    ''
].join('\n')));

var whichBrowser = process.argv[2] || 'chrome';

var zipFileName = null;
if (whichBrowser === 'edge') {
    zipFileName = 'extension-edge.zip';
} else if (whichBrowser === 'chrome' || whichBrowser === 'firefox') {
    zipFileName = 'extension-chrome-firefox.zip';
} else {
    console.log(chalk.red('Error: Please pass a supported browser name as parameter (or no parameters)'));
    process.exit(1);
}

if (fs.readFileSync(__dirname + '/extension/manifest.json', 'utf8') !== fs.readFileSync(__dirname + '/extension/manifest-chrome-firefox.json', 'utf8')) {
    console.log(chalk.yellow('Warning: extension/manifest.json & extension/manifest-chrome-firefox.json do not match.\nThey must have same contents before zipping the extension with this script. Exiting.'));
    process.exit(1);
}

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/' + zipFileName);
var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

var warnUserToCheckManifestFile = function (e) {
    console.log(chalk.yellow('\nWarning: Due to this error, the file extension/manifest.json might have been modified/deleted. Please check manually.\n'));
    throw e;
};

// listen for all archive data to be written
output.on('close', function() {
    try {
        del.sync(['extension/manifest.json']);
        cpFile.sync('extension/manifest-chrome-firefox.json', 'extension/manifest.json', {overwrite: false});

        console.log(chalk.green('The extension has been zipped as: ' + zipFileName + ' (' + archive.pointer() + ' bytes)'));
    } catch (e) {
        warnUserToCheckManifestFile(e);
    }
});

// good practice to catch error explicitly
archive.on('error', function(e) {
    console.log(chalk.red('Error: An unexpected error occurred in zipping the extension.'));
    warnUserToCheckManifestFile(e);
});

// pipe archive data to the file
archive.pipe(output);

try {
    del.sync(['extension/manifest.json']);
    cpFile.sync('extension/' + (whichBrowser === 'edge' ? 'manifest-edge.json' : 'manifest-chrome-firefox.json'), 'extension/manifest.json', {overwrite: false});

    archive.glob('**/*', {
        cwd: __dirname + '/extension',
        ignore: (function () {
            var filesToIgnore = [
                'manifest-edge.json',
                'manifest-chrome-firefox.json',
                'ui-images/**/*.*',     // Exclude files in "ui-images" folder
                'ui-images',            // Avoid "ui-images" folder from getting created
            ];
            if (whichBrowser !== 'edge') {
                filesToIgnore.push('backgroundScriptsAPIBridge.js');
                filesToIgnore.push('contentScriptsAPIBridge.js');
            }
            return filesToIgnore;
        }())
    }, {});

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
} catch (e) {
    warnUserToCheckManifestFile(e);
}

#!/usr/bin/env node

/* eslint-env node */

var nodeVersion = process.versions.node,
    semverArrNodeVersion = nodeVersion.split('.');
if (parseInt(semverArrNodeVersion[0], 10) < 4) {
    console.log(
        '\nError: You are currently using Node JS ' + process.version + ' which is outdated.' +
        '\nFor best experience with live-css, we recommend you to upgrade to the latest Node JS version.\n'
    );
    process.exit(1);
} else if (parseInt(semverArrNodeVersion[0], 10) < 6) {
    console.log(
        '\nYou are currently using Node JS ' + process.version +
        '\nWe recommend you to upgrade to the latest Node JS version for improved experience.'
    );
}

var updateNotifier = require('update-notifier'),
    pkg = require('./package.json'),
    notifier = updateNotifier({
        // updateCheckInterval: 0,     // Useful when testing
        pkg: pkg
    });

if (notifier.update) {
    // Notify about update immediately when the script executes
    notifier.notify({
        defer: false,
        shouldNotifyInNpmScript: true
    });

    // Notify about update when the script ends after running for at least 15 seconds
    setTimeout(function () {
        notifier.notify({
            shouldNotifyInNpmScript: true
        });
    }, 15000);
}

var nPath = require('path'),
    fs = require('fs');

var chokidar = require('chokidar'),
    anymatch = require('anymatch'),
    boxen = require('boxen'),
    _uniq = require('lodash/uniq.js');

var findFreePort;
try {
    // Before Node JS v6.0.0, find-free-port won't work due to the unsupported JavaScript syntax
    findFreePort = require('find-free-port');
} catch (e) {
    // do nothing
}

var logger = require('note-down');
logger.removeOption('showLogLine');

var Emitter = require('tiny-emitter'),
    emitter = new Emitter();

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var defaultConfig = require('./default.live-css.config.js'),
    defaultPort = defaultConfig.port;

var logAndThrowError = function (msg) {
    logger.errorHeading(msg);
    throw new Error(msg);
};

// If being executed as a binary and not via require()
if (!module.parent) {
    var argv = require('yargs')
        .help(false)
        .version(false)
        .argv;

    var localIpAddressesAndHostnames = [];
    try {
        localIpAddressesAndHostnames = require('local-ip-addresses-and-hostnames').getLocalIpAddressesAndHostnames();
    } catch (e) {
        // do nothing
    }

    var showHelp = function () {
        logger.verbose([
            '',
            'Format:   live-css [--root <http-server-root-folder>] [--help]',
            'Examples: live-css',
            '          live-css --help',
            '          live-css --root project/http-pub',
            '          live-css --init',
            'Options:  -h --help                        Show help',
            '          -r --root=<http-server-root-folder>  Folder mapping to root (/) of your HTTP server',
            '          -p --port=<port-number>          Port number to run live-css server',
            '             --init                        Generate the configuration file',
            '             --list-files                  List the files being monitored',
            '             --allow-symlinks              Allow symbolic links',
            '          -v --version                     Output the version number',
            '             --debug                       Extra logging to help in debugging live-css',
            ''
        ].join('\n'));
    };

    var paramHelp = argv.h || argv.help,
        paramInit = argv.init,
        paramVersion = argv.v || argv.version,
        paramDebug = argv.debug;

    if (paramHelp) {
        showHelp();
        process.exit(0);
    }
    if (paramVersion || paramDebug) {
        logger.log('live-css version: ' + require('./package.json').version);
        logger.log('Node JS version: ' + nodeVersion);
        if (paramVersion) {
            process.exit(0);
        }
    }
    if (paramInit) {
        var defaultConfigFilePath = nPath.resolve(__dirname, 'default.live-css.config.js'),
            defaultConfigurationText;
        try {
            defaultConfigurationText = fs.readFileSync(defaultConfigFilePath, 'utf8');
        } catch (e) {
            logger.fatal('Error:\nUnable to read default configuration file from ' + defaultConfigFilePath);
            process.exit(1);
        }

        var targetConfigFilePath = nPath.resolve(process.cwd(), '.live-css.config.js');
        try {
            fs.writeFileSync(targetConfigFilePath, defaultConfigurationText);
            logger.success('\nConfiguration file of live-css server has been written at:\n    ' + targetConfigFilePath);
            logger.info('\nNow, when you execute the ' + logger.chalk.underline('live-css') + ' command from this directory, it would load the required options from this configuration file.\n');
            process.exit(0);
        } catch (e) {
            logger.error(' ✗ Error: Unable to write configuration file to: ' + targetConfigFilePath);
            process.exit(1);
        }
    }

    logger.verbose([
        '',
        'live-css server version: ' + require('./package.json').version,
        'Run ' + logger.chalk.underline('live-css --help') + ' to see the available options and examples.'
    ].join('\n'));

    var configFilePath = nPath.resolve(process.cwd(), '.live-css.config.js'),
        configFileExists = fs.existsSync(configFilePath),
        flagConfigurationLoaded = false,
        configuration = {};

    if (configFileExists) {
        try {
            configuration = require(configFilePath);
            flagConfigurationLoaded = true;
            logger.verbose('Loaded configuration from ' + configFilePath);
            if (paramDebug) {
                logger.verbose('\nConfiguration from file:');
                logger.log(configuration);
            }
        } catch (e) {
            logger.log('');
            logger.verbose(e);
            logger.warnHeading('\nUnable to read configuration from ' + configFilePath);
            logger.warn('The configuration file contents needs to follow JavaScript syntax.\neg: https://github.com/webextensions/live-css-editor/tree/master/live-css/default.live-css.config.js');
        }
    } else {
        logger.verbose([
            'Run ' + logger.chalk.underline('live-css --init') + ' to generate the configuration file (recommended).'
        ].join('\n'));
    }

    var connectedSessions = 0;

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    var paramPort = parseInt(argv.port || argv.p || configuration.port, 10) || null,    // Not initiating paramPort from defaultConfig['port'] because we want to follow a special flow when the user doesn't set its value
        paramRoot = argv.root || configuration['root'] || null,                 // Not initiating paramPort from defaultConfig['root'] because it is not set by default
        paramWatchPatterns = configuration['watch-patterns'] || defaultConfig['watch-patterns'],
        paramWatchIgnorePatterns = configuration['watch-ignore-patterns'] || defaultConfig['watch-ignore-patterns'],
        paramAllowSymlinks = argv.allowSymlinks || configuration['allow-symlinks'] || defaultConfig['allow-symlinks'],
        paramListFiles = argv.listFiles || configuration['list-files'] || defaultConfig['list-files'];

    if (paramDebug) {
        logger.verbose('\nApplied configuration:');
        logger.log({
            'port': paramPort,
            'root': paramRoot,
            'watch-patterns': paramWatchPatterns,
            'watch-ignore-patterns': paramWatchIgnorePatterns,
            'allow-symlinks': paramAllowSymlinks,
            'list-files': paramListFiles
        });
    }

    var watcherCwd = (function () {
        if (paramRoot) {
            if (typeof paramRoot === 'string') {
                var resolvedPath = nPath.resolve(paramRoot),
                    stat,
                    lstat;
                try {
                    stat = fs.statSync(resolvedPath);
                    if (!stat.isDirectory()) {
                        logger.error('Error: The "--root" parameter or "root" configuration (' + resolvedPath + ') needs to be a directory');
                        process.exit(1);
                    }

                    lstat = fs.lstatSync(resolvedPath);
                    if (lstat.isSymbolicLink() && !paramAllowSymlinks) {
                        logger.warn(
                            boxen(
                                'For better experience, try starting live-css' +
                                '\nwith ' + logger.chalk.bold('--allow-symlinks') + ' parameter.',
                                {
                                    padding: 1,
                                    margin: 1,
                                    borderStyle: 'double'
                                }
                            )
                        );
                    }
                } catch (e) {
                    logger.error('Error: Unable to access ' + resolvedPath);
                    process.exit(1);
                }
                return resolvedPath;
            } else {
                logger.error('Error: If you set --root parameter, it should be followed by an absolute or relative path of a directory');
                process.exit(1);
            }
        } else {
            return process.cwd();
        }
    }());

    // Note:
    //     https://github.com/paulmillr/chokidar/issues/544
    //     Executable symlinks are getting watched unnecessarily due to this bug in chokidar
    var watcher = chokidar.watch(
        paramWatchPatterns,
        {
            cwd: watcherCwd,

            // https://github.com/paulmillr/chokidar#performance
            // Sometimes the file is in the process of writing.
            // It should have a stable filesize before we notify about the change.
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 45
            },

            ignored: paramWatchIgnorePatterns,

            followSymlinks: paramAllowSymlinks
        }
    );

    var versionNamespace = io.of('/api/v' + parseInt(pkg.version, 10));
    var flagFileWatchReady = false;
    var filesBeingWatched = [];
    var fileModifiedHandler = function (changeObj) {
        versionNamespace.emit('file-modified', changeObj);
    };
    var fileAddedHandler = function (changeObj) {
        filesBeingWatched.push(changeObj);
        versionNamespace.emit('file-added', changeObj);
    };
    var fileDeletedHandler = function (changeObj) {
        filesBeingWatched = filesBeingWatched.filter(function (item) {
            return item.relativePath !== changeObj.relativePath;
        });

        versionNamespace.emit('file-deleted', changeObj);
    };

    emitter.on('file-modified', fileModifiedHandler);
    emitter.on('file-added', fileAddedHandler);
    emitter.on('file-deleted', fileDeletedHandler);

    var anyFileNameIsRepeated = function (arrPaths) {
        var arrWithFileNames = arrPaths.map(function (item) {
            return item.fileName;
        });
        var uniqArrWithRelativePaths = _uniq(arrWithFileNames);
        if (uniqArrWithRelativePaths.length === arrWithFileNames.length) {
            return false;
        } else {
            return true;
        }
    };

    emitter.on('file-watch-ready', function () {
        flagFileWatchReady = true;
        if (!paramListFiles) {
            logger.log('');
        }
        logger.success(
            '\nLive CSS Editor (Magic CSS) server is ready.' +
            '\nWatching ' + filesBeingWatched.length + ' files from:' +
            '\n    ' + watcherCwd +
            '\n'
        );
        if (!paramRoot && anyFileNameIsRepeated(filesBeingWatched)) {
            logger.warn(
                boxen(
                    'Some of the files being watched have the same name.' +
                    '\nlive-css would still work fine.' +
                    '\n\nFor better experience, you may start live-css with' +
                    '\nan appropriate ' + logger.chalk.bold('--root') + ' parameter.',
                    {
                        padding: 1,
                        margin: 1,
                        borderStyle: 'double'
                    }
                )
            );
        }
    });

    watcher.on('ready', function () {
        emitter.emit('file-watch-ready');
        // var watchedPaths = watcher.getWatched();
        // log('**********Watched paths**********');
        // log(watchedPaths);
    });


    var printSessionCount = function (connectedSessions) {
        logger.info('Number of active connections: ' + connectedSessions);
    };

    emitter.on('connected-socket', function () {
        connectedSessions++;
        logger.info('\nConnected to a socket.');
        printSessionCount(connectedSessions);
    });

    emitter.on('disconnected-socket', function () {
        connectedSessions--;
        logger.info('\nDisconnected from a socket.');
        printSessionCount(connectedSessions);
    });

    var getPathValues = function (path) {
        var ob = {
            relativePath: path,
            fullPath: nPath.join(watcherCwd, path),
            fileName: nPath.basename(path),
            useOnlyFileNamesForMatch: (function () {

            }()),
            root: watcherCwd
        };
        if (paramRoot) {
            ob.root = watcherCwd;
            ob.useOnlyFileNamesForMatch = false;
        } else {
            ob.root = null;
            ob.useOnlyFileNamesForMatch = true;
        }
        return ob;
    };

    // https://github.com/paulmillr/chokidar/issues/544
    var avoidSymbolicLinkDueToChokidarBug = function (path, cb) {
        var fullPath = nPath.resolve(watcherCwd, path);
        if (paramAllowSymlinks) {
            if (anymatch(paramWatchPatterns, path)) {
                cb(fullPath);
            }
        } else {
            try {
                var lstat = fs.lstatSync(fullPath);
                if (!lstat.isSymbolicLink()) {
                    cb(fullPath, lstat);
                }
            } catch (e) {
                // do nothing
            }
        }
    };

    watcher
        .on('add', function (path) {
            avoidSymbolicLinkDueToChokidarBug(path, function () {
                if (paramListFiles || flagFileWatchReady || paramDebug) {
                    logger.verbose('Watching file: ' + path);
                } else {
                    process.stdout.write(logger.chalk.dim('.'));
                }
                emitter.emit('file-added', getPathValues(path));
            });
        })
        .on('change', function (path) {
            avoidSymbolicLinkDueToChokidarBug(path, function (fullPath, lstat) {
                var stat;
                if (!lstat) {
                    try {
                        stat = fs.statSync(fullPath);
                    } catch (e) {
                        // do nothing
                    }
                }

                var timeModified = (lstat || stat || {}).mtime;

                // mtime / timeModified / toTimeString should be available, but adding extra check to make the code more robust
                if (timeModified && timeModified.toTimeString) {
                    timeModified = timeModified.toTimeString().substring(0, 8);
                }
                if (timeModified) {
                    logger.verbose('(' + timeModified + ') File modified: ' + path);
                } else {
                    logger.verbose('File modified: ' + path);
                }
                emitter.emit('file-modified', getPathValues(path));
            });
        })
        .on('unlink', function (path) {
            logger.verbose('File removed: ' + path);
            emitter.emit('file-deleted', getPathValues(path));
        });

    versionNamespace.on('connection', function (socket) {
        emitter.emit('connected-socket');

        socket.on('disconnect', function () {
            emitter.emit('disconnected-socket');
        });
    });

    var startServer = function (portNumber) {
        /* Begin: Temporarily hang application */
        /*
        console.log('TODO: Remove this section "Temporarily hang application" when debugging is done');
        var t1 = new Date();
        setTimeout(function () {
            console.log('Entering sleep');
            while (true) {
                // do nothing
                var t2 = new Date();
                if (t2 - t1 >= 30000) {
                    break;
                }
            }
            console.log('Exiting sleep');
        }, 5000);
        /* End: Temporarily hang application */

        http.listen(portNumber, function () {
            if (localIpAddressesAndHostnames.length) {
                logger.info(
                    '\nLive CSS Editor (Magic CSS) server is available at any of the following addresses:\n' +
                    (function (localIpAddressesAndHostnames) {
                        var addresses = [].concat(localIpAddressesAndHostnames);
                        addresses = addresses.map(function (item) {
                            return '    http://' + item + ':' + portNumber + '/';
                        });
                        return addresses.join('\n');
                    }(localIpAddressesAndHostnames)) +
                    '\n'
                );
            }

            logger.info('Press CTRL-C to stop the server\n');

            if (paramListFiles || flagFileWatchReady || paramDebug) {
                // do nothing
            } else {
                if (!flagConfigurationLoaded) {
                    logger.verbose('To list the files being watched, run ' + logger.chalk.underline('live-css') + ' with ' + logger.chalk.underline('--list-files') + ' parameter.');
                }
                process.stdout.write(logger.chalk.dim('Adding files to watch '));
            }
        });
    };

    var portRequestedByUser = paramPort,
        flagPortSetByUser = false,
        portToUse = defaultPort;
    if (
        portRequestedByUser &&
        typeof portRequestedByUser === 'number' &&
        !isNaN(portRequestedByUser) &&
        portRequestedByUser >= 1 &&
        portRequestedByUser <= 65535
    ) {
        portToUse = portRequestedByUser;
        flagPortSetByUser = true;
    }

    if (findFreePort) {
        findFreePort(portToUse, function (err, freePort) {
            if (flagPortSetByUser && freePort !== portToUse) {
                logger.warnHeading('\nPort number ' + portToUse + ' is not available. Using port number ' + freePort + '.');
            }
            startServer(freePort);
        });
    } else {
        startServer(portToUse);
    }
} else {
    logAndThrowError('Error: live-css currently does not work with Node JS require()');
}

process.on('uncaughtException', function (err) {
    if (err.code === 'EADDRINUSE') {
        logger.errorHeading('\nError: The requested port number is in use. Please pass a different port number to use.');
    } else if (err.code === 'ENOSPC') {
        logger.errorHeading(
            '\n\nError: ENOSPC'
        );
        logger.error('Exiting live-css server.');
        logger.info(
            '\nMost probably, this issue can be easily fixed. Use one of the following methods and try running live-css again:' +
            '\n    Method 1. For Linux, try following instructions mentioned at https://stackoverflow.com/questions/22475849/node-js-error-enospc/32600959#32600959' +
            '\n    Method 2. You are probably watching too many files, to fix that:' +
            '\n              - try changing "root" directory for live-css' +
            '\n              - try changing "watch-patterns" if you are using live-css configuration file' +
            '\n              - try changing "watch-ignore-patterns" if you are using live-css configuration file' +
            '\n    Method 3. You are probably running out of disk space. Delete some of the unnecessary files and try again' +
            '\n'
        );
    } else {
        console.log(err);
    }
    process.exit(1);
});

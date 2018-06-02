#!/usr/bin/env node

/* eslint-env node */

'use strict';   // Would be useful for supporting Node JS v4 if using "let", "class", etc.
                // 'use strict'; can be removed when dropping support for Node JS v4

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

var path = require('path'),
    fs = require('fs');

var chokidar = require('chokidar-webextensions'),
    anymatch = require('anymatch'),
    boxen = require('boxen'),
    unusedFilename = require('unused-filename'),
    _uniq = require('lodash/uniq.js');

var nocache = require('nocache');

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

var defaultConfig = require('./default.live-css.config.js'),
    defaultPort = defaultConfig.port;

var exitWithError = function (msg) {
    logger.error(msg);
    process.exit(1);
};

/*
var logAndThrowError = function (msg) {
    logger.errorHeading(msg);
    throw new Error(msg);
};
/* */

/*
// Temporarily hang application thread for testing purposes
(function () {
    console.log('TODO: Remove/comment this section ("Temporarily hang application thread") when debugging is done');
    var t1 = new Date();
    setTimeout(function () {
        console.log('Entering sleep');
        while (true) {
            var t2 = new Date();
            if (t2 - t1 >= 15000) {
                break;
            }
        }
        console.log('Exiting sleep');
    }, 5000);
}());
/* */

// TODO: This function can be simplified
var getLocalISOTime = function () {
    // http://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset/28149561#28149561
    var tzoffset = (new Date()).getTimezoneOffset() * 60000, //offset in milliseconds
        localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    localISOTime = localISOTime.replace('T', ' ');
    localISOTime = localISOTime.substring(11, 19);
    return localISOTime;
};

var getLiveCssParams = function (configFilePath, argv) {
    var flagConfigFilePathProvidedByUser = !!configFilePath;
    configFilePath = configFilePath || '.live-css.config.js';
    argv = argv || [];

    var paramDebug = argv.debug;

    configFilePath = path.resolve(
        configFilePath ?
            path.dirname(configFilePath) :
            process.cwd(),
        configFilePath
    );

    var configFileExists = fs.existsSync(configFilePath),
        flagConfigurationLoaded = false,
        configuration = {};

    if (configFileExists) {
        try {
            configuration = require(configFilePath);
            flagConfigurationLoaded = true;
            paramDebug = paramDebug || configuration.debug;
            logger.verbose('Loaded live-css configuration from ' + configFilePath);
            if (paramDebug) {
                logger.verbose('\nConfiguration from file:');
                logger.log(configuration);
            }
        } catch (e) {
            logger.log('');
            logger.verbose(e);
            logger.warnHeading('\nUnable to read live-css configuration from ' + configFilePath);
            logger.warn('The configuration file contents needs to follow JavaScript syntax.\neg: https://github.com/webextensions/live-css-editor/tree/master/live-css/default.live-css.config.js');
        }
    } else {
        if (flagConfigFilePathProvidedByUser) {
            logger.warnHeading('\nUnable to read live-css configuration from ' + configFilePath);
            logger.warn('Using default configuration for live-css server.');
        } else {
            logger.verbose([
                'Run ' + logger.chalk.underline('live-css --init') + ' to generate the configuration file (recommended).'
            ].join('\n'));
        }
    }

    var paramPort = parseInt(argv.port || argv.p || configuration.port, 10) || null;    // Not initiating paramPort from defaultConfig['port'] because we want to follow a special flow when the user doesn't set its value
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

    var paramRoot = argv.root || configuration['root'] || null;                         // Not initiating paramRoot from defaultConfig['root'] because it is not set by default
    if (paramRoot) {
        paramRoot = path.resolve(
            configFilePath ?
                path.dirname(configFilePath) :
                process.cwd(),
            paramRoot
        );
    }

    var paramWatchPatterns = configuration['watch-patterns'] || defaultConfig['watch-patterns'],
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
            'list-files': paramListFiles,
            'debug': paramDebug
        });
        logger.log('');
    }

    return {
        configFilePath: configFilePath,
        flagConfigurationLoaded: flagConfigurationLoaded,
        configuration: configuration,
        paramAllowSymlinks: paramAllowSymlinks,
        paramWatchPatterns: paramWatchPatterns,
        paramWatchIgnorePatterns: paramWatchIgnorePatterns,
        paramListFiles: paramListFiles,

        paramPort: paramPort,
        flagPortSetByUser: flagPortSetByUser,
        portToUse: portToUse,

        paramRoot: paramRoot,
        paramDebug: paramDebug
    };
};

var startTheServer = function (options) {
    var processedParams = options.processedParams;
    var httpServer = options.httpServer;

    if (httpServer) {
        handleLiveCss({
            httpServer: httpServer,
            processedParams: processedParams
        });
    } else {
        var beginServerListening = function (portNumber) {
            var express = require('express'),
                expressApp = express();
            var httpServer = expressApp.listen(portNumber, function () {
                var localIpAddressesAndHostnames = [];
                try {
                    localIpAddressesAndHostnames = require('local-ip-addresses-and-hostnames').getLocalIpAddressesAndHostnames();
                } catch (e) {
                    // do nothing
                }
                if (localIpAddressesAndHostnames.length) {
                    logger.info(
                        '\nlive-css server is available at any of the following addresses:\n' +
                        (function (localIpAddressesAndHostnames) {
                            var addresses = [].concat(localIpAddressesAndHostnames);
                            addresses = addresses.map(function (item) {
                                return '    http://' + item + ':' + portNumber + '/';
                            });
                            return addresses.join('\n');
                        }(localIpAddressesAndHostnames)) +
                        '\n'
                    );
                } else {
                    logger.info('\nlive-css server is running at port ' + portNumber);
                }

                if (!module.parent) {
                    logger.info('Use it along with the browser extension "Live editor for CSS, Less & Sass - Magic CSS":');
                    logger.info('    https://github.com/webextensions/live-css-editor');

                    logger.info('\nPress CTRL+C to stop the server\n');
                }

                handleLiveCss({
                    httpServer: httpServer,
                    expressApp: expressApp,
                    runningOnSeparatePort: true,
                    processedParams: processedParams
                });
            });
        };

        var flagPortSetByUser = processedParams.flagPortSetByUser,
            portToUse = processedParams.portToUse;

        if (findFreePort) {
            findFreePort(portToUse, function (err, freePort) {
                if (flagPortSetByUser && freePort !== portToUse) {
                    logger.warnHeading('\nPort number ' + portToUse + ' is not available. Using port number ' + freePort + '.');
                }
                beginServerListening(freePort);
            });
        } else {
            beginServerListening(portToUse);
        }

        if (!module.parent) {
            process.on('uncaughtException', function (err) {
                if (err.code === 'EADDRINUSE') {
                    logger.errorHeading('\nError: The requested port number (' + portToUse + ') is in use. Please pass a different port number to use.');
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
                    logger.log('');
                    logger.log(err);
                    logger.error('\n^^^^ Error ^^^^');
                    logger.warn(
                        'Sorry! live-css server encountered an unexpected error!' +
                        '\nKindly report this issue at:' +
                        '\n    https://github.com/webextensions/live-css-editor/issues'
                    );
                    logger.log('');
                }
                process.exit(1);
            });
        }
    }
};

var handleLiveCss = function (options) {
    options = options || {};

    // https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen/17697134#17697134
    var httpServer = options.httpServer,
        io = require('socket.io')(httpServer);

    var expressApp = options.expressApp,
        runningOnSeparatePort = options.runningOnSeparatePort;

    var processedParams = options.processedParams,
        configFilePath = processedParams.configFilePath,
        paramAllowSymlinks = processedParams.paramAllowSymlinks,
        paramWatchPatterns = processedParams.paramWatchPatterns,
        paramWatchIgnorePatterns = processedParams.paramWatchIgnorePatterns,
        paramListFiles = processedParams.paramListFiles,
        paramRoot = processedParams.paramRoot,
        paramDebug = processedParams.paramDebug,
        flagConfigurationLoaded = processedParams.flagConfigurationLoaded;

    var connectedSessions = 0;

    if (expressApp) {
        expressApp.use(nocache());

        expressApp.get('/live-css', function (req, res) {
            res.sendFile(__dirname + '/live-css.html');
        });
        if (runningOnSeparatePort) {
            expressApp.get('/', function (req, res) {
                var redirectToUrl = path.resolve(req.originalUrl, 'live-css');
                res.redirect(307, redirectToUrl);
            });
        }
    }

    var watcherCwd = (function () {
        if (paramRoot) {
            if (typeof paramRoot === 'string') {
                var resolvedPath = path.resolve(paramRoot),
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
                                'For improved experience, try starting live-css' +
                                '\nwith ' + logger.chalk.bold('--allow-symlinks') + ' parameter or' +
                                '\n' + logger.chalk.bold('"allow-symlinks"') + ' configuration.',
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
                logger.error('Error: If you set --root parameter or "root" configuration, it should be followed by an absolute or relative path of a directory');
                process.exit(1);
            }
        } else if (configFilePath) {
            return path.dirname(configFilePath);
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
        if (!paramRoot && anyFileNameIsRepeated(filesBeingWatched)) {
            logger.warn(
                boxen(
                    'Some of the files being watched have the same name.' +
                    '\nYou may see some extra notifications in such cases.' +
                    '\n' +
                    '\nFor improved experience, kindly start live-css with' +
                    '\nan appropriate ' + logger.chalk.bold('--root') + ' parameter or ' + logger.chalk.bold('"root"') +
                    '\nconfiguration.',
                    {
                        padding: 1,
                        margin: 1,
                        borderStyle: 'double'
                    }
                )
            );
        } else {
            logger.log('');
        }
        logger.success(
            'live-css server is ready.' +
            '\nWatching ' + filesBeingWatched.length + ' files under:' +
            '\n    ' + watcherCwd +
            '\n'
        );
    });

    watcher.on('ready', function () {
        emitter.emit('file-watch-ready');
    });

    var printSessionCount = function (connectedSessions) {
        logger.info(logger.chalk.gray(getLocalISOTime()) + ' Number of active socket connections: ' + connectedSessions);
    };

    emitter.on('connected-socket', function () {
        connectedSessions++;
        logger.info(logger.chalk.gray(getLocalISOTime()) + ' Connected to a socket.');
        printSessionCount(connectedSessions);
    });

    emitter.on('disconnected-socket', function () {
        connectedSessions--;
        logger.info(logger.chalk.gray(getLocalISOTime()) + ' Disconnected from a socket.');
        printSessionCount(connectedSessions);
    });

    var getPathValues = function (strPath) {
        return {
            relativePath: strPath,
            fullPath: path.join(watcherCwd, strPath),
            fileName: path.basename(strPath),
            useOnlyFileNamesForMatch: paramRoot ? false : true,
            root: paramRoot ? watcherCwd : null
        };
    };

    // https://github.com/paulmillr/chokidar/issues/544
    var avoidSymbolicLinkDueToChokidarBug = function (strPath, cb) {
        var fullPath = path.resolve(watcherCwd, strPath);
        if (paramAllowSymlinks) {
            if (anymatch(paramWatchPatterns, strPath)) {
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
        .on('add', function (strPath) {
            avoidSymbolicLinkDueToChokidarBug(strPath, function () {
                if (flagFileWatchReady || paramDebug) {
                    logger.log(logger.chalk.gray(getLocalISOTime()) + logger.chalk.dim(' Watching file: ' + strPath));
                } else if (paramListFiles) {
                    logger.verbose('Watching file: ' + strPath);
                } else {
                    process.stdout.write(logger.chalk.dim('.'));
                }
                emitter.emit('file-added', getPathValues(strPath));
            });
        })
        .on('change', function (strPath) {
            avoidSymbolicLinkDueToChokidarBug(strPath, function (fullPath, lstat) {
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
                    logger.log(logger.chalk.gray(timeModified) + logger.chalk.dim(' File modified: ' + strPath));
                } else {
                    logger.log(logger.chalk.gray(getLocalISOTime()) + logger.chalk.dim(' File modified: ' + strPath));
                }
                emitter.emit('file-modified', getPathValues(strPath));
            });
        })
        .on('unlink', function (strPath) {
            logger.log(logger.chalk.gray(getLocalISOTime()) + logger.chalk.dim(' File removed: ' + strPath));
            emitter.emit('file-deleted', getPathValues(strPath));
        });

    versionNamespace.on('connection', function (socket) {
        emitter.emit('connected-socket');

        socket.on('disconnect', function () {
            emitter.emit('disconnected-socket');
        });
    });

    // In some of the cases, the following setTimeout helps in keeping the message (like: "Adding files to watch ")
    // closer to the dot characters (".") which indicate that a file has been added to the watch list.
    // Without this setTimeout, if we load the package using require(), then some of the log entries from
    // the parent project may come in between those messages.
    setTimeout(function () {
        if (paramListFiles || flagFileWatchReady) {
            // do nothing
        } else if (paramDebug) {
            logger.verbose('live-css will start watching files under:\n    ' + watcherCwd + '\n');
        } else {
            if (!flagConfigurationLoaded) {
                logger.verbose('To list the files being watched, run ' + logger.chalk.underline('live-css') + ' with ' + logger.chalk.underline('--list-files') + ' parameter or ' + logger.chalk.underline('"list-files"') + ' configuration.');
            }
            process.stdout.write(logger.chalk.dim('Adding files to watch '));
        }
    }, 0);
};

if (module.parent) {    // If being loaded via require()
    (function () {
        var liveCss = function (options) {
            options = options || {};
            var httpServer = options.httpServer,
                configFilePath = options.configFilePath,
                processedParams = getLiveCssParams(configFilePath);

            startTheServer({
                httpServer: httpServer,
                processedParams: processedParams
            });
        };
        module.exports = liveCss;
    }());
} else {                // If being executed directly from command line
    (function () {
        var argv = require('yargs')
            .help(false)
            .version(false)
            .argv;

        var showHelp = function () {
            logger.verbose([
                '',
                'Format:   live-css [--root <http-server-root-folder>] [--help]',
                'Examples: live-css',
                '          live-css --help',
                '          live-css --root project/http-pub',
                '          live-css --init',
                'Options:  -h --help                            Show help',
                '          -r --root <http-server-root-folder>  Folder mapping to root (/) of your HTTP server',
                '          -p --port <port-number>              Port number to run live-css server',
                '             --init                            Generate the configuration file',
                '             --list-files                      List the files being monitored',
                '             --allow-symlinks                  Allow symbolic links',
                '          -v --version                         Output the version number',
                '             --debug                           Extra logging to help in debugging live-css',
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
            var defaultConfigFilePath = path.resolve(__dirname, 'default.live-css.config.js'),
                defaultConfigurationText;
            try {
                defaultConfigurationText = fs.readFileSync(defaultConfigFilePath, 'utf8');
            } catch (e) {
                exitWithError('An error occurred.\nUnable to read the default configuration file from:\n    ' + defaultConfigFilePath);
            }

            var targetConfigFilePath = path.resolve(process.cwd(), '.live-css.config.js');
            try {
                try {
                    if (fs.existsSync(targetConfigFilePath)) {
                        // Copy and rename the existing file
                        try {
                            var renameTo = unusedFilename.sync(targetConfigFilePath);
                            try {
                                fs.renameSync(targetConfigFilePath, renameTo);
                                logger.warn('\nThe old configuration file has been renamed to:\n    ' + renameTo);
                            } catch (e) {
                                exitWithError('An error occurred.\nUnable to create a backup of the existing configuration file at:\n    ' + renameTo);
                            }
                        } catch (e) {
                            exitWithError('An error occurred.\nUnable to access the files in directory:\n    ' + path.dirname(targetConfigFilePath));
                        }
                    }
                } catch (e) {
                    exitWithError('An error occurred.\nUnable to access the path:\n    ' + targetConfigFilePath);
                }
                fs.writeFileSync(targetConfigFilePath, defaultConfigurationText);
                logger.success('\nConfiguration file of live-css server has been written at:\n    ' + targetConfigFilePath);
                logger.info('\nNow, when you execute the ' + logger.chalk.underline('live-css') + ' command from this directory, it would load the required options from this configuration file.\n');
                process.exit(0);
            } catch (e) {
                exitWithError('An error occurred.\nUnable to write configuration file to:\n    ' + targetConfigFilePath);
            }
        }

        logger.verbose([
            '',
            'live-css server version: ' + require('./package.json').version,
            'Run ' + logger.chalk.underline('live-css --help') + ' to see the available options and examples.'
        ].join('\n'));

        var processedParams = getLiveCssParams(null, argv);

        startTheServer({
            processedParams: processedParams
        });
    }());
}

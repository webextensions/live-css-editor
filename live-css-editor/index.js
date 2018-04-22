#!/usr/bin/env node

/* eslint-env node */

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

var nPath = require('path');

var chokidar = require('chokidar'),
    boxen = require('boxen'),
    _uniq = require('lodash/uniq.js'),
    findFreePort = require('find-free-port');

var logger = require('note-down');
logger.removeOption('showLogLine');

var Emitter = require('tiny-emitter'),
    emitter = new Emitter();

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// If being executed as a binary and not via require()
if (!module.parent) {
    var argv = require('yargs')
        .help(false)
        .argv;

    var localIpAddressesAndHostnames = require('local-ip-addresses-and-hostnames').getLocalIpAddressesAndHostnames();

    var log = console.log.bind(console);

    var verboseLogging = false;
    if (argv.v || argv.verbose) {
        verboseLogging = true;
    }

    var showHelp = function () {
        logger.verbose([
            '',
            'Format:   live-css-editor [--root=<project-root-folder>] [--help]',
            'Examples: live-css-editor',
            '          live-css-editor --help',
            '          live-css-editor --root=project/css',
            'Options:  -h --help',
            '          -v --verbose',
            '             --root=<project-root-folder>',
            ''
        ].join('\n'));
    };

    if (argv.h || argv.help) {
        showHelp();
    }

    var connectedSessions = 0;

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    var watcherCwd = (function () {
        if (argv.root) {
            if (typeof argv.root === 'string') {
                return nPath.resolve(argv.root);
            } else {
                logger.error('Error: You need to pass an absolute or relative path to the --root parameter');
                process.exit(1);
            }
        } else {
            return process.cwd();
        }
    }());
    var watcher = chokidar.watch(
        [
            '**/*.css',
            '**/*.css.*',

            '**/*.less',
            '**/*.less.*',

            '**/*.sass',
            '**/*.sass.*',

            '**/*.scss',
            '**/*.scss.*',

            // An example path which is required to be watched, but its parent folder is ignored
            // See below in this file: The path also needs to be "not" ignored in the "ignored" section
            'node_modules/async-limiter/coverage/lcov-report/base.css',
        ],
        {
            cwd: watcherCwd,
            ignored: [
                /(^|[/\\])\../,     // A general rule to ignore the "." files/directories
                'node_modules',

                // An example path which is required to be watched, but its parent folder is ignored
                // See above in this file: The path also needs to be in the watchlist section
                '!node_modules/async-limiter/coverage/lcov-report/base.css'
            ],
            // ignored: /(^|[/\\])\../,
            // ignoreInitial: true,
            persistent: true
        }
    );

    var filesBeingWatched = [];
    var fileModifiedHandler = function (changeObj) {
        io.emit('file-modified', changeObj);
    };
    var fileAddedHandler = function (changeObj) {
        if (verboseLogging) {
            if (filesBeingWatched.length === 0) {
                logger.success('Live CSS Editor (Magic CSS) is watching the following file(s):');
            }
            logger.log('    ' + changeObj.relativePath);
        }
        filesBeingWatched.push(changeObj);
        io.emit('file-added', changeObj);
    };
    var fileDeletedHandler = function (changeObj) {
        filesBeingWatched = filesBeingWatched.filter(function(item){
            return item.relativePath !== changeObj.relativePath;
        });

        io.emit('file-deleted', changeObj);
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
        logger.success(
            '\nLive CSS Editor (Magic CSS) server is watching ' + filesBeingWatched.length + ' files from:' +
            '\n    ' + watcherCwd
        );
        if (!argv.root && anyFileNameIsRepeated(filesBeingWatched)) {
            logger.warn(
                boxen(
                    'Some of the files being watched have the same name.' +
                    '\nlive-css-editor would still work fine.' +
                    '\n\nFor better experience, you may start live-css-editor' +
                    '\nwith an appropriate ' + logger.chalk.bold('--root') + ' parameter',
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
        logger.info('Connected to a socket.');
        printSessionCount(connectedSessions);
    });

    emitter.on('disconnected-socket', function () {
        connectedSessions--;
        logger.info('Disconnected from a socket.');
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
        if (argv.root) {
            ob.root = watcherCwd;
            ob.useOnlyFileNamesForMatch = false;
        } else {
            ob.root = null;
            ob.useOnlyFileNamesForMatch = true;
        }
        return ob;
    }

    watcher
        .on('add', function (path, asdf, xyz) {
            logger.verbose('File being watched: ' + path);
            emitter.emit('file-added', getPathValues(path));
        })
        .on('change', function (path) {
            log('File modified: ' + path);
            emitter.emit('file-modified', getPathValues(path));
        })
        .on('unlink', function (path) {
            log('File removed: ' + path);
            emitter.emit('file-deleted', getPathValues(path));
        });

    io.on('connection', function(socket) {
        emitter.emit('connected-socket');

        // socket.on('chat message', function(msg){
        //     console.log('message: ' + msg);
        // });

        socket.on('disconnect', function(){
            emitter.emit('disconnected-socket');
        });
    });

    findFreePort(3456, function(err, freePort) {
        logger.info(
            '\nLive CSS Editor (Magic CSS) server is available at any of the following addresses:\n' +
            (function (localIpAddressesAndHostnames) {
                var addresses = [].concat(localIpAddressesAndHostnames);
                addresses = addresses.map(function (item) {
                    return  '    http://' + item + ':' + freePort + '/';
                });
                return addresses.join('\n');
            }(localIpAddressesAndHostnames)) +
            '\n'
        );

        logger.info('Press CTRL-C to stop the server\n');

        http.listen(freePort, function() {
            // console.log('listening on *:' + freePort);
        });
    });

    // getPort({port: 4000}).then(port => {
    //     http.listen(port, function(){
    //         console.log('listening on *:' + port);
    //     });
    //
    //     // Will use 3000 if available, otherwise fall back to a random port
    // });
}
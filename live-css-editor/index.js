#!/usr/bin/env node

/* eslint-env node */

var os = require('os');

var chokidar = require('chokidar'),
    findFreePort = require('find-free-port');

var logger = require('note-down');

var Emitter = require('tiny-emitter'),
    emitter = new Emitter();

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var argv = require('yargs').argv;

var localIpAddressesAndHostnames = require('local-ip-addresses-and-hostnames').getLocalIpAddressesAndHostnames();

var log = console.log.bind(console);

var verboseLogging = false;
if (argv.v || argv.verbose) {
    verboseLogging = true;
}

var connectedSessions = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

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

var filesBeingWatched = 0;
var fileModifiedHandler = function (changeObj) {
    // console.log(changeObj.fileName);
    io.emit('file-modified', changeObj);
};
var fileAddedHandler = function (changeObj) {
    filesBeingWatched++;
    if (verboseLogging) {
        if (filesBeingWatched === 1) {
            logger.success('Live CSS Editor (Magic CSS) is watching the following file(s):');
        }
        logger.log('    ' + changeObj.fileName);
    }
    io.emit('file-added', changeObj);
};
var fileDeletedHandler = function (changeObj) {
    // console.log(changeObj.fileName);
    filesBeingWatched--;
    io.emit('file-deleted', changeObj);
};

emitter.on('file-modified', fileModifiedHandler);
emitter.on('file-added', fileAddedHandler);
emitter.on('file-deleted', fileDeletedHandler);

emitter.on('file-watch-ready', function () {
    logger.success('Live CSS Editor (Magic CSS) is watching ' + filesBeingWatched + ' files.');
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

watcher
    .on('add', function (path) {
        logger.verbose(`File ${path} is being watched`);
        emitter.emit('file-added', { fileName: path });
    })
    .on('change', function (path) {
        log(`File ${path} has been changed`);
        emitter.emit('file-modified', { fileName: path });
    })
    .on('unlink', function (path) {
        log(`File ${path} has been removed`);
        emitter.emit('file-deleted', { fileName: path });
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
        '\nLive CSS Editor (Magic CSS) is available at any of the following addresses:\n' +
        (function (localIpAddressesAndHostnames) {
            var addresses = [].concat(localIpAddressesAndHostnames);
            addresses = addresses.map(function (item) {
                return  '    http://' + item + ':' + freePort + '/';
            });
            return addresses.join('\n');
        }(localIpAddressesAndHostnames))
    );

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

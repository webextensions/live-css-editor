#!/usr/bin/env node

/* eslint-env node */

var chokidar = require('chokidar');
var express = require('express');
var Emitter = require('tiny-emitter');
// var chalk = require('chalk');

var emitter = new Emitter();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var os = require('os');
var logger = require('note-down'),
    localIpAddresses = require('local-ip-addresses');

// var getPort = require('get-port');
var findFreePort = require('find-free-port');

var argv = require('yargs').argv;

var verboseLogging = false;
if (argv.v || argv.verbose) {
    verboseLogging = true;
}

// var verboseLogging = false;
// var verboseLogging = true;

var connectedSessions = 0;

// app.get('/', function(req, res){
//     res.send('<h1>Hello world</h1>');
// });
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var log = console.log.bind(console);

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
        // log(`File ${path} has been added`);
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

findFreePort(4000, function(err, freePort) {
    logger.info(
        '\nLive CSS Editor (Magic CSS) is available at any of the following addresses:\n' +
        (function (ipAddresses) {
            var host = os.hostname(),
                addresses = [];
            addresses = addresses.concat('localhost');
            addresses = addresses.concat(host);
            addresses = addresses.concat(ipAddresses);
            addresses = addresses.map(function (item) {
                return  '    http://' + item + ':' + freePort + '/';
            });
            return addresses.join('\n');
        }(localIpAddresses))
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

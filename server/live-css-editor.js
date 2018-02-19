#!/usr/bin/env node

/* eslint-env node */

// var path = require('path'),
var fs = require('fs'),
    os = require('os');

var express = require('express'),
    serveIndex = require('serve-index'),
    bodyParser = require('body-parser'),
    glob = require('glob-all');

var logger = require('note-down'),
    localIpAddresses = require('local-ip-addresses');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static('temp'));
// app.use('/temp', express.static('temp'));
// app.use('/', express.static(path.join(__dirname, 'temp')));

/*
app.put('/magic-css', function (req, res, next) {
    console.log('Hi world');
});
/* */

app.put('/magic-css/*', function (req, res, next) { // eslint-disable-line no-unused-vars
    var relativeFilePath = req.originalUrl.substr('/magic-css/'.length);
    fs.writeFileSync(
        // __dirname + '/' + relativeFilePath,
        relativeFilePath,
        req.body.targetFileContents
    );
    res.send({ status: 'File updated successfully' });
}); /* */

app.get('/magic-css', function (req, res, next) { // eslint-disable-line no-unused-vars
    var arrFiles = [];
    glob([
        '**/*.css',
        '**/*.scss',
        '**/*.less'
    ], function (err, files) {
        logger.verbose(files);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            arrFiles.push({
                id: file,
                name: file
            });
        }
        res.send(arrFiles);

        // next();
    });
});

// https://expressjs.com/en/starter/static-files.html
// https://expressjs.com/en/resources/middleware/serve-index.html
app.use('/', express.static('.'), serveIndex('.', {'icons': true}));

// app.use('/', express.static('temp'), serveIndex('temp', {'icons': true}));
// app.use('/', express.static('.'), serveIndex('temp', {'icons': true}));

// app.use(express.static(__dirname));

// app.get('/', function (req, res) {
//     res.send('Hello World');
// });

var portNumber = 3777;

app.listen(portNumber);

logger.info(
    '\nLive CSS Editor (Magic CSS) is available at any of the following addresses:\n' +
    (function (ipAddresses) {
        var host = os.hostname(),
            addresses = [];
        addresses = addresses.concat('localhost');
        addresses = addresses.concat(host);
        addresses = addresses.concat(ipAddresses);
        addresses = addresses.map(function (item) {
            return  '    http://' + item + ':' + portNumber + '/';
        });
        return addresses.join('\n');
    }(localIpAddresses))
);

logger.success('Use it along with the Chrome extension:');
logger.success('    https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol');

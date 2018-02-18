#!/usr/bin/env node

var express = require('express');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');

var path = require('path');
var fs = require('fs');
var os = require('os');
var glob = require('glob-all');

var localIpAddresses = require('local-ip-addresses');

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

app.put('/magic-css/*', function (req, res, next) {
    var relativeFilePath = req.originalUrl.substr('/magic-css/'.length);
    fs.writeFileSync(
        // __dirname + '/' + relativeFilePath,
        relativeFilePath,
        req.body.targetFileContents
    );
    res.send({ status: 'File updated successfully' });
}); /* */

app.get('/magic-css', function (req, res, next) {
    // debugger;
    var arrFiles = [];
    glob([
        '**/*.css',
        '**/*.scss',
        '**/*.less'
    ], function (err, files) {
        console.log(files);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            arrFiles.push({
                id: file,
                name: file
            });
        }
        res.send(arrFiles);

        // next();
    })
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

console.log(
    'Live CSS Editor (Magic CSS) is available at any of the following addresses:\n' +
    (function (ipAddresses) {
        var host = os.hostname(),
            addresses = [];
        addresses = addresses.concat('localhost');
        addresses = addresses.concat(host);
        addresses = addresses.concat(ipAddresses);
        addresses = addresses.map(function (item) {
            return  '    http://' + item + ':3777/';
        });
        return addresses.join('\n');
    }(localIpAddresses))
);

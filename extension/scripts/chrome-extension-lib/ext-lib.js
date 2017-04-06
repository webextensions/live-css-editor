/*globals chrome, async */

var extLib = {
    TR: function (key, defaultValue) {
        if (typeof chrome !== "undefined" && chrome && chrome.i18n) {
            return chrome.i18n.getMessage(key);
        } else {
            if (defaultValue) {
                return defaultValue;
            } else {
                console.warn('No default value available for key: ' + key);
                return '';
            }
        }
    },

    loadCSS: function (href) {
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", href);
        // link.onload = function() {
        //     cb();
        // };
        // link.onerror = function() {
        //     cb('Could not load: ' + link);
        // };
        document.body.appendChild(link);
    },

    // allFrames: true
    // to support webpages structured using <frameset> (eg: http://www.w3schools.com/tags/tryhtml_frame_cols.htm)
    insertCSS: function (file, allFrames, cb) {
        if (typeof chrome !== "undefined" && chrome && chrome.tabs) {
            chrome.tabs.insertCSS(null, {file: file, allFrames: allFrames || true}, function () {
                cb();       // Somehow this callback is not getting called without this anonymous function wrapper
            });
        } else {
            extLib.loadCSS(file);
            cb();
            // extLib.loadCSS(file, function (err) {
            //     if (err) {
            //         console.error(err);
            //     } else {
            //         cb();
            //     }
            // });
        }
    },

    loadJS: function(src, cb) {
        cb = cb || function () {};
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.onload = function() {
            cb();
        };
        script.onerror = function() {
            cb('Could not load: ' + src);
        };
        document.body.appendChild(script);
    },

    // allFrames: true
    // to support webpages structured using <frameset> (eg: http://www.w3schools.com/tags/tryhtml_frame_cols.htm)
    executeScript: function (file, allFrames, cb) {
        if (typeof chrome !== "undefined" && chrome && chrome.tabs) {
            chrome.tabs.executeScript(null, {file: file, allFrames: allFrames || true}, function () {
                cb();       // Somehow this callback is not getting called without this anonymous function wrapper
            });
        } else {
            extLib.loadJS(file, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    cb();
                }
            });
        }
    },

    loadJSCSS: function (arrSources, allFrames) {
        async.eachSeries(
            arrSources,
            function (source, cb) {
                // source can also be an object and can have "src" and "skip" parameters
                if (typeof source === "object") {
                    if (source.skip) {
                        source = null;
                    } else {
                        source = source.src;
                    }
                }
                if (source) {
                    if (source.match('.js$')) {
                        extLib.executeScript(source, allFrames, cb);
                    } else if (source.match('.css$')) {
                        extLib.insertCSS(source, allFrames, cb);
                    } else {
                        console.log('Error - Loading files like ' + source + ' is not supported by loadJSCSS(). Please check the file extension.');
                        cb();
                    }
                } else {
                    cb();
                }
            }
        );
    }
};

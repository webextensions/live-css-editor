/*globals chrome */

// https://github.com/coderaiser/itchy/blob/master/lib/itchy.js
var asyncEachSeries = (array, iterator, done) => {
    check(array, iterator, done);

    var i = -1,
        n = array.length;

    var loop = function (e) {
        i++;

        if (e || i === n)
            return done && done(e);

        iterator(array[i], loop);
    };

    loop();
};

function check(array, iterator, done) {
    if (!Array.isArray(array))
        throw Error('array should be an array!');

    if (typeof iterator !== 'function')
        throw Error('iterator should be a function!');

    if (done && typeof done !== 'function')
        throw Error('done should be a function (when available)!');
}

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
    insertCSS: function (options, cb) {
        var file = options.file,
            code = options.code,
            allFrames = options.allFrames === false ? false : true,
            tabId = options.tabId || null,
            advancedConfig = options.advancedConfig || {},
            runAt = advancedConfig.runAt || 'document_idle';

        if (typeof chrome !== "undefined" && chrome && chrome.tabs) {
            chrome.tabs.insertCSS(tabId, {file: file, code: code, allFrames: allFrames, runAt: runAt}, function () {
                cb();       // Somehow this callback is not getting called without this anonymous function wrapper
            });
        } else {
            if (file) {
                extLib.loadCSS(file);
            } else {
                console.log('Error: It appears that you are in normal webpage mode while trying to load CSS "code". Currently, that works only in extension mode.');
            }
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
    executeScript: function (options, cb) {
        var file = options.file,
            code = options.code,
            allFrames = options.allFrames === false ? false : true,
            tabId = options.tabId || null,
            advancedConfig = options.advancedConfig || {},
            runAt = advancedConfig.runAt || 'document_idle';
        if (typeof chrome !== "undefined" && chrome && chrome.tabs) {
            chrome.tabs.executeScript(tabId, {file: file, code: code, allFrames: allFrames, runAt: runAt}, function () {
                cb();       // Somehow this callback is not getting called without this anonymous function wrapper
            });
        } else {
            if (file) {
                extLib.loadJS(file, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        cb();
                    }
                });
            } else {
                console.log('Error: It appears that you are in normal webpage mode while trying to execute JS "code". Currently, that works only in extension mode.');
                cb();
            }
        }
    },

    loadJSCSS: function (arrSources, allFrames, tabId, advancedConfig, done) {
        asyncEachSeries(
            arrSources,
            function (source, cb) {
                var sourceText, type;
                // source can also be an object and can have "src" and "skip" parameters
                if (typeof source === "object") {
                    if (source.skip) {
                        source = null;
                    } else if (source.sourceText && source.type) {
                        sourceText = source.sourceText;
                        type = source.type;
                    } else {
                        source = source.src;
                    }
                }
                if (type && sourceText) {
                    if (type === 'js') {
                        extLib.executeScript({code: sourceText, allFrames: allFrames, tabId: tabId, advancedConfig: advancedConfig}, cb);
                    } else if (type === 'css') {
                        extLib.insertCSS({code: sourceText, allFrames: allFrames, tabId: tabId, advancedConfig: advancedConfig}, cb);
                    } else {
                        console.log('Error - Loading scripts like ' + type + '/' + source + ' is not supported by loadJSCSS(). Please check the "type" for the "sourceText".');
                        cb();
                    }
                } else if (source) {
                    if (source.match('.js$')) {
                        extLib.executeScript({file: source, allFrames: allFrames, tabId: tabId, advancedConfig: advancedConfig}, cb);
                    } else if (source.match('.css$')) {
                        extLib.insertCSS({file: source, allFrames: allFrames, tabId: tabId, advancedConfig: advancedConfig}, cb);
                    } else {
                        console.log('Error - Loading files like ' + source + ' is not supported by loadJSCSS(). Please check the file extension.');
                        cb();
                    }
                } else {
                    cb();
                }
            },
            function () {
                if (done) {
                    done();
                }
            }
        );
    }
};

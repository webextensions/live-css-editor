/* global browser, chrome */

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

// TODO: DUPLICATE: Code duplication for browser detection in commands.js, ext-lib.js, magicss.js and options.js
var isChrome = false,
    isEdge = false,
    isFirefox = false,
    isOpera = false,
    isChromiumBased = false;

// Note that we are checking for "Edg/" which is the test required for identifying Chromium based Edge browser
if (/Edg\//.test(navigator.appVersion)) {           // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
    isEdge = true;
} else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
    isOpera = true;
} else if (/Chrome/.test(navigator.appVersion)) {
    isChrome = true;
} else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
    isFirefox = true;
}
if (isEdge || isOpera || isChrome) {
    isChromiumBased = true; // eslint-disable-line no-unused-vars
}

var extLib = {
    TR: function (key, defaultValue) {
        if (typeof chrome !== 'undefined' && chrome && chrome.i18n) {
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

    loadCss: function (href) {
        const link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', href);

        // link.onload = function() {
        //     callback();
        // };
        // link.onerror = function() {
        //     callback('Could not load: ' + link);
        // };

        document.body.appendChild(link);
    },

    // allFrames: true
    // to support webpages structured using <frameset> (eg: http://www.w3schools.com/tags/tryhtml_frame_cols.htm)
    insertCss: function (options) {
        var treatAsNormalWebpage = options.treatAsNormalWebpage,
            file = options.file,
            code = options.code,
            allFrames = options.allFrames === false ? false : true,
            tabId = options.tabId || null,
            frameId = options.frameId,
            runAt = options.runAt || 'document_idle',
            callback = options.callback;

        if (
            !treatAsNormalWebpage &&
            typeof chrome !== 'undefined' &&
            chrome &&
            chrome.tabs
        ) {
            chrome.tabs.insertCSS(tabId, { file, code, allFrames, frameId, runAt }, function () {
                callback();       // Somehow this callback is not getting called without this anonymous function wrapper
            });
        } else {
            if (file) {
                extLib.loadCss(file);
            } else {
                console.log('Error: It appears that you are in normal webpage mode while trying to load CSS "code". Currently, that works only in extension mode.');
            }
            callback();
            // extLib.loadCss(file, function (err) {
            //     if (err) {
            //         console.error(err);
            //     } else {
            //         callback();
            //     }
            // });
        }
    },

    loadJs: function({ src, callback }) {
        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = src;

        script.onload = function() {
            if (callback) {
                callback();
            }
        };
        script.onerror = function() {
            if (callback) {
                callback('Could not load: ' + src);
            }
        };

        document.body.appendChild(script);
    },

    loadJsAsync: async function({ src }) {
        return new Promise(function (resolve, reject) { // eslint-disable-line no-unused-vars
            extLib.loadJs({
                src,
                callback: function (err) {
                    if (err) {
                        resolve([err]);
                    } else {
                        resolve([null]);
                    }
                }
            });
        });
    },

    // allFrames: true
    // to support webpages structured using <frameset> (eg: http://www.w3schools.com/tags/tryhtml_frame_cols.htm)
    executeScript: function (options) {
        var treatAsNormalWebpage = options.treatAsNormalWebpage,
            file = options.file,
            code = options.code,
            allFrames = options.allFrames === false ? false : true,
            tabId = options.tabId || null,
            frameId = options.frameId,
            runAt = options.runAt || 'document_idle',
            callback = options.callback;

        if (
            !treatAsNormalWebpage &&
            typeof chrome !== 'undefined' &&
            chrome &&
            chrome.tabs
        ) {
            if (isFirefox) {
                const executing = browser.tabs.executeScript(tabId, { file, code, allFrames, frameId, runAt });
                executing.then(function () {
                    callback();
                });
            } else {
                chrome.tabs.executeScript(tabId, { file, code, allFrames, frameId, runAt }, function () {
                    callback();       // Somehow this callback is not getting called without this anonymous function wrapper
                });
            }
        } else {
            if (file) {
                extLib.loadJs({
                    src: file,
                    callback: function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                console.log('Error: It appears that you are in normal webpage mode while trying to execute JS "code". Currently, that works only in extension mode.');
                callback();
            }
        }
    },

    executeScriptAsync: async function (options) {
        return new Promise(function (resolve, reject) { // eslint-disable-line no-unused-vars
            extLib.executeScript({
                ...options,
                callback: function (err) {
                    if (err) {
                        resolve([err]);
                    } else {
                        resolve([null]);
                    }
                }
            });
        });
    },

    loadJsCss: function ({
        treatAsNormalWebpage,
        source,
        allFrames,
        tabId,
        frameId,
        runAt,
        callback
    }) {
        var sourceText, type;
        // source can also be an object and can have "src" and "skip" parameters
        if (typeof source === 'object') {
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
                extLib.executeScript({ treatAsNormalWebpage, code: sourceText, allFrames, tabId, frameId, runAt, callback });
            } else if (type === 'css') {
                extLib.insertCss({     treatAsNormalWebpage, code: sourceText, allFrames, tabId, frameId, runAt, callback });
            } else {
                console.log('Error - Loading scripts like ' + type + '/' + source + ' is not supported by loadMultipleJsCss(). Please check the "type" for the "sourceText".');
                callback();
            }
        } else if (source) {
            if (source.match('.js$')) {
                extLib.executeScript({ treatAsNormalWebpage, file: source, allFrames, tabId, frameId, runAt, callback });
            } else if (source.match('.css$')) {
                extLib.insertCss({     treatAsNormalWebpage, file: source, allFrames, tabId, frameId, runAt, callback });
            } else {
                console.log('Error - Loading files like ' + source + ' is not supported by loadMultipleJsCss(). Please check the file extension.');
                callback();
            }
        } else {
            callback();
        }
    },

    loadJsCssAsync: async function({
        treatAsNormalWebpage,
        source,
        allFrames,
        tabId,
        frameId,
        runAt
    }) {
        return new Promise(function (resolve, reject) { // eslint-disable-line no-unused-vars
            extLib.loadJsCss({
                treatAsNormalWebpage,
                source,
                allFrames,
                tabId,
                frameId,
                runAt,
                callback: function (err) {
                    if (err) {
                        resolve([err]);
                    } else {
                        resolve([null]);
                    }
                }
            });
        });
    },

    loadMultipleJsCss: function ({
        treatAsNormalWebpage,
        arrSources,
        allFrames,
        tabId,
        frameId,
        runAt,
        done
    }) {
        asyncEachSeries(
            arrSources,
            function (source, callback) {
                extLib.loadJsCss({
                    treatAsNormalWebpage,
                    source,
                    allFrames,
                    tabId,
                    frameId,
                    runAt,
                    callback: function () {
                        callback();
                    }
                });
            },
            function () {
                if (done) {
                    done();
                }
            }
        );
    }
};

/* global chrome, jQuery, less, Sass, csspretty */

'use strict';

var utils = window.utils || {};

if (!utils.defined) {
    utils.defined = true;

    /* eslint-disable no-undef */
    // https://github.com/hydiak/a-sync-waterfall/blob/master/index.js
    // MIT license (by Elan Shanker).
    (function(globals) {
        'use strict';

        var executeSync = function() {
            var args = Array.prototype.slice.call(arguments);
            if (typeof args[0] === 'function') {
                args[0].apply(null, args.splice(1));
            }
        };

        var executeAsync = function(fn) {
            if (typeof setImmediate === 'function') {
                setImmediate(fn);
            } else if (typeof process !== 'undefined' && process.nextTick) {
                process.nextTick(fn);
            } else {
                setTimeout(fn, 0);
            }
        };

        var makeIterator = function(tasks) {
            var makeCallback = function(index) {
                var fn = function() {
                    if (tasks.length) {
                        tasks[index].apply(null, arguments);
                    }
                    return fn.next();
                };
                fn.next = function() {
                    return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
                };
                return fn;
            };
            return makeCallback(0);
        };

        var _isArray = Array.isArray || function(maybeArray) {
            return Object.prototype.toString.call(maybeArray) === '[object Array]';
        };

        var waterfall = function(tasks, callback, forceAsync) {
            var nextTick = forceAsync ? executeAsync : executeSync;
            callback = callback || function() {};
            if (!_isArray(tasks)) {
                var err = new Error('First argument to waterfall must be an array of functions');
                return callback(err);
            }
            if (!tasks.length) {
                return callback();
            }
            var wrapIterator = function(iterator) {
                return function(err) {
                    if (err) {
                        callback.apply(null, arguments);
                        callback = function() {};
                    } else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        var next = iterator.next();
                        if (next) {
                            args.push(wrapIterator(next));
                        } else {
                            args.push(callback);
                        }
                        nextTick(function() {
                            iterator.apply(null, args);
                        });
                    }
                };
            };
            wrapIterator(makeIterator(tasks))();
        };

        if (typeof define !== 'undefined' && define.amd) {
            define([], function() {
                return waterfall;
            }); // RequireJS
        } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = waterfall; // CommonJS
        } else {
            globals.waterfall = waterfall; // <script>
        }
    })(this);
    /* eslint-enable no-undef */
    utils.waterfall = this.waterfall;

    utils.attachPublishSubscribe = function (attachToObject) {
        var o = jQuery({});
        jQuery.each({
            trigger: 'publish',
            on: 'subscribe',
            off: 'unsubscribe'
        }, function (key, val) {
            attachToObject[val] = function () {
                o[key].apply(o, arguments);
            };
        });
    };

    utils.gEBI = function (id) {
        return document.getElementById(id);
    };

    utils.gEBTN = function (tagName) {
        return document.getElementsByTagName(tagName);
    };

    /**
     * Load a script
     *
     * @param {Object|string} cfg Configuration object or Path of the JS source
     * @param {Document} [cfg.doc=document] Which "document" object to use
     * @param {String} [cfg.parent='body'] Which tag to append to (the "parent" tag value would be used if that element is available)
     * @param {String} cfg.src Path of the JS source
     * @param {Boolean} [cfg.freshCopy=true] Load a fresh JS source
    */
    utils.loadScript = function (cfg) {
        var doc = cfg.doc || document,
            parent = (function () {
                var parent = cfg.parent || 'body';
                if (parent === 'html') {
                    return 'documentElement';
                } else if (parent === 'head') {
                    return 'head';
                } else {
                    return 'body';
                }
            }()),
            parentEl = doc[parent] || doc['body'] || doc['head'] || doc['documentElement'],
            src = (cfg.src || cfg),
            freshCopy = (cfg.freshCopy === false) ? false : true,
            script = doc.createElement('script');
        script.src = src + (freshCopy ? '' : ('?' + Math.random()));
        parentEl.appendChild(script);
    };

    /*
    Parameters:
        config.cssText (required): The CSS style
        config.doc (optional): Which "document" object to use
        config.id (optional): ID attribute for the style tag
        config.parentTag (optional): 'body' (default) or 'head' or 'html' (the "parentTag" value would be used if that element is available)
        config.overwriteExistingStyleTagWithSameId: Overwrite definition of existing style tag with same id, true or false (default)
        config.removeExistingStyleTagWithSameId (optional): true or false (default),
            applicable only if "id" parameter is also specified
    */
    utils.addStyleTag = function (config) {
        var doc = config.doc || document,
            id = config.id;
        if (id) {
            var removeExistingStyleTag = config.removeExistingStyleTagWithSameId;
            if (removeExistingStyleTag === true) {
                var existingStyleTag = utils.gEBI(id);
                existingStyleTag.parentNode.removeChild(existingStyleTag);
            }
        }

        var overwriteExistingStyleTag = config.overwriteExistingStyleTagWithSameId,
            styleNode;
        if (overwriteExistingStyleTag && id) {
            styleNode = utils.gEBI(id);
        }
        if (styleNode) {
            // do nothing
        } else {
            styleNode = doc.createElement('style');
            styleNode.type = 'text/css';
            if (id) {
                styleNode.id = id;
            }
        }
        var attributes = config.attributes || [];
        attributes.forEach(function (attribute) {
            styleNode.setAttribute(attribute.name, attribute.value);
        });

        var cssText = config.cssText;
        styleNode.innerHTML = '';
        styleNode.appendChild(doc.createTextNode(cssText));

        var parent = (function () {
            var parentTag = config.parentTag || 'body';
            if (parentTag === 'html') {
                return 'documentElement';
            } else if (parentTag === 'head') {
                return 'head';
            } else {
                return 'body';
            }
        }());
        var parentEl = doc[parent] || doc['body'] || doc['head'] || doc['documentElement'];

        parentEl.appendChild(styleNode);

        var disabled = config.disabled;

        // TODO: FIXME: HACK: This 'if' condition should be converted into some standard implementation
        if (window.flagEditorInExternalWindow && id === 'MagiCSS-bookmarklet-html-id') {
            disabled = true;
        }

        if (disabled) {
            styleNode.disabled = true;
        } else {
            styleNode.disabled = false;
        }
    };

    utils.StyleTag = function (config) {
        this.cssText = config.cssText;
        this.id = config.id;
        this.parentTag = config.parentTag;
        this.overwriteExistingStyleTagWithSameId = config.overwriteExistingStyleTagWithSameId;
        this.removeExistingStyleTagWithSameId = config.removeExistingStyleTagWithSameId;

        var proto = utils.StyleTag.prototype;
        if (typeof proto.firstExecution == 'undefined') {
            proto.firstExecution = true;

            proto.applyTag = function () {
                utils.addStyleTag({
                    attributes: config.attributes,
                    cssText: this.cssText,
                    id: this.id,
                    parentTag: this.parentTag,
                    overwriteExistingStyleTagWithSameId: this.overwriteExistingStyleTagWithSameId,
                    removeExistingStyleTagWithSameId: this.removeExistingStyleTagWithSameId,
                    disabled: this.disabled
                });
                var appliedCssText = this.cssText;
                return appliedCssText;
            };

            proto.disable = function () {
                // TODO
            };
        } else {
            proto.firstExecution = false;
        }
    };

    // http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
    utils.removeComments = function (str) {
        var uid = '_' + (+new Date()),
            primatives = [],
            primIndex = 0;

        return (
            str
                /* Remove strings */
                .replace(/(['"])(\\\1|.)+?\1/g, function(match){
                    primatives[primIndex] = match;
                    return (uid + '') + primIndex++;
                })

                /* Remove Regexes */
                .replace(/([^/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
                    primatives[primIndex] = $2;
                    return $1 + (uid + '') + primIndex++;
                })

                /*
                - Remove single-line comments that contain would-be multi-line delimiters
                    E.g. // Comment /* <--
                - Remove multi-line comments that contain would be single-line delimiters
                    E.g. /* // <--
               */
                .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')

                /*
                Remove single and multi-line comments,
                no consideration of inner-contents
               */
                .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')

                /*
                Remove multi-line comments that have a replaced ending (string/regex)
                Greedy, so no inner strings/regexes will stop it.
               */
                .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')

                /* Bring back strings & regexes */
                .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
                    return primatives[n];
                })
        );
    };

    utils.chromeStorageGet = function (storageObject, prop) {
        return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
            storageObject.get(prop, function (values) {
                resolve(values[prop]);
            });
        });
    };

    utils.chromeStorageSet = function (storageObject, prop, value) {
        return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
            storageObject.set(
                {
                    [prop]: value
                },
                function () {
                    resolve();
                }
            );
        });
    };

    utils.chromeStorageRemove = function (storageObject, prop) {
        return new Promise(function (resolve, reject) {     // eslint-disable-line no-unused-vars
            storageObject.remove(prop, function () {
                resolve();
            });
        });
    };

    utils.chromeStorageLocalGet = async function (prop) {
        const value = await utils.chromeStorageGet(chrome.storage.local, prop);
        return value;
    };
    utils.chromeStorageSyncGet = async function (prop) {
        const value = await utils.chromeStorageGet(chrome.storage.sync, prop);
        return value;
    };

    utils.chromeStorageLocalSet = async function (prop, value) {
        await utils.chromeStorageSet(chrome.storage.local, prop, value);
    };
    utils.chromeStorageSyncSet = async function (prop, value) {
        await utils.chromeStorageSet(chrome.storage.sync, prop, value);
    };

    utils.chromeStorageLocalRemove = async function (prop, value) {
        await utils.chromeStorageRemove(chrome.storage.local, prop, value);
    };
    utils.chromeStorageSyncRemove = async function (prop, value) {
        await utils.chromeStorageRemove(chrome.storage.sync, prop, value);
    };

    utils.delayFunctionUntilTestFunction = async function(config) {
        var fnSuccess = config.fnSuccess,
            fnTest = config.fnTest,
            fnFirstFailure = config.fnFirstFailure,
            fnEachFailure = config.fnEachFailure,
            fnFailure = config.fnFailure,
            tryLimit = typeof config.tryLimit === 'undefined' ? 120 : config.tryLimit;

        config['tryLimit-Running-Cycle-Number'] = typeof config['tryLimit-Running-Cycle-Number'] === 'undefined' ? 0 : config['tryLimit-Running-Cycle-Number']+1;

        var tryLimitRunningCycleNumber = config['tryLimit-Running-Cycle-Number'],
            waitFor = config.waitFor || 750;

        if(fnTest()) {
            return (await fnSuccess()) === false ? false : true;
        } else {
            if(tryLimitRunningCycleNumber === 0 && typeof fnFirstFailure === 'function') {
                fnFirstFailure();
            }

            if(typeof fnEachFailure === 'function') {
                fnEachFailure();
            }

            if(tryLimitRunningCycleNumber < (tryLimit-1)) {
                window.setTimeout((async function(){
                    await utils.delayFunctionUntilTestFunction(config);
                }),waitFor);
            } else {
                if (typeof fnFailure === 'function') {
                    fnFailure();
                }
            }
            return false;
        }
    };

    utils.alertNote = (function () {
        var w = window,
            d = document,
            dE = d.documentElement,
            div = d.createElement('div'),
            t;
        div.id = 'topCenterAlertNote';

        // Hide functionality
        var h = function (div) {
            div.style.display = 'none';
        };

        var clearTimeout = function () {
            w.clearTimeout(t);
        };

        const defaults = {
            paddingTop: '',
            paddingRight: '',
            paddingBottom: '',
            paddingLeft: '',
            verticalAlignment: 'top',
            horizontalAlignment: 'center',
            textAlignment: 'center'
        };

        var alertNote = function (msg, hideDelay, options) {
            options = options || {};
            var verticalAlignment = options.verticalAlignment || defaults.verticalAlignment || 'top',
                horizontalAlignment = options.horizontalAlignment || defaults.horizontalAlignment || 'center',
                textAlignment = options.textAlignment || defaults.textAlignment || 'center',
                backgroundColor = options.backgroundColor || '#f9edbe',
                borderColor = options.borderColor || '#eb7',
                opacity = options.opacity || '1',
                paddingTop    = options.paddingTop    || defaults.paddingTop    || '',
                paddingRight  = options.paddingRight  || defaults.paddingRight  || '',
                paddingBottom = options.paddingBottom || defaults.paddingBottom || '',
                paddingLeft   = options.paddingLeft   || defaults.paddingLeft   || '',
                unobtrusive = options.unobtrusive || false;
            // TODO:
            // - Apply !important for various inline styles (otherwise, it might get over-ridden by some previously present !important CSS styles)
            // - "OK" button functionality

            /*eslint-disable indent */
            div.innerHTML = [
                '<div ' +
                    'style="' +
                        'pointer-events:none;' +    // To avoid it from stealing hover (the pointer-events will be enabled for a child element)
                        'position:fixed;width:100%;z-index:2147483600;' +
                        (paddingTop    ? `padding-top:   ${paddingTop   };` : '') +
                        (paddingBottom ? `padding-bottom:${paddingBottom};` : '') +
                        (verticalAlignment === 'bottom' ? 'bottom:0;' : 'top:0;') +
                        (function () {
                            if (horizontalAlignment === 'left') {
                                return 'left:0;';
                            } else if (horizontalAlignment === 'right') {
                                return 'right:0;';
                            } else {
                                /* Even for center aligning, we need to set left or right as 0, without that
                                    it would try to center align whithout considering the width taken by vertical scrollbar */
                                return 'left:0;';
                            }
                        }()) +
                        'text-align:' + horizontalAlignment + ';' +     // TODO: Check if we need this
                        'opacity:' + opacity + ';' +
                        '"' +
                    '>',
                    '<div ' +
                        'style="' +
                            'display:flex;width:auto;margin:0;padding:0;border:0;' +
                            (paddingRight ? `padding-right:${paddingRight};` : '') +
                            (paddingLeft  ? `padding-left: ${paddingLeft };` : '') +
                            (function () {
                                if (horizontalAlignment === 'left') {
                                    return 'justify-content:flex-start;';
                                } else if (horizontalAlignment === 'right') {
                                    return 'justify-content:flex-end;';
                                } else {
                                    return 'justify-content:center;';
                                }
                            }()) +
                                    // margin:0 is useful for some sites (eg: https://developer.chrome.com/home)
                            '"' +
                        '>',
                        '<div ' +
                            'style="' +
                                'pointer-events:initial;' +    // To gain back the pointer-events which were disabled in one of the parent elements
                                'border:1px solid ' + borderColor + ';' +
                                'background-color:' + backgroundColor + ';' +   // background-color:#feb;
                                                                                // TODO: Check if we need "text-align: left". Maybe it helps to set the default style.
                                'padding:2px 10px;max-width:980px;overflow:hidden;text-align:left;font-family:Arial,sans-serif;font-weight:bold;font-size:12px' +
                            '"' +
                        '>',
                            '<div class="alert-note-text" style="color:#000;text-align:' + textAlignment + ';word-wrap:break-word;">',
                                msg,
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
            /*eslint-enable indent */

            if (unobtrusive) {
                try {
                    var firstChild = div.firstChild.firstChild.firstChild;
                    firstChild.addEventListener('mouseenter', function () {
                        // Note:
                        //      If we wish to directly apply the opacity changes to the parent "div",
                        //      which is currently a direct child of <html> tag, then, on some sites (eg:
                        //      gmail.com) somehow, as soon as we reduce its opacity to a value less than
                        //      1 (eg: 0.99), it gets hidden immediately. The fact that it is appended to
                        //      <html> tag and not to <body> is somehow causing this behavior. Since we
                        //      are using that parent div's inner child, the opacity transition works fine.
                        firstChild.style.transition = 'opacity 0.3s ease-out';
                        firstChild.style.opacity = '0';
                        firstChild.style.pointerEvents = 'none';
                    }, false);
                } catch (e) {
                    // do nothing
                }
            }

            div.style.display = '';     // Required when the same div element is being reused

            dE.appendChild(div);
            clearTimeout();
            t = w.setTimeout(function () { h(div); }, hideDelay || 5000);
        };

        alertNote.hide = function () {
            h(div);
            clearTimeout();
        };

        alertNote.setup = function (defaultsToSet) {
            if (typeof defaultsToSet.verticalAlignment   !== 'undefined' ) { defaults.verticalAlignment   = defaultsToSet.verticalAlignment;   }
            if (typeof defaultsToSet.horizontalAlignment !== 'undefined' ) { defaults.horizontalAlignment = defaultsToSet.horizontalAlignment; }
            if (typeof defaultsToSet.textAlignment       !== 'undefined' ) { defaults.textAlignment       = defaultsToSet.textAlignment;       }
            if (typeof defaultsToSet.paddingTop          !== 'undefined' ) { defaults.paddingTop          = defaultsToSet.paddingTop;          }
            if (typeof defaultsToSet.paddingRight        !== 'undefined' ) { defaults.paddingRight        = defaultsToSet.paddingRight;        }
            if (typeof defaultsToSet.paddingBottom       !== 'undefined' ) { defaults.paddingBottom       = defaultsToSet.paddingBottom;       }
            if (typeof defaultsToSet.paddingLeft         !== 'undefined' ) { defaults.paddingLeft         = defaultsToSet.paddingLeft;         }
        };

        return alertNote;
    }());

    utils.beautifyCSS = function (cssCode, options) {
        var useTabs = options.useTabs,
            useSpaceCount = options.useSpaceCount;

        var inchar,
            insize;

        if (useTabs) {
            inchar = '\t';
            insize = 1;
        } else {
            inchar = ' ';
            insize = useSpaceCount || 4;
        }

        return csspretty({
            mode: 'beautify',   /* Doing beautify twice, otherwise it doesn't beautify code like the following one in single go:
                                       .box-shadow(@style,@alpha: 50%) when (isnumber(@alpha)){.box-shadow(@style, rgba(0, 0, 0, @alpha))} */
            insize: insize,
            inchar: inchar,
            source: csspretty({
                mode: 'beautify',
                insize: insize,
                inchar: inchar,
                source: cssCode
            })
        });

        // Alternatively, use cssbeautify library:
        //     return cssbeautify(
        //         cssCode,
        //         {
        //             indent: '    ',
        //             autosemicolon: true
        //         }
        //     );
    };

    utils.minifyCSS = function (cssCode) {
        return csspretty({
            mode: 'minify',
            source: cssCode
        });

        // Alternatively, use Yahoo's CSS Min library:
        //     return YAHOO.compressor.cssmin(cssCode);
    };

    utils.sassToCSS = function (sassCode, cb) {
        Sass.compile(sassCode, function (output) {
            if (output.message) {
                cb(output);
            }  else {
                var cssCode = output.text;
                cb(null, cssCode);
            }
        });
    };

    utils.lessToCSS = function (lessCode, cb) {
        less.render(
            lessCode,
            function (err, output) {
                if (err) {
                    cb(err);
                } else {
                    var cssCode = output.css;
                    cb(null, cssCode);
                }
            }
        );

        // With older versions of less:
        //     less.Parser().parse(lessCode, function (err, tree) {
        //         if (err) {
        //             cb(err);
        //         } else {
        //             var cssCode = tree.toCSS();
        //             cb(null, cssCode);
        //         }
        //     });
    };
}

if (!utils.attachPublishSubscribeDone) {
    if (typeof jQuery !== 'undefined') {
        utils.attachPublishSubscribeDone = true;
        utils.attachPublishSubscribe(jQuery);
    }
}

'This string is added to the end of this file to handle a weird bug/behavior for Firefox. Without this, if "reapply styles automatically" feature is activated, then it would not work and an error would occur in the background script. Reference: https://stackoverflow.com/questions/44567525/inject-scripts-error-script-returned-non-structured-clonable-data-on-firefox-ex/56597154#56597154';

/*globals jQuery, less, utils, sourceMap, extLib, chrome */

(function($){
    if (window.MagiCSSEditor) {
        window.MagiCSSEditor.reposition();      // 'MagiCSS window is already there. Repositioning it.'
        return;
    }

    // for HTML frameset pages, this value would be 'FRAMESET'
    // chrome.tabs.executeScript uses allFrames: true, to run inside all frames
    if (document.body.tagName !== 'BODY') {
        return;
    }

    var createGist = function (text, cb) {
        $.ajax({
            url: 'https://api.github.com/gists',
            type: 'POST',
            timeout: 20000,
            contentType: 'application/json',
            data: JSON.stringify({
                "description": window.location.origin + ' - MagiCSS',
                "public": true,
                "files": {
                    "styles.css": {
                        "content": text + '\r\n\r\n/* Created via MagiCSS for Chrome - https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol */\r\n'
                    }
                }
            }),
            error: function () {
                utils.alertNote('An unexpected error has occured.<br />We could not reach GitHub Gist.', 10000);
            },
            success: function (json, textStatus) {
                if (textStatus === 'success') {
                    cb(json.html_url);
                } else {
                    utils.alertNote('An unexpected error has occured.<br />We could not access GitHub Gist.', 10000);
                }
            }
        });
    };
    var createGistAndEmail = (function () {
        var lastMailedValue = null,
            lastSuccessNote = '';
        return function (text) {
            text = $.trim(text);
            if (text === '') {
                utils.alertNote('No CSS code to be shared', 5000);
            } else if (lastMailedValue === text) {
                utils.alertNote(lastSuccessNote, 20000);
            } else {
                var wishToContinue = window.confirm('The code you have entered would be uploaded to\n        https://gist.github.com/\nand a link would be generated for sharing.\n\nDo you wish to continue?');
                if (!wishToContinue) {
                    return;
                }
                createGist(text, function (gistUrl) {
                    var anchor = '<a target="_blank" href="' + gistUrl + '">' + gistUrl + '</a>';
                    lastMailedValue = text;
                    lastSuccessNote = 'The GitHub Gist was successfully created: ' +
                        anchor +
                        '<br/>Share code: <a href="' + 'mailto:?subject=Use this code for styling - ' + gistUrl + '&body=' +
                        encodeURIComponent(text.replace(/\t/g,'  ').substr(0,140) + '\r\n...\r\n...\r\n\r\n' + gistUrl + '\r\n\r\n-- Created via MagiCSS for Chrome - https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol') +
                        '">Send e-mail</a>';
                    utils.alertNote(lastSuccessNote, 10000);
                });
                utils.alertNote('Request initiated. It might take a few moments. Please wait.', 5000);
            }
        };
    }());

    var setCodeMirrorCSSLinting = function (cm, enableOrDisable) {
        var lint,
            gutters = [].concat(cm.getOption('gutters') || []);
        if (enableOrDisable === 'enable') {
            lint = true;
            gutters.push('CodeMirror-lint-markers');
        } else {
            lint = false;
            var index = gutters.indexOf('CodeMirror-lint-markers');
            if (index > -1) {
                gutters.splice(index, 1);
            }
        }
        cm.setOption('gutters', gutters);
        cm.setOption('lint', lint);
    };
    var toggleCodeMirrorCSSLinting = function (cm) {
        var lint = cm.getOption('lint');
        if (lint) {
            setCodeMirrorCSSLinting(cm, 'disable');
        } else {
            setCodeMirrorCSSLinting(cm, 'enable');
        }
    };

    var isMac = false;
    try {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    } catch (e) {
        // do nothing
    }

    var noteForUndo = '<br />Note: You may press ' + (isMac ? 'Cmd' : 'Ctrl') + ' + Z to undo the change';

    var main = function () {
        utils.delayFunctionUntilTestFunction({
            tryLimit: 100,
            waitFor: 500,
            fnTest: function () {
                if ((window.Editor || {}).usable) {
                    return true;
                }
                return false;
            },
            fnFirstFailure: function () {
                // do nothing
            },
            fnFailure: function () {
                // do nothing
            },
            fnSuccess: function () {
                var smc;

                var id = 'MagiCSS-bookmarklet',
                    newStyleTagId = id + '-html-id',
                    newStyleTag = new utils.StyleTag({
                        id: newStyleTagId,
                        parentTag: 'body',
                        overwriteExistingStyleTagWithSameId: true
                    });

                var fnApplyTextAsCSS = function (editor) {
                    if (getLanguageMode() === 'less') {
                        var lessCode = editor.getTextValue(),
                            lessOptions = { sourceMap: true };

                        less.render(lessCode, lessOptions, function(err, output) {
                            smc = null;     // Unset old SourceMapConsumer

                            if (err) {
                                // FIXME: The following setTimeout is a temporary fix for alertNote getting hidden by 'delayedcursormove()'
                                setTimeout(function () {
                                    utils.alertNote(
                                        'Invalid LESS syntax.' +
                                        '<br />Error in line: ' + err.line + ' column: ' + err.column +
                                        '<br />Error message: ' + err.message,
                                        10000
                                    );
                                }, 0);
                            } else {
                                var strCssCode = output.css;
                                newStyleTag.cssText = strCssCode;
                                newStyleTag.applyTag();
                                var rawSourceMap = output.map;
                                if (rawSourceMap) {
                                    smc = new sourceMap.SourceMapConsumer(rawSourceMap);
                                }
                            }
                        });
                    } else {
                        var cssCode = editor.getTextValue();
                        newStyleTag.cssText = cssCode;
                        newStyleTag.applyTag();
                    }
                };

                var setLanguageMode = function (languageMode, editor) {
                    if (languageMode === 'less') {
                        $('#' + id).removeClass('magicss-selected-mode-css').addClass('magicss-selected-mode-less');
                        editor.userPreference('language-mode', 'less');
                        setCodeMirrorCSSLinting(editor.cm, 'disable');
                        utils.alertNote('Now editing code in LESS mode', 5000);
                    } else {
                        $('#' + id).removeClass('magicss-selected-mode-less').addClass('magicss-selected-mode-css');
                        editor.userPreference('language-mode', 'css');
                        utils.alertNote('Now editing code in CSS mode', 5000);
                    }
                    fnApplyTextAsCSS(editor);
                };

                var getLanguageMode = function () {
                    return $('#' + id).hasClass('magicss-selected-mode-css') ? 'css' : 'less';
                };

                var options = {
                    id: id,
                    title: function ($, editor) {
                        var $outer = $('<div></div>'),
                            $titleItems = $('<div class="magicss-title"></div>');
                        $outer.append($titleItems);
                        $titleItems.append(
                            '<div class="magicss-mode-button magicss-mode-less" title="LESS mode">less</div>' +
                            '<div class="magicss-mode-button magicss-mode-switch" title="Switch mode"><div class="magicss-mode-switch-selected"></div></div>' +
                            '<div class="magicss-mode-button magicss-mode-css" title="CSS mode">css</div>'
                        );

                        $(document).on('click', '.magicss-mode-css', function () {
                            setLanguageMode('css', editor);
                        });
                        $(document).on('click', '.magicss-mode-less', function () {
                            setLanguageMode('less', editor);
                        });
                        $(document).on('click', '.magicss-mode-switch', function () {
                            if ($('#' + id).hasClass('magicss-selected-mode-css')) {
                                setLanguageMode('less', editor);
                            } else {
                                setLanguageMode('css', editor);
                            }
                        });

                        return $outer;
                    },
                    placeholder: 'Shortcut: Alt + Shift + C' + '\n\nWrite your LESS/CSS code here.\nThe code gets applied immediately.\n\nExample:' + '\nimg {\n    opacity: 0.5;\n}',
                    codemirrorOptions: {
                        mode: 'text/x-less',
                        autoCloseBrackets: true,
                        hintOptions: {
                            completeSingle: false
                        },
                        extraKeys: {
                            'Ctrl-S': function () {
                                var editor = window.MagiCSSEditor;
                                createGistAndEmail(editor.getTextValue());
                                editor.focus();
                            },
                            'Ctrl-D': function () {
                                // TODO: Implement select-next-occurrence-of-current-selection
                                //       This link might be of some help: https://codereview.chromium.org/219583002/
                            }
                        }
                    },
                    bgColor: '68,88,174,0.7',
                    headerIcons: [
                        {
                            name: 'beautify',
                            title: 'Beautify code',
                            cls: 'magicss-beautify magicss-gray-out',
                            onclick: function (evt, editor) {
                                var textValue = editor.getTextValue(),
                                    beautifiedCSS = utils.beautifyCSS(textValue);
                                if (textValue.trim() !== beautifiedCSS.trim()) {
                                    editor.setTextValue(beautifiedCSS).reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                    utils.alertNote('Your code has been beautified :-)', 5000);
                                } else {
                                    utils.alertNote('Your code already looks beautiful :-)', 5000);
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'disable',
                            title: 'Deactivate code',
                            cls: 'magicss-disable-css magicss-gray-out',
                            onclick: function (evt, editor, divIcon) {
                                if ($(divIcon).parents('#' + id).hasClass('indicate-disabled')) {
                                    editor.disableEnableCSS('enable');
                                } else {
                                    editor.disableEnableCSS('disable');
                                }
                            },
                            afterrender: function (editor, divIcon) {
                                /* HACK: Remove this hack which is being used to handle "divIcon.title" change
                                         for the case of "editor.disableEnableCSS('disable')" under "reInitialized()" */
                                editor.originalDisableEnableCSS = editor.disableEnableCSS;
                                editor.disableEnableCSS = function (doWhat) {
                                    editor.originalDisableEnableCSS(doWhat);
                                    if (doWhat === 'disable') {
                                        divIcon.title = 'Activate code';
                                    } else {
                                        divIcon.title = 'Deactivate code';
                                    }
                                };
                            }
                        },
                        (function () {
                            if (executionCounter < 25 || 50 <= executionCounter) {
                                return null;
                            } else {
                                return {
                                    name: 'rate-on-webstore',
                                    title: 'Rate us on Chrome Web Store',
                                    cls: 'magicss-rate-on-webstore',
                                    uniqCls: 'magicss-rate-on-webstore',
                                    href: 'https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol/reviews'
                                };
                            }
                        }())
                    ],
                    headerOtherIcons: [
                        {
                            name: 'less-to-css',
                            title: 'Convert this code from LESS to CSS',
                            uniqCls: 'magicss-less-to-css',
                            onclick: function (evt, editor) {
                                if (getLanguageMode() === 'less') {
                                    var lessCode = editor.getTextValue();
                                    utils.lessToCSS(lessCode, function (err, cssCode) {
                                        if (err) {
                                            utils.alertNote(
                                                'Invalid LESS syntax.' +
                                                '<br />Error in line: ' + err.line + ' column: ' + err.column +
                                                '<br />Error message: ' + err.message,
                                                10000
                                            );
                                            editor.setCursor({line: err.line - 1, ch: err.column}, {pleaseIgnoreCursorActivity: true});
                                        } else {
                                            var beautifiedLessCode = utils.beautifyCSS(utils.minifyCSS(lessCode));
                                            cssCode = utils.beautifyCSS(utils.minifyCSS(cssCode));

                                            if (cssCode === beautifiedLessCode) {
                                                utils.alertNote('Your code is already in CSS', 5000);
                                            } else {
                                                editor.setTextValue(cssCode).reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                                utils.alertNote('Your code has been converted from LESS to CSS :-)' + noteForUndo, 5000);
                                            }
                                        }
                                        editor.focus();
                                    });
                                } else {
                                    utils.alertNote('Please switch to editing code in LESS mode to enable this feature', 5000);
                                    editor.focus();
                                }
                            },
                            beforeShow: function (origin, tooltip) {
                                if (getLanguageMode() === 'less') {
                                    tooltip.addClass('tooltipster-selected-mode-less');
                                } else {
                                    tooltip.addClass('tooltipster-selected-mode-css');
                                }
                            }
                        },
                        /*
                        {
                            name: 'css-to-less',
                            title: 'Convert this code from CSS to LESS',
                            uniqCls: 'magicss-css-to-less',
                            onclick: function () {
                                console.log('Step 1. Read the text');
                                console.log('Step 2. Try to convert that text from CSS to LESS');
                                console.log('Step 3. If successful, change editing mode from CSS to LESS');
                                console.log('Step 4. Notify the user about this change');
                            },
                            beforeShow: function (origin, tooltip) {
                                if (getLanguageMode() === 'css') {
                                    tooltip.addClass('tooltipster-selected-mode-css');
                                }
                            }
                        },
                        /* */
                        {
                            name: 'showHideLineNumbers',
                            title: 'Show / hide line numbers',
                            uniqCls: 'magicss-show-hide-line-numbers',
                            onclick: function (evt, editor) {
                                editor.cm.setOption('lineNumbers', !editor.cm.getOption('lineNumbers'));
                                editor.focus();
                            }
                        },
                        {
                            name: 'enableDisableCSSLinting',
                            title: 'Enable / disable CSS linting',
                            uniqCls: 'enable-disable-css-linting',
                            onclick: function (evt, editor) {
                                if (getLanguageMode() === 'css') {
                                    toggleCodeMirrorCSSLinting(editor.cm);
                                } else {
                                    utils.alertNote('Please switch to editing code in CSS mode to enable this feature', 5000);
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'minify',
                            title: 'Minify',
                            uniqCls: 'magicss-minify',
                            onclick: function (evt, editor) {
                                var textValue = editor.getTextValue();
                                if (!textValue.trim()) {
                                    editor.setTextValue('').reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                    utils.alertNote('Please write some code to be minified', 5000);
                                } else {
                                    var minifiedCSS = utils.minifyCSS(textValue);
                                    if (textValue !== minifiedCSS) {
                                        editor.setTextValue(minifiedCSS).reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                        utils.alertNote('Your code has been minified' + noteForUndo, 5000);
                                    } else {
                                        utils.alertNote('Your code is already minified', 5000);
                                    }
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'tweet',
                            title: 'Tweet',
                            uniqCls: 'magicss-tweet',
                            href: 'http://twitter.com/intent/tweet?url=https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol&text=' + extLib.TR('Extension_Name', 'MagiCSS - live editor for CSS and LESS') + ' ... web devs check it out!&via=webextensions'
                        },
                        {
                            name: 'gist',
                            title: 'Gist and Mail code',
                            uniqCls: 'magicss-email',
                            onclick: function (evt, editor) {
                                createGistAndEmail(editor.getTextValue());
                                editor.focus();
                            }
                        },
                        {
                            name: 'github-repo',
                            title: 'Contribute / Report issue',
                            cls: 'magicss-github-repo',
                            uniqCls: 'magicss-github-repo',
                            href: 'https://github.com/webextensions/live-css-editor'
                        },
                        (function () {
                            if (executionCounter < 50) {
                                return null;
                            } else {
                                return {
                                    name: 'rate-on-webstore',
                                    title: 'Rate us on Chrome Web Store',
                                    cls: 'magicss-rate-on-webstore',
                                    uniqCls: 'magicss-rate-on-webstore',
                                    href: 'https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol/reviews'
                                };
                            }
                        }())
                    ],
                    footer: function ($) {
                        var $footerItems = $('<div></div>'),
                            $status = $('<div class="magicss-status"></div>');
                        $footerItems.append($status);
                        return $footerItems;
                    },
                    events: {
                        launched: function (editor) {
                            utils.addStyleTag({
                                cssText: (
                                    // Setting display style for UI components generated using this extension
                                    '#' + id + ','
                                    + 'html>body #' + id
                                    + '{'
                                        + 'display: block;'
                                    + '}'
                                ),
                                parentTag: 'body'
                            });

                            window.setTimeout(function () {
                                fnApplyTextAsCSS(editor);
                            }, 750);

                            utils.addStyleTag({
                                cssText: (
                                    // Setting display style for UI components generated using this extension
                                    '#' + id + ' .cancelDragHandle'
                                    + '{'
                                        + 'cursor: default;'
                                    + '}'
                                ),
                                parentTag: 'body'
                            });

                            var languageMode = editor.userPreference('language-mode');
                            if (languageMode === 'less') {
                                $(editor.container).addClass('magicss-selected-mode-less');
                            } else {
                                $(editor.container).addClass('magicss-selected-mode-css');
                            }
                        },
                        reInitialized: function (editor, cfg) {
                            cfg = cfg || {};
                            var duration = cfg.animDuration,
                                targetWidth = cfg.targetWidth,
                                targetHeight = cfg.targetHeight;
                            $('#' + id + ' .CodeMirror').animate(
                                {
                                    'width': targetWidth,
                                    'height': targetHeight
                                },
                                duration,
                                function () {
                                    editor.saveDimensions({width: targetWidth, height: targetHeight});
                                    editor.bringCursorToView({pleaseIgnoreCursorActivity: true});
                                    editor.disableEnableCSS('disable');
                                }
                            );
                        },
                        beforehide: function (editor) {
                            if (editor.styleHighlightingSelector) {
                                editor.styleHighlightingSelector.cssText = '';
                                editor.styleHighlightingSelector.applyTag();
                            }
                        },
                        afterhide: function () {
                            // currently doing nothing
                        },
                        delayedcursormove: function (editor) {
                            var cssClass = processSplitText(editor.splitTextByCursor());
                            if (!cssClass) {
                                utils.alertNote.hide();
                            }

                            if (!editor.styleHighlightingSelector) {
                                editor.styleHighlightingSelector = new utils.StyleTag({
                                    id: 'magicss-higlight-by-selector',
                                    parentTag: 'body',
                                    overwriteExistingStyleTagWithSameId: true
                                });
                            }

                            if (cssClass) {
                                editor.styleHighlightingSelector.cssText = cssClass + '{outline: 1px dashed red !important;}';
                            } else {
                                editor.styleHighlightingSelector.cssText = '';
                            }
                            editor.styleHighlightingSelector.applyTag();
                        },
                        keyup: function () {
                            // Currently doing nothing
                        },
                        delayedtextchange: function (editor) {
                            fnApplyTextAsCSS(editor);
                        },
                        clear: function (editor) {
                            fnApplyTextAsCSS(editor);
                        }
                    }
                };

                var fnReturnClass = function (splitText) {
                    var strBeforeCursor = splitText.strBeforeCursor,
                        strAfterCursor = splitText.strAfterCursor;

                    if (
                        (strBeforeCursor.substr(-1) === '/' && strAfterCursor.substr(0,1) === '*') ||
                        (strBeforeCursor.substr(-1) === '*' && strAfterCursor.substr(0,1) === '/')
                    ) {
                        return '';
                    }

                    var atSelector = true;
                    for (var i = strBeforeCursor.length; i >= 0; i--) {
                        if (
                            strBeforeCursor.charAt(i-1) === '{' ||
                            (strBeforeCursor.charAt(i-1) === '*' && strBeforeCursor.charAt(i-2) === '/')
                        ) {
                            atSelector = false;
                            break;
                        } else if (
                            strBeforeCursor.charAt(i-1) === ',' ||
                            strBeforeCursor.charAt(i-1) === '}' ||
                            strBeforeCursor.charAt(i-1) === '/'
                        ) {
                            atSelector = true;
                            break;
                        }
                    }

                    if (atSelector) {   // Positioned at a selector
                        // do nothing
                    } else {            // Not positioned at a selector
                        return '';
                    }

                    for (var j = 0; j <= strAfterCursor.length; j++) {
                        var charJ = strAfterCursor.charAt(j-1),
                            charJNext = strAfterCursor.charAt(j);
                        if (
                            charJ === ',' ||
                            charJ === '{' ||
                            charJ === '}' ||
                            (charJ === '*' && charJNext === '\/') ||
                            (charJ === '\/' && charJNext === '*')
                        ) {
                            break;
                        }
                    }

                    var cssClass = strBeforeCursor.substring(i) + strAfterCursor.substring(0, j - 1);
                    cssClass = jQuery.trim(cssClass);

                    if (cssClass) {
                        var count;

                        try {
                            count = $(cssClass).length;
                        } catch (e) {
                            return '';
                        }

                        var trunc = function (str, limit) {
                            if (str.length > limit) {
                                var separator = ' ... ';
                                str = str.substr(0, limit / 2) + separator + str.substr(separator.length + str.length - limit / 2);
                            }
                            return str;
                        };

                        if (count) {
                            utils.alertNote(trunc(cssClass, 100) + '&nbsp; &nbsp;<span style="font-weight:normal;">(' + count + ' match' + ((count === 1) ? '':'es') + ')</span>', 2500);
                        } else {
                            utils.alertNote(trunc(cssClass, 100) + '&nbsp; &nbsp;<span style="font-weight:normal;">(No matches)</span>', 2500);
                        }
                    }

                    return cssClass;
                };

                var processSplitText = function (splitText) {
                    if (getLanguageMode() === 'less') {
                        if (!smc) {
                            return '';
                        }

                        var beforeCursor = splitText.strBeforeCursor,
                            rowNumber = (beforeCursor.match(/\n/g) || []).length,
                            columnNumber = beforeCursor.substr(beforeCursor.lastIndexOf('\n') + 1).length,
                            generatedPosition = smc.generatedPositionFor({
                                source: 'input',
                                line: rowNumber + 1,  // Minimum value is 1 for line
                                column: columnNumber  // Minimum value is 0 for column
                            });

                        var cssCode = newStyleTag.cssText,
                            cssTextInLines = cssCode.split('\n'),
                            strFirstPart,
                            strLastPart;
                        if (generatedPosition.line) {
                            cssTextInLines = cssTextInLines.splice(0, generatedPosition.line);
                            var lastItem = cssTextInLines[cssTextInLines.length - 1];
                            cssTextInLines[cssTextInLines.length - 1] = lastItem.substr(0, generatedPosition.column);
                            strFirstPart = cssTextInLines.join('\n');
                            strLastPart = newStyleTag.cssText.substr(strFirstPart.length);
                            return fnReturnClass({
                                strBeforeCursor: strFirstPart,
                                strAfterCursor: strLastPart
                            });
                        } else {
                            return '';
                        }
                    } else {
                        return fnReturnClass(splitText);
                    }
                };

                class StylesEditor extends window.Editor {
                    indicateEnabledDisabled(enabledDisabled) {
                        if (enabledDisabled === 'enabled') {
                            $(this.container).removeClass('indicate-disabled').addClass('indicate-enabled');
                        } else {
                            $(this.container).removeClass('indicate-enabled').addClass('indicate-disabled');
                        }
                    }

                    disableEnableCSS(doWhat) {
                        newStyleTag.disabled = doWhat === 'disable';
                        newStyleTag.applyTag();

                        if (doWhat === 'disable') {
                            this.indicateEnabledDisabled('disabled');
                            utils.alertNote('Deactivated the code', 5000);
                        } else {
                            this.indicateEnabledDisabled('enabled');
                            utils.alertNote('Activated the code', 5000);
                        }
                    }
                }

                window.MagiCSSEditor = new StylesEditor(options);

                if (executionCounter && !isNaN(executionCounter)) {
                    try {
                        chromeStorage.set({'magicss-execution-counter': executionCounter}, function() {
                            // do nothing
                        });
                    } catch (e) {
                        // do nothing
                    }
                }
            }
        });
    };

    var executionCounter = 0;
    try {
        var chromeStorage = chrome.storage.sync;
        chromeStorage.get('magicss-execution-counter', function (values) {
            try {
                executionCounter = parseInt(values['magicss-execution-counter'], 10);
                executionCounter = isNaN(executionCounter) ? 0 : executionCounter;
                executionCounter = executionCounter < 0 ? 0 : executionCounter;
                executionCounter++;
            } catch (e) {
                // do nothing
            }
            main();
        });
    } catch (e) {
        main();
    }
}(jQuery));

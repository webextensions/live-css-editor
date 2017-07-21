/*globals jQuery, less, utils, sourceMap, chrome, CodeMirror */

/*! https://webextensions.org/ by Priyank Parashar | MIT license */

// TODO: Share constants across files (like magicss.js, editor.js and options.js) (probably keep them in a separate file as global variables)
var USER_PREFERENCE_AUTOCOMPLETE_SELECTORS = 'autocomplete-css-selectors';

(function($){
    var chromeStorage;
    try {
        chromeStorage = chrome.storage.sync || chrome.storage.local;
    } catch (e) {
        // do nothing
    }

    if (window.MagiCSSEditor) {
        window.MagiCSSEditor.reposition();      // 'Magic CSS window is already there. Repositioning it.'
        return;
    }

    // for HTML frameset pages, this value would be 'FRAMESET'
    // chrome.tabs.executeScript uses allFrames: true, to run inside all frames
    if (document.body.tagName !== 'BODY') {
        return;
    }

    var ellipsis = function (str, limit) {
        limit = limit || 12;
        return (str.length <= limit) ? str : (str.substring(0, limit - 3) + '...');
    };

    var reloadCSSInPage = function () {
        // http://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset/28149561#28149561
        var tzoffset = (new Date()).getTimezoneOffset() * 60000, //offset in milliseconds
            localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
        localISOTime = localISOTime.slice(0, -4).replace('T', '_');

        // The disabled <link> tags are not loaded when href is changed, so don't include them
        // Don't include the elements which don't have a value set for href
        var $links = $('link[rel~="stylesheet"]:not([disabled])').filter(function () {
            if (this.reloadingActiveWithMagicCSS) {
                return false;
            }
            if (!$(this).attr('href')) {
                return false;
            }
            return true;
        });

        var successCount = 0,
            errorCount = 0;
        var checkCompletion = function () {
            utils.alertNote(htmlEscape('Reloading active CSS <link> tags.') + '<br/>Success: ' + successCount + '/' + $links.length);
            if ($links.length === successCount + errorCount) {
                setTimeout(function () {
                    if (errorCount) {
                        if (errorCount === 1) {
                            utils.alertNote(htmlEscape(errorCount + ' of the CSS <link> tag failed to reload.') + '<br/>Please check availability of the CSS resources included in this page.');
                        } else {
                            utils.alertNote(htmlEscape(errorCount + ' of the CSS <link> tags failed to reload.') + '<br/>Please check availability of the CSS resources included in this page.');
                        }
                    } else {
                        utils.alertNote(htmlEscape('All active CSS <link> tags got reloaded successfully :-)'));
                    }
                }, 750);

                var tagsToExclude = jQuery.makeArray(jQuery('[data-style-created-by="magicss"]'));
                updateExistingCSSSelectorsAndAutocomplete(tagsToExclude);
            }
        };
        if ($links.length) {
            checkCompletion();
            $links.each(function () {
                var link = this,
                    $link = $(link),
                    href = $link.attr('href');
                if (href.indexOf('reloadedAt=') >= 0) {
                    href = href.replace(/[?&]reloadedAt=[\d-_:]+/, '');
                }
                var newHref;
                if (href.indexOf('?') >= 0) {
                    newHref = href + '&reloadedAt=' + localISOTime;
                } else {
                    newHref = href + '?reloadedAt=' + localISOTime;
                }

                var $newLink = $link.clone(),
                    newLink = $newLink.get(0);
                newLink.onload = function () {
                    delete newLink.reloadingActiveWithMagicCSS;
                    delete link.reloadingActiveWithMagicCSS;
                    $link.remove();
                    successCount++;
                    checkCompletion();
                };
                newLink.onerror = function () {
                    delete newLink.reloadingActiveWithMagicCSS;
                    delete link.reloadingActiveWithMagicCSS;
                    $newLink.remove();
                    errorCount++;
                    checkCompletion();
                };

                newLink.reloadingActiveWithMagicCSS = true;
                link.reloadingActiveWithMagicCSS = true;

                $newLink.attr('href', newHref);
                $link.after($newLink);
            });
        } else {
            utils.alertNote(htmlEscape('There are no active CSS <link> tags to be reloaded.'));
        }
    };

    var getExistingCSSSelectors = function (tagsToExclude) {
        tagsToExclude = tagsToExclude || [];
        var selectorsOb = {};
        var handleErrorInReadingCSS = function (e) {
            if (e.name === 'SecurityError') {   // This may happen due to cross-domain CSS resources
                // do nothing
            } else {
                console.log(
                    'If you are seeing this message, it means that Magic CSS extension encountered an unexpected error' +
                    ' when trying to read the list of existing CSS selectors.' +
                    '\n\nDon\'t worry :-) This would not cause any issue at all in usage of this extension.' +
                    ' But we would be glad if you report about this error message at https://github.com/webextensions/live-css-editor/issues' +
                    ' so that we can investigate this minor bug and provide better experience for you and other web developers.'
                );
            }
        };

        try {
            var styleSheets = document.styleSheets;
            var getCSSSelectorsRecursively = function (cssRules, includeMediaTitle) {
                var cssSelectors = [];
                for (var i = 0; i < cssRules.length; i++) {
                    var cssRule = cssRules[i] || {};
                    if (cssRule.selectorText) {
                        var selectorsFound = cssRule.selectorText.split(', ');
                        for (var j = 0; j < selectorsFound.length; j++) {
                            // cssSelectors.push(selectorsFound[j]);
                            cssSelectors.push({
                                selector: selectorsFound[j],
                                source: cssRule.parentStyleSheet.href ||
                                    (cssRule.parentStyleSheet.ownerNode.tagName === 'STYLE' && '<style> tag') ||
                                    ''
                            });
                        }
                    }
                    if (includeMediaTitle && cssRule instanceof CSSMediaRule) {
                        cssSelectors.push(cssRule.cssText.substring(0, cssRule.cssText.indexOf('{')).trim());
                    }
                    if ((cssRule.styleSheet || {}).cssRules) {
                        cssSelectors = cssSelectors.concat(getCSSSelectorsRecursively(cssRule.styleSheet.cssRules, includeMediaTitle));
                    }
                    if (cssRule.cssRules) {
                        cssSelectors = cssSelectors.concat(getCSSSelectorsRecursively(cssRule.cssRules, includeMediaTitle));
                    }
                }
                return cssSelectors;
            };

            for (var i = 0; i < styleSheets.length; i++) {
                var styleSheet = styleSheets[i];

                var shouldTagBeExcluded = tagsToExclude.some(function (tagsToExclude) {
                    if (styleSheet.ownerNode === tagsToExclude) {
                        return true;
                    }
                });
                if (shouldTagBeExcluded) {
                    continue;
                }

                var cssRules;
                try {
                    cssRules = (styleSheet || {}).cssRules;
                } catch (e) {
                    handleErrorInReadingCSS(e);
                }
                cssRules = cssRules || [];

                var cssSelectors = getCSSSelectorsRecursively(cssRules, true);
                cssSelectors.forEach(function (cssSelector) {
                    selectorsOb[cssSelector.selector] = selectorsOb[cssSelector.selector] || [];
                    if (selectorsOb[cssSelector.selector].indexOf(cssSelector.source) === -1) {
                        selectorsOb[cssSelector.selector].push(cssSelector.source);
                    }
                });
            }
        } catch (e) {
            handleErrorInReadingCSS(e);
            return {};
        }

        return selectorsOb;
    };

    var existingCSSSelectorsWithAutocompleteObjects = {};
    var updateExistingCSSSelectorsAndAutocomplete = function (tagsToExclude) {
        window.existingCSSSelectors = getExistingCSSSelectors(tagsToExclude);

        existingCSSSelectorsWithAutocompleteObjects = $.extend(true, {}, window.existingCSSSelectors);
        Object.keys(existingCSSSelectorsWithAutocompleteObjects).forEach(function (key) {
            var sources = '';
            existingCSSSelectorsWithAutocompleteObjects[key].forEach(function (source) {
                if (sources !== '') {
                    sources += ', ';
                }
                sources += ellipsis(
                    source
                        .replace(/[?&]reloadedAt=[\d-_:]+/, '')
                        .substr(source.lastIndexOf('/') + 1),
                    50
                );
            });

            existingCSSSelectorsWithAutocompleteObjects[key] = {
                sources: sources,
                originalSelector: key,
                text: key
            };
        });
    };
    updateExistingCSSSelectorsAndAutocomplete();

    var isChrome = false,
        isEdge = false,
        isFirefox = false,
        isOpera = false;
    if (/Edge/.test(navigator.appVersion)) {            // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
        isEdge = true;
    } else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
        isOpera = true;
    } else if (/Chrome/.test(navigator.appVersion)) {
        isChrome = true;
    } else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
        isFirefox = true;
    }

    var extensionUrl = {
        chrome: 'https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol',
        edge: 'https://www.microsoft.com/store/p/live-editor-for-css-and-less-magic-css/9nzmvhmw5md1',
        firefox: 'https://addons.mozilla.org/firefox/addon/live-editor-for-css-and-less/',
        opera: 'https://addons.opera.com/extensions/details/live-editor-for-css-and-less-magic-css/'
    };
    extensionUrl.forThisBrowser = (function () {
        if (isEdge)         { return extensionUrl.edge;    }
        else if (isFirefox) { return extensionUrl.firefox; }
        else if (isOpera)   { return extensionUrl.opera;   }
        else                { return extensionUrl.chrome;  }
    }());

    var strCreatedVia = 'Created via Magic CSS extension';
    if (isChrome) {
        strCreatedVia += ' for Chrome - ' + extensionUrl.chrome;
    } else if (isEdge) {
        strCreatedVia += ' for Edge - ' + extensionUrl.edge;
    } else if (isFirefox) {
        strCreatedVia += ' for Firefox - ' + extensionUrl.firefox;
    } else if (isOpera) {
        strCreatedVia += ' for Opera - ' + extensionUrl.opera;
    }
    var createGist = function (text, languageMode, cb) {
        var files = {};
        files[languageMode === 'less' ? 'styles.less' : 'styles.css'] = {
            "content": text + '\r\n\r\n/* ' + strCreatedVia + ' */\r\n'
        };
        $.ajax({
            url: 'https://api.github.com/gists',
            type: 'POST',
            timeout: 20000,
            contentType: 'application/json',
            data: JSON.stringify({
                "description": window.location.origin + ' - via Magic CSS extension' + (function () {
                    if (isChrome) {
                        return ' for Chrome - ' + extensionUrl.chrome;
                    } else if (isEdge) {
                        return ' for Edge - ' + extensionUrl.edge;
                    } else if (isFirefox) {
                        return ' for Firefox - ' + extensionUrl.firefox;
                    } else if (isOpera) {
                        return ' for Opera - ' + extensionUrl.opera;
                    }
                    return '';
                }()),
                "public": true,
                "files": files
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
        return function (text, languageMode) {
            text = $.trim(text);
            if (text === '') {
                utils.alertNote('Please type some code to be shared', 5000);
            } else if (lastMailedValue === text) {
                utils.alertNote(lastSuccessNote, 20000);
            } else {
                var wishToContinue = window.confirm('The code you have entered would be uploaded to\n        https://gist.github.com/\nand a link would be generated for sharing.\n\nDo you wish to continue?');
                if (!wishToContinue) {
                    return;
                }
                createGist(text, languageMode, function (gistUrl) {
                    var anchor = '<a target="_blank" href="' + gistUrl + '">' + gistUrl + '</a>';
                    lastMailedValue = text;
                    lastSuccessNote = 'The GitHub Gist was successfully created: ' +
                        anchor +
                        '<br/>Share code: <a href="' + 'mailto:?subject=Use this code for styling - ' + gistUrl + '&body=' +
                        encodeURIComponent(text.replace(/\t/g,'  ').substr(0,140) + '\r\n...\r\n...\r\n\r\n' + gistUrl + '\r\n\r\n-- ' + strCreatedVia + '') +
                        '">Send e-mail</a>';
                    utils.alertNote(lastSuccessNote, 10000);
                });
                utils.alertNote('Request initiated. It might take a few moments. Please wait.', 5000);
            }
        };
    }());

    var htmlEscape = function (str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    var showCSSSelectorMatches = function (cssSelector, editor) {
        var cssSelectorString = (cssSelector && cssSelector.originalSelector) || cssSelector;
        if (!cssSelectorString) {
            utils.alertNote.hide();
        }

        if (!editor.styleHighlightingSelector) {
            editor.styleHighlightingSelector = new utils.StyleTag({
                id: 'magicss-higlight-by-selector',
                parentTag: 'body',
                attributes: [{
                    name: 'data-style-created-by',
                    value: 'magicss'
                }],
                overwriteExistingStyleTagWithSameId: true
            });
        }

        if (cssSelectorString) {
            // Helps in highlighting SVG elements
            editor.styleHighlightingSelector.cssText = cssSelectorString + '{outline: 1px dashed red !important; fill: red !important; }';
        } else {
            editor.styleHighlightingSelector.cssText = '';
        }
        editor.styleHighlightingSelector.applyTag();

        if (cssSelectorString) {
            var count;

            try {
                count = $(cssSelectorString).not('#MagiCSS-bookmarklet, #MagiCSS-bookmarklet *, #topCenterAlertNote, #topCenterAlertNote *').length;
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

            var cssSelectorToShow = htmlEscape(trunc(cssSelectorString, 100));
            var sourcesToShow = (cssSelector && cssSelector.sources) ? ('<br /><span style="color:#888">Source: <span style="font-weight:normal;">' + htmlEscape(cssSelector.sources) + '</span></span>') : '';
            if (count) {
                utils.alertNote(cssSelectorToShow + '&nbsp; &nbsp;<span style="font-weight:normal">(' + count + ' match' + ((count === 1) ? '':'es') + ')</span>' + sourcesToShow, 2500);
            } else {
                utils.alertNote(cssSelectorToShow + '&nbsp; &nbsp;<span style="font-weight:normal;">(No matches)</span>' + sourcesToShow, 2500);
            }
        }
    };

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

    var enablePointAndClick = false;
    var enablePointAndClickFunctionality = function (editor) {
        enablePointAndClick = true;
        $(editor.container).addClass('magicss-point-and-click-activated');
    };
    var disablePointAndClickFunctionality = function (editor) {
        enablePointAndClick = false;
        $(editor.container).removeClass('magicss-point-and-click-activated');
    };

    var enableAutocompleteSelectors = function (editor) {
        $(editor.container).removeClass('magicss-autocomplete-selectors-disabled').addClass('magicss-autocomplete-selectors-enabled');
    };

    var disableAutocompleteSelectors = function (editor) {
        $(editor.container).removeClass('magicss-autocomplete-selectors-enabled').addClass('magicss-autocomplete-selectors-disabled');
    };

    var highlightErroneousLineTemporarily = function (editor, errorInLine) {
        var lineHandle = editor.cm.addLineClass(errorInLine, 'background', 'line-has-less-error-transition-effect');
        editor.cm.addLineClass(errorInLine, 'background', 'line-has-less-error');
        var duration = 2000;
        setTimeout(function () {
            editor.cm.removeLineClass(lineHandle, 'background', 'line-has-less-error');
            setTimeout(function () {
                editor.cm.removeLineClass(lineHandle, 'background', 'line-has-less-error-transition-effect');
            }, 500);   /* 500ms delay matches the transition duration specified for the CSS selector ".line-has-less-error-transition-effect" */
        }, duration);
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
                var beautifyCSS = function (cssCode) {
                    var options = {};
                    if (window.MagiCSSEditor.userPreference('use-tab-for-indentation') === 'yes') {
                        options.useTabs = true;
                    } else {
                        options.useSpaceCount = parseInt(window.MagiCSSEditor.userPreference('indentation-spaces-count'), 10) || 4;
                    }
                    return utils.beautifyCSS(cssCode, options);
                };

                var currentNode = null;
                $(document).on('mousemove', function(event) {
                    if (!enablePointAndClick) {
                        return;
                    }

                    if ($(event.target) !== currentNode) {
                        currentNode = $(event.target);

                        if ($(currentNode).hasClass('magicss-mouse-over-dom-element')) {
                            // do nothing
                        } else {
                            $('.magicss-mouse-over-dom-element').removeClass('magicss-mouse-over-dom-element');
                            if (currentNode.get(0) !== $('#MagiCSS-bookmarklet').get(0) && !$(currentNode).parents('#MagiCSS-bookmarklet').length) {
                                $(currentNode).addClass('magicss-mouse-over-dom-element');
                            }
                        }
                    }
                });

                $(document).on('mousedown', function(evt) {
                    if (evt.which !== 1) {      // If it is not left click
                        return;
                    }
                    if (!enablePointAndClick) {
                        return;
                    } else {
                        if ($(evt.target).hasClass('magicss-point-and-click')) {
                            // do nothing
                        } else {
                            disablePointAndClickFunctionality(window.MagiCSSEditor);
                        }
                    }

                    var currentNode = $(evt.target);
                    if (currentNode.get(0) === $('#MagiCSS-bookmarklet').get(0) || $(currentNode).parents('#MagiCSS-bookmarklet').length) {
                        return;
                    }

                    var $div = $('<div></div>');
                    $('body').append($div);
                    $div.attr('class', 'magicss-block-click');
                    $div.css('position', 'fixed');
                    $div.css('background-color', 'rgba(0,0,0,0)');
                    $div.css('z-index', '2147483647');
                    $div.css('width', '100%');
                    $div.css('height', '100%');
                    $div.css('left', '0px');
                    $div.css('top', '0px');

                    $('.magicss-mouse-over-dom-element').removeClass('magicss-mouse-over-dom-element');
                    $div.on('mouseup', function () {
                        $div.remove();
                    });

                    var targetElement = evt.target;
                    setTimeout(function () {
                        var selector = window.generateFullSelector(targetElement);
                        var workingSetOfSelectors = $.extend({}, window.existingCSSSelectors);

                        var matchAll = function (fullSelector, smallSelector) {
                            var tokens = smallSelector.split('.').join(' ').split('#').join(' ').split(' ');
                            var tokenNotAvailable = tokens.some(function tokenNotInFullSelector(token) {
                                return fullSelector.indexOf(token) === -1;
                            });
                            if (tokenNotAvailable === false) {
                                return true;
                            }
                        };

                        var matchingSelectors = [];

                        var suggestedSelectors = [];
                        try {
                            suggestedSelectors = [
                                window.generateSelector(targetElement),
                                window.generateSelector(targetElement, {reverseClasses: true}),
                                window.generateSelector(targetElement, {sortClasses: true}),
                                window.generateSelector(targetElement, {sortClasses: true, reverseClasses: true})
                            ];
                        } catch (e) {
                            var errorMessage = 'Sorry! Magic CSS encountered an error in generating CSS selector!<br />Kindly report this issue at <a target="_blank" href="https://github.com/webextensions/live-css-editor/issues">GitHub repository for Magic CSS</a>';
                            // Kind of HACK: Show note after a timeout, otherwise the note about matching existing selector might open up and override this
                            //               and trying to solve it without timeout would be a bit tricky because currently, in CodeMirror, the select event
                            //               always gets fired
                            setTimeout(function() { utils.alertNote(errorMessage, 10000); }, 0);
                            console.log(errorMessage);
                            console.log(e);     // The user might wish to add these detais for the report/issue in GitHub about this error.
                        }
                        suggestedSelectors = suggestedSelectors.filter(function(item, pos, self) {
                            return self.indexOf(item) == pos;
                        });

                        matchingSelectors = matchingSelectors.concat(suggestedSelectors);

                        Object.keys(workingSetOfSelectors).forEach(function (key) {
                            var existingSelector = key;
                            var matchesAll = matchAll(selector, existingSelector);
                            if (matchesAll) {
                                if ($(targetElement).is(existingSelector)) {
                                    if (matchingSelectors.indexOf(existingSelector) === -1) {
                                        matchingSelectors.push(existingSelector);
                                    }
                                }
                            }
                        });

                        var cm = window.MagiCSSEditor.cm;

                        var currentLine = cm.getLine(cm.getCursor().line);
                        var whitespaceCharactersInCurrentLine = ((currentLine.match(/^\s+/g)) || [''])[0];

                        var originalCursorPosition = cm.getCursor();
                        var anyCharacterAfterCurrentCursorPosition = true;
                        var anyNonWhitespaceCharacterBeforeCurrentCursorPosition = true;

                        var indexOfFirstNonWhitespaceCharacter = currentLine.length - currentLine.trimLeft().length;
                        if (indexOfFirstNonWhitespaceCharacter >= originalCursorPosition.ch) {
                            anyNonWhitespaceCharacterBeforeCurrentCursorPosition = false;
                        }
                        if (originalCursorPosition.ch === currentLine.length) {
                            anyCharacterAfterCurrentCursorPosition = false;
                        }

                        var useTabs = window.MagiCSSEditor.userPreference('use-tab-for-indentation') === 'yes';
                        var whitespaceToAdd;
                        if (useTabs) {
                            whitespaceToAdd = '\t';
                        } else {
                            var indentationSpacesCount = parseInt(window.MagiCSSEditor.userPreference('indentation-spaces-count'), 10);
                            whitespaceToAdd = ' '.repeat(indentationSpacesCount || 4);
                        }

                        var extraSpaces = whitespaceCharactersInCurrentLine;
                        for (let i = 0; i < matchingSelectors.length; i++) {
                            matchingSelectors[i] = {
                                displayText: matchingSelectors[i],
                                originalSelector: matchingSelectors[i],
                                sources: (function () {
                                    var sources = [];
                                    if (suggestedSelectors.indexOf(matchingSelectors[i]) >= 0) {
                                        sources.push('Suggested by Magic CSS');
                                    }

                                    if (window.existingCSSSelectors[matchingSelectors[i]]) {
                                        sources = sources.concat(window.existingCSSSelectors[matchingSelectors[i]]);
                                    }

                                    return sources;
                                }()),
                                text: (anyNonWhitespaceCharacterBeforeCurrentCursorPosition ? ('\n' + extraSpaces) : '') +
                                    matchingSelectors[i] + ' {' +
                                    '\n' + extraSpaces + whitespaceToAdd +
                                    '\n' + extraSpaces + '}' +
                                    (anyCharacterAfterCurrentCursorPosition ? ('\n' + extraSpaces) : '')
                            };
                        }

                        for (let i = 0; i < matchingSelectors.length; i++) {
                            var sources = '';
                            matchingSelectors[i].sources.forEach(function (source) {
                                if (sources !== '') {
                                    sources += ', ';
                                }
                                sources += ellipsis(source.substr(source.lastIndexOf('/') + 1), 50);
                            });

                            matchingSelectors[i].sources = sources;
                        }

                        if (cm.showHint) {
                            cm.focus();

                            var ob = {
                                from: cm.getDoc().getCursor(),
                                to: cm.getDoc().getCursor(),
                                list: matchingSelectors
                            };

                            CodeMirror.on(ob, 'select', function (selectedTextOb) {
                                showCSSSelectorMatches(selectedTextOb, window.MagiCSSEditor);
                            });

                            CodeMirror.on(ob, 'pick', function () {
                                var cursorPos = cm.getCursor();
                                if (anyCharacterAfterCurrentCursorPosition) {
                                    cm.setCursor({ line: cursorPos.line - 2 });
                                } else {
                                    cm.setCursor({ line: cursorPos.line - 1 });
                                }
                            });

                            CodeMirror.on(ob, 'close', function () {
                                window.MagiCSSEditor.styleHighlightingSelector.cssText = '';
                                window.MagiCSSEditor.styleHighlightingSelector.applyTag();
                            });

                            cm.showHint({
                                hint: function() {
                                    return ob;
                                }
                            });
                        }
                    });
                    return false;
                });

                var csSpec = CodeMirror.resolveMode('text/css'),
                    cssPropertyKeywords = csSpec.propertyKeywords,
                    cssPropertyKeywordsAutocompleteObject = {};
                Object.keys(cssPropertyKeywords).forEach(function (key) {
                    cssPropertyKeywordsAutocompleteObject[key] = {
                        displayText: key,
                        text: key + ': '
                    };
                });

                // Don't let mouse scroll on CodeMirror hints pass on to the parent elements
                // http://stackoverflow.com/questions/5802467/prevent-scrolling-of-parent-element/16324762#16324762
                $(document).on('DOMMouseScroll mousewheel', '.CodeMirror-hints', function(ev) {
                    var $this = $(this),
                        scrollTop = this.scrollTop,
                        scrollHeight = this.scrollHeight,
                        height = $this.innerHeight(),
                        delta = (ev.type == 'DOMMouseScroll' ?
                            ev.originalEvent.detail * -40 :
                            ev.originalEvent.wheelDelta),
                        up = delta > 0;

                    var prevent = function() {
                        ev.stopPropagation();
                        ev.preventDefault();
                        ev.returnValue = false;
                        return false;
                    };

                    if (!up && -delta > scrollHeight - height - scrollTop) {
                        // Scrolling down, but this will take us past the bottom.
                        $this.scrollTop(scrollHeight);
                        return prevent();
                    } else if (up && delta > scrollTop) {
                        // Scrolling up, but this will take us past the top.
                        $this.scrollTop(0);
                        return prevent();
                    }
                });

                var smc;

                var id = 'MagiCSS-bookmarklet',
                    newStyleTagId = id + '-html-id',
                    newStyleTag = new utils.StyleTag({
                        id: newStyleTagId,
                        parentTag: 'body',
                        attributes: [{
                            name: 'data-style-created-by',
                            value: 'magicss'
                        }],
                        overwriteExistingStyleTagWithSameId: true
                    });

                var fnApplyTextAsCSS = function (editor) {
                    var disabled = false;
                    if (editor.userPreference('disable-styles') === 'yes') {
                        disabled = true;
                    }

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
                                    highlightErroneousLineTemporarily(editor, err.line - 1);
                                }, 0);
                            } else {
                                var strCssCode = output.css;
                                newStyleTag.cssText = strCssCode;
                                newStyleTag.disabled = disabled;
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
                        newStyleTag.disabled = disabled;
                        newStyleTag.applyTag();
                    }
                };

                var setLanguageMode = function (languageMode, editor) {
                    if (languageMode === 'less') {
                        $(editor.container).removeClass('magicss-selected-mode-css').addClass('magicss-selected-mode-less');
                        editor.userPreference('language-mode', 'less');
                        setCodeMirrorCSSLinting(editor.cm, 'disable');
                        utils.alertNote('Now editing code in LESS mode', 5000);
                    } else {
                        $(editor.container).removeClass('magicss-selected-mode-less').addClass('magicss-selected-mode-css');
                        editor.userPreference('language-mode', 'css');
                        utils.alertNote('Now editing code in CSS mode', 5000);
                    }
                    fnApplyTextAsCSS(editor);
                };

                var getLanguageMode = function () {
                    return $('#' + id).hasClass('magicss-selected-mode-css') ? 'css' : 'less';
                };

                var getMagicCSSForChrome = null,
                    getMagicCSSForEdge = null,
                    getMagicCSSForFirefox = null;
                if (!isChrome) {
                    getMagicCSSForChrome = {
                        name: 'get-magic-css-for-chrome',
                        title: 'Magic CSS for Chrome',
                        uniqCls: 'get-magic-css-for-chrome',
                        href: extensionUrl.chrome
                    };
                }
                if (!isEdge) {
                    getMagicCSSForEdge = {
                        name: 'get-magic-css-for-edge',
                        title: 'Magic CSS for Edge',
                        uniqCls: 'get-magic-css-for-edge',
                        href: extensionUrl.edge
                    };
                }
                if (!isFirefox) {
                    getMagicCSSForFirefox = {
                        name: 'get-magic-css-for-firefox',
                        title: 'Magic CSS for Firefox',
                        uniqCls: 'get-magic-css-for-firefox',
                        href: extensionUrl.firefox
                    };
                }

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
                            editor.focus();
                        });
                        $(document).on('click', '.magicss-mode-less', function () {
                            setLanguageMode('less', editor);
                            editor.focus();
                        });
                        $(document).on('click', '.magicss-mode-switch', function () {
                            if ($('#' + id).hasClass('magicss-selected-mode-css')) {
                                setLanguageMode('less', editor);
                            } else {
                                setLanguageMode('css', editor);
                            }
                            editor.focus();
                        });

                        return $outer;
                    },
                    placeholder: 'Shortcut: Alt + Shift + C' + '\n\nWrite your LESS/CSS code here.\nThe code gets applied immediately.\n\nExample:' + '\nimg {\n    opacity: 0.5;\n}',
                    codemirrorOptions: {
                        mode: 'text/x-less',
                        colorpicker: {
                            mode: 'edit'
                        },
                        autoCloseBrackets: true,
                        hintOptions: {
                            completeSingle: false,
                            // closeCharacters: /[\s()\[\]{};:>,]/,     // This is the default value defined in show-hint.js
                            closeCharacters: /[(){};:,]/,               // Custom override
                            onAddingAutoCompleteOptionsForSelector: function (add) {
                                var editor = window.MagiCSSEditor;
                                if (editor.userPreference(USER_PREFERENCE_AUTOCOMPLETE_SELECTORS) === 'no') {
                                    return;
                                }
                                if (existingCSSSelectorsWithAutocompleteObjects) {
                                    add(existingCSSSelectorsWithAutocompleteObjects, true);
                                }
                            },
                            onAddingAutoCompleteOptionsForCSSProperty: function (add) {
                                add(cssPropertyKeywordsAutocompleteObject, true);
                            },
                            onCssHintSelectForSelector: function (selectedText) {
                                var editor = window.MagiCSSEditor;
                                showCSSSelectorMatches(selectedText, editor);
                            },
                            onCssHintShownForSelector: function () {    /* As per current CodeMirror/css-hint architecture,
                                                                           "select" is called before "shown".
                                                                           The "select" operation would also show the number  e are hiding the alertNote */
                                utils.alertNote.hide();
                            }
                        },
                        extraKeys: {
                            'Ctrl-S': function () {
                                var editor = window.MagiCSSEditor;
                                createGistAndEmail(editor.getTextValue(), getLanguageMode());
                                editor.focus();
                            },
                            'Ctrl-D': function () {
                                // TODO: Implement select-next-occurrence-of-current-selection
                                //       This link might be of some help: https://codereview.chromium.org/219583002/
                            }
                        }
                    },
                    bgColor: '68,88,174,0.85',
                    headerIcons: [
                        {
                            name: 'point-and-click',
                            title: 'Select an element in the page to generate its CSS Selector',
                            cls: 'magicss-point-and-click',
                            onclick: function (evt, editor) {
                                if (enablePointAndClick) {
                                    disablePointAndClickFunctionality(editor);
                                } else {
                                    // If currently, there is no text selection
                                    if (!editor.cm.getSelection()) {
                                        var cursorPosition = editor.cm.getCursor();
                                        // If there is any non-whitespace character before the cursor in the current line
                                        if (editor.cm.getLine(cursorPosition.line).substr(0, cursorPosition.ch).trim()) {
                                            // Move the cursor to the end of the current line
                                            // Which helps in avoiding the scenario that when the user does point-and-click,
                                            // the text insertion does not happen in the middle of the text
                                            editor.setCursor({line: cursorPosition.line}, {pleaseIgnoreCursorActivity: true});
                                        }
                                    }
                                    utils.alertNote('Select an element in the page to generate its CSS selector', 5000);
                                    enablePointAndClickFunctionality(editor);
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'beautify',
                            title: 'Beautify code',
                            cls: 'magicss-beautify magicss-gray-out',
                            onclick: function (evt, editor) {
                                var textValue = editor.getTextValue();
                                if (!textValue.trim()) {
                                    utils.alertNote('Please type some code to be beautified', 5000);
                                } else {
                                    var beautifiedCSS = beautifyCSS(textValue);
                                    if (textValue.trim() !== beautifiedCSS.trim()) {
                                        editor.setTextValue(beautifiedCSS).reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                        utils.alertNote('Your code has been beautified :-)', 5000);
                                    } else {
                                        utils.alertNote('Your code already looks beautiful :-)', 5000);
                                    }
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
                                editor.focus();
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
                            if (!isChrome) {
                                return null;
                            }
                            if (executionCounter < 25 || 50 <= executionCounter) {
                                return null;
                            } else {
                                return {
                                    name: 'rate-on-webstore',
                                    title: 'Rate us on Chrome Web Store',
                                    cls: 'magicss-rate-on-webstore',
                                    href: extensionUrl.chrome + '/reviews'
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
                                    if (!lessCode.trim()) {
                                        editor.reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                        utils.alertNote('Please type some LESS code to use this feature', 5000);
                                        editor.focus();
                                    } else {
                                        utils.lessToCSS(lessCode, function (err, cssCode) {
                                            if (err) {
                                                utils.alertNote(
                                                    'Invalid LESS syntax.' +
                                                    '<br />Error in line: ' + err.line + ' column: ' + err.column +
                                                    '<br />Error message: ' + err.message,
                                                    10000
                                                );
                                                highlightErroneousLineTemporarily(editor, err.line - 1);
                                                editor.setCursor({line: err.line - 1, ch: err.column}, {pleaseIgnoreCursorActivity: true});
                                            } else {
                                                var beautifiedLessCode = beautifyCSS(utils.minifyCSS(lessCode));
                                                cssCode = beautifyCSS(utils.minifyCSS(cssCode));

                                                if (cssCode === beautifiedLessCode) {
                                                    utils.alertNote('Your code is already CSS compatible', 5000);
                                                } else {
                                                    editor.setTextValue(cssCode).reInitTextComponent({pleaseIgnoreCursorActivity: true});
                                                    utils.alertNote('Your code has been converted from LESS to CSS :-)' + noteForUndo, 5000);
                                                }
                                            }
                                            editor.focus();
                                        });
                                    }
                                } else {
                                    utils.alertNote('Please switch to editing code in LESS mode to enable this feature', 5000);
                                    editor.focus();
                                }
                            },
                            beforeShow: function (origin, tooltip, editor) {
                                tooltip
                                    .addClass(getLanguageMode() === 'less' ? 'tooltipster-selected-mode-less' : 'tooltipster-selected-mode-css')
                                    .addClass(editor.cm.getOption('lineNumbers') ? 'tooltipster-line-numbers-enabled' : 'tooltipster-line-numbers-disabled')
                                    .addClass(editor.cm.getOption('lint') ? 'tooltipster-css-linting-enabled' : 'tooltipster-css-linting-disabled')
                                    .addClass(editor.userPreference(USER_PREFERENCE_AUTOCOMPLETE_SELECTORS) === 'no' ? 'tooltipster-autocomplete-selectors-disabled' : 'tooltipster-autocomplete-selectors-enabled');
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
                            name: 'showLineNumbers',
                            title: 'Show line numbers',
                            uniqCls: 'magicss-show-line-numbers',
                            onclick: function (evt, editor) {
                                editor.cm.setOption('lineNumbers', true);
                                editor.userPreference('show-line-numbers', 'yes');
                                editor.focus();
                            }
                        },
                        {
                            name: 'hideLineNumbers',
                            title: 'Hide line numbers',
                            uniqCls: 'magicss-hide-line-numbers',
                            onclick: function (evt, editor) {
                                editor.cm.setOption('lineNumbers', false);
                                editor.userPreference('show-line-numbers', 'no');
                                editor.focus();
                            }
                        },
                        {
                            name: 'enableCSSLinting',
                            title: 'Enable CSS linting',
                            uniqCls: 'magicss-enable-css-linting',
                            onclick: function (evt, editor) {
                                if (getLanguageMode() === 'css') {
                                    setCodeMirrorCSSLinting(editor.cm, 'enable');
                                } else {
                                    utils.alertNote('Please switch to editing code in CSS mode to enable this feature', 5000);
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'disableCSSLinting',
                            title: 'Disable CSS linting',
                            uniqCls: 'magicss-disable-css-linting',
                            onclick: function (evt, editor) {
                                if (getLanguageMode() === 'css') {
                                    setCodeMirrorCSSLinting(editor.cm, 'disable');
                                } else {
                                    utils.alertNote('Please switch to editing code in CSS mode to enable this feature', 5000);
                                }
                                editor.focus();
                            }
                        },
                        {
                            name: 'reload-css-resources',
                            title: 'Reload CSS resources',
                            uniqCls: 'magicss-reload-css-resources',
                            onclick: function (evt, editor) {
                                reloadCSSInPage();
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
                                    utils.alertNote('Please type some code to be minified', 5000);
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
                            name: 'gist',
                            title: 'Mail code (via Gist)',
                            uniqCls: 'magicss-email',
                            onclick: function (evt, editor) {
                                createGistAndEmail(editor.getTextValue(), getLanguageMode());
                                editor.focus();
                            }
                        },
                        /*
                        {
                            name: 'tweet',
                            title: 'Tweet',
                            uniqCls: 'magicss-tweet',
                            href: 'http://twitter.com/intent/tweet?url=' + extensionUrl.chrome + '&text=' + extLib.TR('Extension_Name', 'Live editor for CSS and LESS - Magic CSS') + ' (for Chrome%2C Edge %26 Firefox) ... web devs check it out!&via=webextensions'
                        },
                        /* */
                        getMagicCSSForChrome,
                        getMagicCSSForEdge,
                        getMagicCSSForFirefox,
                        {
                            name: 'github-repo',
                            title: 'Contribute / Report issue',
                            uniqCls: 'magicss-github-repo',
                            href: 'https://github.com/webextensions/live-css-editor'
                        },
                        (function () {
                            if (!isChrome) {
                                return null;
                            }
                            if (executionCounter < 50) {
                                return null;
                            } else {
                                return {
                                    name: 'rate-on-webstore',
                                    title: 'Rate us on Chrome Web Store',
                                    cls: 'magicss-rate-on-webstore',
                                    href: extensionUrl.chrome + '/reviews'
                                };
                            }
                        }()),
                        {
                            name: 'share-on-facebook',
                            title: 'Share us on Facebook',
                            uniqCls: 'magicss-share-on-facebook',
                            href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(extensionUrl.forThisBrowser)
                        },
                        {
                            name: 'options',
                            title: 'More options',
                            uniqCls: 'magicss-options',
                            onclick: function (evt, editor) {
                                chrome.runtime.sendMessage({openOptionsPage: true});
                                editor.focus();
                            }
                        }
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
                                attributes: [{
                                    name: 'data-style-created-by',
                                    value: 'magicss'
                                }],
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

                            utils.addStyleTag({
                                attributes: [{
                                    name: 'data-style-created-by',
                                    value: 'magicss'
                                }],
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

                            var disableStyles = editor.userPreference('disable-styles') === 'yes';
                            if (disableStyles) {
                                editor.indicateEnabledDisabled('disabled');
                            } else {
                                editor.indicateEnabledDisabled('enabled');
                            }
                            window.setTimeout(function () {
                                fnApplyTextAsCSS(editor);
                            }, 100);

                            var autocompleteSelectors = editor.userPreference(USER_PREFERENCE_AUTOCOMPLETE_SELECTORS);
                            if (autocompleteSelectors === 'no') {
                                $(editor.container).addClass('magicss-autocomplete-selectors-disabled');
                            } else {
                                $(editor.container).addClass('magicss-autocomplete-selectors-enabled');
                            }
                        },
                        reInitialized: function (editor, cfg) {
                            editor.disableEnableCSS('disable');

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
                                    attributes: [{
                                        name: 'data-style-created-by',
                                        value: 'magicss'
                                    }],
                                    overwriteExistingStyleTagWithSameId: true
                                });
                            }

                            if (cssClass) {
                                // Helps in highlighting SVG elements
                                editor.styleHighlightingSelector.cssText = cssClass + '{outline: 1px dashed red !important; fill: red !important; }';
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
                            (charJ === '*' && charJNext === '/') ||
                            (charJ === '/' && charJNext === '*')
                        ) {
                            break;
                        }
                    }

                    var cssClass = strBeforeCursor.substring(i) + strAfterCursor.substring(0, j - 1);
                    cssClass = jQuery.trim(cssClass);

                    if (cssClass) {
                        var count;

                        try {
                            count = $(cssClass).not('#MagiCSS-bookmarklet, #MagiCSS-bookmarklet *, #topCenterAlertNote, #topCenterAlertNote *').length;
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
                        var disabled = doWhat === 'disable';
                        newStyleTag.disabled = disabled;
                        newStyleTag.applyTag();
                        this.userPreference('disable-styles', disabled ? 'yes' : 'no');

                        if (disabled) {
                            this.indicateEnabledDisabled('disabled');
                            utils.alertNote('Deactivated the code', 5000);
                        } else {
                            this.indicateEnabledDisabled('enabled');
                            utils.alertNote('Activated the code', 5000);
                        }
                    }
                }

                window.MagiCSSEditor = new StylesEditor(options);

                try {
                    chromeStorage.get('use-autocomplete-for-css-selectors', function (values) {
                        if (values['use-autocomplete-for-css-selectors'] === false) {
                            disableAutocompleteSelectors(window.MagiCSSEditor);
                        } else {
                            enableAutocompleteSelectors(window.MagiCSSEditor);
                        }
                    });
                } catch (e) {
                    enableAutocompleteSelectors(window.MagiCSSEditor);
                }

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
        chromeStorage.get('magicss-execution-counter', function (values) {
            try {
                executionCounter = parseInt(values && values['magicss-execution-counter'], 10);
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

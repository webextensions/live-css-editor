/* global jQuery */

(function () {
    var $ = jQuery;

    var tokenSetMayUseProperty = function (tokenSet, options) {
        var whichProperty = options.whichProperty;
        var skipUseItCheckForTokenCls = options.skipUseItCheckForTokenCls;
        if (whichProperty === 'class') {
            var numberOfMatches = 0;
            for (var i = 0; i < (tokenSet.classes || []).length; i++) {
                var tokenCls = tokenSet.classes[i];
                if (tokenCls === skipUseItCheckForTokenCls) {
                    // do nothing
                } else {
                    if (tokenCls.useIt) {
                        numberOfMatches++;
                    }
                }
            }
            return numberOfMatches;
        } else if (whichProperty === 'id') {
            return (tokenSet.id || {}).useIt ? 1 : 0;
        } else if (whichProperty === 'tag') {
            return (tokenSet.tag || {}).useIt ? 1 : 0;
        } else {
            console.log('Error: An unexpected value was passed to tokenSetMayUseProperty()');
        }
    };

    var tokenSetToMiniSelector = function (tokenSet) {
        var miniSelector = '';

        var tag = tokenSet.tag;
        if (tag && tag.useIt) {
            miniSelector += tag.value;
        }

        var id = tokenSet.id;
        if (id && id.useIt) {
            miniSelector += id.value;
        }

        var classes = tokenSet.classes;
        if (classes) {
            classes.forEach(function (cls) {
                if (cls.useIt) {
                    miniSelector += cls.value;
                }
            });
        }

        var descendentSelector = tokenSet.descendentSelector;
        if (descendentSelector && descendentSelector.useIt) {
            miniSelector += descendentSelector.value;
        }
        return miniSelector;
    };

    var tokenSetsIntoSelector = function (tokenSets) {
        var selector = '';
        var miniSelectors = [];
        tokenSets.forEach(function (tokenSet) {
            var miniSelector = tokenSetToMiniSelector(tokenSet);
            if (miniSelector) {
                miniSelectors.push(miniSelector);
            }
        });
        for (var i = 0; i < miniSelectors.length; i++ ) {
            if (miniSelectors[i] === '>' && miniSelectors[i-1] === '>') {
                miniSelectors[i-1] = null;
            }
        }
        miniSelectors = miniSelectors.filter(function(n){ return n !== null; });

        selector = miniSelectors.join(' ');
        return selector;
    };

    var reduceTokenSets = function (tokenSets, options) {
        var mode = options.mode;
        var receivedSelector = tokenSetsIntoSelector(tokenSets);

        var $elementsMatchingReceivedSelector = $(receivedSelector);
        var countOfElementsMatchingReceivedSelector = $elementsMatchingReceivedSelector.length;

        var lastOperationWasWrong = function () {};
        var lastOperationWasCorrect = function () {};

        var i, limit;
        limit = tokenSets.length;
        for (i = 0; i < limit; i++) {
            var tokenSet = tokenSets[i];
            if (mode === 'tag') {
                if (tokenSet.tag && tokenSet.tag.useIt === 'not-specified') {
                    if (i === limit - 1 && !tokenSetMayUseProperty(tokenSet, {whichProperty: 'id'}) && !tokenSetMayUseProperty(tokenSet, {whichProperty: 'class'})) {
                        tokenSet.tag.useIt = true;
                        break;
                    }
                    tokenSet.tag.useIt = null;
                    lastOperationWasWrong = (function () {
                        var tag = tokenSet.tag;
                        return function () { tag.useIt = true; };
                    }());
                    lastOperationWasCorrect = (function () {
                        var tag = tokenSet.tag;
                        return function () { tag.useIt = false; };
                    }());
                    break;
                }
            } else if (mode === 'id') {
                if (tokenSet.id && tokenSet.id.useIt === 'not-specified') {
                    if (i === limit - 1 && !tokenSetMayUseProperty(tokenSet, {whichProperty: 'tag'}) && !tokenSetMayUseProperty(tokenSet, {whichProperty: 'class'})) {
                        tokenSet.id.useIt = true;
                        break;
                    }
                    tokenSet.id.useIt = null;
                    lastOperationWasWrong = (function () {
                        var id = tokenSet.id;
                        return function () { id.useIt = true; };
                    }());
                    lastOperationWasCorrect = (function () {
                        var id = tokenSet.id;
                        return function () { id.useIt = false; };
                    }());
                    break;
                }
            } else if (mode === 'class') {
                if (tokenSet.classes) {
                    for (var j = 0; j < tokenSet.classes.length; j++) {
                        var tokenCls = tokenSet.classes[j];
                        if (tokenCls && tokenCls.useIt === 'not-specified') {
                            if (
                                i === limit - 1 &&
                                !tokenSetMayUseProperty(tokenSet, {whichProperty: 'tag'}) &&
                                !tokenSetMayUseProperty(tokenSet, {whichProperty: 'id'})
                            ) {
                                if (!tokenSetMayUseProperty(tokenSet, {whichProperty: 'class', skipUseItCheckForTokenCls: tokenCls})) {
                                    tokenCls.useIt = true;
                                    break;
                                }
                            }
                            tokenCls.useIt = null;
                            lastOperationWasWrong = (function () {
                                var cls = tokenCls;
                                return function () { cls.useIt = true; };
                            }());
                            lastOperationWasCorrect = (function () {
                                var cls = tokenCls;
                                return function () { cls.useIt = false; };
                            }());
                            break;
                        }
                    }
                    if (j === tokenSet.classes.length) {   // If the loop completed
                        // do nothing
                    } else {
                        break;
                    }
                }
            } else if (mode === 'descendentSelector') {
                if (tokenSet.descendentSelector && tokenSet.descendentSelector.useIt === 'not-specified') {
                    tokenSet.descendentSelector.useIt = null;
                    lastOperationWasWrong = (function () {
                        var descendentSelector = tokenSet.descendentSelector;
                        return function () { descendentSelector.useIt = true; };
                    }());
                    lastOperationWasCorrect = (function () {
                        var descendentSelector = tokenSet.descendentSelector;
                        return function () { descendentSelector.useIt = false; };
                    }());
                    break;
                }
            } else {
                console.log('Error: Unexpected mode passed for reduceTokenSets()');
            }
        }
        if (i === limit) {   // If the loop completed
            // do nothing
        } else {
            var reducedSelector = tokenSetsIntoSelector(tokenSets);
            var $elementsMatchingReducedSelector = $(reducedSelector);
            var countOfElementsMatchingReducedSelector = $elementsMatchingReducedSelector.length;
            if (
                countOfElementsMatchingReducedSelector > countOfElementsMatchingReceivedSelector ||
                !$elementsMatchingReceivedSelector.is($elementsMatchingReducedSelector)
            ) {
                lastOperationWasWrong();
            } else {
                lastOperationWasCorrect();
            }
            reduceTokenSets(tokenSets, options);
        }

        return tokenSets;
    };

    var selectorIntoTokenSets = function (selector) {
        var miniSelectors = selector.split(' ');
        miniSelectors.forEach(function (miniSelector, index) {
            var tagPart = null,
                idPart = null,
                clsParts = null,
                descendentSelector = null;
            var idMatch = miniSelector.match(/#[^.]*/);
            if (idMatch && idMatch.length) {
                idPart = idMatch[0];
            }
            var clsMatch = miniSelector.match(/\.[^.]*/g);
            if (clsMatch && clsMatch.length) {
                clsParts = clsMatch;
            }

            if (miniSelector === '>') {
                descendentSelector = miniSelector;
            } else {
                var tagMatch = miniSelector.match(/[^.#]*/);
                if (tagMatch && tagMatch.length) {
                    tagPart = tagMatch[0];
                }
            }

            miniSelectors[index] = {
                tag: tagPart,
                id: idPart,
                classes: clsParts,
                descendentSelector: descendentSelector
            };
        });

        miniSelectors.forEach(function (miniSelector) {
            if (miniSelector.tag) {
                miniSelector.tag = {
                    useIt: 'not-specified',
                    value: miniSelector.tag
                };
            }
            if (miniSelector.id) {
                miniSelector.id = {
                    useIt: 'not-specified',
                    value: miniSelector.id
                };
            }
            if (miniSelector.classes) {
                miniSelector.classes.forEach(function (cls, index) {
                    miniSelector.classes[index] = {
                        useIt: 'not-specified',
                        value: miniSelector.classes[index]
                    };
                });
            }
            if (miniSelector.descendentSelector) {
                miniSelector.descendentSelector = {
                    useIt: 'not-specified',
                    value: '>'
                };
            }
        });

        var tokenSets = miniSelectors;
        return tokenSets;
    };

    var generateFullSelector = function (el, options) {
        options = options || {};
        var skipClass = options.skipClass || null;
        var useDescendentSyntax = (options.useDescendentSyntax === undefined) ? true : options.useDescendentSyntax;
        var useDescendentForLastSelector = options.useDescendentForLastSelector;
        var sortClasses = options.sortClasses;
        var reverseClasses = options.reverseClasses;
        var selector = '';

        var currentNode = el;

        while(currentNode && currentNode.tagName) {
            var selectorForThisNode = '';
            selectorForThisNode = currentNode.tagName.toLowerCase();

            var id = currentNode.getAttribute('id');    // An element like <input name="id"> might be returned as currentNode.id (for example when the <input> element belongs to a <form> element)
            if (id) {
                selectorForThisNode += '#' + CSS.escape(id);
            }
            var className = ((typeof currentNode.className === 'string') ? currentNode.className : ((currentNode.className || {}).baseVal)).trim();
            if (skipClass) {
                className = className.replace(skipClass, '').trim();
            }
            if (className) {
                var classes = className.replace(/\s+/g, ' ').split(' ');
                var classesWhichNeedEscaping = [],
                    classesWhichDoNotNeedEscaping = [];

                classes.forEach(function (item) {
                    if (item === CSS.escape(item)) {
                        classesWhichDoNotNeedEscaping.push(item);
                    } else {
                        classesWhichNeedEscaping.push(CSS.escape(item));
                    }
                });

                // Sometimes the classes which come later are more important, sometimes the classes which come earlier, otherwise alphabetical order is also an intuitive option
                if (sortClasses) {
                    classesWhichNeedEscaping = classesWhichNeedEscaping.sort();
                    classesWhichDoNotNeedEscaping = classesWhichDoNotNeedEscaping.sort();
                }
                if (reverseClasses) {
                    classesWhichNeedEscaping = classesWhichNeedEscaping.reverse();
                    classesWhichDoNotNeedEscaping = classesWhichDoNotNeedEscaping.reverse();
                }
                classes = classesWhichNeedEscaping.concat(classesWhichDoNotNeedEscaping);

                classes = '.' + classes.join('.');
                selectorForThisNode += classes;
            }
            if (selector) {
                if (useDescendentSyntax) {
                    selector = selectorForThisNode + ' > ' + selector;
                } else {
                    if (useDescendentForLastSelector && el.parentNode === currentNode) {
                        selector = selectorForThisNode + ' > ' + selector;
                    } else {
                        selector = selectorForThisNode + ' ' + selector;
                    }
                }
            } else {
                selector = selectorForThisNode;
            }
            currentNode = currentNode.parentNode;
        }

        return selector;
    };
    window.generateFullSelector = generateFullSelector;

    var generateSelector = function (el, options) {
        options = options || {};

        var fullSelector = generateFullSelector(el, {
            skipClass: options.skipClass,
            useDescendentSyntax: true,
            useDescendentForLastSelector: true,
            sortClasses: options.sortClasses,
            reverseClasses: options.reverseClasses
        });

        var selector = fullSelector,
            tokenSets = selectorIntoTokenSets(selector),
            reducedTokenSets = tokenSets;
        reducedTokenSets = reduceTokenSets(reducedTokenSets, {mode: 'descendentSelector'});
        reducedTokenSets = reduceTokenSets(reducedTokenSets, {mode: 'tag'});
        reducedTokenSets = reduceTokenSets(reducedTokenSets, {mode: 'id'});
        reducedTokenSets = reduceTokenSets(reducedTokenSets, {mode: 'class'});

        var reducedSelector = tokenSetsIntoSelector(reducedTokenSets);

        selector = reducedSelector;

        return selector;
    };
    window.generateSelector = generateSelector;
}());

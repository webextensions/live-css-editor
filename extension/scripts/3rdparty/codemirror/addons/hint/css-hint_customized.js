// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../../mode/css/css"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../../mode/css/css"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var pseudoClasses = {link: 1, visited: 1, active: 1, hover: 1, focus: 1,
                       "first-letter": 1, "first-line": 1, "first-child": 1,
                       before: 1, after: 1, lang: 1};

  CodeMirror.registerHelper("hint", "css", function(cm) {
    var cur = cm.getCursor(), token = cm.getTokenAt(cur);
    var inner = CodeMirror.innerMode(cm.getMode(), token.state);
    if (inner.mode.name != "css") return;

    if (token.type == "keyword" && "!important".indexOf(token.string) == 0)
      return {list: ["!important"], from: CodeMirror.Pos(cur.line, token.start),
              to: CodeMirror.Pos(cur.line, token.end)};

    var start = token.start, end = cur.ch, word = token.string.slice(0, end - start);
    var strBeforeCursor = cm.getRange({line:0,ch:0}, cm.getCursor('start')),
        strAfterCursor = cm.getValue().substr(strBeforeCursor.length);

    // if (/[^\w$_-]/.test(word)) {     // Original test
    if (/[^\w\.#$_-]/.test(word)) {     // With this modified test, "#" and "." characters would be considered part of the word
      word = ""; start = end = cur.ch;
    }

    var spec = CodeMirror.resolveMode("text/css");

    var result = [];
    function add(keywords, allowMatchAnywhere) {
      for (var name in keywords)
        if (!word || name.lastIndexOf(word, 0) == 0) {
          if (typeof keywords[name] === 'object') {
            result.push(keywords[name]);
          } else {
            result.push(name);
          }
        }
      // If truthy allowMatchAnywhere is passed, the typed string would match the typed characters anywhere in the
      // available CSS selectors. The "anywhere" matches would be added to the bottom of the list in alphabetical order
      if (allowMatchAnywhere) {
        var anywhereMatches = [];
        for (var name in keywords) {
          if (!word || name.lastIndexOf(word, 0) == 0) {
            // do nothing (those matches have already been added previously)
          } else if (!word || name.indexOf(word) >= 0) {
            // anywhereMatches.push(name);
            if (typeof keywords[name] === 'object') {
              anywhereMatches.push(keywords[name]);
            } else {
              anywhereMatches.push(name);
            }
          }
        }
        anywhereMatches = anywhereMatches.sort();
        result = result.concat(anywhereMatches);
      }
    }

    var isCssHintForSelector = false;

    var st = inner.state.state;

    // For autocompleting CSS selectors with "window.existingCSSSelectors" and to make it work with space character,
    // default hintOptions.closeCharacters is overridden and check for whitespace ("\s") is removed, but autocomplete
    // list shouldn't show up for the other cases of autocomplete (like autocompleting CSS property), so we just
    // return from the function for all other cases if the last character is a whitespace.
    if (token.type == "variable-3" || ["pseudo", "block", "maybeprop", "prop", "parens", "at", "params", "media", "media_parens"].indexOf(st) >= 0) {
      var lastCharacterTyped = cm.getRange({line:0,ch:0}, cm.getCursor('start'));
      if (lastCharacterTyped.substr(-1).match(/\s/)) {
        return;
      }
    }

    if (st == "pseudo" || token.type == "variable-3") {
      add(pseudoClasses);
    } else if (st == "block" || st == "maybeprop") {
      /*
      add(spec.propertyKeywords);
      */
      var onAddingAutoCompleteOptionsForCSSProperty = (((cm.options) || {}).hintOptions || {}).onAddingAutoCompleteOptionsForCSSProperty;
      if (onAddingAutoCompleteOptionsForCSSProperty) {
        onAddingAutoCompleteOptionsForCSSProperty(add);
      } else {
        add(spec.propertyKeywords);
      }
    } else if (st == "prop" || st == "parens" || st == "at" || st == "params") {
      add(spec.valueKeywords);
      add(spec.colorKeywords);
    } else if (st == "media" || st == "media_parens") {
      add(spec.mediaTypes);
      add(spec.mediaFeatures);
    } else if (st === 'top') {
      var str = strBeforeCursor;        // String before cursor
      str = str.substring(str.lastIndexOf('}') + 1)
      str = str.substring(str.lastIndexOf(',') + 1);
      str = str.trimLeft();
      var stringBeforeFilteringNewLine = str;

      str = str.substring(str.lastIndexOf('\r') + 1);
      str = str.substring(str.lastIndexOf('\n') + 1);
      if (stringBeforeFilteringNewLine !== str) {
        return;
      }
      str = str.trimLeft();
      var selectorBeforeCursor = str;   // Selector before cursor
      if (selectorBeforeCursor.length >= 3) {   // Show hint only if selector before cursor has 3 or more characters
        end = cur.ch;
        start = cur.ch - selectorBeforeCursor.length;
        word = selectorBeforeCursor;
        isCssHintForSelector = true;
        var onAddingAutoCompleteOptionsForSelector = (((cm.options) || {}).hintOptions || {}).onAddingAutoCompleteOptionsForSelector;
        if (onAddingAutoCompleteOptionsForSelector) {
          onAddingAutoCompleteOptionsForSelector(add);
        }
      }
    }

    if (result.length) {
      var ob = {
        list: result,
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end)
      };
      if (isCssHintForSelector) {
        ob.selectedHint = -1;   // Do not auto-select the first item if the hint is for CSS selector

        CodeMirror.on(ob, 'select', function (selectedText, selectedEl) {
          var onCssHintSelectForSelector = (((cm.options) || {}).hintOptions || {}).onCssHintSelectForSelector;
          if (onCssHintSelectForSelector) {
            onCssHintSelectForSelector(selectedText, selectedEl);
          }
        });
        CodeMirror.on(ob, 'shown', function () {
          var onCssHintShownForSelector = (((cm.options) || {}).hintOptions || {}).onCssHintShownForSelector;
          if (onCssHintShownForSelector) {
            onCssHintShownForSelector();
          }
        });
      }
      return ob;
    }
  });
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Depends on csslint.js from https://github.com/stubbornella/csslint

// declare global: CSSLint

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.registerHelper("lint", "css", function(text, options) {
  var found = [];
  // if (!window.CSSLint) {
  if (typeof CSSLint === 'undefined') {                 // In Firefox WebExtension, "window.CSSLint" is not available, while "CSSLint" is available
                                                        // Firefox WebExtensions behave slightly differently for global variables declared-using-"var" vs declared-using-"window."
                                                        // References:
                                                        //     https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts
                                                        //     https://developer.mozilla.org/en-US/docs/Mozilla/Tech/Xray_vision
    if (window.console) {
      window.console.error("Error: window.CSSLint not defined, CodeMirror CSS linting cannot run.");
    }
    return found;
  }
  var results = CSSLint.verify(text, options), messages = results.messages, message = null;
  for ( var i = 0; i < messages.length; i++) {
    message = messages[i];
    var startLine = message.line -1, endLine = message.line -1, startCol = message.col -1, endCol = message.col;
    found.push({
      from: CodeMirror.Pos(startLine, startCol),
      to: CodeMirror.Pos(endLine, endCol),
      message: message.message,
      severity : message.type
    });
  }
  return found;
});

});

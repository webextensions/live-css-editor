(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.less = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
var _isWhat = require("is-what");
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
  return r;
}
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  var propType = {}.propertyIsEnumerable.call(originalObject, key) ? 'enumerable' : 'nonenumerable';
  if (propType === 'enumerable') carry[key] = newVal;
  if (includeNonenumerable && propType === 'nonenumerable') {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
/**
 * Copy (clone) an object and all its props recursively to get rid of any prop referenced of the original object. Arrays are also cloned, however objects inside arrays are still linked.
 *
 * @export
 * @template T
 * @param {T} target Target can be anything
 * @param {Options} [options={}] Options can be `props` or `nonenumerable`
 * @returns {T} the target with replaced values
 * @export
 */
function copy(target, options) {
  if (options === void 0) {
    options = {};
  }
  if ((0, _isWhat.isArray)(target)) return target.map(function (i) {
    return copy(i, options);
  });
  if (!(0, _isWhat.isPlainObject)(target)) return target;
  var props = Object.getOwnPropertyNames(target);
  var symbols = Object.getOwnPropertySymbols(target);
  return __spreadArrays(props, symbols).reduce(function (carry, key) {
    if ((0, _isWhat.isArray)(options.props) && !options.props.includes(key)) {
      return carry;
    }
    var val = target[key];
    var newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}

},{"is-what":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.isAnyObject = isAnyObject;
exports.isArray = isArray;
exports.isBlob = isBlob;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isEmptyArray = isEmptyArray;
exports.isEmptyObject = isEmptyObject;
exports.isEmptyString = isEmptyString;
exports.isError = isError;
exports.isFile = isFile;
exports.isFullArray = isFullArray;
exports.isFullString = isFullString;
exports.isFunction = isFunction;
exports.isMap = isMap;
exports.isNaNValue = isNaNValue;
exports.isNull = isNull;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isObjectLike = isObjectLike;
exports.isPlainObject = isPlainObject;
exports.isPrimitive = isPrimitive;
exports.isPromise = isPromise;
exports.isRegExp = isRegExp;
exports.isSet = isSet;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isType = isType;
exports.isUndefined = isUndefined;
exports.isWeakMap = isWeakMap;
exports.isWeakSet = isWeakSet;
/**
 * Returns the object type of the given payload
 *
 * @param {*} payload
 * @returns {string}
 */
function getType(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
/**
 * Returns whether the payload is undefined
 *
 * @param {*} payload
 * @returns {payload is undefined}
 */
function isUndefined(payload) {
  return getType(payload) === 'Undefined';
}
/**
 * Returns whether the payload is null
 *
 * @param {*} payload
 * @returns {payload is null}
 */
function isNull(payload) {
  return getType(payload) === 'Null';
}
/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is Record<string, any>}
 */
function isPlainObject(payload) {
  if (getType(payload) !== 'Object') return false;
  return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
}
/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is Record<string, any>}
 */
function isObject(payload) {
  return isPlainObject(payload);
}
/**
 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is { [K in any]: never }}
 */
function isEmptyObject(payload) {
  return isPlainObject(payload) && Object.keys(payload).length === 0;
}
/**
 * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
 *
 * @param {*} payload
 * @returns {payload is Record<string, any>}
 */
function isAnyObject(payload) {
  return getType(payload) === 'Object';
}
/**
 * Returns whether the payload is an object like a type passed in < >
 *
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 *
 * @template T this must be passed in < >
 * @param {*} payload
 * @returns {payload is T}
 */
function isObjectLike(payload) {
  return isAnyObject(payload);
}
/**
 * Returns whether the payload is a function (regular or async)
 *
 * @param {*} payload
 * @returns {payload is AnyFunction}
 */
function isFunction(payload) {
  return typeof payload === "function";
}
/**
 * Returns whether the payload is an array
 *
 * @param {any} payload
 * @returns {payload is any[]}
 */
function isArray(payload) {
  return getType(payload) === 'Array';
}
/**
 * Returns whether the payload is a an array with at least 1 item
 *
 * @param {*} payload
 * @returns {payload is any[]}
 */
function isFullArray(payload) {
  return isArray(payload) && payload.length > 0;
}
/**
 * Returns whether the payload is a an empty array
 *
 * @param {*} payload
 * @returns {payload is []}
 */
function isEmptyArray(payload) {
  return isArray(payload) && payload.length === 0;
}
/**
 * Returns whether the payload is a string
 *
 * @param {*} payload
 * @returns {payload is string}
 */
function isString(payload) {
  return getType(payload) === 'String';
}
/**
 * Returns whether the payload is a string, BUT returns false for ''
 *
 * @param {*} payload
 * @returns {payload is string}
 */
function isFullString(payload) {
  return isString(payload) && payload !== '';
}
/**
 * Returns whether the payload is ''
 *
 * @param {*} payload
 * @returns {payload is string}
 */
function isEmptyString(payload) {
  return payload === '';
}
/**
 * Returns whether the payload is a number (but not NaN)
 *
 * This will return `false` for `NaN`!!
 *
 * @param {*} payload
 * @returns {payload is number}
 */
function isNumber(payload) {
  return getType(payload) === 'Number' && !isNaN(payload);
}
/**
 * Returns whether the payload is a boolean
 *
 * @param {*} payload
 * @returns {payload is boolean}
 */
function isBoolean(payload) {
  return getType(payload) === 'Boolean';
}
/**
 * Returns whether the payload is a regular expression (RegExp)
 *
 * @param {*} payload
 * @returns {payload is RegExp}
 */
function isRegExp(payload) {
  return getType(payload) === 'RegExp';
}
/**
 * Returns whether the payload is a Map
 *
 * @param {*} payload
 * @returns {payload is Map<any, any>}
 */
function isMap(payload) {
  return getType(payload) === 'Map';
}
/**
 * Returns whether the payload is a WeakMap
 *
 * @param {*} payload
 * @returns {payload is WeakMap<any, any>}
 */
function isWeakMap(payload) {
  return getType(payload) === 'WeakMap';
}
/**
 * Returns whether the payload is a Set
 *
 * @param {*} payload
 * @returns {payload is Set<any>}
 */
function isSet(payload) {
  return getType(payload) === 'Set';
}
/**
 * Returns whether the payload is a WeakSet
 *
 * @param {*} payload
 * @returns {payload is WeakSet<any>}
 */
function isWeakSet(payload) {
  return getType(payload) === 'WeakSet';
}
/**
 * Returns whether the payload is a Symbol
 *
 * @param {*} payload
 * @returns {payload is symbol}
 */
function isSymbol(payload) {
  return getType(payload) === 'Symbol';
}
/**
 * Returns whether the payload is a Date, and that the date is valid
 *
 * @param {*} payload
 * @returns {payload is Date}
 */
function isDate(payload) {
  return getType(payload) === 'Date' && !isNaN(payload);
}
/**
 * Returns whether the payload is a Blob
 *
 * @param {*} payload
 * @returns {payload is Blob}
 */
function isBlob(payload) {
  return getType(payload) === 'Blob';
}
/**
 * Returns whether the payload is a File
 *
 * @param {*} payload
 * @returns {payload is File}
 */
function isFile(payload) {
  return getType(payload) === 'File';
}
/**
 * Returns whether the payload is a Promise
 *
 * @param {*} payload
 * @returns {payload is Promise<any>}
 */
function isPromise(payload) {
  return getType(payload) === 'Promise';
}
/**
 * Returns whether the payload is an Error
 *
 * @param {*} payload
 * @returns {payload is Error}
 */
function isError(payload) {
  return getType(payload) === 'Error';
}
/**
 * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
 *
 * @param {*} payload
 * @returns {payload is typeof NaN}
 */
function isNaNValue(payload) {
  return getType(payload) === 'Number' && isNaN(payload);
}
/**
 * Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
 *
 * @param {*} payload
 * @returns {(payload is boolean | null | undefined | number | string | symbol)}
 */
function isPrimitive(payload) {
  return isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
}
/**
 * Returns true whether the payload is null or undefined
 *
 * @param {*} payload
 * @returns {(payload is null | undefined)}
 */
function isNullOrUndefined(payload) {
  return isNull(payload) || isUndefined(payload);
}
/**
 * Does a generic check to check that the given payload is of a given type.
 * In cases like Number, it will return true for NaN as NaN is a Number (thanks javascript!);
 * It will, however, differentiate between object and null
 *
 * @template T
 * @param {*} payload
 * @param {T} type
 * @throws {TypeError} Will throw type error if type is an invalid type
 * @returns {payload is T}
 */
function isType(payload, type) {
  if (!(type instanceof Function)) {
    throw new TypeError('Type must be a function');
  }
  if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
    throw new TypeError('Type is not a class');
  }
  // Classes usually have names (as functions usually have names)
  var name = type.name;
  return getType(payload) === name || Boolean(payload && payload.constructor === type);
}

},{}],5:[function(require,module,exports){
'use strict';

function parseNodeVersion(version) {
  var match = version.match(/^v(\d{1,2})\.(\d{1,2})\.(\d{1,2})(?:-([0-9A-Za-z-.]+))?(?:\+([0-9A-Za-z-.]+))?$/); // eslint-disable-line max-len
  if (!match) {
    throw new Error('Unable to parse: ' + version);
  }

  var res = {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    pre: match[4] || '',
    build: match[5] || '',
  };

  return res;
}

module.exports = parseNodeVersion;

},{}],6:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

},{"./util":15}],7:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

},{"./base64":8}],8:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

},{}],9:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],10:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

},{"./util":15}],11:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

},{}],12:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var binarySearch = require('./binary-search');
var ArraySet = require('./array-set').ArraySet;
var base64VLQ = require('./base64-vlq');
var quickSort = require('./quick-sort').quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

},{"./array-set":6,"./base64-vlq":7,"./binary-search":9,"./quick-sort":11,"./util":15}],13:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('./base64-vlq');
var util = require('./util');
var ArraySet = require('./array-set').ArraySet;
var MappingList = require('./mapping-list').MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":6,"./base64-vlq":7,"./mapping-list":10,"./util":15}],14:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

},{"./source-map-generator":13,"./util":15}],15:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;

},{}],16:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./lib/source-node').SourceNode;

},{"./lib/source-map-consumer":12,"./lib/source-map-generator":13,"./lib/source-node":14}],17:[function(require,module,exports){
module.exports={
	"name": "less",
	"version": "4.1.3",
	"description": "Leaner CSS",
	"homepage": "http://lesscss.org",
	"author": {
		"name": "Alexis Sellier",
		"email": "self@cloudhead.net"
	},
	"contributors": [
		"The Core Less Team"
	],
	"bugs": {
		"url": "https://github.com/less/less.js/issues"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/less/less.js.git"
	},
	"master": {
		"url": "https://github.com/less/less.js/blob/master/",
		"raw": "https://raw.githubusercontent.com/less/less.js/master/"
	},
	"license": "Apache-2.0",
	"bin": {
		"lessc": "./bin/lessc"
	},
	"main": "index",
	"module": "./lib/less-node/index",
	"directories": {
		"test": "./test"
	},
	"browser": "./dist/less.js",
	"engines": {
		"node": ">=6"
	},
	"scripts": {
		"test": "grunt test",
		"grunt": "grunt",
		"build": "npm-run-all clean compile",
		"build:less-for-magic-css": "browserify -p esmify --entry src/less-node/index-basic-less-with-sourcemap-support.js --outfile dist/basic-less-with-sourcemap-support.browserified.js --standalone less && uglifyjs dist/basic-less-with-sourcemap-support.browserified.js --compress sequences=false --beautify beautify=false,semicolons=false,comments=some --output dist/basic-less-with-sourcemap-support.browserified.uglified.js",
		"clean": "shx rm -rf ./lib tsconfig.tsbuildinfo",
		"compile": "tsc -p tsconfig.json",
		"copy:root": "shx cp -rf ./dist ../../",
		"dev": "tsc -p tsconfig.json -w",
		"prepublishOnly": "grunt dist"
	},
	"optionalDependencies": {
		"errno": "^0.1.1",
		"graceful-fs": "^4.1.2",
		"image-size": "~0.5.0",
		"make-dir": "^2.1.0",
		"mime": "^1.4.1",
		"needle": "^3.1.0",
		"source-map": "~0.6.0"
	},
	"devDependencies": {
		"@less/test-data": "^4.1.0",
		"@less/test-import-module": "^4.0.0",
		"@rollup/plugin-commonjs": "^17.0.0",
		"@rollup/plugin-json": "^4.1.0",
		"@rollup/plugin-node-resolve": "^11.0.0",
		"@typescript-eslint/eslint-plugin": "^4.28.0",
		"@typescript-eslint/parser": "^4.28.0",
		"benny": "^3.6.12",
		"bootstrap-less-port": "0.3.0",
		"browser-resolve": "^2.0.0",
		"chai": "^4.2.0",
		"cross-env": "^7.0.3",
		"diff": "^3.2.0",
		"eslint": "^7.29.0",
		"esmify": "^2.1.1",
		"fs-extra": "^8.1.0",
		"git-rev": "^0.2.1",
		"globby": "^10.0.1",
		"grunt": "^1.0.4",
		"grunt-cli": "^1.3.2",
		"grunt-contrib-clean": "^1.0.0",
		"grunt-contrib-connect": "^1.0.2",
		"grunt-eslint": "^23.0.0",
		"grunt-saucelabs": "^9.0.1",
		"grunt-shell": "^1.3.0",
		"html-template-tag": "^3.2.0",
		"jit-grunt": "^0.10.0",
		"less-plugin-autoprefix": "^1.5.1",
		"less-plugin-clean-css": "^1.5.1",
		"minimist": "^1.2.0",
		"mocha": "^6.2.1",
		"mocha-headless-chrome": "^2.0.3",
		"mocha-teamcity-reporter": "^3.0.0",
		"nock": "^11.8.2",
		"npm-run-all": "^4.1.5",
		"performance-now": "^0.2.0",
		"phin": "^2.2.3",
		"promise": "^7.1.1",
		"read-glob": "^3.0.0",
		"resolve": "^1.17.0",
		"rollup": "^2.52.2",
		"rollup-plugin-terser": "^5.1.1",
		"rollup-plugin-typescript2": "^0.29.0",
		"semver": "^6.3.0",
		"shx": "^0.3.2",
		"time-grunt": "^1.3.0",
		"ts-node": "^9.1.1",
		"typescript": "^4.3.4",
		"uglify-js": "^3.17.4",
		"uikit": "2.27.4"
	},
	"keywords": [
		"compile less",
		"css nesting",
		"css variable",
		"css",
		"gradients css",
		"gradients css3",
		"less compiler",
		"less css",
		"less mixins",
		"less",
		"less.js",
		"lesscss",
		"mixins",
		"nested css",
		"parser",
		"preprocessor",
		"bootstrap css",
		"bootstrap less",
		"style",
		"styles",
		"stylesheet",
		"variables in css",
		"css less"
	],
	"rawcurrent": "https://raw.github.com/less/less.js/v",
	"sourcearchive": "https://github.com/less/less.js/archive/v",
	"dependencies": {
		"copy-anything": "^2.0.1",
		"parse-node-version": "^1.0.1",
		"tslib": "^2.3.0"
	}
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  // encodeBase64: function encodeBase64(str) {
  //     // Avoid Buffer constructor on newer versions of Node.js.
  //     const buffer = (Buffer.from ? Buffer.from(str) : (new Buffer(str)));
  //     return buffer.toString('base64');
  // },
  // mimeLookup: function (filename) {
  //     return require('mime').lookup(filename);
  // },
  // charsetLookup: function (mime) {
  //     return require('mime').charsets.lookup(mime);
  // },
  getSourceMapGenerator: function getSourceMapGenerator() {
    return require('source-map').SourceMapGenerator;
  }
};
exports.default = _default;

},{"source-map":16}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _environmentBasicLessWithSourcemapSupport = _interopRequireDefault(require("./environment-basic-less-with-sourcemap-support.js"));
var _less = _interopRequireDefault(require("../less"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import environment from './environment';

// import FileManager from './file-manager';
// import UrlFileManager from './url-file-manager';

// const less = createFromEnvironment(environment, [new FileManager(), new UrlFileManager()]);
const less = (0, _less.default)(_environmentBasicLessWithSourcemapSupport.default, []);
// import lesscHelper from './lessc-helper';

// allow people to create less with their own environment
less.createFromEnvironment = _less.default;
// less.lesscHelper = lesscHelper;
less.PluginLoader = require('./plugin-loader').default;
// less.fs = require('./fs').default;
// less.FileManager = FileManager;
// less.UrlFileManager = UrlFileManager;

// Set up options
less.options = require('../less/default-options').default();

// provide image-size functionality
// require('./image-size').default(less.environment);
var _default = less;
exports.default = _default;

},{"../less":46,"../less/default-options":26,"./environment-basic-less-with-sourcemap-support.js":18,"./plugin-loader":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _abstractPluginLoader = _interopRequireDefault(require("../less/environment/abstract-plugin-loader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const path = require("path");
/**
 * Node Plugin Loader
 */
const PluginLoader = function (less) {
  this.less = less;
  this.require = prefix => {
    prefix = path.dirname(prefix);
    return id => {
      const str = id.substr(0, 2);
      if (str === '..' || str === './') {
        return require(path.join(prefix, id));
      } else {
        return require(id);
      }
    };
  };
};
PluginLoader.prototype = Object.assign(new _abstractPluginLoader.default(), {
  loadPlugin(filename, basePath, context, environment, fileManager) {
    const prefix = filename.slice(0, 1);
    const explicit = prefix === '.' || prefix === '/' || filename.slice(-3).toLowerCase() === '.js';
    if (!explicit) {
      context.prefixes = ['less-plugin-', ''];
    }
    if (context.syncImport) {
      return fileManager.loadFileSync(filename, basePath, context, environment);
    }
    return new Promise((fulfill, reject) => {
      fileManager.loadFile(filename, basePath, context, environment).then(data => {
        try {
          fulfill(data);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  loadPluginSync(filename, basePath, context, environment, fileManager) {
    context.syncImport = true;
    return this.loadPlugin(filename, basePath, context, environment, fileManager);
  }
});
var _default = PluginLoader;
exports.default = _default;

},{"../less/environment/abstract-plugin-loader.js":28,"path":1}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RewriteUrls = exports.Math = void 0;
const Math = {
  ALWAYS: 0,
  PARENS_DIVISION: 1,
  PARENS: 2
  // removed - STRICT_LEGACY: 3
};
exports.Math = Math;
const RewriteUrls = {
  OFF: 0,
  LOCAL: 1,
  ALL: 2
};
exports.RewriteUrls = RewriteUrls;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Constants = _interopRequireWildcard(require("./constants"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const contexts = {};
var _default = contexts;
exports.default = _default;
const copyFromOriginal = function copyFromOriginal(original, destination, propertiesToCopy) {
  if (!original) {
    return;
  }
  for (let i = 0; i < propertiesToCopy.length; i++) {
    if (original.hasOwnProperty(propertiesToCopy[i])) {
      destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
    }
  }
};

/*
 parse is used whilst parsing
 */
const parseCopyProperties = [
// options
'paths',
// option - unmodified - paths to search for imports on
'rewriteUrls',
// option - whether to adjust URL's to be relative
'rootpath',
// option - rootpath to append to URL's
'strictImports',
// option -
'insecure',
// option - whether to allow imports from insecure ssl hosts
'dumpLineNumbers',
// option - whether to dump line numbers
'compress',
// option - whether to compress
'syncImport',
// option - whether to import synchronously
'chunkInput',
// option - whether to chunk input. more performant but causes parse issues.
'mime',
// browser only - mime type for sheet import
'useFileCache',
// browser only - whether to use the per file session cache
// context
'processImports',
// option & context - whether to process imports. if false then imports will not be imported.
// Used by the import manager to stop multiple import visitors being created.
'pluginManager' // Used as the plugin manager for the session
];

contexts.Parse = function (options) {
  copyFromOriginal(options, this, parseCopyProperties);
  if (typeof this.paths === 'string') {
    this.paths = [this.paths];
  }
};
const evalCopyProperties = ['paths',
// additional include paths
'compress',
// whether to compress
'math',
// whether math has to be within parenthesis
'strictUnits',
// whether units need to evaluate correctly
'sourceMap',
// whether to output a source map
'importMultiple',
// whether we are currently importing multiple copies
'urlArgs',
// whether to add args into url tokens
'javascriptEnabled',
// option - whether Inline JavaScript is enabled. if undefined, defaults to false
'pluginManager',
// Used as the plugin manager for the session
'importantScope',
// used to bubble up !important statements
'rewriteUrls' // option - whether to adjust URL's to be relative
];

contexts.Eval = function (options, frames) {
  copyFromOriginal(options, this, evalCopyProperties);
  if (typeof this.paths === 'string') {
    this.paths = [this.paths];
  }
  this.frames = frames || [];
  this.importantScope = this.importantScope || [];
};
contexts.Eval.prototype.enterCalc = function () {
  if (!this.calcStack) {
    this.calcStack = [];
  }
  this.calcStack.push(true);
  this.inCalc = true;
};
contexts.Eval.prototype.exitCalc = function () {
  this.calcStack.pop();
  if (!this.calcStack.length) {
    this.inCalc = false;
  }
};
contexts.Eval.prototype.inParenthesis = function () {
  if (!this.parensStack) {
    this.parensStack = [];
  }
  this.parensStack.push(true);
};
contexts.Eval.prototype.outOfParenthesis = function () {
  this.parensStack.pop();
};
contexts.Eval.prototype.inCalc = false;
contexts.Eval.prototype.mathOn = true;
contexts.Eval.prototype.isMathOn = function (op) {
  if (!this.mathOn) {
    return false;
  }
  if (op === '/' && this.math !== Constants.Math.ALWAYS && (!this.parensStack || !this.parensStack.length)) {
    return false;
  }
  if (this.math > Constants.Math.PARENS_DIVISION) {
    return this.parensStack && this.parensStack.length;
  }
  return true;
};
contexts.Eval.prototype.pathRequiresRewrite = function (path) {
  const isRelative = this.rewriteUrls === Constants.RewriteUrls.LOCAL ? isPathLocalRelative : isPathRelative;
  return isRelative(path);
};
contexts.Eval.prototype.rewritePath = function (path, rootpath) {
  let newPath;
  rootpath = rootpath || '';
  newPath = this.normalizePath(rootpath + path);

  // If a path was explicit relative and the rootpath was not an absolute path
  // we must ensure that the new path is also explicit relative.
  if (isPathLocalRelative(path) && isPathRelative(rootpath) && isPathLocalRelative(newPath) === false) {
    newPath = `./${newPath}`;
  }
  return newPath;
};
contexts.Eval.prototype.normalizePath = function (path) {
  const segments = path.split('/').reverse();
  let segment;
  path = [];
  while (segments.length !== 0) {
    segment = segments.pop();
    switch (segment) {
      case '.':
        break;
      case '..':
        if (path.length === 0 || path[path.length - 1] === '..') {
          path.push(segment);
        } else {
          path.pop();
        }
        break;
      default:
        path.push(segment);
        break;
    }
  }
  return path.join('/');
};
function isPathRelative(path) {
  return !/^(?:[a-z-]+:|\/|#)/i.test(path);
}
function isPathLocalRelative(path) {
  return path.charAt(0) === '.';
}

// todo - do the same for the toCSS ?

},{"./constants":21}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  'aliceblue': '#f0f8ff',
  'antiquewhite': '#faebd7',
  'aqua': '#00ffff',
  'aquamarine': '#7fffd4',
  'azure': '#f0ffff',
  'beige': '#f5f5dc',
  'bisque': '#ffe4c4',
  'black': '#000000',
  'blanchedalmond': '#ffebcd',
  'blue': '#0000ff',
  'blueviolet': '#8a2be2',
  'brown': '#a52a2a',
  'burlywood': '#deb887',
  'cadetblue': '#5f9ea0',
  'chartreuse': '#7fff00',
  'chocolate': '#d2691e',
  'coral': '#ff7f50',
  'cornflowerblue': '#6495ed',
  'cornsilk': '#fff8dc',
  'crimson': '#dc143c',
  'cyan': '#00ffff',
  'darkblue': '#00008b',
  'darkcyan': '#008b8b',
  'darkgoldenrod': '#b8860b',
  'darkgray': '#a9a9a9',
  'darkgrey': '#a9a9a9',
  'darkgreen': '#006400',
  'darkkhaki': '#bdb76b',
  'darkmagenta': '#8b008b',
  'darkolivegreen': '#556b2f',
  'darkorange': '#ff8c00',
  'darkorchid': '#9932cc',
  'darkred': '#8b0000',
  'darksalmon': '#e9967a',
  'darkseagreen': '#8fbc8f',
  'darkslateblue': '#483d8b',
  'darkslategray': '#2f4f4f',
  'darkslategrey': '#2f4f4f',
  'darkturquoise': '#00ced1',
  'darkviolet': '#9400d3',
  'deeppink': '#ff1493',
  'deepskyblue': '#00bfff',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1e90ff',
  'firebrick': '#b22222',
  'floralwhite': '#fffaf0',
  'forestgreen': '#228b22',
  'fuchsia': '#ff00ff',
  'gainsboro': '#dcdcdc',
  'ghostwhite': '#f8f8ff',
  'gold': '#ffd700',
  'goldenrod': '#daa520',
  'gray': '#808080',
  'grey': '#808080',
  'green': '#008000',
  'greenyellow': '#adff2f',
  'honeydew': '#f0fff0',
  'hotpink': '#ff69b4',
  'indianred': '#cd5c5c',
  'indigo': '#4b0082',
  'ivory': '#fffff0',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'lavenderblush': '#fff0f5',
  'lawngreen': '#7cfc00',
  'lemonchiffon': '#fffacd',
  'lightblue': '#add8e6',
  'lightcoral': '#f08080',
  'lightcyan': '#e0ffff',
  'lightgoldenrodyellow': '#fafad2',
  'lightgray': '#d3d3d3',
  'lightgrey': '#d3d3d3',
  'lightgreen': '#90ee90',
  'lightpink': '#ffb6c1',
  'lightsalmon': '#ffa07a',
  'lightseagreen': '#20b2aa',
  'lightskyblue': '#87cefa',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#b0c4de',
  'lightyellow': '#ffffe0',
  'lime': '#00ff00',
  'limegreen': '#32cd32',
  'linen': '#faf0e6',
  'magenta': '#ff00ff',
  'maroon': '#800000',
  'mediumaquamarine': '#66cdaa',
  'mediumblue': '#0000cd',
  'mediumorchid': '#ba55d3',
  'mediumpurple': '#9370d8',
  'mediumseagreen': '#3cb371',
  'mediumslateblue': '#7b68ee',
  'mediumspringgreen': '#00fa9a',
  'mediumturquoise': '#48d1cc',
  'mediumvioletred': '#c71585',
  'midnightblue': '#191970',
  'mintcream': '#f5fffa',
  'mistyrose': '#ffe4e1',
  'moccasin': '#ffe4b5',
  'navajowhite': '#ffdead',
  'navy': '#000080',
  'oldlace': '#fdf5e6',
  'olive': '#808000',
  'olivedrab': '#6b8e23',
  'orange': '#ffa500',
  'orangered': '#ff4500',
  'orchid': '#da70d6',
  'palegoldenrod': '#eee8aa',
  'palegreen': '#98fb98',
  'paleturquoise': '#afeeee',
  'palevioletred': '#d87093',
  'papayawhip': '#ffefd5',
  'peachpuff': '#ffdab9',
  'peru': '#cd853f',
  'pink': '#ffc0cb',
  'plum': '#dda0dd',
  'powderblue': '#b0e0e6',
  'purple': '#800080',
  'rebeccapurple': '#663399',
  'red': '#ff0000',
  'rosybrown': '#bc8f8f',
  'royalblue': '#4169e1',
  'saddlebrown': '#8b4513',
  'salmon': '#fa8072',
  'sandybrown': '#f4a460',
  'seagreen': '#2e8b57',
  'seashell': '#fff5ee',
  'sienna': '#a0522d',
  'silver': '#c0c0c0',
  'skyblue': '#87ceeb',
  'slateblue': '#6a5acd',
  'slategray': '#708090',
  'slategrey': '#708090',
  'snow': '#fffafa',
  'springgreen': '#00ff7f',
  'steelblue': '#4682b4',
  'tan': '#d2b48c',
  'teal': '#008080',
  'thistle': '#d8bfd8',
  'tomato': '#ff6347',
  'turquoise': '#40e0d0',
  'violet': '#ee82ee',
  'wheat': '#f5deb3',
  'white': '#ffffff',
  'whitesmoke': '#f5f5f5',
  'yellow': '#ffff00',
  'yellowgreen': '#9acd32'
};
exports.default = _default;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _colors = _interopRequireDefault(require("./colors"));
var _unitConversions = _interopRequireDefault(require("./unit-conversions"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  colors: _colors.default,
  unitConversions: _unitConversions.default
};
exports.default = _default;

},{"./colors":23,"./unit-conversions":25}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  length: {
    'm': 1,
    'cm': 0.01,
    'mm': 0.001,
    'in': 0.0254,
    'px': 0.0254 / 96,
    'pt': 0.0254 / 72,
    'pc': 0.0254 / 72 * 12
  },
  duration: {
    's': 1,
    'ms': 0.001
  },
  angle: {
    'rad': 1 / (2 * Math.PI),
    'deg': 1 / 360,
    'grad': 1 / 400,
    'turn': 1
  }
};
exports.default = _default;

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
// Export a new default each time
function _default() {
  return {
    /* Inline Javascript - @plugin still allowed */
    javascriptEnabled: false,
    /* Outputs a makefile import dependency list to stdout. */
    depends: false,
    /* (DEPRECATED) Compress using less built-in compression. 
     * This does an okay job but does not utilise all the tricks of 
     * dedicated css compression. */
    compress: false,
    /* Runs the less parser and just reports errors without any output. */
    lint: false,
    /* Sets available include paths.
     * If the file in an @import rule does not exist at that exact location, 
     * less will look for it at the location(s) passed to this option. 
     * You might use this for instance to specify a path to a library which 
     * you want to be referenced simply and relatively in the less files. */
    paths: [],
    /* color output in the terminal */
    color: true,
    /* The strictImports controls whether the compiler will allow an @import inside of either 
     * @media blocks or (a later addition) other selector blocks.
     * See: https://github.com/less/less.js/issues/656 */
    strictImports: false,
    /* Allow Imports from Insecure HTTPS Hosts */
    insecure: false,
    /* Allows you to add a path to every generated import and url in your css. 
     * This does not affect less import statements that are processed, just ones 
     * that are left in the output css. */
    rootpath: '',
    /* By default URLs are kept as-is, so if you import a file in a sub-directory 
     * that references an image, exactly the same URL will be output in the css. 
     * This option allows you to re-write URL's in imported files so that the 
     * URL is always relative to the base imported file */
    rewriteUrls: false,
    /* How to process math 
     *   0 always           - eagerly try to solve all operations
     *   1 parens-division  - require parens for division "/"
     *   2 parens | strict  - require parens for all operations
     *   3 strict-legacy    - legacy strict behavior (super-strict)
     */
    math: 1,
    /* Without this option, less attempts to guess at the output unit when it does maths. */
    strictUnits: false,
    /* Effectively the declaration is put at the top of your base Less file, 
     * meaning it can be used but it also can be overridden if this variable 
     * is defined in the file. */
    globalVars: null,
    /* As opposed to the global variable option, this puts the declaration at the
     * end of your base file, meaning it will override anything defined in your Less file. */
    modifyVars: null,
    /* This option allows you to specify a argument to go on to every URL.  */
    urlArgs: ''
  };
}
;

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class AbstractFileManager {
  getPath(filename) {
    let j = filename.lastIndexOf('?');
    if (j > 0) {
      filename = filename.slice(0, j);
    }
    j = filename.lastIndexOf('/');
    if (j < 0) {
      j = filename.lastIndexOf('\\');
    }
    if (j < 0) {
      return '';
    }
    return filename.slice(0, j + 1);
  }
  tryAppendExtension(path, ext) {
    return /(\.[a-z]*$)|([\?;].*)$/.test(path) ? path : path + ext;
  }
  tryAppendLessExtension(path) {
    return this.tryAppendExtension(path, '.less');
  }
  supportsSync() {
    return false;
  }
  alwaysMakePathsAbsolute() {
    return false;
  }
  isPathAbsolute(filename) {
    return /^(?:[a-z-]+:|\/|\\|#)/i.test(filename);
  }

  // TODO: pull out / replace?
  join(basePath, laterPath) {
    if (!basePath) {
      return laterPath;
    }
    return basePath + laterPath;
  }
  pathDiff(url, baseUrl) {
    // diff between two paths to create a relative path

    const urlParts = this.extractUrlParts(url);
    const baseUrlParts = this.extractUrlParts(baseUrl);
    let i;
    let max;
    let urlDirectories;
    let baseUrlDirectories;
    let diff = '';
    if (urlParts.hostPart !== baseUrlParts.hostPart) {
      return '';
    }
    max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
    for (i = 0; i < max; i++) {
      if (baseUrlParts.directories[i] !== urlParts.directories[i]) {
        break;
      }
    }
    baseUrlDirectories = baseUrlParts.directories.slice(i);
    urlDirectories = urlParts.directories.slice(i);
    for (i = 0; i < baseUrlDirectories.length - 1; i++) {
      diff += '../';
    }
    for (i = 0; i < urlDirectories.length - 1; i++) {
      diff += `${urlDirectories[i]}/`;
    }
    return diff;
  }

  // helper function, not part of API
  extractUrlParts(url, baseUrl) {
    // urlParts[1] = protocol://hostname/ OR /
    // urlParts[2] = / if path relative to host base
    // urlParts[3] = directories
    // urlParts[4] = filename
    // urlParts[5] = parameters

    const urlPartsRegex = /^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i;
    const urlParts = url.match(urlPartsRegex);
    const returner = {};
    let rawDirectories = [];
    const directories = [];
    let i;
    let baseUrlParts;
    if (!urlParts) {
      throw new Error(`Could not parse sheet href - '${url}'`);
    }

    // Stylesheets in IE don't always return the full path
    if (baseUrl && (!urlParts[1] || urlParts[2])) {
      baseUrlParts = baseUrl.match(urlPartsRegex);
      if (!baseUrlParts) {
        throw new Error(`Could not parse page url - '${baseUrl}'`);
      }
      urlParts[1] = urlParts[1] || baseUrlParts[1] || '';
      if (!urlParts[2]) {
        urlParts[3] = baseUrlParts[3] + urlParts[3];
      }
    }
    if (urlParts[3]) {
      rawDirectories = urlParts[3].replace(/\\/g, '/').split('/');

      // collapse '..' and skip '.'
      for (i = 0; i < rawDirectories.length; i++) {
        if (rawDirectories[i] === '..') {
          directories.pop();
        } else if (rawDirectories[i] !== '.') {
          directories.push(rawDirectories[i]);
        }
      }
    }
    returner.hostPart = urlParts[1];
    returner.directories = directories;
    returner.rawPath = (urlParts[1] || '') + rawDirectories.join('/');
    returner.path = (urlParts[1] || '') + directories.join('/');
    returner.filename = urlParts[4];
    returner.fileUrl = returner.path + (urlParts[4] || '');
    returner.url = returner.fileUrl + (urlParts[5] || '');
    return returner;
  }
}
var _default = AbstractFileManager;
exports.default = _default;

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _functionRegistry = _interopRequireDefault(require("../functions/function-registry"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AbstractPluginLoader {
  constructor() {
    // Implemented by Node.js plugin loader
    this.require = function () {
      return null;
    };
  }
  evalPlugin(contents, context, imports, pluginOptions, fileInfo) {
    let loader, registry, pluginObj, localModule, pluginManager, filename, result;
    pluginManager = context.pluginManager;
    if (fileInfo) {
      if (typeof fileInfo === 'string') {
        filename = fileInfo;
      } else {
        filename = fileInfo.filename;
      }
    }
    const shortname = new this.less.FileManager().extractUrlParts(filename).filename;
    if (filename) {
      pluginObj = pluginManager.get(filename);
      if (pluginObj) {
        result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
        if (result) {
          return result;
        }
        try {
          if (pluginObj.use) {
            pluginObj.use.call(this.context, pluginObj);
          }
        } catch (e) {
          e.message = e.message || 'Error during @plugin call';
          return new _lessError.default(e, imports, filename);
        }
        return pluginObj;
      }
    }
    localModule = {
      exports: {},
      pluginManager,
      fileInfo
    };
    registry = _functionRegistry.default.create();
    const registerPlugin = function (obj) {
      pluginObj = obj;
    };
    try {
      loader = new Function('module', 'require', 'registerPlugin', 'functions', 'tree', 'less', 'fileInfo', contents);
      loader(localModule, this.require(filename), registerPlugin, registry, this.less.tree, this.less, fileInfo);
    } catch (e) {
      return new _lessError.default(e, imports, filename);
    }
    if (!pluginObj) {
      pluginObj = localModule.exports;
    }
    pluginObj = this.validatePlugin(pluginObj, filename, shortname);
    if (pluginObj instanceof _lessError.default) {
      return pluginObj;
    }
    if (pluginObj) {
      pluginObj.imports = imports;
      pluginObj.filename = filename;

      // For < 3.x (or unspecified minVersion) - setOptions() before install()
      if (!pluginObj.minVersion || this.compareVersion('3.0.0', pluginObj.minVersion) < 0) {
        result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
        if (result) {
          return result;
        }
      }

      // Run on first load
      pluginManager.addPlugin(pluginObj, fileInfo.filename, registry);
      pluginObj.functions = registry.getLocalFunctions();

      // Need to call setOptions again because the pluginObj might have functions
      result = this.trySetOptions(pluginObj, filename, shortname, pluginOptions);
      if (result) {
        return result;
      }

      // Run every @plugin call
      try {
        if (pluginObj.use) {
          pluginObj.use.call(this.context, pluginObj);
        }
      } catch (e) {
        e.message = e.message || 'Error during @plugin call';
        return new _lessError.default(e, imports, filename);
      }
    } else {
      return new _lessError.default({
        message: 'Not a valid plugin'
      }, imports, filename);
    }
    return pluginObj;
  }
  trySetOptions(plugin, filename, name, options) {
    if (options && !plugin.setOptions) {
      return new _lessError.default({
        message: `Options have been provided but the plugin ${name} does not support any options.`
      });
    }
    try {
      plugin.setOptions && plugin.setOptions(options);
    } catch (e) {
      return new _lessError.default(e);
    }
  }
  validatePlugin(plugin, filename, name) {
    if (plugin) {
      // support plugins being a function
      // so that the plugin can be more usable programmatically
      if (typeof plugin === 'function') {
        plugin = new plugin();
      }
      if (plugin.minVersion) {
        if (this.compareVersion(plugin.minVersion, this.less.version) < 0) {
          return new _lessError.default({
            message: `Plugin ${name} requires version ${this.versionToString(plugin.minVersion)}`
          });
        }
      }
      return plugin;
    }
    return null;
  }
  compareVersion(aVersion, bVersion) {
    if (typeof aVersion === 'string') {
      aVersion = aVersion.match(/^(\d+)\.?(\d+)?\.?(\d+)?/);
      aVersion.shift();
    }
    for (let i = 0; i < aVersion.length; i++) {
      if (aVersion[i] !== bVersion[i]) {
        return parseInt(aVersion[i]) > parseInt(bVersion[i]) ? -1 : 1;
      }
    }
    return 0;
  }
  versionToString(version) {
    let versionString = '';
    for (let i = 0; i < version.length; i++) {
      versionString += (versionString ? '.' : '') + version[i];
    }
    return versionString;
  }
  printUsage(plugins) {
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      if (plugin.printUsage) {
        plugin.printUsage();
      }
    }
  }
}
var _default = AbstractPluginLoader;
exports.default = _default;

},{"../functions/function-registry":36,"../less-error":47}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _logger = _interopRequireDefault(require("../logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @todo Document why this abstraction exists, and the relationship between
 *       environment, file managers, and plugin manager
 */

class Environment {
  constructor(externalEnvironment, fileManagers) {
    this.fileManagers = fileManagers || [];
    externalEnvironment = externalEnvironment || {};
    const optionalFunctions = ['encodeBase64', 'mimeLookup', 'charsetLookup', 'getSourceMapGenerator'];
    const requiredFunctions = [];
    const functions = requiredFunctions.concat(optionalFunctions);
    for (let i = 0; i < functions.length; i++) {
      const propName = functions[i];
      const environmentFunc = externalEnvironment[propName];
      if (environmentFunc) {
        this[propName] = environmentFunc.bind(externalEnvironment);
      } else if (i < requiredFunctions.length) {
        this.warn(`missing required function in environment - ${propName}`);
      }
    }
  }
  getFileManager(filename, currentDirectory, options, environment, isSync) {
    if (!filename) {
      _logger.default.warn('getFileManager called with no filename.. Please report this issue. continuing.');
    }
    if (currentDirectory == null) {
      _logger.default.warn('getFileManager called with null directory.. Please report this issue. continuing.');
    }
    let fileManagers = this.fileManagers;
    if (options.pluginManager) {
      fileManagers = [].concat(fileManagers).concat(options.pluginManager.getFileManagers());
    }
    for (let i = fileManagers.length - 1; i >= 0; i--) {
      const fileManager = fileManagers[i];
      if (fileManager[isSync ? 'supportsSync' : 'supports'](filename, currentDirectory, options, environment)) {
        return fileManager;
      }
    }
    return null;
  }
  addFileManager(fileManager) {
    this.fileManagers.push(fileManager);
  }
  clearFileManagers() {
    this.fileManagers = [];
  }
}
var _default = Environment;
exports.default = _default;

},{"../logger":48}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _keyword = _interopRequireDefault(require("../tree/keyword"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function boolean(condition) {
  return condition ? _keyword.default.True : _keyword.default.False;
}

/**
 * Functions with evalArgs set to false are sent context
 * as the first argument.
 */
function If(context, condition, trueValue, falseValue) {
  return condition.eval(context) ? trueValue.eval(context) : falseValue ? falseValue.eval(context) : new _anonymous.default();
}
If.evalArgs = false;
function isdefined(context, variable) {
  try {
    variable.eval(context);
    return _keyword.default.True;
  } catch (e) {
    return _keyword.default.False;
  }
}
isdefined.evalArgs = false;
var _default = {
  isdefined,
  boolean,
  'if': If
};
exports.default = _default;

},{"../tree/anonymous":59,"../tree/keyword":79}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _color = _interopRequireDefault(require("../tree/color"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Color Blending
// ref: http://www.w3.org/TR/compositing-1

function colorBlend(mode, color1, color2) {
  const ab = color1.alpha; // result

  let
  // backdrop
  cb;
  const as = color2.alpha;
  let
  // source
  cs;
  let ar;
  let cr;
  const r = [];
  ar = as + ab * (1 - as);
  for (let i = 0; i < 3; i++) {
    cb = color1.rgb[i] / 255;
    cs = color2.rgb[i] / 255;
    cr = mode(cb, cs);
    if (ar) {
      cr = (as * cs + ab * (cb - as * (cb + cs - cr))) / ar;
    }
    r[i] = cr * 255;
  }
  return new _color.default(r, ar);
}
const colorBlendModeFunctions = {
  multiply: function (cb, cs) {
    return cb * cs;
  },
  screen: function (cb, cs) {
    return cb + cs - cb * cs;
  },
  overlay: function (cb, cs) {
    cb *= 2;
    return cb <= 1 ? colorBlendModeFunctions.multiply(cb, cs) : colorBlendModeFunctions.screen(cb - 1, cs);
  },
  softlight: function (cb, cs) {
    let d = 1;
    let e = cb;
    if (cs > 0.5) {
      e = 1;
      d = cb > 0.25 ? Math.sqrt(cb) : ((16 * cb - 12) * cb + 4) * cb;
    }
    return cb - (1 - 2 * cs) * e * (d - cb);
  },
  hardlight: function (cb, cs) {
    return colorBlendModeFunctions.overlay(cs, cb);
  },
  difference: function (cb, cs) {
    return Math.abs(cb - cs);
  },
  exclusion: function (cb, cs) {
    return cb + cs - 2 * cb * cs;
  },
  // non-w3c functions:
  average: function (cb, cs) {
    return (cb + cs) / 2;
  },
  negation: function (cb, cs) {
    return 1 - Math.abs(cb + cs - 1);
  }
};
for (const f in colorBlendModeFunctions) {
  if (colorBlendModeFunctions.hasOwnProperty(f)) {
    colorBlend[f] = colorBlend.bind(null, colorBlendModeFunctions[f]);
  }
}
var _default = colorBlend;
exports.default = _default;

},{"../tree/color":64}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _color = _interopRequireDefault(require("../tree/color"));
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _expression = _interopRequireDefault(require("../tree/expression"));
var _operation = _interopRequireDefault(require("../tree/operation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let colorFunctions;
function clamp(val) {
  return Math.min(1, Math.max(0, val));
}
function hsla(origColor, hsl) {
  const color = colorFunctions.hsla(hsl.h, hsl.s, hsl.l, hsl.a);
  if (color) {
    if (origColor.value && /^(rgb|hsl)/.test(origColor.value)) {
      color.value = origColor.value;
    } else {
      color.value = 'rgb';
    }
    return color;
  }
}
function toHSL(color) {
  if (color.toHSL) {
    return color.toHSL();
  } else {
    throw new Error('Argument cannot be evaluated to a color');
  }
}
function toHSV(color) {
  if (color.toHSV) {
    return color.toHSV();
  } else {
    throw new Error('Argument cannot be evaluated to a color');
  }
}
function number(n) {
  if (n instanceof _dimension.default) {
    return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
  } else if (typeof n === 'number') {
    return n;
  } else {
    throw {
      type: 'Argument',
      message: 'color functions take numbers as parameters'
    };
  }
}
function scaled(n, size) {
  if (n instanceof _dimension.default && n.unit.is('%')) {
    return parseFloat(n.value * size / 100);
  } else {
    return number(n);
  }
}
colorFunctions = {
  rgb: function (r, g, b) {
    let a = 1;
    /**
     * Comma-less syntax
     *   e.g. rgb(0 128 255 / 50%)
     */
    if (r instanceof _expression.default) {
      const val = r.value;
      r = val[0];
      g = val[1];
      b = val[2];
      /** 
       * @todo - should this be normalized in
       *   function caller? Or parsed differently?
       */
      if (b instanceof _operation.default) {
        const op = b;
        b = op.operands[0];
        a = op.operands[1];
      }
    }
    const color = colorFunctions.rgba(r, g, b, a);
    if (color) {
      color.value = 'rgb';
      return color;
    }
  },
  rgba: function (r, g, b, a) {
    try {
      if (r instanceof _color.default) {
        if (g) {
          a = number(g);
        } else {
          a = r.alpha;
        }
        return new _color.default(r.rgb, a, 'rgba');
      }
      const rgb = [r, g, b].map(c => scaled(c, 255));
      a = number(a);
      return new _color.default(rgb, a, 'rgba');
    } catch (e) {}
  },
  hsl: function (h, s, l) {
    let a = 1;
    if (h instanceof _expression.default) {
      const val = h.value;
      h = val[0];
      s = val[1];
      l = val[2];
      if (l instanceof _operation.default) {
        const op = l;
        l = op.operands[0];
        a = op.operands[1];
      }
    }
    const color = colorFunctions.hsla(h, s, l, a);
    if (color) {
      color.value = 'hsl';
      return color;
    }
  },
  hsla: function (h, s, l, a) {
    try {
      if (h instanceof _color.default) {
        if (s) {
          a = number(s);
        } else {
          a = h.alpha;
        }
        return new _color.default(h.rgb, a, 'hsla');
      }
      let m1;
      let m2;
      function hue(h) {
        h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
        if (h * 6 < 1) {
          return m1 + (m2 - m1) * h * 6;
        } else if (h * 2 < 1) {
          return m2;
        } else if (h * 3 < 2) {
          return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        } else {
          return m1;
        }
      }
      h = number(h) % 360 / 360;
      s = clamp(number(s));
      l = clamp(number(l));
      a = clamp(number(a));
      m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
      m1 = l * 2 - m2;
      const rgb = [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
      a = number(a);
      return new _color.default(rgb, a, 'hsla');
    } catch (e) {}
  },
  hsv: function (h, s, v) {
    return colorFunctions.hsva(h, s, v, 1.0);
  },
  hsva: function (h, s, v, a) {
    h = number(h) % 360 / 360 * 360;
    s = number(s);
    v = number(v);
    a = number(a);
    let i;
    let f;
    i = Math.floor(h / 60 % 6);
    f = h / 60 - i;
    const vs = [v, v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)];
    const perm = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]];
    return colorFunctions.rgba(vs[perm[i][0]] * 255, vs[perm[i][1]] * 255, vs[perm[i][2]] * 255, a);
  },
  hue: function (color) {
    return new _dimension.default(toHSL(color).h);
  },
  saturation: function (color) {
    return new _dimension.default(toHSL(color).s * 100, '%');
  },
  lightness: function (color) {
    return new _dimension.default(toHSL(color).l * 100, '%');
  },
  hsvhue: function (color) {
    return new _dimension.default(toHSV(color).h);
  },
  hsvsaturation: function (color) {
    return new _dimension.default(toHSV(color).s * 100, '%');
  },
  hsvvalue: function (color) {
    return new _dimension.default(toHSV(color).v * 100, '%');
  },
  red: function (color) {
    return new _dimension.default(color.rgb[0]);
  },
  green: function (color) {
    return new _dimension.default(color.rgb[1]);
  },
  blue: function (color) {
    return new _dimension.default(color.rgb[2]);
  },
  alpha: function (color) {
    return new _dimension.default(toHSL(color).a);
  },
  luma: function (color) {
    return new _dimension.default(color.luma() * color.alpha * 100, '%');
  },
  luminance: function (color) {
    const luminance = 0.2126 * color.rgb[0] / 255 + 0.7152 * color.rgb[1] / 255 + 0.0722 * color.rgb[2] / 255;
    return new _dimension.default(luminance * color.alpha * 100, '%');
  },
  saturate: function (color, amount, method) {
    // filter: saturate(3.2);
    // should be kept as is, so check for color
    if (!color.rgb) {
      return null;
    }
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.s += hsl.s * amount.value / 100;
    } else {
      hsl.s += amount.value / 100;
    }
    hsl.s = clamp(hsl.s);
    return hsla(color, hsl);
  },
  desaturate: function (color, amount, method) {
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.s -= hsl.s * amount.value / 100;
    } else {
      hsl.s -= amount.value / 100;
    }
    hsl.s = clamp(hsl.s);
    return hsla(color, hsl);
  },
  lighten: function (color, amount, method) {
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.l += hsl.l * amount.value / 100;
    } else {
      hsl.l += amount.value / 100;
    }
    hsl.l = clamp(hsl.l);
    return hsla(color, hsl);
  },
  darken: function (color, amount, method) {
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.l -= hsl.l * amount.value / 100;
    } else {
      hsl.l -= amount.value / 100;
    }
    hsl.l = clamp(hsl.l);
    return hsla(color, hsl);
  },
  fadein: function (color, amount, method) {
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.a += hsl.a * amount.value / 100;
    } else {
      hsl.a += amount.value / 100;
    }
    hsl.a = clamp(hsl.a);
    return hsla(color, hsl);
  },
  fadeout: function (color, amount, method) {
    const hsl = toHSL(color);
    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.a -= hsl.a * amount.value / 100;
    } else {
      hsl.a -= amount.value / 100;
    }
    hsl.a = clamp(hsl.a);
    return hsla(color, hsl);
  },
  fade: function (color, amount) {
    const hsl = toHSL(color);
    hsl.a = amount.value / 100;
    hsl.a = clamp(hsl.a);
    return hsla(color, hsl);
  },
  spin: function (color, amount) {
    const hsl = toHSL(color);
    const hue = (hsl.h + amount.value) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return hsla(color, hsl);
  },
  //
  // Copyright (c) 2006-2009 Hampton Catlin, Natalie Weizenbaum, and Chris Eppstein
  // http://sass-lang.com
  //
  mix: function (color1, color2, weight) {
    if (!weight) {
      weight = new _dimension.default(50);
    }
    const p = weight.value / 100.0;
    const w = p * 2 - 1;
    const a = toHSL(color1).a - toHSL(color2).a;
    const w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    const w2 = 1 - w1;
    const rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2, color1.rgb[1] * w1 + color2.rgb[1] * w2, color1.rgb[2] * w1 + color2.rgb[2] * w2];
    const alpha = color1.alpha * p + color2.alpha * (1 - p);
    return new _color.default(rgb, alpha);
  },
  greyscale: function (color) {
    return colorFunctions.desaturate(color, new _dimension.default(100));
  },
  contrast: function (color, dark, light, threshold) {
    // filter: contrast(3.2);
    // should be kept as is, so check for color
    if (!color.rgb) {
      return null;
    }
    if (typeof light === 'undefined') {
      light = colorFunctions.rgba(255, 255, 255, 1.0);
    }
    if (typeof dark === 'undefined') {
      dark = colorFunctions.rgba(0, 0, 0, 1.0);
    }
    // Figure out which is actually light and dark:
    if (dark.luma() > light.luma()) {
      const t = light;
      light = dark;
      dark = t;
    }
    if (typeof threshold === 'undefined') {
      threshold = 0.43;
    } else {
      threshold = number(threshold);
    }
    if (color.luma() < threshold) {
      return light;
    } else {
      return dark;
    }
  },
  // Changes made in 2.7.0 - Reverted in 3.0.0
  // contrast: function (color, color1, color2, threshold) {
  //     // Return which of `color1` and `color2` has the greatest contrast with `color`
  //     // according to the standard WCAG contrast ratio calculation.
  //     // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
  //     // The threshold param is no longer used, in line with SASS.
  //     // filter: contrast(3.2);
  //     // should be kept as is, so check for color
  //     if (!color.rgb) {
  //         return null;
  //     }
  //     if (typeof color1 === 'undefined') {
  //         color1 = colorFunctions.rgba(0, 0, 0, 1.0);
  //     }
  //     if (typeof color2 === 'undefined') {
  //         color2 = colorFunctions.rgba(255, 255, 255, 1.0);
  //     }
  //     var contrast1, contrast2;
  //     var luma = color.luma();
  //     var luma1 = color1.luma();
  //     var luma2 = color2.luma();
  //     // Calculate contrast ratios for each color
  //     if (luma > luma1) {
  //         contrast1 = (luma + 0.05) / (luma1 + 0.05);
  //     } else {
  //         contrast1 = (luma1 + 0.05) / (luma + 0.05);
  //     }
  //     if (luma > luma2) {
  //         contrast2 = (luma + 0.05) / (luma2 + 0.05);
  //     } else {
  //         contrast2 = (luma2 + 0.05) / (luma + 0.05);
  //     }
  //     if (contrast1 > contrast2) {
  //         return color1;
  //     } else {
  //         return color2;
  //     }
  // },
  argb: function (color) {
    return new _anonymous.default(color.toARGB());
  },
  color: function (c) {
    if (c instanceof _quoted.default && /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/i.test(c.value)) {
      const val = c.value.slice(1);
      return new _color.default(val, undefined, `#${val}`);
    }
    if (c instanceof _color.default || (c = _color.default.fromKeyword(c.value))) {
      c.value = undefined;
      return c;
    }
    throw {
      type: 'Argument',
      message: 'argument must be a color keyword or 3|4|6|8 digit hex e.g. #FFF'
    };
  },
  tint: function (color, amount) {
    return colorFunctions.mix(colorFunctions.rgb(255, 255, 255), color, amount);
  },
  shade: function (color, amount) {
    return colorFunctions.mix(colorFunctions.rgb(0, 0, 0), color, amount);
  }
};
var _default = colorFunctions;
exports.default = _default;

},{"../tree/anonymous":59,"../tree/color":64,"../tree/dimension":71,"../tree/expression":73,"../tree/operation":86,"../tree/quoted":89}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _url = _interopRequireDefault(require("../tree/url"));
var utils = _interopRequireWildcard(require("../utils"));
var _logger = _interopRequireDefault(require("../logger"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = environment => {
  const fallback = (functionThis, node) => new _url.default(node, functionThis.index, functionThis.currentFileInfo).eval(functionThis.context);
  return {
    'data-uri': function (mimetypeNode, filePathNode) {
      if (!filePathNode) {
        filePathNode = mimetypeNode;
        mimetypeNode = null;
      }
      let mimetype = mimetypeNode && mimetypeNode.value;
      let filePath = filePathNode.value;
      const currentFileInfo = this.currentFileInfo;
      const currentDirectory = currentFileInfo.rewriteUrls ? currentFileInfo.currentDirectory : currentFileInfo.entryPath;
      const fragmentStart = filePath.indexOf('#');
      let fragment = '';
      if (fragmentStart !== -1) {
        fragment = filePath.slice(fragmentStart);
        filePath = filePath.slice(0, fragmentStart);
      }
      const context = utils.clone(this.context);
      context.rawBuffer = true;
      const fileManager = environment.getFileManager(filePath, currentDirectory, context, environment, true);
      if (!fileManager) {
        return fallback(this, filePathNode);
      }
      let useBase64 = false;

      // detect the mimetype if not given
      if (!mimetypeNode) {
        mimetype = environment.mimeLookup(filePath);
        if (mimetype === 'image/svg+xml') {
          useBase64 = false;
        } else {
          // use base 64 unless it's an ASCII or UTF-8 format
          const charset = environment.charsetLookup(mimetype);
          useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
        }
        if (useBase64) {
          mimetype += ';base64';
        }
      } else {
        useBase64 = /;base64$/.test(mimetype);
      }
      const fileSync = fileManager.loadFileSync(filePath, currentDirectory, context, environment);
      if (!fileSync.contents) {
        _logger.default.warn(`Skipped data-uri embedding of ${filePath} because file not found`);
        return fallback(this, filePathNode || mimetypeNode);
      }
      let buf = fileSync.contents;
      if (useBase64 && !environment.encodeBase64) {
        return fallback(this, filePathNode);
      }
      buf = useBase64 ? environment.encodeBase64(buf) : encodeURIComponent(buf);
      const uri = `data:${mimetype},${buf}${fragment}`;
      return new _url.default(new _quoted.default(`"${uri}"`, uri, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    }
  };
};
exports.default = _default;

},{"../logger":48,"../tree/quoted":89,"../tree/url":94,"../utils":98}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _keyword = _interopRequireDefault(require("../tree/keyword"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const defaultFunc = {
  eval: function () {
    const v = this.value_;
    const e = this.error_;
    if (e) {
      throw e;
    }
    if (v != null) {
      return v ? _keyword.default.True : _keyword.default.False;
    }
  },
  value: function (v) {
    this.value_ = v;
  },
  error: function (e) {
    this.error_ = e;
  },
  reset: function () {
    this.value_ = this.error_ = null;
  }
};
var _default = defaultFunc;
exports.default = _default;

},{"../tree/keyword":79}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _expression = _interopRequireDefault(require("../tree/expression"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class functionCaller {
  constructor(name, context, index, currentFileInfo) {
    this.name = name.toLowerCase();
    this.index = index;
    this.context = context;
    this.currentFileInfo = currentFileInfo;
    this.func = context.frames[0].functionRegistry.get(this.name);
  }
  isValid() {
    return Boolean(this.func);
  }
  call(args) {
    if (!Array.isArray(args)) {
      args = [args];
    }
    const evalArgs = this.func.evalArgs;
    if (evalArgs !== false) {
      args = args.map(a => a.eval(this.context));
    }
    const commentFilter = item => !(item.type === 'Comment');

    // This code is terrible and should be replaced as per this issue...
    // https://github.com/less/less.js/issues/2477
    args = args.filter(commentFilter).map(item => {
      if (item.type === 'Expression') {
        const subNodes = item.value.filter(commentFilter);
        if (subNodes.length === 1) {
          // https://github.com/less/less.js/issues/3616
          if (item.parens && subNodes[0].op === '/') {
            return item;
          }
          return subNodes[0];
        } else {
          return new _expression.default(subNodes);
        }
      }
      return item;
    });
    if (evalArgs === false) {
      return this.func(this.context, ...args);
    }
    return this.func(...args);
  }
}
var _default = functionCaller;
exports.default = _default;

},{"../tree/expression":73}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function makeRegistry(base) {
  return {
    _data: {},
    add: function (name, func) {
      // precautionary case conversion, as later querying of
      // the registry by function-caller uses lower case as well.
      name = name.toLowerCase();
      if (this._data.hasOwnProperty(name)) {
        // TODO warn
      }
      this._data[name] = func;
    },
    addMultiple: function (functions) {
      Object.keys(functions).forEach(name => {
        this.add(name, functions[name]);
      });
    },
    get: function (name) {
      return this._data[name] || base && base.get(name);
    },
    getLocalFunctions: function () {
      return this._data;
    },
    inherit: function () {
      return makeRegistry(this);
    },
    create: function (base) {
      return makeRegistry(base);
    }
  };
}
var _default = makeRegistry(null);
exports.default = _default;

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _functionRegistry = _interopRequireDefault(require("./function-registry"));
var _functionCaller = _interopRequireDefault(require("./function-caller"));
var _boolean = _interopRequireDefault(require("./boolean"));
var _default2 = _interopRequireDefault(require("./default"));
var _color = _interopRequireDefault(require("./color"));
var _colorBlending = _interopRequireDefault(require("./color-blending"));
var _dataUri = _interopRequireDefault(require("./data-uri"));
var _list = _interopRequireDefault(require("./list"));
var _math = _interopRequireDefault(require("./math"));
var _number = _interopRequireDefault(require("./number"));
var _string = _interopRequireDefault(require("./string"));
var _svg = _interopRequireDefault(require("./svg"));
var _types = _interopRequireDefault(require("./types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = environment => {
  const functions = {
    functionRegistry: _functionRegistry.default,
    functionCaller: _functionCaller.default
  };

  // register functions
  _functionRegistry.default.addMultiple(_boolean.default);
  _functionRegistry.default.add('default', _default2.default.eval.bind(_default2.default));
  _functionRegistry.default.addMultiple(_color.default);
  _functionRegistry.default.addMultiple(_colorBlending.default);
  _functionRegistry.default.addMultiple((0, _dataUri.default)(environment));
  _functionRegistry.default.addMultiple(_list.default);
  _functionRegistry.default.addMultiple(_math.default);
  _functionRegistry.default.addMultiple(_number.default);
  _functionRegistry.default.addMultiple(_string.default);
  _functionRegistry.default.addMultiple((0, _svg.default)(environment));
  _functionRegistry.default.addMultiple(_types.default);
  return functions;
};
exports.default = _default;

},{"./boolean":30,"./color":32,"./color-blending":31,"./data-uri":33,"./default":34,"./function-caller":35,"./function-registry":36,"./list":38,"./math":40,"./number":41,"./string":42,"./svg":43,"./types":44}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _comment = _interopRequireDefault(require("../tree/comment"));
var _node = _interopRequireDefault(require("../tree/node"));
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _declaration = _interopRequireDefault(require("../tree/declaration"));
var _expression = _interopRequireDefault(require("../tree/expression"));
var _ruleset = _interopRequireDefault(require("../tree/ruleset"));
var _selector = _interopRequireDefault(require("../tree/selector"));
var _element = _interopRequireDefault(require("../tree/element"));
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _value = _interopRequireDefault(require("../tree/value"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getItemsFromNode = node => {
  // handle non-array values as an array of length 1
  // return 'undefined' if index is invalid
  const items = Array.isArray(node.value) ? node.value : Array(node);
  return items;
};
var _default = {
  _SELF: function (n) {
    return n;
  },
  '~': function (...expr) {
    if (expr.length === 1) {
      return expr[0];
    }
    return new _value.default(expr);
  },
  extract: function (values, index) {
    // (1-based index)
    index = index.value - 1;
    return getItemsFromNode(values)[index];
  },
  length: function (values) {
    return new _dimension.default(getItemsFromNode(values).length);
  },
  /**
   * Creates a Less list of incremental values.
   * Modeled after Lodash's range function, also exists natively in PHP
   * 
   * @param {Dimension} [start=1]
   * @param {Dimension} end  - e.g. 10 or 10px - unit is added to output
   * @param {Dimension} [step=1] 
   */
  range: function (start, end, step) {
    let from;
    let to;
    let stepValue = 1;
    const list = [];
    if (end) {
      to = end;
      from = start.value;
      if (step) {
        stepValue = step.value;
      }
    } else {
      from = 1;
      to = start;
    }
    for (let i = from; i <= to.value; i += stepValue) {
      list.push(new _dimension.default(i, to.unit));
    }
    return new _expression.default(list);
  },
  each: function (list, rs) {
    const rules = [];
    let newRules;
    let iterator;
    const tryEval = val => {
      if (val instanceof _node.default) {
        return val.eval(this.context);
      }
      return val;
    };
    if (list.value && !(list instanceof _quoted.default)) {
      if (Array.isArray(list.value)) {
        iterator = list.value.map(tryEval);
      } else {
        iterator = [tryEval(list.value)];
      }
    } else if (list.ruleset) {
      iterator = tryEval(list.ruleset).rules;
    } else if (list.rules) {
      iterator = list.rules.map(tryEval);
    } else if (Array.isArray(list)) {
      iterator = list.map(tryEval);
    } else {
      iterator = [tryEval(list)];
    }
    let valueName = '@value';
    let keyName = '@key';
    let indexName = '@index';
    if (rs.params) {
      valueName = rs.params[0] && rs.params[0].name;
      keyName = rs.params[1] && rs.params[1].name;
      indexName = rs.params[2] && rs.params[2].name;
      rs = rs.rules;
    } else {
      rs = rs.ruleset;
    }
    for (let i = 0; i < iterator.length; i++) {
      let key;
      let value;
      const item = iterator[i];
      if (item instanceof _declaration.default) {
        key = typeof item.name === 'string' ? item.name : item.name[0].value;
        value = item.value;
      } else {
        key = new _dimension.default(i + 1);
        value = item;
      }
      if (item instanceof _comment.default) {
        continue;
      }
      newRules = rs.rules.slice(0);
      if (valueName) {
        newRules.push(new _declaration.default(valueName, value, false, false, this.index, this.currentFileInfo));
      }
      if (indexName) {
        newRules.push(new _declaration.default(indexName, new _dimension.default(i + 1), false, false, this.index, this.currentFileInfo));
      }
      if (keyName) {
        newRules.push(new _declaration.default(keyName, key, false, false, this.index, this.currentFileInfo));
      }
      rules.push(new _ruleset.default([new _selector.default([new _element.default("", '&')])], newRules, rs.strictImports, rs.visibilityInfo()));
    }
    return new _ruleset.default([new _selector.default([new _element.default("", '&')])], rules, rs.strictImports, rs.visibilityInfo()).eval(this.context);
  }
};
exports.default = _default;

},{"../tree/comment":66,"../tree/declaration":69,"../tree/dimension":71,"../tree/element":72,"../tree/expression":73,"../tree/node":85,"../tree/quoted":89,"../tree/ruleset":90,"../tree/selector":91,"../tree/value":95}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dimension = _interopRequireDefault(require("../tree/dimension"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MathHelper = (fn, unit, n) => {
  if (!(n instanceof _dimension.default)) {
    throw {
      type: 'Argument',
      message: 'argument must be a number'
    };
  }
  if (unit == null) {
    unit = n.unit;
  } else {
    n = n.unify();
  }
  return new _dimension.default(fn(parseFloat(n.value)), unit);
};
var _default = MathHelper;
exports.default = _default;

},{"../tree/dimension":71}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mathHelper = _interopRequireDefault(require("./math-helper.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const mathFunctions = {
  // name,  unit
  ceil: null,
  floor: null,
  sqrt: null,
  abs: null,
  tan: '',
  sin: '',
  cos: '',
  atan: 'rad',
  asin: 'rad',
  acos: 'rad'
};
for (const f in mathFunctions) {
  if (mathFunctions.hasOwnProperty(f)) {
    mathFunctions[f] = _mathHelper.default.bind(null, Math[f], mathFunctions[f]);
  }
}
mathFunctions.round = (n, f) => {
  const fraction = typeof f === 'undefined' ? 0 : f.value;
  return (0, _mathHelper.default)(num => num.toFixed(fraction), null, n);
};
var _default = mathFunctions;
exports.default = _default;

},{"./math-helper.js":39}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _mathHelper = _interopRequireDefault(require("./math-helper.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const minMax = function (isMin, args) {
  args = Array.prototype.slice.call(args);
  switch (args.length) {
    case 0:
      throw {
        type: 'Argument',
        message: 'one or more arguments required'
      };
  }
  let i; // key is the unit.toString() for unified Dimension values,
  let j;
  let current;
  let currentUnified;
  let referenceUnified;
  let unit;
  let unitStatic;
  let unitClone;
  const
  // elems only contains original argument values.
  order = [];
  const values = {};
  // value is the index into the order array.
  for (i = 0; i < args.length; i++) {
    current = args[i];
    if (!(current instanceof _dimension.default)) {
      if (Array.isArray(args[i].value)) {
        Array.prototype.push.apply(args, Array.prototype.slice.call(args[i].value));
      }
      continue;
    }
    currentUnified = current.unit.toString() === '' && unitClone !== undefined ? new _dimension.default(current.value, unitClone).unify() : current.unify();
    unit = currentUnified.unit.toString() === '' && unitStatic !== undefined ? unitStatic : currentUnified.unit.toString();
    unitStatic = unit !== '' && unitStatic === undefined || unit !== '' && order[0].unify().unit.toString() === '' ? unit : unitStatic;
    unitClone = unit !== '' && unitClone === undefined ? current.unit.toString() : unitClone;
    j = values[''] !== undefined && unit !== '' && unit === unitStatic ? values[''] : values[unit];
    if (j === undefined) {
      if (unitStatic !== undefined && unit !== unitStatic) {
        throw {
          type: 'Argument',
          message: 'incompatible types'
        };
      }
      values[unit] = order.length;
      order.push(current);
      continue;
    }
    referenceUnified = order[j].unit.toString() === '' && unitClone !== undefined ? new _dimension.default(order[j].value, unitClone).unify() : order[j].unify();
    if (isMin && currentUnified.value < referenceUnified.value || !isMin && currentUnified.value > referenceUnified.value) {
      order[j] = current;
    }
  }
  if (order.length == 1) {
    return order[0];
  }
  args = order.map(function (a) {
    return a.toCSS(this.context);
  }).join(this.context.compress ? ',' : ', ');
  return new _anonymous.default(`${isMin ? 'min' : 'max'}(${args})`);
};
var _default = {
  min: function (...args) {
    try {
      return minMax(true, args);
    } catch (e) {}
  },
  max: function (...args) {
    try {
      return minMax(false, args);
    } catch (e) {}
  },
  convert: function (val, unit) {
    return val.convertTo(unit.value);
  },
  pi: function () {
    return new _dimension.default(Math.PI);
  },
  mod: function (a, b) {
    return new _dimension.default(a.value % b.value, a.unit);
  },
  pow: function (x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      x = new _dimension.default(x);
      y = new _dimension.default(y);
    } else if (!(x instanceof _dimension.default) || !(y instanceof _dimension.default)) {
      throw {
        type: 'Argument',
        message: 'arguments must be numbers'
      };
    }
    return new _dimension.default(Math.pow(x.value, y.value), x.unit);
  },
  percentage: function (n) {
    const result = (0, _mathHelper.default)(num => num * 100, '%', n);
    return result;
  }
};
exports.default = _default;

},{"../tree/anonymous":59,"../tree/dimension":71,"./math-helper.js":39}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _javascript = _interopRequireDefault(require("../tree/javascript"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  e: function (str) {
    return new _quoted.default('"', str instanceof _javascript.default ? str.evaluated : str.value, true);
  },
  escape: function (str) {
    return new _anonymous.default(encodeURI(str.value).replace(/=/g, '%3D').replace(/:/g, '%3A').replace(/#/g, '%23').replace(/;/g, '%3B').replace(/\(/g, '%28').replace(/\)/g, '%29'));
  },
  replace: function (string, pattern, replacement, flags) {
    let result = string.value;
    replacement = replacement.type === 'Quoted' ? replacement.value : replacement.toCSS();
    result = result.replace(new RegExp(pattern.value, flags ? flags.value : ''), replacement);
    return new _quoted.default(string.quote || '', result, string.escaped);
  },
  '%': function (string /* arg, arg, ... */) {
    const args = Array.prototype.slice.call(arguments, 1);
    let result = string.value;
    for (let i = 0; i < args.length; i++) {
      /* jshint loopfunc:true */
      result = result.replace(/%[sda]/i, token => {
        const value = args[i].type === 'Quoted' && token.match(/s/i) ? args[i].value : args[i].toCSS();
        return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
      });
    }
    result = result.replace(/%%/g, '%');
    return new _quoted.default(string.quote || '', result, string.escaped);
  }
};
exports.default = _default;

},{"../tree/anonymous":59,"../tree/javascript":77,"../tree/quoted":89}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _color = _interopRequireDefault(require("../tree/color"));
var _expression = _interopRequireDefault(require("../tree/expression"));
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _url = _interopRequireDefault(require("../tree/url"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = environment => {
  return {
    'svg-gradient': function (direction) {
      let stops;
      let gradientDirectionSvg;
      let gradientType = 'linear';
      let rectangleDimension = 'x="0" y="0" width="1" height="1"';
      const renderEnv = {
        compress: false
      };
      let returner;
      const directionValue = direction.toCSS(renderEnv);
      let i;
      let color;
      let position;
      let positionValue;
      let alpha;
      function throwArgumentDescriptor() {
        throw {
          type: 'Argument',
          message: 'svg-gradient expects direction, start_color [start_position], [color position,]...,' + ' end_color [end_position] or direction, color list'
        };
      }
      if (arguments.length == 2) {
        if (arguments[1].value.length < 2) {
          throwArgumentDescriptor();
        }
        stops = arguments[1].value;
      } else if (arguments.length < 3) {
        throwArgumentDescriptor();
      } else {
        stops = Array.prototype.slice.call(arguments, 1);
      }
      switch (directionValue) {
        case 'to bottom':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
          break;
        case 'to right':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
          break;
        case 'to bottom right':
          gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
          break;
        case 'to top right':
          gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
          break;
        case 'ellipse':
        case 'ellipse at center':
          gradientType = 'radial';
          gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
          rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
          break;
        default:
          throw {
            type: 'Argument',
            message: 'svg-gradient direction must be \'to bottom\', \'to right\',' + ' \'to bottom right\', \'to top right\' or \'ellipse at center\''
          };
      }
      returner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><${gradientType}Gradient id="g" ${gradientDirectionSvg}>`;
      for (i = 0; i < stops.length; i += 1) {
        if (stops[i] instanceof _expression.default) {
          color = stops[i].value[0];
          position = stops[i].value[1];
        } else {
          color = stops[i];
          position = undefined;
        }
        if (!(color instanceof _color.default) || !((i === 0 || i + 1 === stops.length) && position === undefined) && !(position instanceof _dimension.default)) {
          throwArgumentDescriptor();
        }
        positionValue = position ? position.toCSS(renderEnv) : i === 0 ? '0%' : '100%';
        alpha = color.alpha;
        returner += `<stop offset="${positionValue}" stop-color="${color.toRGB()}"${alpha < 1 ? ` stop-opacity="${alpha}"` : ''}/>`;
      }
      returner += `</${gradientType}Gradient><rect ${rectangleDimension} fill="url(#g)" /></svg>`;
      returner = encodeURIComponent(returner);
      returner = `data:image/svg+xml,${returner}`;
      return new _url.default(new _quoted.default(`'${returner}'`, returner, false, this.index, this.currentFileInfo), this.index, this.currentFileInfo);
    }
  };
};
exports.default = _default;

},{"../tree/color":64,"../tree/dimension":71,"../tree/expression":73,"../tree/quoted":89,"../tree/url":94}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _keyword = _interopRequireDefault(require("../tree/keyword"));
var _detachedRuleset = _interopRequireDefault(require("../tree/detached-ruleset"));
var _dimension = _interopRequireDefault(require("../tree/dimension"));
var _color = _interopRequireDefault(require("../tree/color"));
var _quoted = _interopRequireDefault(require("../tree/quoted"));
var _anonymous = _interopRequireDefault(require("../tree/anonymous"));
var _url = _interopRequireDefault(require("../tree/url"));
var _operation = _interopRequireDefault(require("../tree/operation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isa = (n, Type) => n instanceof Type ? _keyword.default.True : _keyword.default.False;
const isunit = (n, unit) => {
  if (unit === undefined) {
    throw {
      type: 'Argument',
      message: 'missing the required second argument to isunit.'
    };
  }
  unit = typeof unit.value === 'string' ? unit.value : unit;
  if (typeof unit !== 'string') {
    throw {
      type: 'Argument',
      message: 'Second argument to isunit should be a unit or a string.'
    };
  }
  return n instanceof _dimension.default && n.unit.is(unit) ? _keyword.default.True : _keyword.default.False;
};
var _default = {
  isruleset: function (n) {
    return isa(n, _detachedRuleset.default);
  },
  iscolor: function (n) {
    return isa(n, _color.default);
  },
  isnumber: function (n) {
    return isa(n, _dimension.default);
  },
  isstring: function (n) {
    return isa(n, _quoted.default);
  },
  iskeyword: function (n) {
    return isa(n, _keyword.default);
  },
  isurl: function (n) {
    return isa(n, _url.default);
  },
  ispixel: function (n) {
    return isunit(n, 'px');
  },
  ispercentage: function (n) {
    return isunit(n, '%');
  },
  isem: function (n) {
    return isunit(n, 'em');
  },
  isunit,
  unit: function (val, unit) {
    if (!(val instanceof _dimension.default)) {
      throw {
        type: 'Argument',
        message: `the first argument to unit must be a number${val instanceof _operation.default ? '. Have you forgotten parenthesis?' : ''}`
      };
    }
    if (unit) {
      if (unit instanceof _keyword.default) {
        unit = unit.value;
      } else {
        unit = unit.toCSS();
      }
    } else {
      unit = '';
    }
    return new _dimension.default(val.value, unit);
  },
  'get-unit': function (n) {
    return new _anonymous.default(n.unit);
  }
};
exports.default = _default;

},{"../tree/anonymous":59,"../tree/color":64,"../tree/detached-ruleset":70,"../tree/dimension":71,"../tree/keyword":79,"../tree/operation":86,"../tree/quoted":89,"../tree/url":94}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _contexts = _interopRequireDefault(require("./contexts"));
var _parser = _interopRequireDefault(require("./parser/parser"));
var _lessError = _interopRequireDefault(require("./less-error"));
var utils = _interopRequireWildcard(require("./utils"));
var _logger = _interopRequireDefault(require("./logger"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(environment) {
  // FileInfo = {
  //  'rewriteUrls' - option - whether to adjust URL's to be relative
  //  'filename' - full resolved filename of current file
  //  'rootpath' - path to append to normal URLs for this node
  //  'currentDirectory' - path to the current file, absolute
  //  'rootFilename' - filename of the base file
  //  'entryPath' - absolute path to the entry file
  //  'reference' - whether the file should not be output and only output parts that are referenced

  class ImportManager {
    constructor(less, context, rootFileInfo) {
      this.less = less;
      this.rootFilename = rootFileInfo.filename;
      this.paths = context.paths || []; // Search paths, when importing
      this.contents = {}; // map - filename to contents of all the files
      this.contentsIgnoredChars = {}; // map - filename to lines at the beginning of each file to ignore
      this.mime = context.mime;
      this.error = null;
      this.context = context;
      // Deprecated? Unused outside of here, could be useful.
      this.queue = []; // Files which haven't been imported yet
      this.files = {}; // Holds the imported parse trees.
    }

    /**
     * Add an import to be imported
     * @param path - the raw path
     * @param tryAppendExtension - whether to try appending a file extension (.less or .js if the path has no extension)
     * @param currentFileInfo - the current file info (used for instance to work out relative paths)
     * @param importOptions - import options
     * @param callback - callback for when it is imported
     */
    push(path, tryAppendExtension, currentFileInfo, importOptions, callback) {
      const importManager = this,
        pluginLoader = this.context.pluginManager.Loader;
      this.queue.push(path);
      const fileParsedFunc = function (e, root, fullPath) {
        importManager.queue.splice(importManager.queue.indexOf(path), 1); // Remove the path from the queue

        const importedEqualsRoot = fullPath === importManager.rootFilename;
        if (importOptions.optional && e) {
          callback(null, {
            rules: []
          }, false, null);
          _logger.default.info(`The file ${fullPath} was skipped because it was not found and the import was marked optional.`);
        } else {
          // Inline imports aren't cached here.
          // If we start to cache them, please make sure they won't conflict with non-inline imports of the
          // same name as they used to do before this comment and the condition below have been added.
          if (!importManager.files[fullPath] && !importOptions.inline) {
            importManager.files[fullPath] = {
              root,
              options: importOptions
            };
          }
          if (e && !importManager.error) {
            importManager.error = e;
          }
          callback(e, root, importedEqualsRoot, fullPath);
        }
      };
      const newFileInfo = {
        rewriteUrls: this.context.rewriteUrls,
        entryPath: currentFileInfo.entryPath,
        rootpath: currentFileInfo.rootpath,
        rootFilename: currentFileInfo.rootFilename
      };
      const fileManager = environment.getFileManager(path, currentFileInfo.currentDirectory, this.context, environment);
      if (!fileManager) {
        fileParsedFunc({
          message: `Could not find a file-manager for ${path}`
        });
        return;
      }
      const loadFileCallback = function (loadedFile) {
        let plugin;
        const resolvedFilename = loadedFile.filename;
        const contents = loadedFile.contents.replace(/^\uFEFF/, '');

        // Pass on an updated rootpath if path of imported file is relative and file
        // is in a (sub|sup) directory
        //
        // Examples:
        // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
        //   then rootpath should become 'less/module/nav/'
        // - If path of imported file is '../mixins.less' and rootpath is 'less/',
        //   then rootpath should become 'less/../'
        newFileInfo.currentDirectory = fileManager.getPath(resolvedFilename);
        if (newFileInfo.rewriteUrls) {
          newFileInfo.rootpath = fileManager.join(importManager.context.rootpath || '', fileManager.pathDiff(newFileInfo.currentDirectory, newFileInfo.entryPath));
          if (!fileManager.isPathAbsolute(newFileInfo.rootpath) && fileManager.alwaysMakePathsAbsolute()) {
            newFileInfo.rootpath = fileManager.join(newFileInfo.entryPath, newFileInfo.rootpath);
          }
        }
        newFileInfo.filename = resolvedFilename;
        const newEnv = new _contexts.default.Parse(importManager.context);
        newEnv.processImports = false;
        importManager.contents[resolvedFilename] = contents;
        if (currentFileInfo.reference || importOptions.reference) {
          newFileInfo.reference = true;
        }
        if (importOptions.isPlugin) {
          plugin = pluginLoader.evalPlugin(contents, newEnv, importManager, importOptions.pluginArgs, newFileInfo);
          if (plugin instanceof _lessError.default) {
            fileParsedFunc(plugin, null, resolvedFilename);
          } else {
            fileParsedFunc(null, plugin, resolvedFilename);
          }
        } else if (importOptions.inline) {
          fileParsedFunc(null, contents, resolvedFilename);
        } else {
          // import (multiple) parse trees apparently get altered and can't be cached.
          // TODO: investigate why this is
          if (importManager.files[resolvedFilename] && !importManager.files[resolvedFilename].options.multiple && !importOptions.multiple) {
            fileParsedFunc(null, importManager.files[resolvedFilename].root, resolvedFilename);
          } else {
            new _parser.default(newEnv, importManager, newFileInfo).parse(contents, function (e, root) {
              fileParsedFunc(e, root, resolvedFilename);
            });
          }
        }
      };
      let loadedFile;
      let promise;
      const context = utils.clone(this.context);
      if (tryAppendExtension) {
        context.ext = importOptions.isPlugin ? '.js' : '.less';
      }
      if (importOptions.isPlugin) {
        context.mime = 'application/javascript';
        if (context.syncImport) {
          loadedFile = pluginLoader.loadPluginSync(path, currentFileInfo.currentDirectory, context, environment, fileManager);
        } else {
          promise = pluginLoader.loadPlugin(path, currentFileInfo.currentDirectory, context, environment, fileManager);
        }
      } else {
        if (context.syncImport) {
          loadedFile = fileManager.loadFileSync(path, currentFileInfo.currentDirectory, context, environment);
        } else {
          promise = fileManager.loadFile(path, currentFileInfo.currentDirectory, context, environment, (err, loadedFile) => {
            if (err) {
              fileParsedFunc(err);
            } else {
              loadFileCallback(loadedFile);
            }
          });
        }
      }
      if (loadedFile) {
        if (!loadedFile.filename) {
          fileParsedFunc(loadedFile);
        } else {
          loadFileCallback(loadedFile);
        }
      } else if (promise) {
        promise.then(loadFileCallback, fileParsedFunc);
      }
    }
  }
  return ImportManager;
}
;

},{"./contexts":22,"./less-error":47,"./logger":48,"./parser/parser":53,"./utils":98}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _environment = _interopRequireDefault(require("./environment/environment"));
var _data = _interopRequireDefault(require("./data"));
var _tree = _interopRequireDefault(require("./tree"));
var _abstractFileManager = _interopRequireDefault(require("./environment/abstract-file-manager"));
var _abstractPluginLoader = _interopRequireDefault(require("./environment/abstract-plugin-loader"));
var _visitors = _interopRequireDefault(require("./visitors"));
var _parser = _interopRequireDefault(require("./parser/parser"));
var _functions = _interopRequireDefault(require("./functions"));
var _contexts = _interopRequireDefault(require("./contexts"));
var _lessError = _interopRequireDefault(require("./less-error"));
var _transformTree = _interopRequireDefault(require("./transform-tree"));
var utils = _interopRequireWildcard(require("./utils"));
var _pluginManager = _interopRequireDefault(require("./plugin-manager"));
var _logger = _interopRequireDefault(require("./logger"));
var _sourceMapOutput = _interopRequireDefault(require("./source-map-output"));
var _sourceMapBuilder = _interopRequireDefault(require("./source-map-builder"));
var _parseTree = _interopRequireDefault(require("./parse-tree"));
var _importManager = _interopRequireDefault(require("./import-manager"));
var _parse = _interopRequireDefault(require("./parse"));
var _render = _interopRequireDefault(require("./render"));
var _package = require("../../package.json");
var _parseNodeVersion = _interopRequireDefault(require("parse-node-version"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(environment, fileManagers) {
  let sourceMapOutput, sourceMapBuilder, parseTree, importManager;
  environment = new _environment.default(environment, fileManagers);
  sourceMapOutput = (0, _sourceMapOutput.default)(environment);
  sourceMapBuilder = (0, _sourceMapBuilder.default)(sourceMapOutput, environment);
  parseTree = (0, _parseTree.default)(sourceMapBuilder);
  importManager = (0, _importManager.default)(environment);
  const render = (0, _render.default)(environment, parseTree, importManager);
  const parse = (0, _parse.default)(environment, parseTree, importManager);
  const v = (0, _parseNodeVersion.default)(`v${_package.version}`);
  const initial = {
    version: [v.major, v.minor, v.patch],
    data: _data.default,
    tree: _tree.default,
    Environment: _environment.default,
    AbstractFileManager: _abstractFileManager.default,
    AbstractPluginLoader: _abstractPluginLoader.default,
    environment,
    visitors: _visitors.default,
    Parser: _parser.default,
    functions: (0, _functions.default)(environment),
    contexts: _contexts.default,
    SourceMapOutput: sourceMapOutput,
    SourceMapBuilder: sourceMapBuilder,
    ParseTree: parseTree,
    ImportManager: importManager,
    render,
    parse,
    LessError: _lessError.default,
    transformTree: _transformTree.default,
    utils,
    PluginManager: _pluginManager.default,
    logger: _logger.default
  };

  // Create a public API

  const ctor = function (t) {
    return function () {
      const obj = Object.create(t.prototype);
      t.apply(obj, Array.prototype.slice.call(arguments, 0));
      return obj;
    };
  };
  let t;
  const api = Object.create(initial);
  for (const n in initial.tree) {
    /* eslint guard-for-in: 0 */
    t = initial.tree[n];
    if (typeof t === 'function') {
      api[n.toLowerCase()] = ctor(t);
    } else {
      api[n] = Object.create(null);
      for (const o in t) {
        /* eslint guard-for-in: 0 */
        api[n][o.toLowerCase()] = ctor(t[o]);
      }
    }
  }

  /**
   * Some of the functions assume a `this` context of the API object,
   * which causes it to fail when wrapped for ES6 imports.
   * 
   * An assumed `this` should be removed in the future.
   */
  initial.parse = initial.parse.bind(api);
  initial.render = initial.render.bind(api);
  return api;
}
;

},{"../../package.json":17,"./contexts":22,"./data":24,"./environment/abstract-file-manager":27,"./environment/abstract-plugin-loader":28,"./environment/environment":29,"./functions":37,"./import-manager":45,"./less-error":47,"./logger":48,"./parse":50,"./parse-tree":49,"./parser/parser":53,"./plugin-manager":54,"./render":55,"./source-map-builder":56,"./source-map-output":57,"./transform-tree":58,"./tree":76,"./utils":98,"./visitors":102,"parse-node-version":5}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const anonymousFunc = /(<anonymous>|Function):(\d+):(\d+)/;

/**
 * This is a centralized class of any error that could be thrown internally (mostly by the parser).
 * Besides standard .message it keeps some additional data like a path to the file where the error
 * occurred along with line and column numbers.
 *
 * @class
 * @extends Error
 * @type {module.LessError}
 *
 * @prop {string} type
 * @prop {string} filename
 * @prop {number} index
 * @prop {number} line
 * @prop {number} column
 * @prop {number} callLine
 * @prop {number} callExtract
 * @prop {string[]} extract
 *
 * @param {Object} e              - An error object to wrap around or just a descriptive object
 * @param {Object} fileContentMap - An object with file contents in 'contents' property (like importManager) @todo - move to fileManager?
 * @param {string} [currentFilename]
 */
const LessError = function (e, fileContentMap, currentFilename) {
  Error.call(this);
  const filename = e.filename || currentFilename;
  this.message = e.message;
  this.stack = e.stack;
  if (fileContentMap && filename) {
    const input = fileContentMap.contents[filename];
    const loc = utils.getLocation(e.index, input);
    var line = loc.line;
    const col = loc.column;
    const callLine = e.call && utils.getLocation(e.call, input).line;
    const lines = input ? input.split('\n') : '';
    this.type = e.type || 'Syntax';
    this.filename = filename;
    this.index = e.index;
    this.line = typeof line === 'number' ? line + 1 : null;
    this.column = col;
    if (!this.line && this.stack) {
      const found = this.stack.match(anonymousFunc);

      /**
       * We have to figure out how this environment stringifies anonymous functions
       * so we can correctly map plugin errors.
       * 
       * Note, in Node 8, the output of anonymous funcs varied based on parameters
       * being present or not, so we inject dummy params.
       */
      const func = new Function('a', 'throw new Error()');
      let lineAdjust = 0;
      try {
        func();
      } catch (e) {
        const match = e.stack.match(anonymousFunc);
        var line = parseInt(match[2]);
        lineAdjust = 1 - line;
      }
      if (found) {
        if (found[2]) {
          this.line = parseInt(found[2]) + lineAdjust;
        }
        if (found[3]) {
          this.column = parseInt(found[3]);
        }
      }
    }
    this.callLine = callLine + 1;
    this.callExtract = lines[callLine];
    this.extract = [lines[this.line - 2], lines[this.line - 1], lines[this.line]];
  }
};
if (typeof Object.create === 'undefined') {
  const F = function () {};
  F.prototype = Error.prototype;
  LessError.prototype = new F();
} else {
  LessError.prototype = Object.create(Error.prototype);
}
LessError.prototype.constructor = LessError;

/**
 * An overridden version of the default Object.prototype.toString
 * which uses additional information to create a helpful message.
 *
 * @param {Object} options
 * @returns {string}
 */
LessError.prototype.toString = function (options) {
  options = options || {};
  let message = '';
  const extract = this.extract || [];
  let error = [];
  let stylize = function (str) {
    return str;
  };
  if (options.stylize) {
    const type = typeof options.stylize;
    if (type !== 'function') {
      throw Error(`options.stylize should be a function, got a ${type}!`);
    }
    stylize = options.stylize;
  }
  if (this.line !== null) {
    if (typeof extract[0] === 'string') {
      error.push(stylize(`${this.line - 1} ${extract[0]}`, 'grey'));
    }
    if (typeof extract[1] === 'string') {
      let errorTxt = `${this.line} `;
      if (extract[1]) {
        errorTxt += extract[1].slice(0, this.column) + stylize(stylize(stylize(extract[1].substr(this.column, 1), 'bold') + extract[1].slice(this.column + 1), 'red'), 'inverse');
      }
      error.push(errorTxt);
    }
    if (typeof extract[2] === 'string') {
      error.push(stylize(`${this.line + 1} ${extract[2]}`, 'grey'));
    }
    error = `${error.join('\n') + stylize('', 'reset')}\n`;
  }
  message += stylize(`${this.type}Error: ${this.message}`, 'red');
  if (this.filename) {
    message += stylize(' in ', 'red') + this.filename;
  }
  if (this.line) {
    message += stylize(` on line ${this.line}, column ${this.column + 1}:`, 'grey');
  }
  message += `\n${error}`;
  if (this.callLine) {
    message += `${stylize('from ', 'red') + (this.filename || '')}/n`;
    message += `${stylize(this.callLine, 'grey')} ${this.callExtract}/n`;
  }
  return message;
};
var _default = LessError;
exports.default = _default;

},{"./utils":98}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  error: function (msg) {
    this._fireEvent('error', msg);
  },
  warn: function (msg) {
    this._fireEvent('warn', msg);
  },
  info: function (msg) {
    this._fireEvent('info', msg);
  },
  debug: function (msg) {
    this._fireEvent('debug', msg);
  },
  addListener: function (listener) {
    this._listeners.push(listener);
  },
  removeListener: function (listener) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i] === listener) {
        this._listeners.splice(i, 1);
        return;
      }
    }
  },
  _fireEvent: function (type, msg) {
    for (let i = 0; i < this._listeners.length; i++) {
      const logFunction = this._listeners[i][type];
      if (logFunction) {
        logFunction(msg);
      }
    }
  },
  _listeners: []
};
exports.default = _default;

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _lessError = _interopRequireDefault(require("./less-error"));
var _transformTree = _interopRequireDefault(require("./transform-tree"));
var _logger = _interopRequireDefault(require("./logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(SourceMapBuilder) {
  class ParseTree {
    constructor(root, imports) {
      this.root = root;
      this.imports = imports;
    }
    toCSS(options) {
      let evaldRoot;
      const result = {};
      let sourceMapBuilder;
      try {
        evaldRoot = (0, _transformTree.default)(this.root, options);
      } catch (e) {
        throw new _lessError.default(e, this.imports);
      }
      try {
        const compress = Boolean(options.compress);
        if (compress) {
          _logger.default.warn('The compress option has been deprecated. ' + 'We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.');
        }
        const toCSSOptions = {
          compress,
          dumpLineNumbers: options.dumpLineNumbers,
          strictUnits: Boolean(options.strictUnits),
          numPrecision: 8
        };
        if (options.sourceMap) {
          sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
          result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
        } else {
          result.css = evaldRoot.toCSS(toCSSOptions);
        }
      } catch (e) {
        throw new _lessError.default(e, this.imports);
      }
      if (options.pluginManager) {
        const postProcessors = options.pluginManager.getPostProcessors();
        for (let i = 0; i < postProcessors.length; i++) {
          result.css = postProcessors[i].process(result.css, {
            sourceMap: sourceMapBuilder,
            options,
            imports: this.imports
          });
        }
      }
      if (options.sourceMap) {
        result.map = sourceMapBuilder.getExternalSourceMap();
      }
      result.imports = [];
      for (const file in this.imports.files) {
        if (this.imports.files.hasOwnProperty(file) && file !== this.imports.rootFilename) {
          result.imports.push(file);
        }
      }
      return result;
    }
  }
  return ParseTree;
}
;

},{"./less-error":47,"./logger":48,"./transform-tree":58}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _contexts = _interopRequireDefault(require("./contexts"));
var _parser = _interopRequireDefault(require("./parser/parser"));
var _pluginManager = _interopRequireDefault(require("./plugin-manager"));
var _lessError = _interopRequireDefault(require("./less-error"));
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(environment, ParseTree, ImportManager) {
  const parse = function (input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }
    if (!callback) {
      const self = this;
      return new Promise(function (resolve, reject) {
        parse.call(self, input, options, function (err, output) {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        });
      });
    } else {
      let context;
      let rootFileInfo;
      const pluginManager = new _pluginManager.default(this, !options.reUsePluginManager);
      options.pluginManager = pluginManager;
      context = new _contexts.default.Parse(options);
      if (options.rootFileInfo) {
        rootFileInfo = options.rootFileInfo;
      } else {
        const filename = options.filename || 'input';
        const entryPath = filename.replace(/[^\/\\]*$/, '');
        rootFileInfo = {
          filename,
          rewriteUrls: context.rewriteUrls,
          rootpath: context.rootpath || '',
          currentDirectory: entryPath,
          entryPath,
          rootFilename: filename
        };
        // add in a missing trailing slash
        if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== '/') {
          rootFileInfo.rootpath += '/';
        }
      }
      const imports = new ImportManager(this, context, rootFileInfo);
      this.importManager = imports;

      // TODO: allow the plugins to be just a list of paths or names
      // Do an async plugin queue like lessc

      if (options.plugins) {
        options.plugins.forEach(function (plugin) {
          let evalResult, contents;
          if (plugin.fileContent) {
            contents = plugin.fileContent.replace(/^\uFEFF/, '');
            evalResult = pluginManager.Loader.evalPlugin(contents, context, imports, plugin.options, plugin.filename);
            if (evalResult instanceof _lessError.default) {
              return callback(evalResult);
            }
          } else {
            pluginManager.addPlugin(plugin);
          }
        });
      }
      new _parser.default(context, imports, rootFileInfo).parse(input, function (e, root) {
        if (e) {
          return callback(e);
        }
        callback(null, root, imports, options);
      }, options);
    }
  };
  return parse;
}
;

},{"./contexts":22,"./less-error":47,"./parser/parser":53,"./plugin-manager":54,"./utils":98}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
// Split the input into chunks.
function _default(input, fail) {
  const len = input.length;
  let level = 0;
  let parenLevel = 0;
  let lastOpening;
  let lastOpeningParen;
  let lastMultiComment;
  let lastMultiCommentEndBrace;
  const chunks = [];
  let emitFrom = 0;
  let chunkerCurrentIndex;
  let currentChunkStartIndex;
  let cc;
  let cc2;
  let matched;
  function emitChunk(force) {
    const len = chunkerCurrentIndex - emitFrom;
    if (len < 512 && !force || !len) {
      return;
    }
    chunks.push(input.slice(emitFrom, chunkerCurrentIndex + 1));
    emitFrom = chunkerCurrentIndex + 1;
  }
  for (chunkerCurrentIndex = 0; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
    cc = input.charCodeAt(chunkerCurrentIndex);
    if (cc >= 97 && cc <= 122 || cc < 34) {
      // a-z or whitespace
      continue;
    }
    switch (cc) {
      case 40:
        // (
        parenLevel++;
        lastOpeningParen = chunkerCurrentIndex;
        continue;
      case 41:
        // )
        if (--parenLevel < 0) {
          return fail('missing opening `(`', chunkerCurrentIndex);
        }
        continue;
      case 59:
        // ;
        if (!parenLevel) {
          emitChunk();
        }
        continue;
      case 123:
        // {
        level++;
        lastOpening = chunkerCurrentIndex;
        continue;
      case 125:
        // }
        if (--level < 0) {
          return fail('missing opening `{`', chunkerCurrentIndex);
        }
        if (!level && !parenLevel) {
          emitChunk();
        }
        continue;
      case 92:
        // \
        if (chunkerCurrentIndex < len - 1) {
          chunkerCurrentIndex++;
          continue;
        }
        return fail('unescaped `\\`', chunkerCurrentIndex);
      case 34:
      case 39:
      case 96:
        // ", ' and `
        matched = 0;
        currentChunkStartIndex = chunkerCurrentIndex;
        for (chunkerCurrentIndex = chunkerCurrentIndex + 1; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
          cc2 = input.charCodeAt(chunkerCurrentIndex);
          if (cc2 > 96) {
            continue;
          }
          if (cc2 == cc) {
            matched = 1;
            break;
          }
          if (cc2 == 92) {
            // \
            if (chunkerCurrentIndex == len - 1) {
              return fail('unescaped `\\`', chunkerCurrentIndex);
            }
            chunkerCurrentIndex++;
          }
        }
        if (matched) {
          continue;
        }
        return fail(`unmatched \`${String.fromCharCode(cc)}\``, currentChunkStartIndex);
      case 47:
        // /, check for comment
        if (parenLevel || chunkerCurrentIndex == len - 1) {
          continue;
        }
        cc2 = input.charCodeAt(chunkerCurrentIndex + 1);
        if (cc2 == 47) {
          // //, find lnfeed
          for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len; chunkerCurrentIndex++) {
            cc2 = input.charCodeAt(chunkerCurrentIndex);
            if (cc2 <= 13 && (cc2 == 10 || cc2 == 13)) {
              break;
            }
          }
        } else if (cc2 == 42) {
          // /*, find */
          lastMultiComment = currentChunkStartIndex = chunkerCurrentIndex;
          for (chunkerCurrentIndex = chunkerCurrentIndex + 2; chunkerCurrentIndex < len - 1; chunkerCurrentIndex++) {
            cc2 = input.charCodeAt(chunkerCurrentIndex);
            if (cc2 == 125) {
              lastMultiCommentEndBrace = chunkerCurrentIndex;
            }
            if (cc2 != 42) {
              continue;
            }
            if (input.charCodeAt(chunkerCurrentIndex + 1) == 47) {
              break;
            }
          }
          if (chunkerCurrentIndex == len - 1) {
            return fail('missing closing `*/`', currentChunkStartIndex);
          }
          chunkerCurrentIndex++;
        }
        continue;
      case 42:
        // *, check for unmatched */
        if (chunkerCurrentIndex < len - 1 && input.charCodeAt(chunkerCurrentIndex + 1) == 47) {
          return fail('unmatched `/*`', chunkerCurrentIndex);
        }
        continue;
    }
  }
  if (level !== 0) {
    if (lastMultiComment > lastOpening && lastMultiCommentEndBrace > lastMultiComment) {
      return fail('missing closing `}` or `*/`', lastOpening);
    } else {
      return fail('missing closing `}`', lastOpening);
    }
  } else if (parenLevel !== 0) {
    return fail('missing closing `)`', lastOpeningParen);
  }
  emitChunk(true);
  return chunks;
}
;

},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _chunker = _interopRequireDefault(require("./chunker"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = () => {
  let
  // Less input string
  input;
  let
  // current chunk
  j;
  const
  // holds state for backtracking
  saveStack = [];
  let
  // furthest index the parser has gone to
  furthest;
  let
  // if this is furthest we got to, this is the probably cause
  furthestPossibleErrorMessage;
  let
  // chunkified input
  chunks;
  let
  // current chunk
  current;
  let
  // index of current chunk, in `input`
  currentPos;
  const parserInput = {};
  const CHARCODE_SPACE = 32;
  const CHARCODE_TAB = 9;
  const CHARCODE_LF = 10;
  const CHARCODE_CR = 13;
  const CHARCODE_PLUS = 43;
  const CHARCODE_COMMA = 44;
  const CHARCODE_FORWARD_SLASH = 47;
  const CHARCODE_9 = 57;
  function skipWhitespace(length) {
    const oldi = parserInput.i;
    const oldj = j;
    const curr = parserInput.i - currentPos;
    const endIndex = parserInput.i + current.length - curr;
    const mem = parserInput.i += length;
    const inp = input;
    let c;
    let nextChar;
    let comment;
    for (; parserInput.i < endIndex; parserInput.i++) {
      c = inp.charCodeAt(parserInput.i);
      if (parserInput.autoCommentAbsorb && c === CHARCODE_FORWARD_SLASH) {
        nextChar = inp.charAt(parserInput.i + 1);
        if (nextChar === '/') {
          comment = {
            index: parserInput.i,
            isLineComment: true
          };
          let nextNewLine = inp.indexOf('\n', parserInput.i + 2);
          if (nextNewLine < 0) {
            nextNewLine = endIndex;
          }
          parserInput.i = nextNewLine;
          comment.text = inp.substr(comment.index, parserInput.i - comment.index);
          parserInput.commentStore.push(comment);
          continue;
        } else if (nextChar === '*') {
          const nextStarSlash = inp.indexOf('*/', parserInput.i + 2);
          if (nextStarSlash >= 0) {
            comment = {
              index: parserInput.i,
              text: inp.substr(parserInput.i, nextStarSlash + 2 - parserInput.i),
              isLineComment: false
            };
            parserInput.i += comment.text.length - 1;
            parserInput.commentStore.push(comment);
            continue;
          }
        }
        break;
      }
      if (c !== CHARCODE_SPACE && c !== CHARCODE_LF && c !== CHARCODE_TAB && c !== CHARCODE_CR) {
        break;
      }
    }
    current = current.slice(length + parserInput.i - mem + curr);
    currentPos = parserInput.i;
    if (!current.length) {
      if (j < chunks.length - 1) {
        current = chunks[++j];
        skipWhitespace(0); // skip space at the beginning of a chunk
        return true; // things changed
      }

      parserInput.finished = true;
    }
    return oldi !== parserInput.i || oldj !== j;
  }
  parserInput.save = () => {
    currentPos = parserInput.i;
    saveStack.push({
      current,
      i: parserInput.i,
      j
    });
  };
  parserInput.restore = possibleErrorMessage => {
    if (parserInput.i > furthest || parserInput.i === furthest && possibleErrorMessage && !furthestPossibleErrorMessage) {
      furthest = parserInput.i;
      furthestPossibleErrorMessage = possibleErrorMessage;
    }
    const state = saveStack.pop();
    current = state.current;
    currentPos = parserInput.i = state.i;
    j = state.j;
  };
  parserInput.forget = () => {
    saveStack.pop();
  };
  parserInput.isWhitespace = offset => {
    const pos = parserInput.i + (offset || 0);
    const code = input.charCodeAt(pos);
    return code === CHARCODE_SPACE || code === CHARCODE_CR || code === CHARCODE_TAB || code === CHARCODE_LF;
  };

  // Specialization of $(tok)
  parserInput.$re = tok => {
    if (parserInput.i > currentPos) {
      current = current.slice(parserInput.i - currentPos);
      currentPos = parserInput.i;
    }
    const m = tok.exec(current);
    if (!m) {
      return null;
    }
    skipWhitespace(m[0].length);
    if (typeof m === 'string') {
      return m;
    }
    return m.length === 1 ? m[0] : m;
  };
  parserInput.$char = tok => {
    if (input.charAt(parserInput.i) !== tok) {
      return null;
    }
    skipWhitespace(1);
    return tok;
  };
  parserInput.$str = tok => {
    const tokLength = tok.length;

    // https://jsperf.com/string-startswith/21
    for (let i = 0; i < tokLength; i++) {
      if (input.charAt(parserInput.i + i) !== tok.charAt(i)) {
        return null;
      }
    }
    skipWhitespace(tokLength);
    return tok;
  };
  parserInput.$quoted = loc => {
    const pos = loc || parserInput.i;
    const startChar = input.charAt(pos);
    if (startChar !== '\'' && startChar !== '"') {
      return;
    }
    const length = input.length;
    const currentPosition = pos;
    for (let i = 1; i + currentPosition < length; i++) {
      const nextChar = input.charAt(i + currentPosition);
      switch (nextChar) {
        case '\\':
          i++;
          continue;
        case '\r':
        case '\n':
          break;
        case startChar:
          const str = input.substr(currentPosition, i + 1);
          if (!loc && loc !== 0) {
            skipWhitespace(i + 1);
            return str;
          }
          return [startChar, str];
        default:
      }
    }
    return null;
  };

  /**
   * Permissive parsing. Ignores everything except matching {} [] () and quotes
   * until matching token (outside of blocks)
   */
  parserInput.$parseUntil = tok => {
    let quote = '';
    let returnVal = null;
    let inComment = false;
    let blockDepth = 0;
    const blockStack = [];
    const parseGroups = [];
    const length = input.length;
    const startPos = parserInput.i;
    let lastPos = parserInput.i;
    let i = parserInput.i;
    let loop = true;
    let testChar;
    if (typeof tok === 'string') {
      testChar = char => char === tok;
    } else {
      testChar = char => tok.test(char);
    }
    do {
      let prevChar;
      let nextChar = input.charAt(i);
      if (blockDepth === 0 && testChar(nextChar)) {
        returnVal = input.substr(lastPos, i - lastPos);
        if (returnVal) {
          parseGroups.push(returnVal);
        } else {
          parseGroups.push(' ');
        }
        returnVal = parseGroups;
        skipWhitespace(i - startPos);
        loop = false;
      } else {
        if (inComment) {
          if (nextChar === '*' && input.charAt(i + 1) === '/') {
            i++;
            blockDepth--;
            inComment = false;
          }
          i++;
          continue;
        }
        switch (nextChar) {
          case '\\':
            i++;
            nextChar = input.charAt(i);
            parseGroups.push(input.substr(lastPos, i - lastPos + 1));
            lastPos = i + 1;
            break;
          case '/':
            if (input.charAt(i + 1) === '*') {
              i++;
              inComment = true;
              blockDepth++;
            }
            break;
          case '\'':
          case '"':
            quote = parserInput.$quoted(i);
            if (quote) {
              parseGroups.push(input.substr(lastPos, i - lastPos), quote);
              i += quote[1].length - 1;
              lastPos = i + 1;
            } else {
              skipWhitespace(i - startPos);
              returnVal = nextChar;
              loop = false;
            }
            break;
          case '{':
            blockStack.push('}');
            blockDepth++;
            break;
          case '(':
            blockStack.push(')');
            blockDepth++;
            break;
          case '[':
            blockStack.push(']');
            blockDepth++;
            break;
          case '}':
          case ')':
          case ']':
            const expected = blockStack.pop();
            if (nextChar === expected) {
              blockDepth--;
            } else {
              // move the parser to the error and return expected
              skipWhitespace(i - startPos);
              returnVal = expected;
              loop = false;
            }
        }
        i++;
        if (i > length) {
          loop = false;
        }
      }
      prevChar = nextChar;
    } while (loop);
    return returnVal ? returnVal : null;
  };
  parserInput.autoCommentAbsorb = true;
  parserInput.commentStore = [];
  parserInput.finished = false;

  // Same as $(), but don't change the state of the parser,
  // just return the match.
  parserInput.peek = tok => {
    if (typeof tok === 'string') {
      // https://jsperf.com/string-startswith/21
      for (let i = 0; i < tok.length; i++) {
        if (input.charAt(parserInput.i + i) !== tok.charAt(i)) {
          return false;
        }
      }
      return true;
    } else {
      return tok.test(current);
    }
  };

  // Specialization of peek()
  // TODO remove or change some currentChar calls to peekChar
  parserInput.peekChar = tok => input.charAt(parserInput.i) === tok;
  parserInput.currentChar = () => input.charAt(parserInput.i);
  parserInput.prevChar = () => input.charAt(parserInput.i - 1);
  parserInput.getInput = () => input;
  parserInput.peekNotNumeric = () => {
    const c = input.charCodeAt(parserInput.i);
    // Is the first char of the dimension 0-9, '.', '+' or '-'
    return c > CHARCODE_9 || c < CHARCODE_PLUS || c === CHARCODE_FORWARD_SLASH || c === CHARCODE_COMMA;
  };
  parserInput.start = (str, chunkInput, failFunction) => {
    input = str;
    parserInput.i = j = currentPos = furthest = 0;

    // chunking apparently makes things quicker (but my tests indicate
    // it might actually make things slower in node at least)
    // and it is a non-perfect parse - it can't recognise
    // unquoted urls, meaning it can't distinguish comments
    // meaning comments with quotes or {}() in them get 'counted'
    // and then lead to parse errors.
    // In addition if the chunking chunks in the wrong place we might
    // not be able to parse a parser statement in one go
    // this is officially deprecated but can be switched on via an option
    // in the case it causes too much performance issues.
    if (chunkInput) {
      chunks = (0, _chunker.default)(str, failFunction);
    } else {
      chunks = [str];
    }
    current = chunks[0];
    skipWhitespace(0);
  };
  parserInput.end = () => {
    let message;
    const isFinished = parserInput.i >= input.length;
    if (parserInput.i < furthest) {
      message = furthestPossibleErrorMessage;
      parserInput.i = furthest;
    }
    return {
      isFinished,
      furthest: parserInput.i,
      furthestPossibleErrorMessage: message,
      furthestReachedEnd: parserInput.i >= input.length - 1,
      furthestChar: input[parserInput.i]
    };
  };
  return parserInput;
};
exports.default = _default;

},{"./chunker":51}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lessError = _interopRequireDefault(require("../less-error"));
var _tree = _interopRequireDefault(require("../tree"));
var _visitors = _interopRequireDefault(require("../visitors"));
var _parserInput = _interopRequireDefault(require("./parser-input"));
var utils = _interopRequireWildcard(require("../utils"));
var _functionRegistry = _interopRequireDefault(require("../functions/function-registry"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//
// less.js - parser
//
//    A relatively straight-forward predictive parser.
//    There is no tokenization/lexing stage, the input is parsed
//    in one sweep.
//
//    To make the parser fast enough to run in the browser, several
//    optimization had to be made:
//
//    - Matching and slicing on a huge input is often cause of slowdowns.
//      The solution is to chunkify the input into smaller strings.
//      The chunks are stored in the `chunks` var,
//      `j` holds the current chunk index, and `currentPos` holds
//      the index of the current chunk in relation to `input`.
//      This gives us an almost 4x speed-up.
//
//    - In many cases, we don't need to match individual tokens;
//      for example, if a value doesn't hold any variables, operations
//      or dynamic references, the parser can effectively 'skip' it,
//      treating it as a literal.
//      An example would be '1px solid #000' - which evaluates to itself,
//      we don't need to know what the individual components are.
//      The drawback, of course is that you don't get the benefits of
//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
//      and a smaller speed-up in the code-gen.
//
//
//    Token matching is done with the `$` function, which either takes
//    a terminal string or regexp, or a non-terminal function to call.
//    It also takes care of moving all the indices forwards.
//

const Parser = function Parser(context, imports, fileInfo) {
  let parsers;
  const parserInput = (0, _parserInput.default)();
  function error(msg, type) {
    throw new _lessError.default({
      index: parserInput.i,
      filename: fileInfo.filename,
      type: type || 'Syntax',
      message: msg
    }, imports);
  }
  function expect(arg, msg) {
    // some older browsers return typeof 'function' for RegExp
    const result = arg instanceof Function ? arg.call(parsers) : parserInput.$re(arg);
    if (result) {
      return result;
    }
    error(msg || (typeof arg === 'string' ? `expected '${arg}' got '${parserInput.currentChar()}'` : 'unexpected token'));
  }

  // Specialization of expect()
  function expectChar(arg, msg) {
    if (parserInput.$char(arg)) {
      return arg;
    }
    error(msg || `expected '${arg}' got '${parserInput.currentChar()}'`);
  }
  function getDebugInfo(index) {
    const filename = fileInfo.filename;
    return {
      lineNumber: utils.getLocation(index, parserInput.getInput()).line + 1,
      fileName: filename
    };
  }

  /**
   *  Used after initial parsing to create nodes on the fly
   * 
   *  @param {String} str          - string to parse 
   *  @param {Array}  parseList    - array of parsers to run input through e.g. ["value", "important"]
   *  @param {Number} currentIndex - start number to begin indexing
   *  @param {Object} fileInfo     - fileInfo to attach to created nodes
   */
  function parseNode(str, parseList, currentIndex, fileInfo, callback) {
    let result;
    const returnNodes = [];
    const parser = parserInput;
    try {
      parser.start(str, false, function fail(msg, index) {
        callback({
          message: msg,
          index: index + currentIndex
        });
      });
      for (let x = 0, p, i; p = parseList[x]; x++) {
        i = parser.i;
        result = parsers[p]();
        if (result) {
          try {
            result._index = i + currentIndex;
            result._fileInfo = fileInfo;
          } catch (e) {}
          returnNodes.push(result);
        } else {
          returnNodes.push(null);
        }
      }
      const endInfo = parser.end();
      if (endInfo.isFinished) {
        callback(null, returnNodes);
      } else {
        callback(true, null);
      }
    } catch (e) {
      throw new _lessError.default({
        index: e.index + currentIndex,
        message: e.message
      }, imports, fileInfo.filename);
    }
  }

  //
  // The Parser
  //
  return {
    parserInput,
    imports,
    fileInfo,
    parseNode,
    //
    // Parse an input string into an abstract syntax tree,
    // @param str A string containing 'less' markup
    // @param callback call `callback` when done.
    // @param [additionalData] An optional map which can contains vars - a map (key, value) of variables to apply
    //
    parse: function (str, callback, additionalData) {
      let root;
      let err = null;
      let globalVars;
      let modifyVars;
      let ignored;
      let preText = '';

      // Optionally disable @plugin parsing
      if (additionalData && additionalData.disablePluginRule) {
        parsers.plugin = function () {
          var dir = parserInput.$re(/^@plugin?\s+/);
          if (dir) {
            error('@plugin statements are not allowed when disablePluginRule is set to true');
          }
        };
      }
      ;
      globalVars = additionalData && additionalData.globalVars ? `${Parser.serializeVars(additionalData.globalVars)}\n` : '';
      modifyVars = additionalData && additionalData.modifyVars ? `\n${Parser.serializeVars(additionalData.modifyVars)}` : '';
      if (context.pluginManager) {
        const preProcessors = context.pluginManager.getPreProcessors();
        for (let i = 0; i < preProcessors.length; i++) {
          str = preProcessors[i].process(str, {
            context,
            imports,
            fileInfo
          });
        }
      }
      if (globalVars || additionalData && additionalData.banner) {
        preText = (additionalData && additionalData.banner ? additionalData.banner : '') + globalVars;
        ignored = imports.contentsIgnoredChars;
        ignored[fileInfo.filename] = ignored[fileInfo.filename] || 0;
        ignored[fileInfo.filename] += preText.length;
      }
      str = str.replace(/\r\n?/g, '\n');
      // Remove potential UTF Byte Order Mark
      str = preText + str.replace(/^\uFEFF/, '') + modifyVars;
      imports.contents[fileInfo.filename] = str;

      // Start with the primary rule.
      // The whole syntax tree is held under a Ruleset node,
      // with the `root` property set to true, so no `{}` are
      // output. The callback is called when the input is parsed.
      try {
        parserInput.start(str, context.chunkInput, function fail(msg, index) {
          throw new _lessError.default({
            index,
            type: 'Parse',
            message: msg,
            filename: fileInfo.filename
          }, imports);
        });
        _tree.default.Node.prototype.parse = this;
        root = new _tree.default.Ruleset(null, this.parsers.primary());
        _tree.default.Node.prototype.rootNode = root;
        root.root = true;
        root.firstRoot = true;
        root.functionRegistry = _functionRegistry.default.inherit();
      } catch (e) {
        return callback(new _lessError.default(e, imports, fileInfo.filename));
      }

      // If `i` is smaller than the `input.length - 1`,
      // it means the parser wasn't able to parse the whole
      // string, so we've got a parsing error.
      //
      // We try to extract a \n delimited string,
      // showing the line where the parse error occurred.
      // We split it up into two parts (the part which parsed,
      // and the part which didn't), so we can color them differently.
      const endInfo = parserInput.end();
      if (!endInfo.isFinished) {
        let message = endInfo.furthestPossibleErrorMessage;
        if (!message) {
          message = 'Unrecognised input';
          if (endInfo.furthestChar === '}') {
            message += '. Possibly missing opening \'{\'';
          } else if (endInfo.furthestChar === ')') {
            message += '. Possibly missing opening \'(\'';
          } else if (endInfo.furthestReachedEnd) {
            message += '. Possibly missing something';
          }
        }
        err = new _lessError.default({
          type: 'Parse',
          message,
          index: endInfo.furthest,
          filename: fileInfo.filename
        }, imports);
      }
      const finish = e => {
        e = err || e || imports.error;
        if (e) {
          if (!(e instanceof _lessError.default)) {
            e = new _lessError.default(e, imports, fileInfo.filename);
          }
          return callback(e);
        } else {
          return callback(null, root);
        }
      };
      if (context.processImports !== false) {
        new _visitors.default.ImportVisitor(imports, finish).run(root);
      } else {
        return finish();
      }
    },
    //
    // Here in, the parsing rules/functions
    //
    // The basic structure of the syntax tree generated is as follows:
    //
    //   Ruleset ->  Declaration -> Value -> Expression -> Entity
    //
    // Here's some Less code:
    //
    //    .class {
    //      color: #fff;
    //      border: 1px solid #000;
    //      width: @w + 4px;
    //      > .child {...}
    //    }
    //
    // And here's what the parse tree might look like:
    //
    //     Ruleset (Selector '.class', [
    //         Declaration ("color",  Value ([Expression [Color #fff]]))
    //         Declaration ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
    //         Declaration ("width",  Value ([Expression [Operation " + " [Variable "@w"][Dimension 4px]]]))
    //         Ruleset (Selector [Element '>', '.child'], [...])
    //     ])
    //
    //  In general, most rules will try to parse a token with the `$re()` function, and if the return
    //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
    //  first, before parsing, that's when we use `peek()`.
    //
    parsers: parsers = {
      //
      // The `primary` rule is the *entry* and *exit* point of the parser.
      // The rules here can appear at any level of the parse tree.
      //
      // The recursive nature of the grammar is an interplay between the `block`
      // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
      // as represented by this simplified grammar:
      //
      //     primary  →  (ruleset | declaration)+
      //     ruleset  →  selector+ block
      //     block    →  '{' primary '}'
      //
      // Only at one point is the primary rule not called from the
      // block rule: at the root level.
      //
      primary: function () {
        const mixin = this.mixin;
        let root = [];
        let node;
        while (true) {
          while (true) {
            node = this.comment();
            if (!node) {
              break;
            }
            root.push(node);
          }
          // always process comments before deciding if finished
          if (parserInput.finished) {
            break;
          }
          if (parserInput.peek('}')) {
            break;
          }
          node = this.extendRule();
          if (node) {
            root = root.concat(node);
            continue;
          }
          node = mixin.definition() || this.declaration() || mixin.call(false, false) || this.ruleset() || this.variableCall() || this.entities.call() || this.atrule();
          if (node) {
            root.push(node);
          } else {
            let foundSemiColon = false;
            while (parserInput.$char(';')) {
              foundSemiColon = true;
            }
            if (!foundSemiColon) {
              break;
            }
          }
        }
        return root;
      },
      // comments are collected by the main parsing mechanism and then assigned to nodes
      // where the current structure allows it
      comment: function () {
        if (parserInput.commentStore.length) {
          const comment = parserInput.commentStore.shift();
          return new _tree.default.Comment(comment.text, comment.isLineComment, comment.index, fileInfo);
        }
      },
      //
      // Entities are tokens which can be found inside an Expression
      //
      entities: {
        mixinLookup: function () {
          return parsers.mixin.call(true, true);
        },
        //
        // A string, which supports escaping " and '
        //
        //     "milky way" 'he\'s the one!'
        //
        quoted: function (forceEscaped) {
          let str;
          const index = parserInput.i;
          let isEscaped = false;
          parserInput.save();
          if (parserInput.$char('~')) {
            isEscaped = true;
          } else if (forceEscaped) {
            parserInput.restore();
            return;
          }
          str = parserInput.$quoted();
          if (!str) {
            parserInput.restore();
            return;
          }
          parserInput.forget();
          return new _tree.default.Quoted(str.charAt(0), str.substr(1, str.length - 2), isEscaped, index, fileInfo);
        },
        //
        // A catch-all word, such as:
        //
        //     black border-collapse
        //
        keyword: function () {
          const k = parserInput.$char('%') || parserInput.$re(/^\[?(?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+\]?/);
          if (k) {
            return _tree.default.Color.fromKeyword(k) || new _tree.default.Keyword(k);
          }
        },
        //
        // A function call
        //
        //     rgb(255, 0, 255)
        //
        // The arguments are parsed with the `entities.arguments` parser.
        //
        call: function () {
          let name;
          let args;
          let func;
          const index = parserInput.i;

          // http://jsperf.com/case-insensitive-regex-vs-strtolower-then-regex/18
          if (parserInput.peek(/^url\(/i)) {
            return;
          }
          parserInput.save();
          name = parserInput.$re(/^([\w-]+|%|~|progid:[\w\.]+)\(/);
          if (!name) {
            parserInput.forget();
            return;
          }
          name = name[1];
          func = this.customFuncCall(name);
          if (func) {
            args = func.parse();
            if (args && func.stop) {
              parserInput.forget();
              return args;
            }
          }
          args = this.arguments(args);
          if (!parserInput.$char(')')) {
            parserInput.restore('Could not parse call arguments or missing \')\'');
            return;
          }
          parserInput.forget();
          return new _tree.default.Call(name, args, index, fileInfo);
        },
        //
        // Parsing rules for functions with non-standard args, e.g.:
        //
        //     boolean(not(2 > 1))
        //
        //     This is a quick prototype, to be modified/improved when
        //     more custom-parsed funcs come (e.g. `selector(...)`)
        //

        customFuncCall: function (name) {
          /* Ideally the table is to be moved out of here for faster perf.,
             but it's quite tricky since it relies on all these `parsers`
             and `expect` available only here */
          return {
            alpha: f(parsers.ieAlpha, true),
            boolean: f(condition),
            'if': f(condition)
          }[name.toLowerCase()];
          function f(parse, stop) {
            return {
              parse,
              // parsing function
              stop // when true - stop after parse() and return its result, 
              // otherwise continue for plain args
            };
          }

          function condition() {
            return [expect(parsers.condition, 'expected condition')];
          }
        },
        arguments: function (prevArgs) {
          let argsComma = prevArgs || [];
          const argsSemiColon = [];
          let isSemiColonSeparated;
          let value;
          parserInput.save();
          while (true) {
            if (prevArgs) {
              prevArgs = false;
            } else {
              value = parsers.detachedRuleset() || this.assignment() || parsers.expression();
              if (!value) {
                break;
              }
              if (value.value && value.value.length == 1) {
                value = value.value[0];
              }
              argsComma.push(value);
            }
            if (parserInput.$char(',')) {
              continue;
            }
            if (parserInput.$char(';') || isSemiColonSeparated) {
              isSemiColonSeparated = true;
              value = argsComma.length < 1 ? argsComma[0] : new _tree.default.Value(argsComma);
              argsSemiColon.push(value);
              argsComma = [];
            }
          }
          parserInput.forget();
          return isSemiColonSeparated ? argsSemiColon : argsComma;
        },
        literal: function () {
          return this.dimension() || this.color() || this.quoted() || this.unicodeDescriptor();
        },
        // Assignments are argument entities for calls.
        // They are present in ie filter properties as shown below.
        //
        //     filter: progid:DXImageTransform.Microsoft.Alpha( *opacity=50* )
        //

        assignment: function () {
          let key;
          let value;
          parserInput.save();
          key = parserInput.$re(/^\w+(?=\s?=)/i);
          if (!key) {
            parserInput.restore();
            return;
          }
          if (!parserInput.$char('=')) {
            parserInput.restore();
            return;
          }
          value = parsers.entity();
          if (value) {
            parserInput.forget();
            return new _tree.default.Assignment(key, value);
          } else {
            parserInput.restore();
          }
        },
        //
        // Parse url() tokens
        //
        // We use a specific rule for urls, because they don't really behave like
        // standard function calls. The difference is that the argument doesn't have
        // to be enclosed within a string, so it can't be parsed as an Expression.
        //
        url: function () {
          let value;
          const index = parserInput.i;
          parserInput.autoCommentAbsorb = false;
          if (!parserInput.$str('url(')) {
            parserInput.autoCommentAbsorb = true;
            return;
          }
          value = this.quoted() || this.variable() || this.property() || parserInput.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || '';
          parserInput.autoCommentAbsorb = true;
          expectChar(')');
          return new _tree.default.URL(value.value != null || value instanceof _tree.default.Variable || value instanceof _tree.default.Property ? value : new _tree.default.Anonymous(value, index), index, fileInfo);
        },
        //
        // A Variable entity, such as `@fink`, in
        //
        //     width: @fink + 2px
        //
        // We use a different parser for variable definitions,
        // see `parsers.variable`.
        //
        variable: function () {
          let ch;
          let name;
          const index = parserInput.i;
          parserInput.save();
          if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^@@?[\w-]+/))) {
            ch = parserInput.currentChar();
            if (ch === '(' || ch === '[' && !parserInput.prevChar().match(/^\s/)) {
              // this may be a VariableCall lookup
              const result = parsers.variableCall(name);
              if (result) {
                parserInput.forget();
                return result;
              }
            }
            parserInput.forget();
            return new _tree.default.Variable(name, index, fileInfo);
          }
          parserInput.restore();
        },
        // A variable entity using the protective {} e.g. @{var}
        variableCurly: function () {
          let curly;
          const index = parserInput.i;
          if (parserInput.currentChar() === '@' && (curly = parserInput.$re(/^@\{([\w-]+)\}/))) {
            return new _tree.default.Variable(`@${curly[1]}`, index, fileInfo);
          }
        },
        //
        // A Property accessor, such as `$color`, in
        //
        //     background-color: $color
        //
        property: function () {
          let name;
          const index = parserInput.i;
          if (parserInput.currentChar() === '$' && (name = parserInput.$re(/^\$[\w-]+/))) {
            return new _tree.default.Property(name, index, fileInfo);
          }
        },
        // A property entity useing the protective {} e.g. ${prop}
        propertyCurly: function () {
          let curly;
          const index = parserInput.i;
          if (parserInput.currentChar() === '$' && (curly = parserInput.$re(/^\$\{([\w-]+)\}/))) {
            return new _tree.default.Property(`$${curly[1]}`, index, fileInfo);
          }
        },
        //
        // A Hexadecimal color
        //
        //     #4F3C2F
        //
        // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
        //
        color: function () {
          let rgb;
          parserInput.save();
          if (parserInput.currentChar() === '#' && (rgb = parserInput.$re(/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})([\w.#\[])?/))) {
            if (!rgb[2]) {
              parserInput.forget();
              return new _tree.default.Color(rgb[1], undefined, rgb[0]);
            }
          }
          parserInput.restore();
        },
        colorKeyword: function () {
          parserInput.save();
          const autoCommentAbsorb = parserInput.autoCommentAbsorb;
          parserInput.autoCommentAbsorb = false;
          const k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/);
          parserInput.autoCommentAbsorb = autoCommentAbsorb;
          if (!k) {
            parserInput.forget();
            return;
          }
          parserInput.restore();
          const color = _tree.default.Color.fromKeyword(k);
          if (color) {
            parserInput.$str(k);
            return color;
          }
        },
        //
        // A Dimension, that is, a number and a unit
        //
        //     0.5em 95%
        //
        dimension: function () {
          if (parserInput.peekNotNumeric()) {
            return;
          }
          const value = parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i);
          if (value) {
            return new _tree.default.Dimension(value[1], value[2]);
          }
        },
        //
        // A unicode descriptor, as is used in unicode-range
        //
        // U+0??  or U+00A1-00A9
        //
        unicodeDescriptor: function () {
          let ud;
          ud = parserInput.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/);
          if (ud) {
            return new _tree.default.UnicodeDescriptor(ud[0]);
          }
        },
        //
        // JavaScript code to be evaluated
        //
        //     `window.location.href`
        //
        javascript: function () {
          let js;
          const index = parserInput.i;
          parserInput.save();
          const escape = parserInput.$char('~');
          const jsQuote = parserInput.$char('`');
          if (!jsQuote) {
            parserInput.restore();
            return;
          }
          js = parserInput.$re(/^[^`]*`/);
          if (js) {
            parserInput.forget();
            return new _tree.default.JavaScript(js.substr(0, js.length - 1), Boolean(escape), index, fileInfo);
          }
          parserInput.restore('invalid javascript definition');
        }
      },
      //
      // The variable part of a variable definition. Used in the `rule` parser
      //
      //     @fink:
      //
      variable: function () {
        let name;
        if (parserInput.currentChar() === '@' && (name = parserInput.$re(/^(@[\w-]+)\s*:/))) {
          return name[1];
        }
      },
      //
      // Call a variable value to retrieve a detached ruleset
      // or a value from a detached ruleset's rules.
      //
      //     @fink();
      //     @fink;
      //     color: @fink[@color];
      //
      variableCall: function (parsedName) {
        let lookups;
        const i = parserInput.i;
        const inValue = !!parsedName;
        let name = parsedName;
        parserInput.save();
        if (name || parserInput.currentChar() === '@' && (name = parserInput.$re(/^(@[\w-]+)(\(\s*\))?/))) {
          lookups = this.mixin.ruleLookups();
          if (!lookups && (inValue && parserInput.$str('()') !== '()' || name[2] !== '()')) {
            parserInput.restore('Missing \'[...]\' lookup in variable call');
            return;
          }
          if (!inValue) {
            name = name[1];
          }
          const call = new _tree.default.VariableCall(name, i, fileInfo);
          if (!inValue && parsers.end()) {
            parserInput.forget();
            return call;
          } else {
            parserInput.forget();
            return new _tree.default.NamespaceValue(call, lookups, i, fileInfo);
          }
        }
        parserInput.restore();
      },
      //
      // extend syntax - used to extend selectors
      //
      extend: function (isRule) {
        let elements;
        let e;
        const index = parserInput.i;
        let option;
        let extendList;
        let extend;
        if (!parserInput.$str(isRule ? '&:extend(' : ':extend(')) {
          return;
        }
        do {
          option = null;
          elements = null;
          while (!(option = parserInput.$re(/^(all)(?=\s*(\)|,))/))) {
            e = this.element();
            if (!e) {
              break;
            }
            if (elements) {
              elements.push(e);
            } else {
              elements = [e];
            }
          }
          option = option && option[1];
          if (!elements) {
            error('Missing target selector for :extend().');
          }
          extend = new _tree.default.Extend(new _tree.default.Selector(elements), option, index, fileInfo);
          if (extendList) {
            extendList.push(extend);
          } else {
            extendList = [extend];
          }
        } while (parserInput.$char(','));
        expect(/^\)/);
        if (isRule) {
          expect(/^;/);
        }
        return extendList;
      },
      //
      // extendRule - used in a rule to extend all the parent selectors
      //
      extendRule: function () {
        return this.extend(true);
      },
      //
      // Mixins
      //
      mixin: {
        //
        // A Mixin call, with an optional argument list
        //
        //     #mixins > .square(#fff);
        //     #mixins.square(#fff);
        //     .rounded(4px, black);
        //     .button;
        //
        // We can lookup / return a value using the lookup syntax:
        //
        //     color: #mixin.square(#fff)[@color];
        //
        // The `while` loop is there because mixins can be
        // namespaced, but we only support the child and descendant
        // selector for now.
        //
        call: function (inValue, getLookup) {
          const s = parserInput.currentChar();
          let important = false;
          let lookups;
          const index = parserInput.i;
          let elements;
          let args;
          let hasParens;
          if (s !== '.' && s !== '#') {
            return;
          }
          parserInput.save(); // stop us absorbing part of an invalid selector

          elements = this.elements();
          if (elements) {
            if (parserInput.$char('(')) {
              args = this.args(true).args;
              expectChar(')');
              hasParens = true;
            }
            if (getLookup !== false) {
              lookups = this.ruleLookups();
            }
            if (getLookup === true && !lookups) {
              parserInput.restore();
              return;
            }
            if (inValue && !lookups && !hasParens) {
              // This isn't a valid in-value mixin call
              parserInput.restore();
              return;
            }
            if (!inValue && parsers.important()) {
              important = true;
            }
            if (inValue || parsers.end()) {
              parserInput.forget();
              const mixin = new _tree.default.mixin.Call(elements, args, index, fileInfo, !lookups && important);
              if (lookups) {
                return new _tree.default.NamespaceValue(mixin, lookups);
              } else {
                return mixin;
              }
            }
          }
          parserInput.restore();
        },
        /**
         * Matching elements for mixins
         * (Start with . or # and can have > )
         */
        elements: function () {
          let elements;
          let e;
          let c;
          let elem;
          let elemIndex;
          const re = /^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/;
          while (true) {
            elemIndex = parserInput.i;
            e = parserInput.$re(re);
            if (!e) {
              break;
            }
            elem = new _tree.default.Element(c, e, false, elemIndex, fileInfo);
            if (elements) {
              elements.push(elem);
            } else {
              elements = [elem];
            }
            c = parserInput.$char('>');
          }
          return elements;
        },
        args: function (isCall) {
          const entities = parsers.entities;
          const returner = {
            args: null,
            variadic: false
          };
          let expressions = [];
          const argsSemiColon = [];
          const argsComma = [];
          let isSemiColonSeparated;
          let expressionContainsNamed;
          let name;
          let nameLoop;
          let value;
          let arg;
          let expand;
          let hasSep = true;
          parserInput.save();
          while (true) {
            if (isCall) {
              arg = parsers.detachedRuleset() || parsers.expression();
            } else {
              parserInput.commentStore.length = 0;
              if (parserInput.$str('...')) {
                returner.variadic = true;
                if (parserInput.$char(';') && !isSemiColonSeparated) {
                  isSemiColonSeparated = true;
                }
                (isSemiColonSeparated ? argsSemiColon : argsComma).push({
                  variadic: true
                });
                break;
              }
              arg = entities.variable() || entities.property() || entities.literal() || entities.keyword() || this.call(true);
            }
            if (!arg || !hasSep) {
              break;
            }
            nameLoop = null;
            if (arg.throwAwayComments) {
              arg.throwAwayComments();
            }
            value = arg;
            let val = null;
            if (isCall) {
              // Variable
              if (arg.value && arg.value.length == 1) {
                val = arg.value[0];
              }
            } else {
              val = arg;
            }
            if (val && (val instanceof _tree.default.Variable || val instanceof _tree.default.Property)) {
              if (parserInput.$char(':')) {
                if (expressions.length > 0) {
                  if (isSemiColonSeparated) {
                    error('Cannot mix ; and , as delimiter types');
                  }
                  expressionContainsNamed = true;
                }
                value = parsers.detachedRuleset() || parsers.expression();
                if (!value) {
                  if (isCall) {
                    error('could not understand value for named argument');
                  } else {
                    parserInput.restore();
                    returner.args = [];
                    return returner;
                  }
                }
                nameLoop = name = val.name;
              } else if (parserInput.$str('...')) {
                if (!isCall) {
                  returner.variadic = true;
                  if (parserInput.$char(';') && !isSemiColonSeparated) {
                    isSemiColonSeparated = true;
                  }
                  (isSemiColonSeparated ? argsSemiColon : argsComma).push({
                    name: arg.name,
                    variadic: true
                  });
                  break;
                } else {
                  expand = true;
                }
              } else if (!isCall) {
                name = nameLoop = val.name;
                value = null;
              }
            }
            if (value) {
              expressions.push(value);
            }
            argsComma.push({
              name: nameLoop,
              value,
              expand
            });
            if (parserInput.$char(',')) {
              hasSep = true;
              continue;
            }
            hasSep = parserInput.$char(';') === ';';
            if (hasSep || isSemiColonSeparated) {
              if (expressionContainsNamed) {
                error('Cannot mix ; and , as delimiter types');
              }
              isSemiColonSeparated = true;
              if (expressions.length > 1) {
                value = new _tree.default.Value(expressions);
              }
              argsSemiColon.push({
                name,
                value,
                expand
              });
              name = null;
              expressions = [];
              expressionContainsNamed = false;
            }
          }
          parserInput.forget();
          returner.args = isSemiColonSeparated ? argsSemiColon : argsComma;
          return returner;
        },
        //
        // A Mixin definition, with a list of parameters
        //
        //     .rounded (@radius: 2px, @color) {
        //        ...
        //     }
        //
        // Until we have a finer grained state-machine, we have to
        // do a look-ahead, to make sure we don't have a mixin call.
        // See the `rule` function for more information.
        //
        // We start by matching `.rounded (`, and then proceed on to
        // the argument list, which has optional default values.
        // We store the parameters in `params`, with a `value` key,
        // if there is a value, such as in the case of `@radius`.
        //
        // Once we've got our params list, and a closing `)`, we parse
        // the `{...}` block.
        //
        definition: function () {
          let name;
          let params = [];
          let match;
          let ruleset;
          let cond;
          let variadic = false;
          if (parserInput.currentChar() !== '.' && parserInput.currentChar() !== '#' || parserInput.peek(/^[^{]*\}/)) {
            return;
          }
          parserInput.save();
          match = parserInput.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/);
          if (match) {
            name = match[1];
            const argInfo = this.args(false);
            params = argInfo.args;
            variadic = argInfo.variadic;

            // .mixincall("@{a}");
            // looks a bit like a mixin definition..
            // also
            // .mixincall(@a: {rule: set;});
            // so we have to be nice and restore
            if (!parserInput.$char(')')) {
              parserInput.restore('Missing closing \')\'');
              return;
            }
            parserInput.commentStore.length = 0;
            if (parserInput.$str('when')) {
              // Guard
              cond = expect(parsers.conditions, 'expected condition');
            }
            ruleset = parsers.block();
            if (ruleset) {
              parserInput.forget();
              return new _tree.default.mixin.Definition(name, params, ruleset, cond, variadic);
            } else {
              parserInput.restore();
            }
          } else {
            parserInput.restore();
          }
        },
        ruleLookups: function () {
          let rule;
          let args;
          const lookups = [];
          if (parserInput.currentChar() !== '[') {
            return;
          }
          while (true) {
            parserInput.save();
            args = null;
            rule = this.lookupValue();
            if (!rule && rule !== '') {
              parserInput.restore();
              break;
            }
            lookups.push(rule);
            parserInput.forget();
          }
          if (lookups.length > 0) {
            return lookups;
          }
        },
        lookupValue: function () {
          parserInput.save();
          if (!parserInput.$char('[')) {
            parserInput.restore();
            return;
          }
          const name = parserInput.$re(/^(?:[@$]{0,2})[_a-zA-Z0-9-]*/);
          if (!parserInput.$char(']')) {
            parserInput.restore();
            return;
          }
          if (name || name === '') {
            parserInput.forget();
            return name;
          }
          parserInput.restore();
        }
      },
      //
      // Entities are the smallest recognized token,
      // and can be found inside a rule's value.
      //
      entity: function () {
        const entities = this.entities;
        return this.comment() || entities.literal() || entities.variable() || entities.url() || entities.property() || entities.call() || entities.keyword() || this.mixin.call(true) || entities.javascript();
      },
      //
      // A Declaration terminator. Note that we use `peek()` to check for '}',
      // because the `block` rule will be expecting it, but we still need to make sure
      // it's there, if ';' was omitted.
      //
      end: function () {
        return parserInput.$char(';') || parserInput.peek('}');
      },
      //
      // IE's alpha function
      //
      //     alpha(opacity=88)
      //
      ieAlpha: function () {
        let value;

        // http://jsperf.com/case-insensitive-regex-vs-strtolower-then-regex/18
        if (!parserInput.$re(/^opacity=/i)) {
          return;
        }
        value = parserInput.$re(/^\d+/);
        if (!value) {
          value = expect(parsers.entities.variable, 'Could not parse alpha');
          value = `@{${value.name.slice(1)}}`;
        }
        expectChar(')');
        return new _tree.default.Quoted('', `alpha(opacity=${value})`);
      },
      //
      // A Selector Element
      //
      //     div
      //     + h1
      //     #socks
      //     input[type="text"]
      //
      // Elements are the building blocks for Selectors,
      // they are made out of a `Combinator` (see combinator rule),
      // and an element name, such as a tag a class, or `*`.
      //
      element: function () {
        let e;
        let c;
        let v;
        const index = parserInput.i;
        c = this.combinator();
        e = parserInput.$re(/^(?:\d+\.\d+|\d+)%/) || parserInput.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) || parserInput.$char('*') || parserInput.$char('&') || this.attribute() || parserInput.$re(/^\([^&()@]+\)/) || parserInput.$re(/^[\.#:](?=@)/) || this.entities.variableCurly();
        if (!e) {
          parserInput.save();
          if (parserInput.$char('(')) {
            if ((v = this.selector(false)) && parserInput.$char(')')) {
              e = new _tree.default.Paren(v);
              parserInput.forget();
            } else {
              parserInput.restore('Missing closing \')\'');
            }
          } else {
            parserInput.forget();
          }
        }
        if (e) {
          return new _tree.default.Element(c, e, e instanceof _tree.default.Variable, index, fileInfo);
        }
      },
      //
      // Combinators combine elements together, in a Selector.
      //
      // Because our parser isn't white-space sensitive, special care
      // has to be taken, when parsing the descendant combinator, ` `,
      // as it's an empty space. We have to check the previous character
      // in the input, to see if it's a ` ` character. More info on how
      // we deal with this in *combinator.js*.
      //
      combinator: function () {
        let c = parserInput.currentChar();
        if (c === '/') {
          parserInput.save();
          const slashedCombinator = parserInput.$re(/^\/[a-z]+\//i);
          if (slashedCombinator) {
            parserInput.forget();
            return new _tree.default.Combinator(slashedCombinator);
          }
          parserInput.restore();
        }
        if (c === '>' || c === '+' || c === '~' || c === '|' || c === '^') {
          parserInput.i++;
          if (c === '^' && parserInput.currentChar() === '^') {
            c = '^^';
            parserInput.i++;
          }
          while (parserInput.isWhitespace()) {
            parserInput.i++;
          }
          return new _tree.default.Combinator(c);
        } else if (parserInput.isWhitespace(-1)) {
          return new _tree.default.Combinator(' ');
        } else {
          return new _tree.default.Combinator(null);
        }
      },
      //
      // A CSS Selector
      // with less extensions e.g. the ability to extend and guard
      //
      //     .class > div + h1
      //     li a:hover
      //
      // Selectors are made out of one or more Elements, see above.
      //
      selector: function (isLess) {
        const index = parserInput.i;
        let elements;
        let extendList;
        let c;
        let e;
        let allExtends;
        let when;
        let condition;
        isLess = isLess !== false;
        while (isLess && (extendList = this.extend()) || isLess && (when = parserInput.$str('when')) || (e = this.element())) {
          if (when) {
            condition = expect(this.conditions, 'expected condition');
          } else if (condition) {
            error('CSS guard can only be used at the end of selector');
          } else if (extendList) {
            if (allExtends) {
              allExtends = allExtends.concat(extendList);
            } else {
              allExtends = extendList;
            }
          } else {
            if (allExtends) {
              error('Extend can only be used at the end of selector');
            }
            c = parserInput.currentChar();
            if (elements) {
              elements.push(e);
            } else {
              elements = [e];
            }
            e = null;
          }
          if (c === '{' || c === '}' || c === ';' || c === ',' || c === ')') {
            break;
          }
        }
        if (elements) {
          return new _tree.default.Selector(elements, allExtends, condition, index, fileInfo);
        }
        if (allExtends) {
          error('Extend must be used to extend a selector, it cannot be used on its own');
        }
      },
      selectors: function () {
        let s;
        let selectors;
        while (true) {
          s = this.selector();
          if (!s) {
            break;
          }
          if (selectors) {
            selectors.push(s);
          } else {
            selectors = [s];
          }
          parserInput.commentStore.length = 0;
          if (s.condition && selectors.length > 1) {
            error("Guards are only currently allowed on a single selector.");
          }
          if (!parserInput.$char(',')) {
            break;
          }
          if (s.condition) {
            error("Guards are only currently allowed on a single selector.");
          }
          parserInput.commentStore.length = 0;
        }
        return selectors;
      },
      attribute: function () {
        if (!parserInput.$char('[')) {
          return;
        }
        const entities = this.entities;
        let key;
        let val;
        let op;
        //
        // case-insensitive flag
        // e.g. [attr operator value i]
        //
        let cif;
        if (!(key = entities.variableCurly())) {
          key = expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/);
        }
        op = parserInput.$re(/^[|~*$^]?=/);
        if (op) {
          val = entities.quoted() || parserInput.$re(/^[0-9]+%/) || parserInput.$re(/^[\w-]+/) || entities.variableCurly();
          if (val) {
            cif = parserInput.$re(/^[iIsS]/);
          }
        }
        expectChar(']');
        return new _tree.default.Attribute(key, op, val, cif);
      },
      //
      // The `block` rule is used by `ruleset` and `mixin.definition`.
      // It's a wrapper around the `primary` rule, with added `{}`.
      //
      block: function () {
        let content;
        if (parserInput.$char('{') && (content = this.primary()) && parserInput.$char('}')) {
          return content;
        }
      },
      blockRuleset: function () {
        let block = this.block();
        if (block) {
          block = new _tree.default.Ruleset(null, block);
        }
        return block;
      },
      detachedRuleset: function () {
        let argInfo;
        let params;
        let variadic;
        parserInput.save();
        if (parserInput.$re(/^[.#]\(/)) {
          /**
           * DR args currently only implemented for each() function, and not 
           * yet settable as `@dr: #(@arg) {}`
           * This should be done when DRs are merged with mixins.
           * See: https://github.com/less/less-meta/issues/16
           */
          argInfo = this.mixin.args(false);
          params = argInfo.args;
          variadic = argInfo.variadic;
          if (!parserInput.$char(')')) {
            parserInput.restore();
            return;
          }
        }
        const blockRuleset = this.blockRuleset();
        if (blockRuleset) {
          parserInput.forget();
          if (params) {
            return new _tree.default.mixin.Definition(null, params, blockRuleset, null, variadic);
          }
          return new _tree.default.DetachedRuleset(blockRuleset);
        }
        parserInput.restore();
      },
      //
      // div, .class, body > p {...}
      //
      ruleset: function () {
        let selectors;
        let rules;
        let debugInfo;
        parserInput.save();
        if (context.dumpLineNumbers) {
          debugInfo = getDebugInfo(parserInput.i);
        }
        selectors = this.selectors();
        if (selectors && (rules = this.block())) {
          parserInput.forget();
          const ruleset = new _tree.default.Ruleset(selectors, rules, context.strictImports);
          if (context.dumpLineNumbers) {
            ruleset.debugInfo = debugInfo;
          }
          return ruleset;
        } else {
          parserInput.restore();
        }
      },
      declaration: function () {
        let name;
        let value;
        const index = parserInput.i;
        let hasDR;
        const c = parserInput.currentChar();
        let important;
        let merge;
        let isVariable;
        if (c === '.' || c === '#' || c === '&' || c === ':') {
          return;
        }
        parserInput.save();
        name = this.variable() || this.ruleProperty();
        if (name) {
          isVariable = typeof name === 'string';
          if (isVariable) {
            value = this.detachedRuleset();
            if (value) {
              hasDR = true;
            }
          }
          parserInput.commentStore.length = 0;
          if (!value) {
            // a name returned by this.ruleProperty() is always an array of the form:
            // [string-1, ..., string-n, ""] or [string-1, ..., string-n, "+"]
            // where each item is a tree.Keyword or tree.Variable
            merge = !isVariable && name.length > 1 && name.pop().value;

            // Custom property values get permissive parsing
            if (name[0].value && name[0].value.slice(0, 2) === '--') {
              value = this.permissiveValue();
            }
            // Try to store values as anonymous
            // If we need the value later we'll re-parse it in ruleset.parseValue
            else {
              value = this.anonymousValue();
            }
            if (value) {
              parserInput.forget();
              // anonymous values absorb the end ';' which is required for them to work
              return new _tree.default.Declaration(name, value, false, merge, index, fileInfo);
            }
            if (!value) {
              value = this.value();
            }
            if (value) {
              important = this.important();
            } else if (isVariable) {
              // As a last resort, try permissiveValue
              value = this.permissiveValue();
            }
          }
          if (value && (this.end() || hasDR)) {
            parserInput.forget();
            return new _tree.default.Declaration(name, value, important, merge, index, fileInfo);
          } else {
            parserInput.restore();
          }
        } else {
          parserInput.restore();
        }
      },
      anonymousValue: function () {
        const index = parserInput.i;
        const match = parserInput.$re(/^([^.#@\$+\/'"*`(;{}-]*);/);
        if (match) {
          return new _tree.default.Anonymous(match[1], index);
        }
      },
      /**
       * Used for custom properties, at-rules, and variables (as fallback)
       * Parses almost anything inside of {} [] () "" blocks
       * until it reaches outer-most tokens.
       * 
       * First, it will try to parse comments and entities to reach
       * the end. This is mostly like the Expression parser except no
       * math is allowed.
       */
      permissiveValue: function (untilTokens) {
        let i;
        let e;
        let done;
        let value;
        const tok = untilTokens || ';';
        const index = parserInput.i;
        const result = [];
        function testCurrentChar() {
          const char = parserInput.currentChar();
          if (typeof tok === 'string') {
            return char === tok;
          } else {
            return tok.test(char);
          }
        }
        if (testCurrentChar()) {
          return;
        }
        value = [];
        do {
          e = this.comment();
          if (e) {
            value.push(e);
            continue;
          }
          e = this.entity();
          if (e) {
            value.push(e);
          }
        } while (e);
        done = testCurrentChar();
        if (value.length > 0) {
          value = new _tree.default.Expression(value);
          if (done) {
            return value;
          } else {
            result.push(value);
          }
          // Preserve space before $parseUntil as it will not
          if (parserInput.prevChar() === ' ') {
            result.push(new _tree.default.Anonymous(' ', index));
          }
        }
        parserInput.save();
        value = parserInput.$parseUntil(tok);
        if (value) {
          if (typeof value === 'string') {
            error(`Expected '${value}'`, 'Parse');
          }
          if (value.length === 1 && value[0] === ' ') {
            parserInput.forget();
            return new _tree.default.Anonymous('', index);
          }
          let item;
          for (i = 0; i < value.length; i++) {
            item = value[i];
            if (Array.isArray(item)) {
              // Treat actual quotes as normal quoted values
              result.push(new _tree.default.Quoted(item[0], item[1], true, index, fileInfo));
            } else {
              if (i === value.length - 1) {
                item = item.trim();
              }
              // Treat like quoted values, but replace vars like unquoted expressions
              const quote = new _tree.default.Quoted('\'', item, true, index, fileInfo);
              quote.variableRegex = /@([\w-]+)/g;
              quote.propRegex = /\$([\w-]+)/g;
              result.push(quote);
            }
          }
          parserInput.forget();
          return new _tree.default.Expression(result, true);
        }
        parserInput.restore();
      },
      //
      // An @import atrule
      //
      //     @import "lib";
      //
      // Depending on our environment, importing is done differently:
      // In the browser, it's an XHR request, in Node, it would be a
      // file-system operation. The function used for importing is
      // stored in `import`, which we pass to the Import constructor.
      //
      'import': function () {
        let path;
        let features;
        const index = parserInput.i;
        const dir = parserInput.$re(/^@import\s+/);
        if (dir) {
          const options = (dir ? this.importOptions() : null) || {};
          if (path = this.entities.quoted() || this.entities.url()) {
            features = this.mediaFeatures();
            if (!parserInput.$char(';')) {
              parserInput.i = index;
              error('missing semi-colon or unrecognised media features on import');
            }
            features = features && new _tree.default.Value(features);
            return new _tree.default.Import(path, features, options, index, fileInfo);
          } else {
            parserInput.i = index;
            error('malformed import statement');
          }
        }
      },
      importOptions: function () {
        let o;
        const options = {};
        let optionName;
        let value;

        // list of options, surrounded by parens
        if (!parserInput.$char('(')) {
          return null;
        }
        do {
          o = this.importOption();
          if (o) {
            optionName = o;
            value = true;
            switch (optionName) {
              case 'css':
                optionName = 'less';
                value = false;
                break;
              case 'once':
                optionName = 'multiple';
                value = false;
                break;
            }
            options[optionName] = value;
            if (!parserInput.$char(',')) {
              break;
            }
          }
        } while (o);
        expectChar(')');
        return options;
      },
      importOption: function () {
        const opt = parserInput.$re(/^(less|css|multiple|once|inline|reference|optional)/);
        if (opt) {
          return opt[1];
        }
      },
      mediaFeature: function () {
        const entities = this.entities;
        const nodes = [];
        let e;
        let p;
        parserInput.save();
        do {
          e = entities.keyword() || entities.variable() || entities.mixinLookup();
          if (e) {
            nodes.push(e);
          } else if (parserInput.$char('(')) {
            p = this.property();
            e = this.value();
            if (parserInput.$char(')')) {
              if (p && e) {
                nodes.push(new _tree.default.Paren(new _tree.default.Declaration(p, e, null, null, parserInput.i, fileInfo, true)));
              } else if (e) {
                nodes.push(new _tree.default.Paren(e));
              } else {
                error('badly formed media feature definition');
              }
            } else {
              error('Missing closing \')\'', 'Parse');
            }
          }
        } while (e);
        parserInput.forget();
        if (nodes.length > 0) {
          return new _tree.default.Expression(nodes);
        }
      },
      mediaFeatures: function () {
        const entities = this.entities;
        const features = [];
        let e;
        do {
          e = this.mediaFeature();
          if (e) {
            features.push(e);
            if (!parserInput.$char(',')) {
              break;
            }
          } else {
            e = entities.variable() || entities.mixinLookup();
            if (e) {
              features.push(e);
              if (!parserInput.$char(',')) {
                break;
              }
            }
          }
        } while (e);
        return features.length > 0 ? features : null;
      },
      media: function () {
        let features;
        let rules;
        let media;
        let debugInfo;
        const index = parserInput.i;
        if (context.dumpLineNumbers) {
          debugInfo = getDebugInfo(index);
        }
        parserInput.save();
        if (parserInput.$str('@media')) {
          features = this.mediaFeatures();
          rules = this.block();
          if (!rules) {
            error('media definitions require block statements after any features');
          }
          parserInput.forget();
          media = new _tree.default.Media(rules, features, index, fileInfo);
          if (context.dumpLineNumbers) {
            media.debugInfo = debugInfo;
          }
          return media;
        }
        parserInput.restore();
      },
      //

      // A @plugin directive, used to import plugins dynamically.
      //
      //     @plugin (args) "lib";
      //
      plugin: function () {
        let path;
        let args;
        let options;
        const index = parserInput.i;
        const dir = parserInput.$re(/^@plugin\s+/);
        if (dir) {
          args = this.pluginArgs();
          if (args) {
            options = {
              pluginArgs: args,
              isPlugin: true
            };
          } else {
            options = {
              isPlugin: true
            };
          }
          if (path = this.entities.quoted() || this.entities.url()) {
            if (!parserInput.$char(';')) {
              parserInput.i = index;
              error('missing semi-colon on @plugin');
            }
            return new _tree.default.Import(path, null, options, index, fileInfo);
          } else {
            parserInput.i = index;
            error('malformed @plugin statement');
          }
        }
      },
      pluginArgs: function () {
        // list of options, surrounded by parens
        parserInput.save();
        if (!parserInput.$char('(')) {
          parserInput.restore();
          return null;
        }
        const args = parserInput.$re(/^\s*([^\);]+)\)\s*/);
        if (args[1]) {
          parserInput.forget();
          return args[1].trim();
        } else {
          parserInput.restore();
          return null;
        }
      },
      //
      // A CSS AtRule
      //
      //     @charset "utf-8";
      //
      atrule: function () {
        const index = parserInput.i;
        let name;
        let value;
        let rules;
        let nonVendorSpecificName;
        let hasIdentifier;
        let hasExpression;
        let hasUnknown;
        let hasBlock = true;
        let isRooted = true;
        if (parserInput.currentChar() !== '@') {
          return;
        }
        value = this['import']() || this.plugin() || this.media();
        if (value) {
          return value;
        }
        parserInput.save();
        name = parserInput.$re(/^@[a-z-]+/);
        if (!name) {
          return;
        }
        nonVendorSpecificName = name;
        if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
          nonVendorSpecificName = `@${name.slice(name.indexOf('-', 2) + 1)}`;
        }
        switch (nonVendorSpecificName) {
          case '@charset':
            hasIdentifier = true;
            hasBlock = false;
            break;
          case '@namespace':
            hasExpression = true;
            hasBlock = false;
            break;
          case '@keyframes':
          case '@counter-style':
            hasIdentifier = true;
            break;
          case '@document':
          case '@supports':
            hasUnknown = true;
            isRooted = false;
            break;
          default:
            hasUnknown = true;
            break;
        }
        parserInput.commentStore.length = 0;
        if (hasIdentifier) {
          value = this.entity();
          if (!value) {
            error(`expected ${name} identifier`);
          }
        } else if (hasExpression) {
          value = this.expression();
          if (!value) {
            error(`expected ${name} expression`);
          }
        } else if (hasUnknown) {
          value = this.permissiveValue(/^[{;]/);
          hasBlock = parserInput.currentChar() === '{';
          if (!value) {
            if (!hasBlock && parserInput.currentChar() !== ';') {
              error(`${name} rule is missing block or ending semi-colon`);
            }
          } else if (!value.value) {
            value = null;
          }
        }
        if (hasBlock) {
          rules = this.blockRuleset();
        }
        if (rules || !hasBlock && value && parserInput.$char(';')) {
          parserInput.forget();
          return new _tree.default.AtRule(name, value, rules, index, fileInfo, context.dumpLineNumbers ? getDebugInfo(index) : null, isRooted);
        }
        parserInput.restore('at-rule options not recognised');
      },
      //
      // A Value is a comma-delimited list of Expressions
      //
      //     font-family: Baskerville, Georgia, serif;
      //
      // In a Rule, a Value represents everything after the `:`,
      // and before the `;`.
      //
      value: function () {
        let e;
        const expressions = [];
        const index = parserInput.i;
        do {
          e = this.expression();
          if (e) {
            expressions.push(e);
            if (!parserInput.$char(',')) {
              break;
            }
          }
        } while (e);
        if (expressions.length > 0) {
          return new _tree.default.Value(expressions, index);
        }
      },
      important: function () {
        if (parserInput.currentChar() === '!') {
          return parserInput.$re(/^! *important/);
        }
      },
      sub: function () {
        let a;
        let e;
        parserInput.save();
        if (parserInput.$char('(')) {
          a = this.addition();
          if (a && parserInput.$char(')')) {
            parserInput.forget();
            e = new _tree.default.Expression([a]);
            e.parens = true;
            return e;
          }
          parserInput.restore('Expected \')\'');
          return;
        }
        parserInput.restore();
      },
      multiplication: function () {
        let m;
        let a;
        let op;
        let operation;
        let isSpaced;
        m = this.operand();
        if (m) {
          isSpaced = parserInput.isWhitespace(-1);
          while (true) {
            if (parserInput.peek(/^\/[*\/]/)) {
              break;
            }
            parserInput.save();
            op = parserInput.$char('/') || parserInput.$char('*') || parserInput.$str('./');
            if (!op) {
              parserInput.forget();
              break;
            }
            a = this.operand();
            if (!a) {
              parserInput.restore();
              break;
            }
            parserInput.forget();
            m.parensInOp = true;
            a.parensInOp = true;
            operation = new _tree.default.Operation(op, [operation || m, a], isSpaced);
            isSpaced = parserInput.isWhitespace(-1);
          }
          return operation || m;
        }
      },
      addition: function () {
        let m;
        let a;
        let op;
        let operation;
        let isSpaced;
        m = this.multiplication();
        if (m) {
          isSpaced = parserInput.isWhitespace(-1);
          while (true) {
            op = parserInput.$re(/^[-+]\s+/) || !isSpaced && (parserInput.$char('+') || parserInput.$char('-'));
            if (!op) {
              break;
            }
            a = this.multiplication();
            if (!a) {
              break;
            }
            m.parensInOp = true;
            a.parensInOp = true;
            operation = new _tree.default.Operation(op, [operation || m, a], isSpaced);
            isSpaced = parserInput.isWhitespace(-1);
          }
          return operation || m;
        }
      },
      conditions: function () {
        let a;
        let b;
        const index = parserInput.i;
        let condition;
        a = this.condition(true);
        if (a) {
          while (true) {
            if (!parserInput.peek(/^,\s*(not\s*)?\(/) || !parserInput.$char(',')) {
              break;
            }
            b = this.condition(true);
            if (!b) {
              break;
            }
            condition = new _tree.default.Condition('or', condition || a, b, index);
          }
          return condition || a;
        }
      },
      condition: function (needsParens) {
        let result;
        let logical;
        let next;
        function or() {
          return parserInput.$str('or');
        }
        result = this.conditionAnd(needsParens);
        if (!result) {
          return;
        }
        logical = or();
        if (logical) {
          next = this.condition(needsParens);
          if (next) {
            result = new _tree.default.Condition(logical, result, next);
          } else {
            return;
          }
        }
        return result;
      },
      conditionAnd: function (needsParens) {
        let result;
        let logical;
        let next;
        const self = this;
        function insideCondition() {
          const cond = self.negatedCondition(needsParens) || self.parenthesisCondition(needsParens);
          if (!cond && !needsParens) {
            return self.atomicCondition(needsParens);
          }
          return cond;
        }
        function and() {
          return parserInput.$str('and');
        }
        result = insideCondition();
        if (!result) {
          return;
        }
        logical = and();
        if (logical) {
          next = this.conditionAnd(needsParens);
          if (next) {
            result = new _tree.default.Condition(logical, result, next);
          } else {
            return;
          }
        }
        return result;
      },
      negatedCondition: function (needsParens) {
        if (parserInput.$str('not')) {
          const result = this.parenthesisCondition(needsParens);
          if (result) {
            result.negate = !result.negate;
          }
          return result;
        }
      },
      parenthesisCondition: function (needsParens) {
        function tryConditionFollowedByParenthesis(me) {
          let body;
          parserInput.save();
          body = me.condition(needsParens);
          if (!body) {
            parserInput.restore();
            return;
          }
          if (!parserInput.$char(')')) {
            parserInput.restore();
            return;
          }
          parserInput.forget();
          return body;
        }
        let body;
        parserInput.save();
        if (!parserInput.$str('(')) {
          parserInput.restore();
          return;
        }
        body = tryConditionFollowedByParenthesis(this);
        if (body) {
          parserInput.forget();
          return body;
        }
        body = this.atomicCondition(needsParens);
        if (!body) {
          parserInput.restore();
          return;
        }
        if (!parserInput.$char(')')) {
          parserInput.restore(`expected ')' got '${parserInput.currentChar()}'`);
          return;
        }
        parserInput.forget();
        return body;
      },
      atomicCondition: function (needsParens) {
        const entities = this.entities;
        const index = parserInput.i;
        let a;
        let b;
        let c;
        let op;
        function cond() {
          return this.addition() || entities.keyword() || entities.quoted() || entities.mixinLookup();
        }
        cond = cond.bind(this);
        a = cond();
        if (a) {
          if (parserInput.$char('>')) {
            if (parserInput.$char('=')) {
              op = '>=';
            } else {
              op = '>';
            }
          } else if (parserInput.$char('<')) {
            if (parserInput.$char('=')) {
              op = '<=';
            } else {
              op = '<';
            }
          } else if (parserInput.$char('=')) {
            if (parserInput.$char('>')) {
              op = '=>';
            } else if (parserInput.$char('<')) {
              op = '=<';
            } else {
              op = '=';
            }
          }
          if (op) {
            b = cond();
            if (b) {
              c = new _tree.default.Condition(op, a, b, index, false);
            } else {
              error('expected expression');
            }
          } else {
            c = new _tree.default.Condition('=', a, new _tree.default.Keyword('true'), index, false);
          }
          return c;
        }
      },
      //
      // An operand is anything that can be part of an operation,
      // such as a Color, or a Variable
      //
      operand: function () {
        const entities = this.entities;
        let negate;
        if (parserInput.peek(/^-[@\$\(]/)) {
          negate = parserInput.$char('-');
        }
        let o = this.sub() || entities.dimension() || entities.color() || entities.variable() || entities.property() || entities.call() || entities.quoted(true) || entities.colorKeyword() || entities.mixinLookup();
        if (negate) {
          o.parensInOp = true;
          o = new _tree.default.Negative(o);
        }
        return o;
      },
      //
      // Expressions either represent mathematical operations,
      // or white-space delimited Entities.
      //
      //     1px solid black
      //     @var * 2
      //
      expression: function () {
        const entities = [];
        let e;
        let delim;
        const index = parserInput.i;
        do {
          e = this.comment();
          if (e) {
            entities.push(e);
            continue;
          }
          e = this.addition() || this.entity();
          if (e instanceof _tree.default.Comment) {
            e = null;
          }
          if (e) {
            entities.push(e);
            // operations do not allow keyword "/" dimension (e.g. small/20px) so we support that here
            if (!parserInput.peek(/^\/[\/*]/)) {
              delim = parserInput.$char('/');
              if (delim) {
                entities.push(new _tree.default.Anonymous(delim, index));
              }
            }
          }
        } while (e);
        if (entities.length > 0) {
          return new _tree.default.Expression(entities);
        }
      },
      property: function () {
        const name = parserInput.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);
        if (name) {
          return name[1];
        }
      },
      ruleProperty: function () {
        let name = [];
        const index = [];
        let s;
        let k;
        parserInput.save();
        const simpleProperty = parserInput.$re(/^([_a-zA-Z0-9-]+)\s*:/);
        if (simpleProperty) {
          name = [new _tree.default.Keyword(simpleProperty[1])];
          parserInput.forget();
          return name;
        }
        function match(re) {
          const i = parserInput.i;
          const chunk = parserInput.$re(re);
          if (chunk) {
            index.push(i);
            return name.push(chunk[1]);
          }
        }
        match(/^(\*?)/);
        while (true) {
          if (!match(/^((?:[\w-]+)|(?:[@\$]\{[\w-]+\}))/)) {
            break;
          }
        }
        if (name.length > 1 && match(/^((?:\+_|\+)?)\s*:/)) {
          parserInput.forget();

          // at last, we have the complete match now. move forward,
          // convert name particles to tree objects and return:
          if (name[0] === '') {
            name.shift();
            index.shift();
          }
          for (k = 0; k < name.length; k++) {
            s = name[k];
            name[k] = s.charAt(0) !== '@' && s.charAt(0) !== '$' ? new _tree.default.Keyword(s) : s.charAt(0) === '@' ? new _tree.default.Variable(`@${s.slice(2, -1)}`, index[k], fileInfo) : new _tree.default.Property(`$${s.slice(2, -1)}`, index[k], fileInfo);
          }
          return name;
        }
        parserInput.restore();
      }
    }
  };
};
Parser.serializeVars = vars => {
  let s = '';
  for (const name in vars) {
    if (Object.hasOwnProperty.call(vars, name)) {
      const value = vars[name];
      s += `${(name[0] === '@' ? '' : '@') + name}: ${value}${String(value).slice(-1) === ';' ? '' : ';'}`;
    }
  }
  return s;
};
var _default = Parser;
exports.default = _default;

},{"../functions/function-registry":36,"../less-error":47,"../tree":76,"../utils":98,"../visitors":102,"./parser-input":52}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Plugin Manager
 */
class PluginManager {
  constructor(less) {
    this.less = less;
    this.visitors = [];
    this.preProcessors = [];
    this.postProcessors = [];
    this.installedPlugins = [];
    this.fileManagers = [];
    this.iterator = -1;
    this.pluginCache = {};
    this.Loader = new less.PluginLoader(less);
  }

  /**
   * Adds all the plugins in the array
   * @param {Array} plugins
   */
  addPlugins(plugins) {
    if (plugins) {
      for (let i = 0; i < plugins.length; i++) {
        this.addPlugin(plugins[i]);
      }
    }
  }

  /**
   *
   * @param plugin
   * @param {String} filename
   */
  addPlugin(plugin, filename, functionRegistry) {
    this.installedPlugins.push(plugin);
    if (filename) {
      this.pluginCache[filename] = plugin;
    }
    if (plugin.install) {
      plugin.install(this.less, this, functionRegistry || this.less.functions.functionRegistry);
    }
  }

  /**
   *
   * @param filename
   */
  get(filename) {
    return this.pluginCache[filename];
  }

  /**
   * Adds a visitor. The visitor object has options on itself to determine
   * when it should run.
   * @param visitor
   */
  addVisitor(visitor) {
    this.visitors.push(visitor);
  }

  /**
   * Adds a pre processor object
   * @param {object} preProcessor
   * @param {number} priority - guidelines 1 = before import, 1000 = import, 2000 = after import
   */
  addPreProcessor(preProcessor, priority) {
    let indexToInsertAt;
    for (indexToInsertAt = 0; indexToInsertAt < this.preProcessors.length; indexToInsertAt++) {
      if (this.preProcessors[indexToInsertAt].priority >= priority) {
        break;
      }
    }
    this.preProcessors.splice(indexToInsertAt, 0, {
      preProcessor,
      priority
    });
  }

  /**
   * Adds a post processor object
   * @param {object} postProcessor
   * @param {number} priority - guidelines 1 = before compression, 1000 = compression, 2000 = after compression
   */
  addPostProcessor(postProcessor, priority) {
    let indexToInsertAt;
    for (indexToInsertAt = 0; indexToInsertAt < this.postProcessors.length; indexToInsertAt++) {
      if (this.postProcessors[indexToInsertAt].priority >= priority) {
        break;
      }
    }
    this.postProcessors.splice(indexToInsertAt, 0, {
      postProcessor,
      priority
    });
  }

  /**
   *
   * @param manager
   */
  addFileManager(manager) {
    this.fileManagers.push(manager);
  }

  /**
   *
   * @returns {Array}
   * @private
   */
  getPreProcessors() {
    const preProcessors = [];
    for (let i = 0; i < this.preProcessors.length; i++) {
      preProcessors.push(this.preProcessors[i].preProcessor);
    }
    return preProcessors;
  }

  /**
   *
   * @returns {Array}
   * @private
   */
  getPostProcessors() {
    const postProcessors = [];
    for (let i = 0; i < this.postProcessors.length; i++) {
      postProcessors.push(this.postProcessors[i].postProcessor);
    }
    return postProcessors;
  }

  /**
   *
   * @returns {Array}
   * @private
   */
  getVisitors() {
    return this.visitors;
  }
  visitor() {
    const self = this;
    return {
      first: function () {
        self.iterator = -1;
        return self.visitors[self.iterator];
      },
      get: function () {
        self.iterator += 1;
        return self.visitors[self.iterator];
      }
    };
  }

  /**
   *
   * @returns {Array}
   * @private
   */
  getFileManagers() {
    return this.fileManagers;
  }
}
let pm;
const PluginManagerFactory = function (less, newFactory) {
  if (newFactory || !pm) {
    pm = new PluginManager(less);
  }
  return pm;
};

//
var _default = PluginManagerFactory;
exports.default = _default;

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _default(environment, ParseTree, ImportManager) {
  const render = function (input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = utils.copyOptions(this.options, {});
    } else {
      options = utils.copyOptions(this.options, options || {});
    }
    if (!callback) {
      const self = this;
      return new Promise(function (resolve, reject) {
        render.call(self, input, options, function (err, output) {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        });
      });
    } else {
      this.parse(input, options, function (err, root, imports, options) {
        if (err) {
          return callback(err);
        }
        let result;
        try {
          const parseTree = new ParseTree(root, imports);
          result = parseTree.toCSS(options);
        } catch (err) {
          return callback(err);
        }
        callback(null, result);
      });
    }
  };
  return render;
}
;

},{"./utils":98}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default(SourceMapOutput, environment) {
  class SourceMapBuilder {
    constructor(options) {
      this.options = options;
    }
    toCSS(rootNode, options, imports) {
      const sourceMapOutput = new SourceMapOutput({
        contentsIgnoredCharsMap: imports.contentsIgnoredChars,
        rootNode,
        contentsMap: imports.contents,
        sourceMapFilename: this.options.sourceMapFilename,
        sourceMapURL: this.options.sourceMapURL,
        outputFilename: this.options.sourceMapOutputFilename,
        sourceMapBasepath: this.options.sourceMapBasepath,
        sourceMapRootpath: this.options.sourceMapRootpath,
        outputSourceFiles: this.options.outputSourceFiles,
        sourceMapGenerator: this.options.sourceMapGenerator,
        sourceMapFileInline: this.options.sourceMapFileInline,
        disableSourcemapAnnotation: this.options.disableSourcemapAnnotation
      });
      const css = sourceMapOutput.toCSS(options);
      this.sourceMap = sourceMapOutput.sourceMap;
      this.sourceMapURL = sourceMapOutput.sourceMapURL;
      if (this.options.sourceMapInputFilename) {
        this.sourceMapInputFilename = sourceMapOutput.normalizeFilename(this.options.sourceMapInputFilename);
      }
      if (this.options.sourceMapBasepath !== undefined && this.sourceMapURL !== undefined) {
        this.sourceMapURL = sourceMapOutput.removeBasepath(this.sourceMapURL);
      }
      return css + this.getCSSAppendage();
    }
    getCSSAppendage() {
      let sourceMapURL = this.sourceMapURL;
      if (this.options.sourceMapFileInline) {
        if (this.sourceMap === undefined) {
          return '';
        }
        sourceMapURL = `data:application/json;base64,${environment.encodeBase64(this.sourceMap)}`;
      }
      if (this.options.disableSourcemapAnnotation) {
        return '';
      }
      if (sourceMapURL) {
        return `/*# sourceMappingURL=${sourceMapURL} */`;
      }
      return '';
    }
    getExternalSourceMap() {
      return this.sourceMap;
    }
    setExternalSourceMap(sourceMap) {
      this.sourceMap = sourceMap;
    }
    isInline() {
      return this.options.sourceMapFileInline;
    }
    getSourceMapURL() {
      return this.sourceMapURL;
    }
    getOutputFilename() {
      return this.options.sourceMapOutputFilename;
    }
    getInputFilename() {
      return this.sourceMapInputFilename;
    }
  }
  return SourceMapBuilder;
}
;

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default(environment) {
  class SourceMapOutput {
    constructor(options) {
      this._css = [];
      this._rootNode = options.rootNode;
      this._contentsMap = options.contentsMap;
      this._contentsIgnoredCharsMap = options.contentsIgnoredCharsMap;
      if (options.sourceMapFilename) {
        this._sourceMapFilename = options.sourceMapFilename.replace(/\\/g, '/');
      }
      this._outputFilename = options.outputFilename;
      this.sourceMapURL = options.sourceMapURL;
      if (options.sourceMapBasepath) {
        this._sourceMapBasepath = options.sourceMapBasepath.replace(/\\/g, '/');
      }
      if (options.sourceMapRootpath) {
        this._sourceMapRootpath = options.sourceMapRootpath.replace(/\\/g, '/');
        if (this._sourceMapRootpath.charAt(this._sourceMapRootpath.length - 1) !== '/') {
          this._sourceMapRootpath += '/';
        }
      } else {
        this._sourceMapRootpath = '';
      }
      this._outputSourceFiles = options.outputSourceFiles;
      this._sourceMapGeneratorConstructor = environment.getSourceMapGenerator();
      this._lineNumber = 0;
      this._column = 0;
    }
    removeBasepath(path) {
      if (this._sourceMapBasepath && path.indexOf(this._sourceMapBasepath) === 0) {
        path = path.substring(this._sourceMapBasepath.length);
        if (path.charAt(0) === '\\' || path.charAt(0) === '/') {
          path = path.substring(1);
        }
      }
      return path;
    }
    normalizeFilename(filename) {
      filename = filename.replace(/\\/g, '/');
      filename = this.removeBasepath(filename);
      return (this._sourceMapRootpath || '') + filename;
    }
    add(chunk, fileInfo, index, mapLines) {
      // ignore adding empty strings
      if (!chunk) {
        return;
      }
      let lines, sourceLines, columns, sourceColumns, i;
      if (fileInfo && fileInfo.filename) {
        let inputSource = this._contentsMap[fileInfo.filename];

        // remove vars/banner added to the top of the file
        if (this._contentsIgnoredCharsMap[fileInfo.filename]) {
          // adjust the index
          index -= this._contentsIgnoredCharsMap[fileInfo.filename];
          if (index < 0) {
            index = 0;
          }
          // adjust the source
          inputSource = inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename]);
        }

        /** 
         * ignore empty content, or failsafe
         * if contents map is incorrect
         */
        if (inputSource === undefined) {
          this._css.push(chunk);
          return;
        }
        inputSource = inputSource.substring(0, index);
        sourceLines = inputSource.split('\n');
        sourceColumns = sourceLines[sourceLines.length - 1];
      }
      lines = chunk.split('\n');
      columns = lines[lines.length - 1];
      if (fileInfo && fileInfo.filename) {
        if (!mapLines) {
          this._sourceMapGenerator.addMapping({
            generated: {
              line: this._lineNumber + 1,
              column: this._column
            },
            original: {
              line: sourceLines.length,
              column: sourceColumns.length
            },
            source: this.normalizeFilename(fileInfo.filename)
          });
        } else {
          for (i = 0; i < lines.length; i++) {
            this._sourceMapGenerator.addMapping({
              generated: {
                line: this._lineNumber + i + 1,
                column: i === 0 ? this._column : 0
              },
              original: {
                line: sourceLines.length + i,
                column: i === 0 ? sourceColumns.length : 0
              },
              source: this.normalizeFilename(fileInfo.filename)
            });
          }
        }
      }
      if (lines.length === 1) {
        this._column += columns.length;
      } else {
        this._lineNumber += lines.length - 1;
        this._column = columns.length;
      }
      this._css.push(chunk);
    }
    isEmpty() {
      return this._css.length === 0;
    }
    toCSS(context) {
      this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({
        file: this._outputFilename,
        sourceRoot: null
      });
      if (this._outputSourceFiles) {
        for (const filename in this._contentsMap) {
          if (this._contentsMap.hasOwnProperty(filename)) {
            let source = this._contentsMap[filename];
            if (this._contentsIgnoredCharsMap[filename]) {
              source = source.slice(this._contentsIgnoredCharsMap[filename]);
            }
            this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), source);
          }
        }
      }
      this._rootNode.genCSS(context, this);
      if (this._css.length > 0) {
        let sourceMapURL;
        const sourceMapContent = JSON.stringify(this._sourceMapGenerator.toJSON());
        if (this.sourceMapURL) {
          sourceMapURL = this.sourceMapURL;
        } else if (this._sourceMapFilename) {
          sourceMapURL = this._sourceMapFilename;
        }
        this.sourceMapURL = sourceMapURL;
        this.sourceMap = sourceMapContent;
      }
      return this._css.join('');
    }
  }
  return SourceMapOutput;
}
;

},{}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _contexts = _interopRequireDefault(require("./contexts"));
var _visitors = _interopRequireDefault(require("./visitors"));
var _tree = _interopRequireDefault(require("./tree"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default(root, options) {
  options = options || {};
  let evaldRoot;
  let variables = options.variables;
  const evalEnv = new _contexts.default.Eval(options);

  //
  // Allows setting variables with a hash, so:
  //
  //   `{ color: new tree.Color('#f01') }` will become:
  //
  //   new tree.Declaration('@color',
  //     new tree.Value([
  //       new tree.Expression([
  //         new tree.Color('#f01')
  //       ])
  //     ])
  //   )
  //
  if (typeof variables === 'object' && !Array.isArray(variables)) {
    variables = Object.keys(variables).map(function (k) {
      let value = variables[k];
      if (!(value instanceof _tree.default.Value)) {
        if (!(value instanceof _tree.default.Expression)) {
          value = new _tree.default.Expression([value]);
        }
        value = new _tree.default.Value([value]);
      }
      return new _tree.default.Declaration(`@${k}`, value, false, null, 0);
    });
    evalEnv.frames = [new _tree.default.Ruleset(null, variables)];
  }
  const visitors = [new _visitors.default.JoinSelectorVisitor(), new _visitors.default.MarkVisibleSelectorsVisitor(true), new _visitors.default.ExtendVisitor(), new _visitors.default.ToCSSVisitor({
    compress: Boolean(options.compress)
  })];
  const preEvalVisitors = [];
  let v;
  let visitorIterator;

  /**
   * first() / get() allows visitors to be added while visiting
   * 
   * @todo Add scoping for visitors just like functions for @plugin; right now they're global
   */
  if (options.pluginManager) {
    visitorIterator = options.pluginManager.visitor();
    for (var i = 0; i < 2; i++) {
      visitorIterator.first();
      while (v = visitorIterator.get()) {
        if (v.isPreEvalVisitor) {
          if (i === 0 || preEvalVisitors.indexOf(v) === -1) {
            preEvalVisitors.push(v);
            v.run(root);
          }
        } else {
          if (i === 0 || visitors.indexOf(v) === -1) {
            if (v.isPreVisitor) {
              visitors.unshift(v);
            } else {
              visitors.push(v);
            }
          }
        }
      }
    }
  }
  evaldRoot = root.eval(evalEnv);
  for (var i = 0; i < visitors.length; i++) {
    visitors[i].run(evaldRoot);
  }

  // Run any remaining visitors added after eval pass
  if (options.pluginManager) {
    visitorIterator.first();
    while (v = visitorIterator.get()) {
      if (visitors.indexOf(v) === -1 && preEvalVisitors.indexOf(v) === -1) {
        v.run(evaldRoot);
      }
    }
  }
  return evaldRoot;
}
;

},{"./contexts":22,"./tree":76,"./visitors":102}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Anonymous = function (value, index, currentFileInfo, mapLines, rulesetLike, visibilityInfo) {
  this.value = value;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.mapLines = mapLines;
  this.rulesetLike = typeof rulesetLike === 'undefined' ? false : rulesetLike;
  this.allowRoot = true;
  this.copyVisibilityInfo(visibilityInfo);
};
Anonymous.prototype = Object.assign(new _node.default(), {
  type: 'Anonymous',
  eval() {
    return new Anonymous(this.value, this._index, this._fileInfo, this.mapLines, this.rulesetLike, this.visibilityInfo());
  },
  compare(other) {
    return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
  },
  isRulesetLike() {
    return this.rulesetLike;
  },
  genCSS(context, output) {
    this.nodeVisible = Boolean(this.value);
    if (this.nodeVisible) {
      output.add(this.value, this._fileInfo, this._index, this.mapLines);
    }
  }
});
var _default = Anonymous;
exports.default = _default;

},{"./node":85}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Assignment = function (key, val) {
  this.key = key;
  this.value = val;
};
Assignment.prototype = Object.assign(new _node.default(), {
  type: 'Assignment',
  accept(visitor) {
    this.value = visitor.visit(this.value);
  },
  eval(context) {
    if (this.value.eval) {
      return new Assignment(this.key, this.value.eval(context));
    }
    return this;
  },
  genCSS(context, output) {
    output.add(`${this.key}=`);
    if (this.value.genCSS) {
      this.value.genCSS(context, output);
    } else {
      output.add(this.value);
    }
  }
});
var _default = Assignment;
exports.default = _default;

},{"./node":85}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AtRule = function (name, value, rules, index, currentFileInfo, debugInfo, isRooted, visibilityInfo) {
  let i;
  this.name = name;
  this.value = value instanceof _node.default ? value : value ? new _anonymous.default(value) : value;
  if (rules) {
    if (Array.isArray(rules)) {
      this.rules = rules;
    } else {
      this.rules = [rules];
      this.rules[0].selectors = new _selector.default([], null, null, index, currentFileInfo).createEmptySelectors();
    }
    for (i = 0; i < this.rules.length; i++) {
      this.rules[i].allowImports = true;
    }
    this.setParent(this.rules, this);
  }
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.debugInfo = debugInfo;
  this.isRooted = isRooted || false;
  this.copyVisibilityInfo(visibilityInfo);
  this.allowRoot = true;
};
AtRule.prototype = Object.assign(new _node.default(), {
  type: 'AtRule',
  accept(visitor) {
    const value = this.value,
      rules = this.rules;
    if (rules) {
      this.rules = visitor.visitArray(rules);
    }
    if (value) {
      this.value = visitor.visit(value);
    }
  },
  isRulesetLike() {
    return this.rules || !this.isCharset();
  },
  isCharset() {
    return '@charset' === this.name;
  },
  genCSS(context, output) {
    const value = this.value,
      rules = this.rules;
    output.add(this.name, this.fileInfo(), this.getIndex());
    if (value) {
      output.add(' ');
      value.genCSS(context, output);
    }
    if (rules) {
      this.outputRuleset(context, output, rules);
    } else {
      output.add(';');
    }
  },
  eval(context) {
    let mediaPathBackup,
      mediaBlocksBackup,
      value = this.value,
      rules = this.rules;

    // media stored inside other atrule should not bubble over it
    // backpup media bubbling information
    mediaPathBackup = context.mediaPath;
    mediaBlocksBackup = context.mediaBlocks;
    // deleted media bubbling information
    context.mediaPath = [];
    context.mediaBlocks = [];
    if (value) {
      value = value.eval(context);
    }
    if (rules) {
      // assuming that there is only one rule at this point - that is how parser constructs the rule
      rules = [rules[0].eval(context)];
      rules[0].root = true;
    }
    // restore media bubbling information
    context.mediaPath = mediaPathBackup;
    context.mediaBlocks = mediaBlocksBackup;
    return new AtRule(this.name, value, rules, this.getIndex(), this.fileInfo(), this.debugInfo, this.isRooted, this.visibilityInfo());
  },
  variable(name) {
    if (this.rules) {
      // assuming that there is only one rule at this point - that is how parser constructs the rule
      return _ruleset.default.prototype.variable.call(this.rules[0], name);
    }
  },
  find() {
    if (this.rules) {
      // assuming that there is only one rule at this point - that is how parser constructs the rule
      return _ruleset.default.prototype.find.apply(this.rules[0], arguments);
    }
  },
  rulesets() {
    if (this.rules) {
      // assuming that there is only one rule at this point - that is how parser constructs the rule
      return _ruleset.default.prototype.rulesets.apply(this.rules[0]);
    }
  },
  outputRuleset(context, output, rules) {
    const ruleCnt = rules.length;
    let i;
    context.tabLevel = (context.tabLevel | 0) + 1;

    // Compressed
    if (context.compress) {
      output.add('{');
      for (i = 0; i < ruleCnt; i++) {
        rules[i].genCSS(context, output);
      }
      output.add('}');
      context.tabLevel--;
      return;
    }

    // Non-compressed
    const tabSetStr = `\n${Array(context.tabLevel).join('  ')}`,
      tabRuleStr = `${tabSetStr}  `;
    if (!ruleCnt) {
      output.add(` {${tabSetStr}}`);
    } else {
      output.add(` {${tabRuleStr}`);
      rules[0].genCSS(context, output);
      for (i = 1; i < ruleCnt; i++) {
        output.add(tabRuleStr);
        rules[i].genCSS(context, output);
      }
      output.add(`${tabSetStr}}`);
    }
    context.tabLevel--;
  }
});
var _default = AtRule;
exports.default = _default;

},{"./anonymous":59,"./node":85,"./ruleset":90,"./selector":91}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Attribute = function (key, op, value, cif) {
  this.key = key;
  this.op = op;
  this.value = value;
  this.cif = cif;
};
Attribute.prototype = Object.assign(new _node.default(), {
  type: 'Attribute',
  eval(context) {
    return new Attribute(this.key.eval ? this.key.eval(context) : this.key, this.op, this.value && this.value.eval ? this.value.eval(context) : this.value, this.cif);
  },
  genCSS(context, output) {
    output.add(this.toCSS(context));
  },
  toCSS(context) {
    let value = this.key.toCSS ? this.key.toCSS(context) : this.key;
    if (this.op) {
      value += this.op;
      value += this.value.toCSS ? this.value.toCSS(context) : this.value;
    }
    if (this.cif) {
      value = value + " " + this.cif;
    }
    return `[${value}]`;
  }
});
var _default = Attribute;
exports.default = _default;

},{"./node":85}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _functionCaller = _interopRequireDefault(require("../functions/function-caller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//
// A function call node.
//
const Call = function (name, args, index, currentFileInfo) {
  this.name = name;
  this.args = args;
  this.calc = name === 'calc';
  this._index = index;
  this._fileInfo = currentFileInfo;
};
Call.prototype = Object.assign(new _node.default(), {
  type: 'Call',
  accept(visitor) {
    if (this.args) {
      this.args = visitor.visitArray(this.args);
    }
  },
  //
  // When evaluating a function call,
  // we either find the function in the functionRegistry,
  // in which case we call it, passing the  evaluated arguments,
  // if this returns null or we cannot find the function, we
  // simply print it out as it appeared originally [2].
  //
  // The reason why we evaluate the arguments, is in the case where
  // we try to pass a variable to a function, like: `saturate(@color)`.
  // The function should receive the value, not the variable.
  //
  eval(context) {
    /**
     * Turn off math for calc(), and switch back on for evaluating nested functions
     */
    const currentMathContext = context.mathOn;
    context.mathOn = !this.calc;
    if (this.calc || context.inCalc) {
      context.enterCalc();
    }
    const exitCalc = () => {
      if (this.calc || context.inCalc) {
        context.exitCalc();
      }
      context.mathOn = currentMathContext;
    };
    let result;
    const funcCaller = new _functionCaller.default(this.name, context, this.getIndex(), this.fileInfo());
    if (funcCaller.isValid()) {
      try {
        result = funcCaller.call(this.args);
        exitCalc();
      } catch (e) {
        if (e.hasOwnProperty('line') && e.hasOwnProperty('column')) {
          throw e;
        }
        throw {
          type: e.type || 'Runtime',
          message: `Error evaluating function \`${this.name}\`${e.message ? `: ${e.message}` : ''}`,
          index: this.getIndex(),
          filename: this.fileInfo().filename,
          line: e.lineNumber,
          column: e.columnNumber
        };
      }
    }
    if (result !== null && result !== undefined) {
      // Results that that are not nodes are cast as Anonymous nodes
      // Falsy values or booleans are returned as empty nodes
      if (!(result instanceof _node.default)) {
        if (!result || result === true) {
          result = new _anonymous.default(null);
        } else {
          result = new _anonymous.default(result.toString());
        }
      }
      result._index = this._index;
      result._fileInfo = this._fileInfo;
      return result;
    }
    const args = this.args.map(a => a.eval(context));
    exitCalc();
    return new Call(this.name, args, this.getIndex(), this.fileInfo());
  },
  genCSS(context, output) {
    output.add(`${this.name}(`, this.fileInfo(), this.getIndex());
    for (let i = 0; i < this.args.length; i++) {
      this.args[i].genCSS(context, output);
      if (i + 1 < this.args.length) {
        output.add(', ');
      }
    }
    output.add(')');
  }
});
var _default = Call;
exports.default = _default;

},{"../functions/function-caller":35,"./anonymous":59,"./node":85}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _colors = _interopRequireDefault(require("../data/colors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//
// RGB Colors - #ff0014, #eee
//
const Color = function (rgb, a, originalForm) {
  const self = this;
  //
  // The end goal here, is to parse the arguments
  // into an integer triplet, such as `128, 255, 0`
  //
  // This facilitates operations and conversions.
  //
  if (Array.isArray(rgb)) {
    this.rgb = rgb;
  } else if (rgb.length >= 6) {
    this.rgb = [];
    rgb.match(/.{2}/g).map(function (c, i) {
      if (i < 3) {
        self.rgb.push(parseInt(c, 16));
      } else {
        self.alpha = parseInt(c, 16) / 255;
      }
    });
  } else {
    this.rgb = [];
    rgb.split('').map(function (c, i) {
      if (i < 3) {
        self.rgb.push(parseInt(c + c, 16));
      } else {
        self.alpha = parseInt(c + c, 16) / 255;
      }
    });
  }
  this.alpha = this.alpha || (typeof a === 'number' ? a : 1);
  if (typeof originalForm !== 'undefined') {
    this.value = originalForm;
  }
};
Color.prototype = Object.assign(new _node.default(), {
  type: 'Color',
  luma() {
    let r = this.rgb[0] / 255,
      g = this.rgb[1] / 255,
      b = this.rgb[2] / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  genCSS(context, output) {
    output.add(this.toCSS(context));
  },
  toCSS(context, doNotCompress) {
    const compress = context && context.compress && !doNotCompress;
    let color;
    let alpha;
    let colorFunction;
    let args = [];

    // `value` is set if this color was originally
    // converted from a named color string so we need
    // to respect this and try to output named color too.
    alpha = this.fround(context, this.alpha);
    if (this.value) {
      if (this.value.indexOf('rgb') === 0) {
        if (alpha < 1) {
          colorFunction = 'rgba';
        }
      } else if (this.value.indexOf('hsl') === 0) {
        if (alpha < 1) {
          colorFunction = 'hsla';
        } else {
          colorFunction = 'hsl';
        }
      } else {
        return this.value;
      }
    } else {
      if (alpha < 1) {
        colorFunction = 'rgba';
      }
    }
    switch (colorFunction) {
      case 'rgba':
        args = this.rgb.map(function (c) {
          return clamp(Math.round(c), 255);
        }).concat(clamp(alpha, 1));
        break;
      case 'hsla':
        args.push(clamp(alpha, 1));
      case 'hsl':
        color = this.toHSL();
        args = [this.fround(context, color.h), `${this.fround(context, color.s * 100)}%`, `${this.fround(context, color.l * 100)}%`].concat(args);
    }
    if (colorFunction) {
      // Values are capped between `0` and `255`, rounded and zero-padded.
      return `${colorFunction}(${args.join(`,${compress ? '' : ' '}`)})`;
    }
    color = this.toRGB();
    if (compress) {
      const splitcolor = color.split('');

      // Convert color to short format
      if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
        color = `#${splitcolor[1]}${splitcolor[3]}${splitcolor[5]}`;
      }
    }
    return color;
  },
  //
  // Operations have to be done per-channel, if not,
  // channels will spill onto each other. Once we have
  // our result, in the form of an integer triplet,
  // we create a new Color node to hold the result.
  //
  operate(context, op, other) {
    const rgb = new Array(3);
    const alpha = this.alpha * (1 - other.alpha) + other.alpha;
    for (let c = 0; c < 3; c++) {
      rgb[c] = this._operate(context, op, this.rgb[c], other.rgb[c]);
    }
    return new Color(rgb, alpha);
  },
  toRGB() {
    return toHex(this.rgb);
  },
  toHSL() {
    const r = this.rgb[0] / 255,
      g = this.rgb[1] / 255,
      b = this.rgb[2] / 255,
      a = this.alpha;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;
    const d = max - min;
    if (max === min) {
      h = s = 0;
    } else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: h * 360,
      s,
      l,
      a
    };
  },
  // Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  toHSV() {
    const r = this.rgb[0] / 255,
      g = this.rgb[1] / 255,
      b = this.rgb[2] / 255,
      a = this.alpha;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h;
    let s;
    const v = max;
    const d = max - min;
    if (max === 0) {
      s = 0;
    } else {
      s = d / max;
    }
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: h * 360,
      s,
      v,
      a
    };
  },
  toARGB() {
    return toHex([this.alpha * 255].concat(this.rgb));
  },
  compare(x) {
    return x.rgb && x.rgb[0] === this.rgb[0] && x.rgb[1] === this.rgb[1] && x.rgb[2] === this.rgb[2] && x.alpha === this.alpha ? 0 : undefined;
  }
});
Color.fromKeyword = function (keyword) {
  let c;
  const key = keyword.toLowerCase();
  if (_colors.default.hasOwnProperty(key)) {
    c = new Color(_colors.default[key].slice(1));
  } else if (key === 'transparent') {
    c = new Color([0, 0, 0], 0);
  }
  if (c) {
    c.value = keyword;
    return c;
  }
};
function clamp(v, max) {
  return Math.min(Math.max(v, 0), max);
}
function toHex(v) {
  return `#${v.map(function (c) {
    c = clamp(Math.round(c), 255);
    return (c < 16 ? '0' : '') + c.toString(16);
  }).join('')}`;
}
var _default = Color;
exports.default = _default;

},{"../data/colors":23,"./node":85}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _noSpaceCombinators = {
  '': true,
  ' ': true,
  '|': true
};
const Combinator = function (value) {
  if (value === ' ') {
    this.value = ' ';
    this.emptyOrWhitespace = true;
  } else {
    this.value = value ? value.trim() : '';
    this.emptyOrWhitespace = this.value === '';
  }
};
Combinator.prototype = Object.assign(new _node.default(), {
  type: 'Combinator',
  genCSS(context, output) {
    const spaceOrEmpty = context.compress || _noSpaceCombinators[this.value] ? '' : ' ';
    output.add(spaceOrEmpty + this.value + spaceOrEmpty);
  }
});
var _default = Combinator;
exports.default = _default;

},{"./node":85}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _debugInfo = _interopRequireDefault(require("./debug-info"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Comment = function (value, isLineComment, index, currentFileInfo) {
  this.value = value;
  this.isLineComment = isLineComment;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.allowRoot = true;
};
Comment.prototype = Object.assign(new _node.default(), {
  type: 'Comment',
  genCSS(context, output) {
    if (this.debugInfo) {
      output.add((0, _debugInfo.default)(context, this), this.fileInfo(), this.getIndex());
    }
    output.add(this.value);
  },
  isSilent(context) {
    const isCompressed = context.compress && this.value[2] !== '!';
    return this.isLineComment || isCompressed;
  }
});
var _default = Comment;
exports.default = _default;

},{"./debug-info":68,"./node":85}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Condition = function (op, l, r, i, negate) {
  this.op = op.trim();
  this.lvalue = l;
  this.rvalue = r;
  this._index = i;
  this.negate = negate;
};
Condition.prototype = Object.assign(new _node.default(), {
  type: 'Condition',
  accept(visitor) {
    this.lvalue = visitor.visit(this.lvalue);
    this.rvalue = visitor.visit(this.rvalue);
  },
  eval(context) {
    const result = function (op, a, b) {
      switch (op) {
        case 'and':
          return a && b;
        case 'or':
          return a || b;
        default:
          switch (_node.default.compare(a, b)) {
            case -1:
              return op === '<' || op === '=<' || op === '<=';
            case 0:
              return op === '=' || op === '>=' || op === '=<' || op === '<=';
            case 1:
              return op === '>' || op === '>=';
            default:
              return false;
          }
      }
    }(this.op, this.lvalue.eval(context), this.rvalue.eval(context));
    return this.negate ? !result : result;
  }
});
var _default = Condition;
exports.default = _default;

},{"./node":85}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function asComment(ctx) {
  return `/* line ${ctx.debugInfo.lineNumber}, ${ctx.debugInfo.fileName} */\n`;
}
function asMediaQuery(ctx) {
  let filenameWithProtocol = ctx.debugInfo.fileName;
  if (!/^[a-z]+:\/\//i.test(filenameWithProtocol)) {
    filenameWithProtocol = `file://${filenameWithProtocol}`;
  }
  return `@media -sass-debug-info{filename{font-family:${filenameWithProtocol.replace(/([.:\/\\])/g, function (a) {
    if (a == '\\') {
      a = '\/';
    }
    return `\\${a}`;
  })}}line{font-family:\\00003${ctx.debugInfo.lineNumber}}}\n`;
}
function debugInfo(context, ctx, lineSeparator) {
  let result = '';
  if (context.dumpLineNumbers && !context.compress) {
    switch (context.dumpLineNumbers) {
      case 'comments':
        result = asComment(ctx);
        break;
      case 'mediaquery':
        result = asMediaQuery(ctx);
        break;
      case 'all':
        result = asComment(ctx) + (lineSeparator || '') + asMediaQuery(ctx);
        break;
    }
  }
  return result;
}
var _default = debugInfo;
exports.default = _default;

},{}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _value = _interopRequireDefault(require("./value"));
var _keyword = _interopRequireDefault(require("./keyword"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var Constants = _interopRequireWildcard(require("../constants"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MATH = Constants.Math;
function evalName(context, name) {
  let value = '';
  let i;
  const n = name.length;
  const output = {
    add: function (s) {
      value += s;
    }
  };
  for (i = 0; i < n; i++) {
    name[i].eval(context).genCSS(context, output);
  }
  return value;
}
const Declaration = function (name, value, important, merge, index, currentFileInfo, inline, variable) {
  this.name = name;
  this.value = value instanceof _node.default ? value : new _value.default([value ? new _anonymous.default(value) : null]);
  this.important = important ? ` ${important.trim()}` : '';
  this.merge = merge;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.inline = inline || false;
  this.variable = variable !== undefined ? variable : name.charAt && name.charAt(0) === '@';
  this.allowRoot = true;
  this.setParent(this.value, this);
};
Declaration.prototype = Object.assign(new _node.default(), {
  type: 'Declaration',
  genCSS(context, output) {
    output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());
    try {
      this.value.genCSS(context, output);
    } catch (e) {
      e.index = this._index;
      e.filename = this._fileInfo.filename;
      throw e;
    }
    output.add(this.important + (this.inline || context.lastRule && context.compress ? '' : ';'), this._fileInfo, this._index);
  },
  eval(context) {
    let mathBypass = false,
      prevMath,
      name = this.name,
      evaldValue,
      variable = this.variable;
    if (typeof name !== 'string') {
      // expand 'primitive' name directly to get
      // things faster (~10% for benchmark.less):
      name = name.length === 1 && name[0] instanceof _keyword.default ? name[0].value : evalName(context, name);
      variable = false; // never treat expanded interpolation as new variable name
    }

    // @todo remove when parens-division is default
    if (name === 'font' && context.math === MATH.ALWAYS) {
      mathBypass = true;
      prevMath = context.math;
      context.math = MATH.PARENS_DIVISION;
    }
    try {
      context.importantScope.push({});
      evaldValue = this.value.eval(context);
      if (!this.variable && evaldValue.type === 'DetachedRuleset') {
        throw {
          message: 'Rulesets cannot be evaluated on a property.',
          index: this.getIndex(),
          filename: this.fileInfo().filename
        };
      }
      let important = this.important;
      const importantResult = context.importantScope.pop();
      if (!important && importantResult.important) {
        important = importantResult.important;
      }
      return new Declaration(name, evaldValue, important, this.merge, this.getIndex(), this.fileInfo(), this.inline, variable);
    } catch (e) {
      if (typeof e.index !== 'number') {
        e.index = this.getIndex();
        e.filename = this.fileInfo().filename;
      }
      throw e;
    } finally {
      if (mathBypass) {
        context.math = prevMath;
      }
    }
  },
  makeImportant() {
    return new Declaration(this.name, this.value, '!important', this.merge, this.getIndex(), this.fileInfo(), this.inline);
  }
});
var _default = Declaration;
exports.default = _default;

},{"../constants":21,"./anonymous":59,"./keyword":79,"./node":85,"./value":95}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _contexts = _interopRequireDefault(require("../contexts"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DetachedRuleset = function (ruleset, frames) {
  this.ruleset = ruleset;
  this.frames = frames;
  this.setParent(this.ruleset, this);
};
DetachedRuleset.prototype = Object.assign(new _node.default(), {
  type: 'DetachedRuleset',
  evalFirst: true,
  accept(visitor) {
    this.ruleset = visitor.visit(this.ruleset);
  },
  eval(context) {
    const frames = this.frames || utils.copyArray(context.frames);
    return new DetachedRuleset(this.ruleset, frames);
  },
  callEval(context) {
    return this.ruleset.eval(this.frames ? new _contexts.default.Eval(context, this.frames.concat(context.frames)) : context);
  }
});
var _default = DetachedRuleset;
exports.default = _default;

},{"../contexts":22,"../utils":98,"./node":85}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));
var _unit = _interopRequireDefault(require("./unit"));
var _color = _interopRequireDefault(require("./color"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//
// A number with a unit
//
const Dimension = function (value, unit) {
  this.value = parseFloat(value);
  if (isNaN(this.value)) {
    throw new Error('Dimension is not a number.');
  }
  this.unit = unit && unit instanceof _unit.default ? unit : new _unit.default(unit ? [unit] : undefined);
  this.setParent(this.unit, this);
};
Dimension.prototype = Object.assign(new _node.default(), {
  type: 'Dimension',
  accept(visitor) {
    this.unit = visitor.visit(this.unit);
  },
  eval(context) {
    return this;
  },
  toColor() {
    return new _color.default([this.value, this.value, this.value]);
  },
  genCSS(context, output) {
    if (context && context.strictUnits && !this.unit.isSingular()) {
      throw new Error(`Multiple units in dimension. Correct the units or use the unit function. Bad unit: ${this.unit.toString()}`);
    }
    const value = this.fround(context, this.value);
    let strValue = String(value);
    if (value !== 0 && value < 0.000001 && value > -0.000001) {
      // would be output 1e-6 etc.
      strValue = value.toFixed(20).replace(/0+$/, '');
    }
    if (context && context.compress) {
      // Zero values doesn't need a unit
      if (value === 0 && this.unit.isLength()) {
        output.add(strValue);
        return;
      }

      // Float values doesn't need a leading zero
      if (value > 0 && value < 1) {
        strValue = strValue.substr(1);
      }
    }
    output.add(strValue);
    this.unit.genCSS(context, output);
  },
  // In an operation between two Dimensions,
  // we default to the first Dimension's unit,
  // so `1px + 2` will yield `3px`.
  operate(context, op, other) {
    /* jshint noempty:false */
    let value = this._operate(context, op, this.value, other.value);
    let unit = this.unit.clone();
    if (op === '+' || op === '-') {
      if (unit.numerator.length === 0 && unit.denominator.length === 0) {
        unit = other.unit.clone();
        if (this.unit.backupUnit) {
          unit.backupUnit = this.unit.backupUnit;
        }
      } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
        // do nothing
      } else {
        other = other.convertTo(this.unit.usedUnits());
        if (context.strictUnits && other.unit.toString() !== unit.toString()) {
          throw new Error(`Incompatible units. Change the units or use the unit function. ` + `Bad units: '${unit.toString()}' and '${other.unit.toString()}'.`);
        }
        value = this._operate(context, op, this.value, other.value);
      }
    } else if (op === '*') {
      unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
      unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
      unit.cancel();
    } else if (op === '/') {
      unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
      unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
      unit.cancel();
    }
    return new Dimension(value, unit);
  },
  compare(other) {
    let a, b;
    if (!(other instanceof Dimension)) {
      return undefined;
    }
    if (this.unit.isEmpty() || other.unit.isEmpty()) {
      a = this;
      b = other;
    } else {
      a = this.unify();
      b = other.unify();
      if (a.unit.compare(b.unit) !== 0) {
        return undefined;
      }
    }
    return _node.default.numericCompare(a.value, b.value);
  },
  unify() {
    return this.convertTo({
      length: 'px',
      duration: 's',
      angle: 'rad'
    });
  },
  convertTo(conversions) {
    let value = this.value;
    const unit = this.unit.clone();
    let i;
    let groupName;
    let group;
    let targetUnit;
    let derivedConversions = {};
    let applyUnit;
    if (typeof conversions === 'string') {
      for (i in _unitConversions.default) {
        if (_unitConversions.default[i].hasOwnProperty(conversions)) {
          derivedConversions = {};
          derivedConversions[i] = conversions;
        }
      }
      conversions = derivedConversions;
    }
    applyUnit = function (atomicUnit, denominator) {
      /* jshint loopfunc:true */
      if (group.hasOwnProperty(atomicUnit)) {
        if (denominator) {
          value = value / (group[atomicUnit] / group[targetUnit]);
        } else {
          value = value * (group[atomicUnit] / group[targetUnit]);
        }
        return targetUnit;
      }
      return atomicUnit;
    };
    for (groupName in conversions) {
      if (conversions.hasOwnProperty(groupName)) {
        targetUnit = conversions[groupName];
        group = _unitConversions.default[groupName];
        unit.map(applyUnit);
      }
    }
    unit.cancel();
    return new Dimension(value, unit);
  }
});
var _default = Dimension;
exports.default = _default;

},{"../data/unit-conversions":25,"./color":64,"./node":85,"./unit":93}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _paren = _interopRequireDefault(require("./paren"));
var _combinator = _interopRequireDefault(require("./combinator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Element = function (combinator, value, isVariable, index, currentFileInfo, visibilityInfo) {
  this.combinator = combinator instanceof _combinator.default ? combinator : new _combinator.default(combinator);
  if (typeof value === 'string') {
    this.value = value.trim();
  } else if (value) {
    this.value = value;
  } else {
    this.value = '';
  }
  this.isVariable = isVariable;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.copyVisibilityInfo(visibilityInfo);
  this.setParent(this.combinator, this);
};
Element.prototype = Object.assign(new _node.default(), {
  type: 'Element',
  accept(visitor) {
    const value = this.value;
    this.combinator = visitor.visit(this.combinator);
    if (typeof value === 'object') {
      this.value = visitor.visit(value);
    }
  },
  eval(context) {
    return new Element(this.combinator, this.value.eval ? this.value.eval(context) : this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
  },
  clone() {
    return new Element(this.combinator, this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
  },
  genCSS(context, output) {
    output.add(this.toCSS(context), this.fileInfo(), this.getIndex());
  },
  toCSS(context) {
    context = context || {};
    let value = this.value;
    const firstSelector = context.firstSelector;
    if (value instanceof _paren.default) {
      // selector in parens should not be affected by outer selector
      // flags (breaks only interpolated selectors - see #1973)
      context.firstSelector = true;
    }
    value = value.toCSS ? value.toCSS(context) : value;
    context.firstSelector = firstSelector;
    if (value === '' && this.combinator.value.charAt(0) === '&') {
      return '';
    } else {
      return this.combinator.toCSS(context) + value;
    }
  }
});
var _default = Element;
exports.default = _default;

},{"./combinator":65,"./node":85,"./paren":87}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _paren = _interopRequireDefault(require("./paren"));
var _comment = _interopRequireDefault(require("./comment"));
var _dimension = _interopRequireDefault(require("./dimension"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Expression = function (value, noSpacing) {
  this.value = value;
  this.noSpacing = noSpacing;
  if (!value) {
    throw new Error('Expression requires an array parameter');
  }
};
Expression.prototype = Object.assign(new _node.default(), {
  type: 'Expression',
  accept(visitor) {
    this.value = visitor.visitArray(this.value);
  },
  eval(context) {
    let returnValue;
    const mathOn = context.isMathOn();
    const inParenthesis = this.parens;
    let doubleParen = false;
    if (inParenthesis) {
      context.inParenthesis();
    }
    if (this.value.length > 1) {
      returnValue = new Expression(this.value.map(function (e) {
        if (!e.eval) {
          return e;
        }
        return e.eval(context);
      }), this.noSpacing);
    } else if (this.value.length === 1) {
      if (this.value[0].parens && !this.value[0].parensInOp && !context.inCalc) {
        doubleParen = true;
      }
      returnValue = this.value[0].eval(context);
    } else {
      returnValue = this;
    }
    if (inParenthesis) {
      context.outOfParenthesis();
    }
    if (this.parens && this.parensInOp && !mathOn && !doubleParen && !(returnValue instanceof _dimension.default)) {
      returnValue = new _paren.default(returnValue);
    }
    return returnValue;
  },
  genCSS(context, output) {
    for (let i = 0; i < this.value.length; i++) {
      this.value[i].genCSS(context, output);
      if (!this.noSpacing && i + 1 < this.value.length) {
        output.add(' ');
      }
    }
  },
  throwAwayComments() {
    this.value = this.value.filter(function (v) {
      return !(v instanceof _comment.default);
    });
  }
});
var _default = Expression;
exports.default = _default;

},{"./comment":66,"./dimension":71,"./node":85,"./paren":87}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Extend = function (selector, option, index, currentFileInfo, visibilityInfo) {
  this.selector = selector;
  this.option = option;
  this.object_id = Extend.next_id++;
  this.parent_ids = [this.object_id];
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.copyVisibilityInfo(visibilityInfo);
  this.allowRoot = true;
  switch (option) {
    case 'all':
      this.allowBefore = true;
      this.allowAfter = true;
      break;
    default:
      this.allowBefore = false;
      this.allowAfter = false;
      break;
  }
  this.setParent(this.selector, this);
};
Extend.prototype = Object.assign(new _node.default(), {
  type: 'Extend',
  accept(visitor) {
    this.selector = visitor.visit(this.selector);
  },
  eval(context) {
    return new Extend(this.selector.eval(context), this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
  },
  clone(context) {
    return new Extend(this.selector, this.option, this.getIndex(), this.fileInfo(), this.visibilityInfo());
  },
  // it concatenates (joins) all selectors in selector array
  findSelfSelectors(selectors) {
    let selfElements = [],
      i,
      selectorElements;
    for (i = 0; i < selectors.length; i++) {
      selectorElements = selectors[i].elements;
      // duplicate the logic in genCSS function inside the selector node.
      // future TODO - move both logics into the selector joiner visitor
      if (i > 0 && selectorElements.length && selectorElements[0].combinator.value === '') {
        selectorElements[0].combinator.value = ' ';
      }
      selfElements = selfElements.concat(selectors[i].elements);
    }
    this.selfSelectors = [new _selector.default(selfElements)];
    this.selfSelectors[0].copyVisibilityInfo(this.visibilityInfo());
  }
});
Extend.next_id = 0;
var _default = Extend;
exports.default = _default;

},{"./node":85,"./selector":91}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _media = _interopRequireDefault(require("./media"));
var _url = _interopRequireDefault(require("./url"));
var _quoted = _interopRequireDefault(require("./quoted"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var utils = _interopRequireWildcard(require("../utils"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
const Import = function (path, features, options, index, currentFileInfo, visibilityInfo) {
  this.options = options;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.path = path;
  this.features = features;
  this.allowRoot = true;
  if (this.options.less !== undefined || this.options.inline) {
    this.css = !this.options.less || this.options.inline;
  } else {
    const pathValue = this.getPath();
    if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
      this.css = true;
    }
  }
  this.copyVisibilityInfo(visibilityInfo);
  this.setParent(this.features, this);
  this.setParent(this.path, this);
};
Import.prototype = Object.assign(new _node.default(), {
  type: 'Import',
  accept(visitor) {
    if (this.features) {
      this.features = visitor.visit(this.features);
    }
    this.path = visitor.visit(this.path);
    if (!this.options.isPlugin && !this.options.inline && this.root) {
      this.root = visitor.visit(this.root);
    }
  },
  genCSS(context, output) {
    if (this.css && this.path._fileInfo.reference === undefined) {
      output.add('@import ', this._fileInfo, this._index);
      this.path.genCSS(context, output);
      if (this.features) {
        output.add(' ');
        this.features.genCSS(context, output);
      }
      output.add(';');
    }
  },
  getPath() {
    return this.path instanceof _url.default ? this.path.value.value : this.path.value;
  },
  isVariableImport() {
    let path = this.path;
    if (path instanceof _url.default) {
      path = path.value;
    }
    if (path instanceof _quoted.default) {
      return path.containsVariables();
    }
    return true;
  },
  evalForImport(context) {
    let path = this.path;
    if (path instanceof _url.default) {
      path = path.value;
    }
    return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
  },
  evalPath(context) {
    const path = this.path.eval(context);
    const fileInfo = this._fileInfo;
    if (!(path instanceof _url.default)) {
      // Add the rootpath if the URL requires a rewrite
      const pathValue = path.value;
      if (fileInfo && pathValue && context.pathRequiresRewrite(pathValue)) {
        path.value = context.rewritePath(pathValue, fileInfo.rootpath);
      } else {
        path.value = context.normalizePath(path.value);
      }
    }
    return path;
  },
  eval(context) {
    const result = this.doEval(context);
    if (this.options.reference || this.blocksVisibility()) {
      if (result.length || result.length === 0) {
        result.forEach(function (node) {
          node.addVisibilityBlock();
        });
      } else {
        result.addVisibilityBlock();
      }
    }
    return result;
  },
  doEval(context) {
    let ruleset;
    let registry;
    const features = this.features && this.features.eval(context);
    if (this.options.isPlugin) {
      if (this.root && this.root.eval) {
        try {
          this.root.eval(context);
        } catch (e) {
          e.message = 'Plugin error during evaluation';
          throw new _lessError.default(e, this.root.imports, this.root.filename);
        }
      }
      registry = context.frames[0] && context.frames[0].functionRegistry;
      if (registry && this.root && this.root.functions) {
        registry.addMultiple(this.root.functions);
      }
      return [];
    }
    if (this.skip) {
      if (typeof this.skip === 'function') {
        this.skip = this.skip();
      }
      if (this.skip) {
        return [];
      }
    }
    if (this.options.inline) {
      const contents = new _anonymous.default(this.root, 0, {
        filename: this.importedFilename,
        reference: this.path._fileInfo && this.path._fileInfo.reference
      }, true, true);
      return this.features ? new _media.default([contents], this.features.value) : [contents];
    } else if (this.css) {
      const newImport = new Import(this.evalPath(context), features, this.options, this._index);
      if (!newImport.css && this.error) {
        throw this.error;
      }
      return newImport;
    } else if (this.root) {
      ruleset = new _ruleset.default(null, utils.copyArray(this.root.rules));
      ruleset.evalImports(context);
      return this.features ? new _media.default(ruleset.rules, this.features.value) : ruleset.rules;
    } else {
      return [];
    }
  }
});
var _default = Import;
exports.default = _default;

},{"../less-error":47,"../utils":98,"./anonymous":59,"./media":80,"./node":85,"./quoted":89,"./ruleset":90,"./url":94}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _color = _interopRequireDefault(require("./color"));
var _atrule = _interopRequireDefault(require("./atrule"));
var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));
var _operation = _interopRequireDefault(require("./operation"));
var _dimension = _interopRequireDefault(require("./dimension"));
var _unit = _interopRequireDefault(require("./unit"));
var _keyword = _interopRequireDefault(require("./keyword"));
var _variable = _interopRequireDefault(require("./variable"));
var _property = _interopRequireDefault(require("./property"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _element = _interopRequireDefault(require("./element"));
var _attribute = _interopRequireDefault(require("./attribute"));
var _combinator = _interopRequireDefault(require("./combinator"));
var _selector = _interopRequireDefault(require("./selector"));
var _quoted = _interopRequireDefault(require("./quoted"));
var _expression = _interopRequireDefault(require("./expression"));
var _declaration = _interopRequireDefault(require("./declaration"));
var _call = _interopRequireDefault(require("./call"));
var _url = _interopRequireDefault(require("./url"));
var _import = _interopRequireDefault(require("./import"));
var _comment = _interopRequireDefault(require("./comment"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _value = _interopRequireDefault(require("./value"));
var _javascript = _interopRequireDefault(require("./javascript"));
var _assignment = _interopRequireDefault(require("./assignment"));
var _condition = _interopRequireDefault(require("./condition"));
var _paren = _interopRequireDefault(require("./paren"));
var _media = _interopRequireDefault(require("./media"));
var _unicodeDescriptor = _interopRequireDefault(require("./unicode-descriptor"));
var _negative = _interopRequireDefault(require("./negative"));
var _extend = _interopRequireDefault(require("./extend"));
var _variableCall = _interopRequireDefault(require("./variable-call"));
var _namespaceValue = _interopRequireDefault(require("./namespace-value"));
var _mixinCall = _interopRequireDefault(require("./mixin-call"));
var _mixinDefinition = _interopRequireDefault(require("./mixin-definition"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// mixins
var _default = {
  Node: _node.default,
  Color: _color.default,
  AtRule: _atrule.default,
  DetachedRuleset: _detachedRuleset.default,
  Operation: _operation.default,
  Dimension: _dimension.default,
  Unit: _unit.default,
  Keyword: _keyword.default,
  Variable: _variable.default,
  Property: _property.default,
  Ruleset: _ruleset.default,
  Element: _element.default,
  Attribute: _attribute.default,
  Combinator: _combinator.default,
  Selector: _selector.default,
  Quoted: _quoted.default,
  Expression: _expression.default,
  Declaration: _declaration.default,
  Call: _call.default,
  URL: _url.default,
  Import: _import.default,
  Comment: _comment.default,
  Anonymous: _anonymous.default,
  Value: _value.default,
  JavaScript: _javascript.default,
  Assignment: _assignment.default,
  Condition: _condition.default,
  Paren: _paren.default,
  Media: _media.default,
  UnicodeDescriptor: _unicodeDescriptor.default,
  Negative: _negative.default,
  Extend: _extend.default,
  VariableCall: _variableCall.default,
  NamespaceValue: _namespaceValue.default,
  mixin: {
    Call: _mixinCall.default,
    Definition: _mixinDefinition.default
  }
};
exports.default = _default;

},{"./anonymous":59,"./assignment":60,"./atrule":61,"./attribute":62,"./call":63,"./color":64,"./combinator":65,"./comment":66,"./condition":67,"./declaration":69,"./detached-ruleset":70,"./dimension":71,"./element":72,"./expression":73,"./extend":74,"./import":75,"./javascript":77,"./keyword":79,"./media":80,"./mixin-call":81,"./mixin-definition":82,"./namespace-value":83,"./negative":84,"./node":85,"./operation":86,"./paren":87,"./property":88,"./quoted":89,"./ruleset":90,"./selector":91,"./unicode-descriptor":92,"./unit":93,"./url":94,"./value":95,"./variable":97,"./variable-call":96}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsEvalNode = _interopRequireDefault(require("./js-eval-node"));
var _dimension = _interopRequireDefault(require("./dimension"));
var _quoted = _interopRequireDefault(require("./quoted"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const JavaScript = function (string, escaped, index, currentFileInfo) {
  this.escaped = escaped;
  this.expression = string;
  this._index = index;
  this._fileInfo = currentFileInfo;
};
JavaScript.prototype = Object.assign(new _jsEvalNode.default(), {
  type: 'JavaScript',
  eval(context) {
    const result = this.evaluateJavaScript(this.expression, context);
    const type = typeof result;
    if (type === 'number' && !isNaN(result)) {
      return new _dimension.default(result);
    } else if (type === 'string') {
      return new _quoted.default(`"${result}"`, result, this.escaped, this._index);
    } else if (Array.isArray(result)) {
      return new _anonymous.default(result.join(', '));
    } else {
      return new _anonymous.default(result);
    }
  }
});
var _default = JavaScript;
exports.default = _default;

},{"./anonymous":59,"./dimension":71,"./js-eval-node":78,"./quoted":89}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const JsEvalNode = function () {};
JsEvalNode.prototype = Object.assign(new _node.default(), {
  evaluateJavaScript(expression, context) {
    let result;
    const that = this;
    const evalContext = {};
    if (!context.javascriptEnabled) {
      throw {
        message: 'Inline JavaScript is not enabled. Is it set in your options?',
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
    expression = expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
      return that.jsify(new _variable.default(`@${name}`, that.getIndex(), that.fileInfo()).eval(context));
    });
    try {
      expression = new Function(`return (${expression})`);
    } catch (e) {
      throw {
        message: `JavaScript evaluation error: ${e.message} from \`${expression}\``,
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
    const variables = context.frames[0].variables();
    for (const k in variables) {
      if (variables.hasOwnProperty(k)) {
        /* jshint loopfunc:true */
        evalContext[k.slice(1)] = {
          value: variables[k].value,
          toJS: function () {
            return this.value.eval(context).toCSS();
          }
        };
      }
    }
    try {
      result = expression.call(evalContext);
    } catch (e) {
      throw {
        message: `JavaScript evaluation error: '${e.name}: ${e.message.replace(/["]/g, '\'')}'`,
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
    return result;
  },
  jsify(obj) {
    if (Array.isArray(obj.value) && obj.value.length > 1) {
      return `[${obj.value.map(function (v) {
        return v.toCSS();
      }).join(', ')}]`;
    } else {
      return obj.toCSS();
    }
  }
});
var _default = JsEvalNode;
exports.default = _default;

},{"./node":85,"./variable":97}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Keyword = function (value) {
  this.value = value;
};
Keyword.prototype = Object.assign(new _node.default(), {
  type: 'Keyword',
  genCSS(context, output) {
    if (this.value === '%') {
      throw {
        type: 'Syntax',
        message: 'Invalid % without number'
      };
    }
    output.add(this.value);
  }
});
Keyword.True = new Keyword('true');
Keyword.False = new Keyword('false');
var _default = Keyword;
exports.default = _default;

},{"./node":85}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _value = _interopRequireDefault(require("./value"));
var _selector = _interopRequireDefault(require("./selector"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _expression = _interopRequireDefault(require("./expression"));
var _atrule = _interopRequireDefault(require("./atrule"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Media = function (value, features, index, currentFileInfo, visibilityInfo) {
  this._index = index;
  this._fileInfo = currentFileInfo;
  const selectors = new _selector.default([], null, null, this._index, this._fileInfo).createEmptySelectors();
  this.features = new _value.default(features);
  this.rules = [new _ruleset.default(selectors, value)];
  this.rules[0].allowImports = true;
  this.copyVisibilityInfo(visibilityInfo);
  this.allowRoot = true;
  this.setParent(selectors, this);
  this.setParent(this.features, this);
  this.setParent(this.rules, this);
};
Media.prototype = Object.assign(new _atrule.default(), {
  type: 'Media',
  isRulesetLike() {
    return true;
  },
  accept(visitor) {
    if (this.features) {
      this.features = visitor.visit(this.features);
    }
    if (this.rules) {
      this.rules = visitor.visitArray(this.rules);
    }
  },
  genCSS(context, output) {
    output.add('@media ', this._fileInfo, this._index);
    this.features.genCSS(context, output);
    this.outputRuleset(context, output, this.rules);
  },
  eval(context) {
    if (!context.mediaBlocks) {
      context.mediaBlocks = [];
      context.mediaPath = [];
    }
    const media = new Media(null, [], this._index, this._fileInfo, this.visibilityInfo());
    if (this.debugInfo) {
      this.rules[0].debugInfo = this.debugInfo;
      media.debugInfo = this.debugInfo;
    }
    media.features = this.features.eval(context);
    context.mediaPath.push(media);
    context.mediaBlocks.push(media);
    this.rules[0].functionRegistry = context.frames[0].functionRegistry.inherit();
    context.frames.unshift(this.rules[0]);
    media.rules = [this.rules[0].eval(context)];
    context.frames.shift();
    context.mediaPath.pop();
    return context.mediaPath.length === 0 ? media.evalTop(context) : media.evalNested(context);
  },
  evalTop(context) {
    let result = this;

    // Render all dependent Media blocks.
    if (context.mediaBlocks.length > 1) {
      const selectors = new _selector.default([], null, null, this.getIndex(), this.fileInfo()).createEmptySelectors();
      result = new _ruleset.default(selectors, context.mediaBlocks);
      result.multiMedia = true;
      result.copyVisibilityInfo(this.visibilityInfo());
      this.setParent(result, this);
    }
    delete context.mediaBlocks;
    delete context.mediaPath;
    return result;
  },
  evalNested(context) {
    let i;
    let value;
    const path = context.mediaPath.concat([this]);

    // Extract the media-query conditions separated with `,` (OR).
    for (i = 0; i < path.length; i++) {
      value = path[i].features instanceof _value.default ? path[i].features.value : path[i].features;
      path[i] = Array.isArray(value) ? value : [value];
    }

    // Trace all permutations to generate the resulting media-query.
    //
    // (a, b and c) with nested (d, e) ->
    //    a and d
    //    a and e
    //    b and c and d
    //    b and c and e
    this.features = new _value.default(this.permute(path).map(path => {
      path = path.map(fragment => fragment.toCSS ? fragment : new _anonymous.default(fragment));
      for (i = path.length - 1; i > 0; i--) {
        path.splice(i, 0, new _anonymous.default('and'));
      }
      return new _expression.default(path);
    }));
    this.setParent(this.features, this);

    // Fake a tree-node that doesn't output anything.
    return new _ruleset.default([], []);
  },
  permute(arr) {
    if (arr.length === 0) {
      return [];
    } else if (arr.length === 1) {
      return arr[0];
    } else {
      const result = [];
      const rest = this.permute(arr.slice(1));
      for (let i = 0; i < rest.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
          result.push([arr[0][j]].concat(rest[i]));
        }
      }
      return result;
    }
  },
  bubbleSelectors(selectors) {
    if (!selectors) {
      return;
    }
    this.rules = [new _ruleset.default(utils.copyArray(selectors), [this.rules[0]])];
    this.setParent(this.rules, this);
  }
});
var _default = Media;
exports.default = _default;

},{"../utils":98,"./anonymous":59,"./atrule":61,"./expression":73,"./ruleset":90,"./selector":91,"./value":95}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _selector = _interopRequireDefault(require("./selector"));
var _mixinDefinition = _interopRequireDefault(require("./mixin-definition"));
var _default2 = _interopRequireDefault(require("../functions/default"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MixinCall = function (elements, args, index, currentFileInfo, important) {
  this.selector = new _selector.default(elements);
  this.arguments = args || [];
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.important = important;
  this.allowRoot = true;
  this.setParent(this.selector, this);
};
MixinCall.prototype = Object.assign(new _node.default(), {
  type: 'MixinCall',
  accept(visitor) {
    if (this.selector) {
      this.selector = visitor.visit(this.selector);
    }
    if (this.arguments.length) {
      this.arguments = visitor.visitArray(this.arguments);
    }
  },
  eval(context) {
    let mixins;
    let mixin;
    let mixinPath;
    const args = [];
    let arg;
    let argValue;
    const rules = [];
    let match = false;
    let i;
    let m;
    let f;
    let isRecursive;
    let isOneFound;
    const candidates = [];
    let candidate;
    const conditionResult = [];
    let defaultResult;
    const defFalseEitherCase = -1;
    const defNone = 0;
    const defTrue = 1;
    const defFalse = 2;
    let count;
    let originalRuleset;
    let noArgumentsFilter;
    this.selector = this.selector.eval(context);
    function calcDefGroup(mixin, mixinPath) {
      let f, p, namespace;
      for (f = 0; f < 2; f++) {
        conditionResult[f] = true;
        _default2.default.value(f);
        for (p = 0; p < mixinPath.length && conditionResult[f]; p++) {
          namespace = mixinPath[p];
          if (namespace.matchCondition) {
            conditionResult[f] = conditionResult[f] && namespace.matchCondition(null, context);
          }
        }
        if (mixin.matchCondition) {
          conditionResult[f] = conditionResult[f] && mixin.matchCondition(args, context);
        }
      }
      if (conditionResult[0] || conditionResult[1]) {
        if (conditionResult[0] != conditionResult[1]) {
          return conditionResult[1] ? defTrue : defFalse;
        }
        return defNone;
      }
      return defFalseEitherCase;
    }
    for (i = 0; i < this.arguments.length; i++) {
      arg = this.arguments[i];
      argValue = arg.value.eval(context);
      if (arg.expand && Array.isArray(argValue.value)) {
        argValue = argValue.value;
        for (m = 0; m < argValue.length; m++) {
          args.push({
            value: argValue[m]
          });
        }
      } else {
        args.push({
          name: arg.name,
          value: argValue
        });
      }
    }
    noArgumentsFilter = function (rule) {
      return rule.matchArgs(null, context);
    };
    for (i = 0; i < context.frames.length; i++) {
      if ((mixins = context.frames[i].find(this.selector, null, noArgumentsFilter)).length > 0) {
        isOneFound = true;

        // To make `default()` function independent of definition order we have two "subpasses" here.
        // At first we evaluate each guard *twice* (with `default() == true` and `default() == false`),
        // and build candidate list with corresponding flags. Then, when we know all possible matches,
        // we make a final decision.

        for (m = 0; m < mixins.length; m++) {
          mixin = mixins[m].rule;
          mixinPath = mixins[m].path;
          isRecursive = false;
          for (f = 0; f < context.frames.length; f++) {
            if (!(mixin instanceof _mixinDefinition.default) && mixin === (context.frames[f].originalRuleset || context.frames[f])) {
              isRecursive = true;
              break;
            }
          }
          if (isRecursive) {
            continue;
          }
          if (mixin.matchArgs(args, context)) {
            candidate = {
              mixin,
              group: calcDefGroup(mixin, mixinPath)
            };
            if (candidate.group !== defFalseEitherCase) {
              candidates.push(candidate);
            }
            match = true;
          }
        }
        _default2.default.reset();
        count = [0, 0, 0];
        for (m = 0; m < candidates.length; m++) {
          count[candidates[m].group]++;
        }
        if (count[defNone] > 0) {
          defaultResult = defFalse;
        } else {
          defaultResult = defTrue;
          if (count[defTrue] + count[defFalse] > 1) {
            throw {
              type: 'Runtime',
              message: `Ambiguous use of \`default()\` found when matching for \`${this.format(args)}\``,
              index: this.getIndex(),
              filename: this.fileInfo().filename
            };
          }
        }
        for (m = 0; m < candidates.length; m++) {
          candidate = candidates[m].group;
          if (candidate === defNone || candidate === defaultResult) {
            try {
              mixin = candidates[m].mixin;
              if (!(mixin instanceof _mixinDefinition.default)) {
                originalRuleset = mixin.originalRuleset || mixin;
                mixin = new _mixinDefinition.default('', [], mixin.rules, null, false, null, originalRuleset.visibilityInfo());
                mixin.originalRuleset = originalRuleset;
              }
              const newRules = mixin.evalCall(context, args, this.important).rules;
              this._setVisibilityToReplacement(newRules);
              Array.prototype.push.apply(rules, newRules);
            } catch (e) {
              throw {
                message: e.message,
                index: this.getIndex(),
                filename: this.fileInfo().filename,
                stack: e.stack
              };
            }
          }
        }
        if (match) {
          return rules;
        }
      }
    }
    if (isOneFound) {
      throw {
        type: 'Runtime',
        message: `No matching definition was found for \`${this.format(args)}\``,
        index: this.getIndex(),
        filename: this.fileInfo().filename
      };
    } else {
      throw {
        type: 'Name',
        message: `${this.selector.toCSS().trim()} is undefined`,
        index: this.getIndex(),
        filename: this.fileInfo().filename
      };
    }
  },
  _setVisibilityToReplacement(replacement) {
    let i, rule;
    if (this.blocksVisibility()) {
      for (i = 0; i < replacement.length; i++) {
        rule = replacement[i];
        rule.addVisibilityBlock();
      }
    }
  },
  format(args) {
    return `${this.selector.toCSS().trim()}(${args ? args.map(function (a) {
      let argValue = '';
      if (a.name) {
        argValue += `${a.name}:`;
      }
      if (a.value.toCSS) {
        argValue += a.value.toCSS();
      } else {
        argValue += '???';
      }
      return argValue;
    }).join(', ') : ''})`;
  }
});
var _default = MixinCall;
exports.default = _default;

},{"../functions/default":34,"./mixin-definition":82,"./node":85,"./selector":91}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _selector = _interopRequireDefault(require("./selector"));
var _element = _interopRequireDefault(require("./element"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _declaration = _interopRequireDefault(require("./declaration"));
var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));
var _expression = _interopRequireDefault(require("./expression"));
var _contexts = _interopRequireDefault(require("../contexts"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Definition = function (name, params, rules, condition, variadic, frames, visibilityInfo) {
  this.name = name || 'anonymous mixin';
  this.selectors = [new _selector.default([new _element.default(null, name, false, this._index, this._fileInfo)])];
  this.params = params;
  this.condition = condition;
  this.variadic = variadic;
  this.arity = params.length;
  this.rules = rules;
  this._lookups = {};
  const optionalParameters = [];
  this.required = params.reduce(function (count, p) {
    if (!p.name || p.name && !p.value) {
      return count + 1;
    } else {
      optionalParameters.push(p.name);
      return count;
    }
  }, 0);
  this.optionalParameters = optionalParameters;
  this.frames = frames;
  this.copyVisibilityInfo(visibilityInfo);
  this.allowRoot = true;
};
Definition.prototype = Object.assign(new _ruleset.default(), {
  type: 'MixinDefinition',
  evalFirst: true,
  accept(visitor) {
    if (this.params && this.params.length) {
      this.params = visitor.visitArray(this.params);
    }
    this.rules = visitor.visitArray(this.rules);
    if (this.condition) {
      this.condition = visitor.visit(this.condition);
    }
  },
  evalParams(context, mixinEnv, args, evaldArguments) {
    /* jshint boss:true */
    const frame = new _ruleset.default(null, null);
    let varargs;
    let arg;
    const params = utils.copyArray(this.params);
    let i;
    let j;
    let val;
    let name;
    let isNamedFound;
    let argIndex;
    let argsLength = 0;
    if (mixinEnv.frames && mixinEnv.frames[0] && mixinEnv.frames[0].functionRegistry) {
      frame.functionRegistry = mixinEnv.frames[0].functionRegistry.inherit();
    }
    mixinEnv = new _contexts.default.Eval(mixinEnv, [frame].concat(mixinEnv.frames));
    if (args) {
      args = utils.copyArray(args);
      argsLength = args.length;
      for (i = 0; i < argsLength; i++) {
        arg = args[i];
        if (name = arg && arg.name) {
          isNamedFound = false;
          for (j = 0; j < params.length; j++) {
            if (!evaldArguments[j] && name === params[j].name) {
              evaldArguments[j] = arg.value.eval(context);
              frame.prependRule(new _declaration.default(name, arg.value.eval(context)));
              isNamedFound = true;
              break;
            }
          }
          if (isNamedFound) {
            args.splice(i, 1);
            i--;
            continue;
          } else {
            throw {
              type: 'Runtime',
              message: `Named argument for ${this.name} ${args[i].name} not found`
            };
          }
        }
      }
    }
    argIndex = 0;
    for (i = 0; i < params.length; i++) {
      if (evaldArguments[i]) {
        continue;
      }
      arg = args && args[argIndex];
      if (name = params[i].name) {
        if (params[i].variadic) {
          varargs = [];
          for (j = argIndex; j < argsLength; j++) {
            varargs.push(args[j].value.eval(context));
          }
          frame.prependRule(new _declaration.default(name, new _expression.default(varargs).eval(context)));
        } else {
          val = arg && arg.value;
          if (val) {
            // This was a mixin call, pass in a detached ruleset of it's eval'd rules
            if (Array.isArray(val)) {
              val = new _detachedRuleset.default(new _ruleset.default('', val));
            } else {
              val = val.eval(context);
            }
          } else if (params[i].value) {
            val = params[i].value.eval(mixinEnv);
            frame.resetCache();
          } else {
            throw {
              type: 'Runtime',
              message: `wrong number of arguments for ${this.name} (${argsLength} for ${this.arity})`
            };
          }
          frame.prependRule(new _declaration.default(name, val));
          evaldArguments[i] = val;
        }
      }
      if (params[i].variadic && args) {
        for (j = argIndex; j < argsLength; j++) {
          evaldArguments[j] = args[j].value.eval(context);
        }
      }
      argIndex++;
    }
    return frame;
  },
  makeImportant() {
    const rules = !this.rules ? this.rules : this.rules.map(function (r) {
      if (r.makeImportant) {
        return r.makeImportant(true);
      } else {
        return r;
      }
    });
    const result = new Definition(this.name, this.params, rules, this.condition, this.variadic, this.frames);
    return result;
  },
  eval(context) {
    return new Definition(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || utils.copyArray(context.frames));
  },
  evalCall(context, args, important) {
    const _arguments = [];
    const mixinFrames = this.frames ? this.frames.concat(context.frames) : context.frames;
    const frame = this.evalParams(context, new _contexts.default.Eval(context, mixinFrames), args, _arguments);
    let rules;
    let ruleset;
    frame.prependRule(new _declaration.default('@arguments', new _expression.default(_arguments).eval(context)));
    rules = utils.copyArray(this.rules);
    ruleset = new _ruleset.default(null, rules);
    ruleset.originalRuleset = this;
    ruleset = ruleset.eval(new _contexts.default.Eval(context, [this, frame].concat(mixinFrames)));
    if (important) {
      ruleset = ruleset.makeImportant();
    }
    return ruleset;
  },
  matchCondition(args, context) {
    if (this.condition && !this.condition.eval(new _contexts.default.Eval(context, [this.evalParams(context, /* the parameter variables */
    new _contexts.default.Eval(context, this.frames ? this.frames.concat(context.frames) : context.frames), args, [])].concat(this.frames || []) // the parent namespace/mixin frames
    .concat(context.frames)))) {
      // the current environment frames
      return false;
    }
    return true;
  },
  matchArgs(args, context) {
    const allArgsCnt = args && args.length || 0;
    let len;
    const optionalParameters = this.optionalParameters;
    const requiredArgsCnt = !args ? 0 : args.reduce(function (count, p) {
      if (optionalParameters.indexOf(p.name) < 0) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    if (!this.variadic) {
      if (requiredArgsCnt < this.required) {
        return false;
      }
      if (allArgsCnt > this.params.length) {
        return false;
      }
    } else {
      if (requiredArgsCnt < this.required - 1) {
        return false;
      }
    }

    // check patterns
    len = Math.min(requiredArgsCnt, this.arity);
    for (let i = 0; i < len; i++) {
      if (!this.params[i].name && !this.params[i].variadic) {
        if (args[i].value.eval(context).toCSS() != this.params[i].value.eval(context).toCSS()) {
          return false;
        }
      }
    }
    return true;
  }
});
var _default = Definition;
exports.default = _default;

},{"../contexts":22,"../utils":98,"./declaration":69,"./detached-ruleset":70,"./element":72,"./expression":73,"./ruleset":90,"./selector":91}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _selector = _interopRequireDefault(require("./selector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NamespaceValue = function (ruleCall, lookups, index, fileInfo) {
  this.value = ruleCall;
  this.lookups = lookups;
  this._index = index;
  this._fileInfo = fileInfo;
};
NamespaceValue.prototype = Object.assign(new _node.default(), {
  type: 'NamespaceValue',
  eval(context) {
    let i,
      j,
      name,
      rules = this.value.eval(context);
    for (i = 0; i < this.lookups.length; i++) {
      name = this.lookups[i];

      /**
       * Eval'd DRs return rulesets.
       * Eval'd mixins return rules, so let's make a ruleset if we need it.
       * We need to do this because of late parsing of values
       */
      if (Array.isArray(rules)) {
        rules = new _ruleset.default([new _selector.default()], rules);
      }
      if (name === '') {
        rules = rules.lastDeclaration();
      } else if (name.charAt(0) === '@') {
        if (name.charAt(1) === '@') {
          name = `@${new _variable.default(name.substr(1)).eval(context).value}`;
        }
        if (rules.variables) {
          rules = rules.variable(name);
        }
        if (!rules) {
          throw {
            type: 'Name',
            message: `variable ${name} not found`,
            filename: this.fileInfo().filename,
            index: this.getIndex()
          };
        }
      } else {
        if (name.substring(0, 2) === '$@') {
          name = `$${new _variable.default(name.substr(1)).eval(context).value}`;
        } else {
          name = name.charAt(0) === '$' ? name : `$${name}`;
        }
        if (rules.properties) {
          rules = rules.property(name);
        }
        if (!rules) {
          throw {
            type: 'Name',
            message: `property "${name.substr(1)}" not found`,
            filename: this.fileInfo().filename,
            index: this.getIndex()
          };
        }
        // Properties are an array of values, since a ruleset can have multiple props.
        // We pick the last one (the "cascaded" value)
        rules = rules[rules.length - 1];
      }
      if (rules.value) {
        rules = rules.eval(context).value;
      }
      if (rules.ruleset) {
        rules = rules.ruleset.eval(context);
      }
    }
    return rules;
  }
});
var _default = NamespaceValue;
exports.default = _default;

},{"./node":85,"./ruleset":90,"./selector":91,"./variable":97}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _operation = _interopRequireDefault(require("./operation"));
var _dimension = _interopRequireDefault(require("./dimension"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Negative = function (node) {
  this.value = node;
};
Negative.prototype = Object.assign(new _node.default(), {
  type: 'Negative',
  genCSS(context, output) {
    output.add('-');
    this.value.genCSS(context, output);
  },
  eval(context) {
    if (context.isMathOn()) {
      return new _operation.default('*', [new _dimension.default(-1), this.value]).eval(context);
    }
    return new Negative(this.value.eval(context));
  }
});
var _default = Negative;
exports.default = _default;

},{"./dimension":71,"./node":85,"./operation":86}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * The reason why Node is a class and other nodes simply do not extend
 * from Node (since we're transpiling) is due to this issue:
 * 
 * https://github.com/less/less.js/issues/3434
 */
class Node {
  constructor() {
    this.parent = null;
    this.visibilityBlocks = undefined;
    this.nodeVisible = undefined;
    this.rootNode = null;
    this.parsed = null;
  }
  get currentFileInfo() {
    return this.fileInfo();
  }
  get index() {
    return this.getIndex();
  }
  setParent(nodes, parent) {
    function set(node) {
      if (node && node instanceof Node) {
        node.parent = parent;
      }
    }
    if (Array.isArray(nodes)) {
      nodes.forEach(set);
    } else {
      set(nodes);
    }
  }
  getIndex() {
    return this._index || this.parent && this.parent.getIndex() || 0;
  }
  fileInfo() {
    return this._fileInfo || this.parent && this.parent.fileInfo() || {};
  }
  isRulesetLike() {
    return false;
  }
  toCSS(context) {
    const strs = [];
    this.genCSS(context, {
      add: function (chunk, fileInfo, index) {
        strs.push(chunk);
      },
      isEmpty: function () {
        return strs.length === 0;
      }
    });
    return strs.join('');
  }
  genCSS(context, output) {
    output.add(this.value);
  }
  accept(visitor) {
    this.value = visitor.visit(this.value);
  }
  eval() {
    return this;
  }
  _operate(context, op, a, b) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
    }
  }
  fround(context, value) {
    const precision = context && context.numPrecision;
    // add "epsilon" to ensure numbers like 1.000000005 (represented as 1.000000004999...) are properly rounded:
    return precision ? Number((value + 2e-16).toFixed(precision)) : value;
  }
  static compare(a, b) {
    /* returns:
     -1: a < b
     0: a = b
     1: a > b
     and *any* other value for a != b (e.g. undefined, NaN, -2 etc.) */

    if (a.compare &&
    // for "symmetric results" force toCSS-based comparison
    // of Quoted or Anonymous if either value is one of those
    !(b.type === 'Quoted' || b.type === 'Anonymous')) {
      return a.compare(b);
    } else if (b.compare) {
      return -b.compare(a);
    } else if (a.type !== b.type) {
      return undefined;
    }
    a = a.value;
    b = b.value;
    if (!Array.isArray(a)) {
      return a === b ? 0 : undefined;
    }
    if (a.length !== b.length) {
      return undefined;
    }
    for (let i = 0; i < a.length; i++) {
      if (Node.compare(a[i], b[i]) !== 0) {
        return undefined;
      }
    }
    return 0;
  }
  static numericCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : a > b ? 1 : undefined;
  }

  // Returns true if this node represents root of ast imported by reference
  blocksVisibility() {
    if (this.visibilityBlocks == null) {
      this.visibilityBlocks = 0;
    }
    return this.visibilityBlocks !== 0;
  }
  addVisibilityBlock() {
    if (this.visibilityBlocks == null) {
      this.visibilityBlocks = 0;
    }
    this.visibilityBlocks = this.visibilityBlocks + 1;
  }
  removeVisibilityBlock() {
    if (this.visibilityBlocks == null) {
      this.visibilityBlocks = 0;
    }
    this.visibilityBlocks = this.visibilityBlocks - 1;
  }

  // Turns on node visibility - if called node will be shown in output regardless
  // of whether it comes from import by reference or not
  ensureVisibility() {
    this.nodeVisible = true;
  }

  // Turns off node visibility - if called node will NOT be shown in output regardless
  // of whether it comes from import by reference or not
  ensureInvisibility() {
    this.nodeVisible = false;
  }

  // return values:
  // false - the node must not be visible
  // true - the node must be visible
  // undefined or null - the node has the same visibility as its parent
  isVisible() {
    return this.nodeVisible;
  }
  visibilityInfo() {
    return {
      visibilityBlocks: this.visibilityBlocks,
      nodeVisible: this.nodeVisible
    };
  }
  copyVisibilityInfo(info) {
    if (!info) {
      return;
    }
    this.visibilityBlocks = info.visibilityBlocks;
    this.nodeVisible = info.nodeVisible;
  }
}
var _default = Node;
exports.default = _default;

},{}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _color = _interopRequireDefault(require("./color"));
var _dimension = _interopRequireDefault(require("./dimension"));
var Constants = _interopRequireWildcard(require("../constants"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MATH = Constants.Math;
const Operation = function (op, operands, isSpaced) {
  this.op = op.trim();
  this.operands = operands;
  this.isSpaced = isSpaced;
};
Operation.prototype = Object.assign(new _node.default(), {
  type: 'Operation',
  accept(visitor) {
    this.operands = visitor.visitArray(this.operands);
  },
  eval(context) {
    let a = this.operands[0].eval(context),
      b = this.operands[1].eval(context),
      op;
    if (context.isMathOn(this.op)) {
      op = this.op === './' ? '/' : this.op;
      if (a instanceof _dimension.default && b instanceof _color.default) {
        a = a.toColor();
      }
      if (b instanceof _dimension.default && a instanceof _color.default) {
        b = b.toColor();
      }
      if (!a.operate || !b.operate) {
        if ((a instanceof Operation || b instanceof Operation) && a.op === '/' && context.math === MATH.PARENS_DIVISION) {
          return new Operation(this.op, [a, b], this.isSpaced);
        }
        throw {
          type: 'Operation',
          message: 'Operation on an invalid type'
        };
      }
      return a.operate(context, op, b);
    } else {
      return new Operation(this.op, [a, b], this.isSpaced);
    }
  },
  genCSS(context, output) {
    this.operands[0].genCSS(context, output);
    if (this.isSpaced) {
      output.add(' ');
    }
    output.add(this.op);
    if (this.isSpaced) {
      output.add(' ');
    }
    this.operands[1].genCSS(context, output);
  }
});
var _default = Operation;
exports.default = _default;

},{"../constants":21,"./color":64,"./dimension":71,"./node":85}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Paren = function (node) {
  this.value = node;
};
Paren.prototype = Object.assign(new _node.default(), {
  type: 'Paren',
  genCSS(context, output) {
    output.add('(');
    this.value.genCSS(context, output);
    output.add(')');
  },
  eval(context) {
    return new Paren(this.value.eval(context));
  }
});
var _default = Paren;
exports.default = _default;

},{"./node":85}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _declaration = _interopRequireDefault(require("./declaration"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Property = function (name, index, currentFileInfo) {
  this.name = name;
  this._index = index;
  this._fileInfo = currentFileInfo;
};
Property.prototype = Object.assign(new _node.default(), {
  type: 'Property',
  eval(context) {
    let property;
    const name = this.name;
    // TODO: shorten this reference
    const mergeRules = context.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules;
    if (this.evaluating) {
      throw {
        type: 'Name',
        message: `Recursive property reference for ${name}`,
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
    this.evaluating = true;
    property = this.find(context.frames, function (frame) {
      let v;
      const vArr = frame.property(name);
      if (vArr) {
        for (let i = 0; i < vArr.length; i++) {
          v = vArr[i];
          vArr[i] = new _declaration.default(v.name, v.value, v.important, v.merge, v.index, v.currentFileInfo, v.inline, v.variable);
        }
        mergeRules(vArr);
        v = vArr[vArr.length - 1];
        if (v.important) {
          const importantScope = context.importantScope[context.importantScope.length - 1];
          importantScope.important = v.important;
        }
        v = v.value.eval(context);
        return v;
      }
    });
    if (property) {
      this.evaluating = false;
      return property;
    } else {
      throw {
        type: 'Name',
        message: `Property '${name}' is undefined`,
        filename: this.currentFileInfo.filename,
        index: this.index
      };
    }
  },
  find(obj, fun) {
    for (let i = 0, r; i < obj.length; i++) {
      r = fun.call(obj, obj[i]);
      if (r) {
        return r;
      }
    }
    return null;
  }
});
var _default = Property;
exports.default = _default;

},{"./declaration":69,"./node":85}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _property = _interopRequireDefault(require("./property"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Quoted = function (str, content, escaped, index, currentFileInfo) {
  this.escaped = escaped == null ? true : escaped;
  this.value = content || '';
  this.quote = str.charAt(0);
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.variableRegex = /@\{([\w-]+)\}/g;
  this.propRegex = /\$\{([\w-]+)\}/g;
  this.allowRoot = escaped;
};
Quoted.prototype = Object.assign(new _node.default(), {
  type: 'Quoted',
  genCSS(context, output) {
    if (!this.escaped) {
      output.add(this.quote, this.fileInfo(), this.getIndex());
    }
    output.add(this.value);
    if (!this.escaped) {
      output.add(this.quote);
    }
  },
  containsVariables() {
    return this.value.match(this.variableRegex);
  },
  eval(context) {
    const that = this;
    let value = this.value;
    const variableReplacement = function (_, name) {
      const v = new _variable.default(`@${name}`, that.getIndex(), that.fileInfo()).eval(context, true);
      return v instanceof Quoted ? v.value : v.toCSS();
    };
    const propertyReplacement = function (_, name) {
      const v = new _property.default(`$${name}`, that.getIndex(), that.fileInfo()).eval(context, true);
      return v instanceof Quoted ? v.value : v.toCSS();
    };
    function iterativeReplace(value, regexp, replacementFnc) {
      let evaluatedValue = value;
      do {
        value = evaluatedValue.toString();
        evaluatedValue = value.replace(regexp, replacementFnc);
      } while (value !== evaluatedValue);
      return evaluatedValue;
    }
    value = iterativeReplace(value, this.variableRegex, variableReplacement);
    value = iterativeReplace(value, this.propRegex, propertyReplacement);
    return new Quoted(this.quote + value + this.quote, value, this.escaped, this.getIndex(), this.fileInfo());
  },
  compare(other) {
    // when comparing quoted strings allow the quote to differ
    if (other.type === 'Quoted' && !this.escaped && !other.escaped) {
      return _node.default.numericCompare(this.value, other.value);
    } else {
      return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
    }
  }
});
var _default = Quoted;
exports.default = _default;

},{"./node":85,"./property":88,"./variable":97}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _declaration = _interopRequireDefault(require("./declaration"));
var _keyword = _interopRequireDefault(require("./keyword"));
var _comment = _interopRequireDefault(require("./comment"));
var _paren = _interopRequireDefault(require("./paren"));
var _selector = _interopRequireDefault(require("./selector"));
var _element = _interopRequireDefault(require("./element"));
var _anonymous = _interopRequireDefault(require("./anonymous"));
var _contexts = _interopRequireDefault(require("../contexts"));
var _functionRegistry = _interopRequireDefault(require("../functions/function-registry"));
var _default2 = _interopRequireDefault(require("../functions/default"));
var _debugInfo = _interopRequireDefault(require("./debug-info"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Ruleset = function (selectors, rules, strictImports, visibilityInfo) {
  this.selectors = selectors;
  this.rules = rules;
  this._lookups = {};
  this._variables = null;
  this._properties = null;
  this.strictImports = strictImports;
  this.copyVisibilityInfo(visibilityInfo);
  this.allowRoot = true;
  this.setParent(this.selectors, this);
  this.setParent(this.rules, this);
};
Ruleset.prototype = Object.assign(new _node.default(), {
  type: 'Ruleset',
  isRuleset: true,
  isRulesetLike() {
    return true;
  },
  accept(visitor) {
    if (this.paths) {
      this.paths = visitor.visitArray(this.paths, true);
    } else if (this.selectors) {
      this.selectors = visitor.visitArray(this.selectors);
    }
    if (this.rules && this.rules.length) {
      this.rules = visitor.visitArray(this.rules);
    }
  },
  eval(context) {
    const that = this;
    let selectors;
    let selCnt;
    let selector;
    let i;
    let hasVariable;
    let hasOnePassingSelector = false;
    if (this.selectors && (selCnt = this.selectors.length)) {
      selectors = new Array(selCnt);
      _default2.default.error({
        type: 'Syntax',
        message: 'it is currently only allowed in parametric mixin guards,'
      });
      for (i = 0; i < selCnt; i++) {
        selector = this.selectors[i].eval(context);
        for (var j = 0; j < selector.elements.length; j++) {
          if (selector.elements[j].isVariable) {
            hasVariable = true;
            break;
          }
        }
        selectors[i] = selector;
        if (selector.evaldCondition) {
          hasOnePassingSelector = true;
        }
      }
      if (hasVariable) {
        const toParseSelectors = new Array(selCnt);
        for (i = 0; i < selCnt; i++) {
          selector = selectors[i];
          toParseSelectors[i] = selector.toCSS(context);
        }
        this.parse.parseNode(toParseSelectors.join(','), ["selectors"], selectors[0].getIndex(), selectors[0].fileInfo(), function (err, result) {
          if (result) {
            selectors = utils.flattenArray(result);
          }
        });
      }
      _default2.default.reset();
    } else {
      hasOnePassingSelector = true;
    }
    let rules = this.rules ? utils.copyArray(this.rules) : null;
    const ruleset = new Ruleset(selectors, rules, this.strictImports, this.visibilityInfo());
    let rule;
    let subRule;
    ruleset.originalRuleset = this;
    ruleset.root = this.root;
    ruleset.firstRoot = this.firstRoot;
    ruleset.allowImports = this.allowImports;
    if (this.debugInfo) {
      ruleset.debugInfo = this.debugInfo;
    }
    if (!hasOnePassingSelector) {
      rules.length = 0;
    }

    // inherit a function registry from the frames stack when possible;
    // otherwise from the global registry
    ruleset.functionRegistry = function (frames) {
      let i = 0;
      const n = frames.length;
      let found;
      for (; i !== n; ++i) {
        found = frames[i].functionRegistry;
        if (found) {
          return found;
        }
      }
      return _functionRegistry.default;
    }(context.frames).inherit();

    // push the current ruleset to the frames stack
    const ctxFrames = context.frames;
    ctxFrames.unshift(ruleset);

    // currrent selectors
    let ctxSelectors = context.selectors;
    if (!ctxSelectors) {
      context.selectors = ctxSelectors = [];
    }
    ctxSelectors.unshift(this.selectors);

    // Evaluate imports
    if (ruleset.root || ruleset.allowImports || !ruleset.strictImports) {
      ruleset.evalImports(context);
    }

    // Store the frames around mixin definitions,
    // so they can be evaluated like closures when the time comes.
    const rsRules = ruleset.rules;
    for (i = 0; rule = rsRules[i]; i++) {
      if (rule.evalFirst) {
        rsRules[i] = rule.eval(context);
      }
    }
    const mediaBlockCount = context.mediaBlocks && context.mediaBlocks.length || 0;

    // Evaluate mixin calls.
    for (i = 0; rule = rsRules[i]; i++) {
      if (rule.type === 'MixinCall') {
        /* jshint loopfunc:true */
        rules = rule.eval(context).filter(function (r) {
          if (r instanceof _declaration.default && r.variable) {
            // do not pollute the scope if the variable is
            // already there. consider returning false here
            // but we need a way to "return" variable from mixins
            return !ruleset.variable(r.name);
          }
          return true;
        });
        rsRules.splice.apply(rsRules, [i, 1].concat(rules));
        i += rules.length - 1;
        ruleset.resetCache();
      } else if (rule.type === 'VariableCall') {
        /* jshint loopfunc:true */
        rules = rule.eval(context).rules.filter(function (r) {
          if (r instanceof _declaration.default && r.variable) {
            // do not pollute the scope at all
            return false;
          }
          return true;
        });
        rsRules.splice.apply(rsRules, [i, 1].concat(rules));
        i += rules.length - 1;
        ruleset.resetCache();
      }
    }

    // Evaluate everything else
    for (i = 0; rule = rsRules[i]; i++) {
      if (!rule.evalFirst) {
        rsRules[i] = rule = rule.eval ? rule.eval(context) : rule;
      }
    }

    // Evaluate everything else
    for (i = 0; rule = rsRules[i]; i++) {
      // for rulesets, check if it is a css guard and can be removed
      if (rule instanceof Ruleset && rule.selectors && rule.selectors.length === 1) {
        // check if it can be folded in (e.g. & where)
        if (rule.selectors[0] && rule.selectors[0].isJustParentSelector()) {
          rsRules.splice(i--, 1);
          for (var j = 0; subRule = rule.rules[j]; j++) {
            if (subRule instanceof _node.default) {
              subRule.copyVisibilityInfo(rule.visibilityInfo());
              if (!(subRule instanceof _declaration.default) || !subRule.variable) {
                rsRules.splice(++i, 0, subRule);
              }
            }
          }
        }
      }
    }

    // Pop the stack
    ctxFrames.shift();
    ctxSelectors.shift();
    if (context.mediaBlocks) {
      for (i = mediaBlockCount; i < context.mediaBlocks.length; i++) {
        context.mediaBlocks[i].bubbleSelectors(selectors);
      }
    }
    return ruleset;
  },
  evalImports(context) {
    const rules = this.rules;
    let i;
    let importRules;
    if (!rules) {
      return;
    }
    for (i = 0; i < rules.length; i++) {
      if (rules[i].type === 'Import') {
        importRules = rules[i].eval(context);
        if (importRules && (importRules.length || importRules.length === 0)) {
          rules.splice.apply(rules, [i, 1].concat(importRules));
          i += importRules.length - 1;
        } else {
          rules.splice(i, 1, importRules);
        }
        this.resetCache();
      }
    }
  },
  makeImportant() {
    const result = new Ruleset(this.selectors, this.rules.map(function (r) {
      if (r.makeImportant) {
        return r.makeImportant();
      } else {
        return r;
      }
    }), this.strictImports, this.visibilityInfo());
    return result;
  },
  matchArgs(args) {
    return !args || args.length === 0;
  },
  // lets you call a css selector with a guard
  matchCondition(args, context) {
    const lastSelector = this.selectors[this.selectors.length - 1];
    if (!lastSelector.evaldCondition) {
      return false;
    }
    if (lastSelector.condition && !lastSelector.condition.eval(new _contexts.default.Eval(context, context.frames))) {
      return false;
    }
    return true;
  },
  resetCache() {
    this._rulesets = null;
    this._variables = null;
    this._properties = null;
    this._lookups = {};
  },
  variables() {
    if (!this._variables) {
      this._variables = !this.rules ? {} : this.rules.reduce(function (hash, r) {
        if (r instanceof _declaration.default && r.variable === true) {
          hash[r.name] = r;
        }
        // when evaluating variables in an import statement, imports have not been eval'd
        // so we need to go inside import statements.
        // guard against root being a string (in the case of inlined less)
        if (r.type === 'Import' && r.root && r.root.variables) {
          const vars = r.root.variables();
          for (const name in vars) {
            if (vars.hasOwnProperty(name)) {
              hash[name] = r.root.variable(name);
            }
          }
        }
        return hash;
      }, {});
    }
    return this._variables;
  },
  properties() {
    if (!this._properties) {
      this._properties = !this.rules ? {} : this.rules.reduce(function (hash, r) {
        if (r instanceof _declaration.default && r.variable !== true) {
          const name = r.name.length === 1 && r.name[0] instanceof _keyword.default ? r.name[0].value : r.name;
          // Properties don't overwrite as they can merge
          if (!hash[`$${name}`]) {
            hash[`$${name}`] = [r];
          } else {
            hash[`$${name}`].push(r);
          }
        }
        return hash;
      }, {});
    }
    return this._properties;
  },
  variable(name) {
    const decl = this.variables()[name];
    if (decl) {
      return this.parseValue(decl);
    }
  },
  property(name) {
    const decl = this.properties()[name];
    if (decl) {
      return this.parseValue(decl);
    }
  },
  lastDeclaration() {
    for (let i = this.rules.length; i > 0; i--) {
      const decl = this.rules[i - 1];
      if (decl instanceof _declaration.default) {
        return this.parseValue(decl);
      }
    }
  },
  parseValue(toParse) {
    const self = this;
    function transformDeclaration(decl) {
      if (decl.value instanceof _anonymous.default && !decl.parsed) {
        if (typeof decl.value.value === 'string') {
          this.parse.parseNode(decl.value.value, ['value', 'important'], decl.value.getIndex(), decl.fileInfo(), function (err, result) {
            if (err) {
              decl.parsed = true;
            }
            if (result) {
              decl.value = result[0];
              decl.important = result[1] || '';
              decl.parsed = true;
            }
          });
        } else {
          decl.parsed = true;
        }
        return decl;
      } else {
        return decl;
      }
    }
    if (!Array.isArray(toParse)) {
      return transformDeclaration.call(self, toParse);
    } else {
      const nodes = [];
      toParse.forEach(function (n) {
        nodes.push(transformDeclaration.call(self, n));
      });
      return nodes;
    }
  },
  rulesets() {
    if (!this.rules) {
      return [];
    }
    const filtRules = [];
    const rules = this.rules;
    let i;
    let rule;
    for (i = 0; rule = rules[i]; i++) {
      if (rule.isRuleset) {
        filtRules.push(rule);
      }
    }
    return filtRules;
  },
  prependRule(rule) {
    const rules = this.rules;
    if (rules) {
      rules.unshift(rule);
    } else {
      this.rules = [rule];
    }
    this.setParent(rule, this);
  },
  find(selector, self, filter) {
    self = self || this;
    const rules = [];
    let match;
    let foundMixins;
    const key = selector.toCSS();
    if (key in this._lookups) {
      return this._lookups[key];
    }
    this.rulesets().forEach(function (rule) {
      if (rule !== self) {
        for (let j = 0; j < rule.selectors.length; j++) {
          match = selector.match(rule.selectors[j]);
          if (match) {
            if (selector.elements.length > match) {
              if (!filter || filter(rule)) {
                foundMixins = rule.find(new _selector.default(selector.elements.slice(match)), self, filter);
                for (let i = 0; i < foundMixins.length; ++i) {
                  foundMixins[i].path.push(rule);
                }
                Array.prototype.push.apply(rules, foundMixins);
              }
            } else {
              rules.push({
                rule,
                path: []
              });
            }
            break;
          }
        }
      }
    });
    this._lookups[key] = rules;
    return rules;
  },
  genCSS(context, output) {
    let i;
    let j;
    const charsetRuleNodes = [];
    let ruleNodes = [];
    let
    // Line number debugging
    debugInfo;
    let rule;
    let path;
    context.tabLevel = context.tabLevel || 0;
    if (!this.root) {
      context.tabLevel++;
    }
    const tabRuleStr = context.compress ? '' : Array(context.tabLevel + 1).join('  ');
    const tabSetStr = context.compress ? '' : Array(context.tabLevel).join('  ');
    let sep;
    let charsetNodeIndex = 0;
    let importNodeIndex = 0;
    for (i = 0; rule = this.rules[i]; i++) {
      if (rule instanceof _comment.default) {
        if (importNodeIndex === i) {
          importNodeIndex++;
        }
        ruleNodes.push(rule);
      } else if (rule.isCharset && rule.isCharset()) {
        ruleNodes.splice(charsetNodeIndex, 0, rule);
        charsetNodeIndex++;
        importNodeIndex++;
      } else if (rule.type === 'Import') {
        ruleNodes.splice(importNodeIndex, 0, rule);
        importNodeIndex++;
      } else {
        ruleNodes.push(rule);
      }
    }
    ruleNodes = charsetRuleNodes.concat(ruleNodes);

    // If this is the root node, we don't render
    // a selector, or {}.
    if (!this.root) {
      debugInfo = (0, _debugInfo.default)(context, this, tabSetStr);
      if (debugInfo) {
        output.add(debugInfo);
        output.add(tabSetStr);
      }
      const paths = this.paths;
      const pathCnt = paths.length;
      let pathSubCnt;
      sep = context.compress ? ',' : `,\n${tabSetStr}`;
      for (i = 0; i < pathCnt; i++) {
        path = paths[i];
        if (!(pathSubCnt = path.length)) {
          continue;
        }
        if (i > 0) {
          output.add(sep);
        }
        context.firstSelector = true;
        path[0].genCSS(context, output);
        context.firstSelector = false;
        for (j = 1; j < pathSubCnt; j++) {
          path[j].genCSS(context, output);
        }
      }
      output.add((context.compress ? '{' : ' {\n') + tabRuleStr);
    }

    // Compile rules and rulesets
    for (i = 0; rule = ruleNodes[i]; i++) {
      if (i + 1 === ruleNodes.length) {
        context.lastRule = true;
      }
      const currentLastRule = context.lastRule;
      if (rule.isRulesetLike(rule)) {
        context.lastRule = false;
      }
      if (rule.genCSS) {
        rule.genCSS(context, output);
      } else if (rule.value) {
        output.add(rule.value.toString());
      }
      context.lastRule = currentLastRule;
      if (!context.lastRule && rule.isVisible()) {
        output.add(context.compress ? '' : `\n${tabRuleStr}`);
      } else {
        context.lastRule = false;
      }
    }
    if (!this.root) {
      output.add(context.compress ? '}' : `\n${tabSetStr}}`);
      context.tabLevel--;
    }
    if (!output.isEmpty() && !context.compress && this.firstRoot) {
      output.add('\n');
    }
  },
  joinSelectors(paths, context, selectors) {
    for (let s = 0; s < selectors.length; s++) {
      this.joinSelector(paths, context, selectors[s]);
    }
  },
  joinSelector(paths, context, selector) {
    function createParenthesis(elementsToPak, originalElement) {
      let replacementParen, j;
      if (elementsToPak.length === 0) {
        replacementParen = new _paren.default(elementsToPak[0]);
      } else {
        const insideParent = new Array(elementsToPak.length);
        for (j = 0; j < elementsToPak.length; j++) {
          insideParent[j] = new _element.default(null, elementsToPak[j], originalElement.isVariable, originalElement._index, originalElement._fileInfo);
        }
        replacementParen = new _paren.default(new _selector.default(insideParent));
      }
      return replacementParen;
    }
    function createSelector(containedElement, originalElement) {
      let element, selector;
      element = new _element.default(null, containedElement, originalElement.isVariable, originalElement._index, originalElement._fileInfo);
      selector = new _selector.default([element]);
      return selector;
    }

    // joins selector path from `beginningPath` with selector path in `addPath`
    // `replacedElement` contains element that is being replaced by `addPath`
    // returns concatenated path
    function addReplacementIntoPath(beginningPath, addPath, replacedElement, originalSelector) {
      let newSelectorPath, lastSelector, newJoinedSelector;
      // our new selector path
      newSelectorPath = [];

      // construct the joined selector - if & is the first thing this will be empty,
      // if not newJoinedSelector will be the last set of elements in the selector
      if (beginningPath.length > 0) {
        newSelectorPath = utils.copyArray(beginningPath);
        lastSelector = newSelectorPath.pop();
        newJoinedSelector = originalSelector.createDerived(utils.copyArray(lastSelector.elements));
      } else {
        newJoinedSelector = originalSelector.createDerived([]);
      }
      if (addPath.length > 0) {
        // /deep/ is a CSS4 selector - (removed, so should deprecate)
        // that is valid without anything in front of it
        // so if the & does not have a combinator that is "" or " " then
        // and there is a combinator on the parent, then grab that.
        // this also allows + a { & .b { .a & { ... though not sure why you would want to do that
        let combinator = replacedElement.combinator;
        const parentEl = addPath[0].elements[0];
        if (combinator.emptyOrWhitespace && !parentEl.combinator.emptyOrWhitespace) {
          combinator = parentEl.combinator;
        }
        // join the elements so far with the first part of the parent
        newJoinedSelector.elements.push(new _element.default(combinator, parentEl.value, replacedElement.isVariable, replacedElement._index, replacedElement._fileInfo));
        newJoinedSelector.elements = newJoinedSelector.elements.concat(addPath[0].elements.slice(1));
      }

      // now add the joined selector - but only if it is not empty
      if (newJoinedSelector.elements.length !== 0) {
        newSelectorPath.push(newJoinedSelector);
      }

      // put together the parent selectors after the join (e.g. the rest of the parent)
      if (addPath.length > 1) {
        let restOfPath = addPath.slice(1);
        restOfPath = restOfPath.map(function (selector) {
          return selector.createDerived(selector.elements, []);
        });
        newSelectorPath = newSelectorPath.concat(restOfPath);
      }
      return newSelectorPath;
    }

    // joins selector path from `beginningPath` with every selector path in `addPaths` array
    // `replacedElement` contains element that is being replaced by `addPath`
    // returns array with all concatenated paths
    function addAllReplacementsIntoPath(beginningPath, addPaths, replacedElement, originalSelector, result) {
      let j;
      for (j = 0; j < beginningPath.length; j++) {
        const newSelectorPath = addReplacementIntoPath(beginningPath[j], addPaths, replacedElement, originalSelector);
        result.push(newSelectorPath);
      }
      return result;
    }
    function mergeElementsOnToSelectors(elements, selectors) {
      let i, sel;
      if (elements.length === 0) {
        return;
      }
      if (selectors.length === 0) {
        selectors.push([new _selector.default(elements)]);
        return;
      }
      for (i = 0; sel = selectors[i]; i++) {
        // if the previous thing in sel is a parent this needs to join on to it
        if (sel.length > 0) {
          sel[sel.length - 1] = sel[sel.length - 1].createDerived(sel[sel.length - 1].elements.concat(elements));
        } else {
          sel.push(new _selector.default(elements));
        }
      }
    }

    // replace all parent selectors inside `inSelector` by content of `context` array
    // resulting selectors are returned inside `paths` array
    // returns true if `inSelector` contained at least one parent selector
    function replaceParentSelector(paths, context, inSelector) {
      // The paths are [[Selector]]
      // The first list is a list of comma separated selectors
      // The inner list is a list of inheritance separated selectors
      // e.g.
      // .a, .b {
      //   .c {
      //   }
      // }
      // == [[.a] [.c]] [[.b] [.c]]
      //
      let i,
        j,
        k,
        currentElements,
        newSelectors,
        selectorsMultiplied,
        sel,
        el,
        hadParentSelector = false,
        length,
        lastSelector;
      function findNestedSelector(element) {
        let maybeSelector;
        if (!(element.value instanceof _paren.default)) {
          return null;
        }
        maybeSelector = element.value.value;
        if (!(maybeSelector instanceof _selector.default)) {
          return null;
        }
        return maybeSelector;
      }

      // the elements from the current selector so far
      currentElements = [];
      // the current list of new selectors to add to the path.
      // We will build it up. We initiate it with one empty selector as we "multiply" the new selectors
      // by the parents
      newSelectors = [[]];
      for (i = 0; el = inSelector.elements[i]; i++) {
        // non parent reference elements just get added
        if (el.value !== '&') {
          const nestedSelector = findNestedSelector(el);
          if (nestedSelector != null) {
            // merge the current list of non parent selector elements
            // on to the current list of selectors to add
            mergeElementsOnToSelectors(currentElements, newSelectors);
            const nestedPaths = [];
            let replaced;
            const replacedNewSelectors = [];
            replaced = replaceParentSelector(nestedPaths, context, nestedSelector);
            hadParentSelector = hadParentSelector || replaced;
            // the nestedPaths array should have only one member - replaceParentSelector does not multiply selectors
            for (k = 0; k < nestedPaths.length; k++) {
              const replacementSelector = createSelector(createParenthesis(nestedPaths[k], el), el);
              addAllReplacementsIntoPath(newSelectors, [replacementSelector], el, inSelector, replacedNewSelectors);
            }
            newSelectors = replacedNewSelectors;
            currentElements = [];
          } else {
            currentElements.push(el);
          }
        } else {
          hadParentSelector = true;
          // the new list of selectors to add
          selectorsMultiplied = [];

          // merge the current list of non parent selector elements
          // on to the current list of selectors to add
          mergeElementsOnToSelectors(currentElements, newSelectors);

          // loop through our current selectors
          for (j = 0; j < newSelectors.length; j++) {
            sel = newSelectors[j];
            // if we don't have any parent paths, the & might be in a mixin so that it can be used
            // whether there are parents or not
            if (context.length === 0) {
              // the combinator used on el should now be applied to the next element instead so that
              // it is not lost
              if (sel.length > 0) {
                sel[0].elements.push(new _element.default(el.combinator, '', el.isVariable, el._index, el._fileInfo));
              }
              selectorsMultiplied.push(sel);
            } else {
              // and the parent selectors
              for (k = 0; k < context.length; k++) {
                // We need to put the current selectors
                // then join the last selector's elements on to the parents selectors
                const newSelectorPath = addReplacementIntoPath(sel, context[k], el, inSelector);
                // add that to our new set of selectors
                selectorsMultiplied.push(newSelectorPath);
              }
            }
          }

          // our new selectors has been multiplied, so reset the state
          newSelectors = selectorsMultiplied;
          currentElements = [];
        }
      }

      // if we have any elements left over (e.g. .a& .b == .b)
      // add them on to all the current selectors
      mergeElementsOnToSelectors(currentElements, newSelectors);
      for (i = 0; i < newSelectors.length; i++) {
        length = newSelectors[i].length;
        if (length > 0) {
          paths.push(newSelectors[i]);
          lastSelector = newSelectors[i][length - 1];
          newSelectors[i][length - 1] = lastSelector.createDerived(lastSelector.elements, inSelector.extendList);
        }
      }
      return hadParentSelector;
    }
    function deriveSelector(visibilityInfo, deriveFrom) {
      const newSelector = deriveFrom.createDerived(deriveFrom.elements, deriveFrom.extendList, deriveFrom.evaldCondition);
      newSelector.copyVisibilityInfo(visibilityInfo);
      return newSelector;
    }

    // joinSelector code follows
    let i, newPaths, hadParentSelector;
    newPaths = [];
    hadParentSelector = replaceParentSelector(newPaths, context, selector);
    if (!hadParentSelector) {
      if (context.length > 0) {
        newPaths = [];
        for (i = 0; i < context.length; i++) {
          const concatenated = context[i].map(deriveSelector.bind(this, selector.visibilityInfo()));
          concatenated.push(selector);
          newPaths.push(concatenated);
        }
      } else {
        newPaths = [[selector]];
      }
    }
    for (i = 0; i < newPaths.length; i++) {
      paths.push(newPaths[i]);
    }
  }
});
var _default = Ruleset;
exports.default = _default;

},{"../contexts":22,"../functions/default":34,"../functions/function-registry":36,"../utils":98,"./anonymous":59,"./comment":66,"./debug-info":68,"./declaration":69,"./element":72,"./keyword":79,"./node":85,"./paren":87,"./selector":91}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _element = _interopRequireDefault(require("./element"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Selector = function (elements, extendList, condition, index, currentFileInfo, visibilityInfo) {
  this.extendList = extendList;
  this.condition = condition;
  this.evaldCondition = !condition;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.elements = this.getElements(elements);
  this.mixinElements_ = undefined;
  this.copyVisibilityInfo(visibilityInfo);
  this.setParent(this.elements, this);
};
Selector.prototype = Object.assign(new _node.default(), {
  type: 'Selector',
  accept(visitor) {
    if (this.elements) {
      this.elements = visitor.visitArray(this.elements);
    }
    if (this.extendList) {
      this.extendList = visitor.visitArray(this.extendList);
    }
    if (this.condition) {
      this.condition = visitor.visit(this.condition);
    }
  },
  createDerived(elements, extendList, evaldCondition) {
    elements = this.getElements(elements);
    const newSelector = new Selector(elements, extendList || this.extendList, null, this.getIndex(), this.fileInfo(), this.visibilityInfo());
    newSelector.evaldCondition = evaldCondition != null ? evaldCondition : this.evaldCondition;
    newSelector.mediaEmpty = this.mediaEmpty;
    return newSelector;
  },
  getElements(els) {
    if (!els) {
      return [new _element.default('', '&', false, this._index, this._fileInfo)];
    }
    if (typeof els === 'string') {
      this.parse.parseNode(els, ['selector'], this._index, this._fileInfo, function (err, result) {
        if (err) {
          throw new _lessError.default({
            index: err.index,
            message: err.message
          }, this.parse.imports, this._fileInfo.filename);
        }
        els = result[0].elements;
      });
    }
    return els;
  },
  createEmptySelectors() {
    const el = new _element.default('', '&', false, this._index, this._fileInfo),
      sels = [new Selector([el], null, null, this._index, this._fileInfo)];
    sels[0].mediaEmpty = true;
    return sels;
  },
  match(other) {
    const elements = this.elements;
    const len = elements.length;
    let olen;
    let i;
    other = other.mixinElements();
    olen = other.length;
    if (olen === 0 || len < olen) {
      return 0;
    } else {
      for (i = 0; i < olen; i++) {
        if (elements[i].value !== other[i]) {
          return 0;
        }
      }
    }
    return olen; // return number of matched elements
  },

  mixinElements() {
    if (this.mixinElements_) {
      return this.mixinElements_;
    }
    let elements = this.elements.map(function (v) {
      return v.combinator.value + (v.value.value || v.value);
    }).join('').match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);
    if (elements) {
      if (elements[0] === '&') {
        elements.shift();
      }
    } else {
      elements = [];
    }
    return this.mixinElements_ = elements;
  },
  isJustParentSelector() {
    return !this.mediaEmpty && this.elements.length === 1 && this.elements[0].value === '&' && (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
  },
  eval(context) {
    const evaldCondition = this.condition && this.condition.eval(context);
    let elements = this.elements;
    let extendList = this.extendList;
    elements = elements && elements.map(function (e) {
      return e.eval(context);
    });
    extendList = extendList && extendList.map(function (extend) {
      return extend.eval(context);
    });
    return this.createDerived(elements, extendList, evaldCondition);
  },
  genCSS(context, output) {
    let i, element;
    if ((!context || !context.firstSelector) && this.elements[0].combinator.value === '') {
      output.add(' ', this.fileInfo(), this.getIndex());
    }
    for (i = 0; i < this.elements.length; i++) {
      element = this.elements[i];
      element.genCSS(context, output);
    }
  },
  getIsOutput() {
    return this.evaldCondition;
  }
});
var _default = Selector;
exports.default = _default;

},{"../less-error":47,"./element":72,"./node":85}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const UnicodeDescriptor = function (value) {
  this.value = value;
};
UnicodeDescriptor.prototype = Object.assign(new _node.default(), {
  type: 'UnicodeDescriptor'
});
var _default = UnicodeDescriptor;
exports.default = _default;

},{"./node":85}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _unitConversions = _interopRequireDefault(require("../data/unit-conversions"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Unit = function (numerator, denominator, backupUnit) {
  this.numerator = numerator ? utils.copyArray(numerator).sort() : [];
  this.denominator = denominator ? utils.copyArray(denominator).sort() : [];
  if (backupUnit) {
    this.backupUnit = backupUnit;
  } else if (numerator && numerator.length) {
    this.backupUnit = numerator[0];
  }
};
Unit.prototype = Object.assign(new _node.default(), {
  type: 'Unit',
  clone() {
    return new Unit(utils.copyArray(this.numerator), utils.copyArray(this.denominator), this.backupUnit);
  },
  genCSS(context, output) {
    // Dimension checks the unit is singular and throws an error if in strict math mode.
    const strictUnits = context && context.strictUnits;
    if (this.numerator.length === 1) {
      output.add(this.numerator[0]); // the ideal situation
    } else if (!strictUnits && this.backupUnit) {
      output.add(this.backupUnit);
    } else if (!strictUnits && this.denominator.length) {
      output.add(this.denominator[0]);
    }
  },
  toString() {
    let i,
      returnStr = this.numerator.join('*');
    for (i = 0; i < this.denominator.length; i++) {
      returnStr += `/${this.denominator[i]}`;
    }
    return returnStr;
  },
  compare(other) {
    return this.is(other.toString()) ? 0 : undefined;
  },
  is(unitString) {
    return this.toString().toUpperCase() === unitString.toUpperCase();
  },
  isLength() {
    return RegExp('^(px|em|ex|ch|rem|in|cm|mm|pc|pt|ex|vw|vh|vmin|vmax)$', 'gi').test(this.toCSS());
  },
  isEmpty() {
    return this.numerator.length === 0 && this.denominator.length === 0;
  },
  isSingular() {
    return this.numerator.length <= 1 && this.denominator.length === 0;
  },
  map(callback) {
    let i;
    for (i = 0; i < this.numerator.length; i++) {
      this.numerator[i] = callback(this.numerator[i], false);
    }
    for (i = 0; i < this.denominator.length; i++) {
      this.denominator[i] = callback(this.denominator[i], true);
    }
  },
  usedUnits() {
    let group;
    const result = {};
    let mapUnit;
    let groupName;
    mapUnit = function (atomicUnit) {
      /* jshint loopfunc:true */
      if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
        result[groupName] = atomicUnit;
      }
      return atomicUnit;
    };
    for (groupName in _unitConversions.default) {
      if (_unitConversions.default.hasOwnProperty(groupName)) {
        group = _unitConversions.default[groupName];
        this.map(mapUnit);
      }
    }
    return result;
  },
  cancel() {
    const counter = {};
    let atomicUnit;
    let i;
    for (i = 0; i < this.numerator.length; i++) {
      atomicUnit = this.numerator[i];
      counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
    }
    for (i = 0; i < this.denominator.length; i++) {
      atomicUnit = this.denominator[i];
      counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
    }
    this.numerator = [];
    this.denominator = [];
    for (atomicUnit in counter) {
      if (counter.hasOwnProperty(atomicUnit)) {
        const count = counter[atomicUnit];
        if (count > 0) {
          for (i = 0; i < count; i++) {
            this.numerator.push(atomicUnit);
          }
        } else if (count < 0) {
          for (i = 0; i < -count; i++) {
            this.denominator.push(atomicUnit);
          }
        }
      }
    }
    this.numerator.sort();
    this.denominator.sort();
  }
});
var _default = Unit;
exports.default = _default;

},{"../data/unit-conversions":25,"../utils":98,"./node":85}],94:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function escapePath(path) {
  return path.replace(/[\(\)'"\s]/g, function (match) {
    return `\\${match}`;
  });
}
const URL = function (val, index, currentFileInfo, isEvald) {
  this.value = val;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.isEvald = isEvald;
};
URL.prototype = Object.assign(new _node.default(), {
  type: 'Url',
  accept(visitor) {
    this.value = visitor.visit(this.value);
  },
  genCSS(context, output) {
    output.add('url(');
    this.value.genCSS(context, output);
    output.add(')');
  },
  eval(context) {
    const val = this.value.eval(context);
    let rootpath;
    if (!this.isEvald) {
      // Add the rootpath if the URL requires a rewrite
      rootpath = this.fileInfo() && this.fileInfo().rootpath;
      if (typeof rootpath === 'string' && typeof val.value === 'string' && context.pathRequiresRewrite(val.value)) {
        if (!val.quote) {
          rootpath = escapePath(rootpath);
        }
        val.value = context.rewritePath(val.value, rootpath);
      } else {
        val.value = context.normalizePath(val.value);
      }

      // Add url args if enabled
      if (context.urlArgs) {
        if (!val.value.match(/^\s*data:/)) {
          const delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
          const urlArgs = delimiter + context.urlArgs;
          if (val.value.indexOf('#') !== -1) {
            val.value = val.value.replace('#', `${urlArgs}#`);
          } else {
            val.value += urlArgs;
          }
        }
      }
    }
    return new URL(val, this.getIndex(), this.fileInfo(), true);
  }
});
var _default = URL;
exports.default = _default;

},{"./node":85}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Value = function (value) {
  if (!value) {
    throw new Error('Value requires an array argument');
  }
  if (!Array.isArray(value)) {
    this.value = [value];
  } else {
    this.value = value;
  }
};
Value.prototype = Object.assign(new _node.default(), {
  type: 'Value',
  accept(visitor) {
    if (this.value) {
      this.value = visitor.visitArray(this.value);
    }
  },
  eval(context) {
    if (this.value.length === 1) {
      return this.value[0].eval(context);
    } else {
      return new Value(this.value.map(function (v) {
        return v.eval(context);
      }));
    }
  },
  genCSS(context, output) {
    let i;
    for (i = 0; i < this.value.length; i++) {
      this.value[i].genCSS(context, output);
      if (i + 1 < this.value.length) {
        output.add(context && context.compress ? ',' : ', ');
      }
    }
  }
});
var _default = Value;
exports.default = _default;

},{"./node":85}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _variable = _interopRequireDefault(require("./variable"));
var _ruleset = _interopRequireDefault(require("./ruleset"));
var _detachedRuleset = _interopRequireDefault(require("./detached-ruleset"));
var _lessError = _interopRequireDefault(require("../less-error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const VariableCall = function (variable, index, currentFileInfo) {
  this.variable = variable;
  this._index = index;
  this._fileInfo = currentFileInfo;
  this.allowRoot = true;
};
VariableCall.prototype = Object.assign(new _node.default(), {
  type: 'VariableCall',
  eval(context) {
    let rules;
    let detachedRuleset = new _variable.default(this.variable, this.getIndex(), this.fileInfo()).eval(context);
    const error = new _lessError.default({
      message: `Could not evaluate variable call ${this.variable}`
    });
    if (!detachedRuleset.ruleset) {
      if (detachedRuleset.rules) {
        rules = detachedRuleset;
      } else if (Array.isArray(detachedRuleset)) {
        rules = new _ruleset.default('', detachedRuleset);
      } else if (Array.isArray(detachedRuleset.value)) {
        rules = new _ruleset.default('', detachedRuleset.value);
      } else {
        throw error;
      }
      detachedRuleset = new _detachedRuleset.default(rules);
    }
    if (detachedRuleset.ruleset) {
      return detachedRuleset.callEval(context);
    }
    throw error;
  }
});
var _default = VariableCall;
exports.default = _default;

},{"../less-error":47,"./detached-ruleset":70,"./node":85,"./ruleset":90,"./variable":97}],97:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _node = _interopRequireDefault(require("./node"));
var _call = _interopRequireDefault(require("./call"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Variable = function (name, index, currentFileInfo) {
  this.name = name;
  this._index = index;
  this._fileInfo = currentFileInfo;
};
Variable.prototype = Object.assign(new _node.default(), {
  type: 'Variable',
  eval(context) {
    let variable,
      name = this.name;
    if (name.indexOf('@@') === 0) {
      name = `@${new Variable(name.slice(1), this.getIndex(), this.fileInfo()).eval(context).value}`;
    }
    if (this.evaluating) {
      throw {
        type: 'Name',
        message: `Recursive variable definition for ${name}`,
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
    this.evaluating = true;
    variable = this.find(context.frames, function (frame) {
      const v = frame.variable(name);
      if (v) {
        if (v.important) {
          const importantScope = context.importantScope[context.importantScope.length - 1];
          importantScope.important = v.important;
        }
        // If in calc, wrap vars in a function call to cascade evaluate args first
        if (context.inCalc) {
          return new _call.default('_SELF', [v.value]).eval(context);
        } else {
          return v.value.eval(context);
        }
      }
    });
    if (variable) {
      this.evaluating = false;
      return variable;
    } else {
      throw {
        type: 'Name',
        message: `variable ${name} is undefined`,
        filename: this.fileInfo().filename,
        index: this.getIndex()
      };
    }
  },
  find(obj, fun) {
    for (let i = 0, r; i < obj.length; i++) {
      r = fun.call(obj, obj[i]);
      if (r) {
        return r;
      }
    }
    return null;
  }
});
var _default = Variable;
exports.default = _default;

},{"./call":63,"./node":85}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.copyArray = copyArray;
exports.copyOptions = copyOptions;
exports.defaults = defaults;
exports.flattenArray = flattenArray;
exports.getLocation = getLocation;
exports.merge = merge;
var Constants = _interopRequireWildcard(require("./constants"));
var _copyAnything = require("copy-anything");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* jshint proto: true */

function getLocation(index, inputStream) {
  let n = index + 1;
  let line = null;
  let column = -1;
  while (--n >= 0 && inputStream.charAt(n) !== '\n') {
    column++;
  }
  if (typeof index === 'number') {
    line = (inputStream.slice(0, index).match(/\n/g) || '').length;
  }
  return {
    line,
    column
  };
}
function copyArray(arr) {
  let i;
  const length = arr.length;
  const copy = new Array(length);
  for (i = 0; i < length; i++) {
    copy[i] = arr[i];
  }
  return copy;
}
function clone(obj) {
  const cloned = {};
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      cloned[prop] = obj[prop];
    }
  }
  return cloned;
}
function defaults(obj1, obj2) {
  let newObj = obj2 || {};
  if (!obj2._defaults) {
    newObj = {};
    const defaults = (0, _copyAnything.copy)(obj1);
    newObj._defaults = defaults;
    const cloned = obj2 ? (0, _copyAnything.copy)(obj2) : {};
    Object.assign(newObj, defaults, cloned);
  }
  return newObj;
}
function copyOptions(obj1, obj2) {
  if (obj2 && obj2._defaults) {
    return obj2;
  }
  const opts = defaults(obj1, obj2);
  if (opts.strictMath) {
    opts.math = Constants.Math.PARENS;
  }
  // Back compat with changed relativeUrls option
  if (opts.relativeUrls) {
    opts.rewriteUrls = Constants.RewriteUrls.ALL;
  }
  if (typeof opts.math === 'string') {
    switch (opts.math.toLowerCase()) {
      case 'always':
        opts.math = Constants.Math.ALWAYS;
        break;
      case 'parens-division':
        opts.math = Constants.Math.PARENS_DIVISION;
        break;
      case 'strict':
      case 'parens':
        opts.math = Constants.Math.PARENS;
        break;
      default:
        opts.math = Constants.Math.PARENS;
    }
  }
  if (typeof opts.rewriteUrls === 'string') {
    switch (opts.rewriteUrls.toLowerCase()) {
      case 'off':
        opts.rewriteUrls = Constants.RewriteUrls.OFF;
        break;
      case 'local':
        opts.rewriteUrls = Constants.RewriteUrls.LOCAL;
        break;
      case 'all':
        opts.rewriteUrls = Constants.RewriteUrls.ALL;
        break;
    }
  }
  return opts;
}
function merge(obj1, obj2) {
  for (const prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      obj1[prop] = obj2[prop];
    }
  }
  return obj1;
}
function flattenArray(arr, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flattenArray(value, result);
    } else {
      if (value !== undefined) {
        result.push(value);
      }
    }
  }
  return result;
}

},{"./constants":21,"copy-anything":3}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tree = _interopRequireDefault(require("../tree"));
var _visitor = _interopRequireDefault(require("./visitor"));
var _logger = _interopRequireDefault(require("../logger"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* jshint loopfunc:true */

class ExtendFinderVisitor {
  constructor() {
    this._visitor = new _visitor.default(this);
    this.contexts = [];
    this.allExtendsStack = [[]];
  }
  run(root) {
    root = this._visitor.visit(root);
    root.allExtends = this.allExtendsStack[0];
    return root;
  }
  visitDeclaration(declNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitMixinDefinition(mixinDefinitionNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitRuleset(rulesetNode, visitArgs) {
    if (rulesetNode.root) {
      return;
    }
    let i;
    let j;
    let extend;
    const allSelectorsExtendList = [];
    let extendList;

    // get &:extend(.a); rules which apply to all selectors in this ruleset
    const rules = rulesetNode.rules,
      ruleCnt = rules ? rules.length : 0;
    for (i = 0; i < ruleCnt; i++) {
      if (rulesetNode.rules[i] instanceof _tree.default.Extend) {
        allSelectorsExtendList.push(rules[i]);
        rulesetNode.extendOnEveryPath = true;
      }
    }

    // now find every selector and apply the extends that apply to all extends
    // and the ones which apply to an individual extend
    const paths = rulesetNode.paths;
    for (i = 0; i < paths.length; i++) {
      const selectorPath = paths[i],
        selector = selectorPath[selectorPath.length - 1],
        selExtendList = selector.extendList;
      extendList = selExtendList ? utils.copyArray(selExtendList).concat(allSelectorsExtendList) : allSelectorsExtendList;
      if (extendList) {
        extendList = extendList.map(function (allSelectorsExtend) {
          return allSelectorsExtend.clone();
        });
      }
      for (j = 0; j < extendList.length; j++) {
        this.foundExtends = true;
        extend = extendList[j];
        extend.findSelfSelectors(selectorPath);
        extend.ruleset = rulesetNode;
        if (j === 0) {
          extend.firstExtendOnThisSelectorPath = true;
        }
        this.allExtendsStack[this.allExtendsStack.length - 1].push(extend);
      }
    }
    this.contexts.push(rulesetNode.selectors);
  }
  visitRulesetOut(rulesetNode) {
    if (!rulesetNode.root) {
      this.contexts.length = this.contexts.length - 1;
    }
  }
  visitMedia(mediaNode, visitArgs) {
    mediaNode.allExtends = [];
    this.allExtendsStack.push(mediaNode.allExtends);
  }
  visitMediaOut(mediaNode) {
    this.allExtendsStack.length = this.allExtendsStack.length - 1;
  }
  visitAtRule(atRuleNode, visitArgs) {
    atRuleNode.allExtends = [];
    this.allExtendsStack.push(atRuleNode.allExtends);
  }
  visitAtRuleOut(atRuleNode) {
    this.allExtendsStack.length = this.allExtendsStack.length - 1;
  }
}
class ProcessExtendsVisitor {
  constructor() {
    this._visitor = new _visitor.default(this);
  }
  run(root) {
    const extendFinder = new ExtendFinderVisitor();
    this.extendIndices = {};
    extendFinder.run(root);
    if (!extendFinder.foundExtends) {
      return root;
    }
    root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
    this.allExtendsStack = [root.allExtends];
    const newRoot = this._visitor.visit(root);
    this.checkExtendsForNonMatched(root.allExtends);
    return newRoot;
  }
  checkExtendsForNonMatched(extendList) {
    const indices = this.extendIndices;
    extendList.filter(function (extend) {
      return !extend.hasFoundMatches && extend.parent_ids.length == 1;
    }).forEach(function (extend) {
      let selector = '_unknown_';
      try {
        selector = extend.selector.toCSS({});
      } catch (_) {}
      if (!indices[`${extend.index} ${selector}`]) {
        indices[`${extend.index} ${selector}`] = true;
        _logger.default.warn(`extend '${selector}' has no matches`);
      }
    });
  }
  doExtendChaining(extendsList, extendsListTarget, iterationCount) {
    //
    // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering
    // and pasting the selector we would do normally, but we are also adding an extend with the same target selector
    // this means this new extend can then go and alter other extends
    //
    // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
    // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already
    // processed if we look at each selector at a time, as is done in visitRuleset

    let extendIndex;
    let targetExtendIndex;
    let matches;
    const extendsToAdd = [];
    let newSelector;
    const extendVisitor = this;
    let selectorPath;
    let extend;
    let targetExtend;
    let newExtend;
    iterationCount = iterationCount || 0;

    // loop through comparing every extend with every target extend.
    // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
    // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
    // and the second is the target.
    // the separation into two lists allows us to process a subset of chains with a bigger set, as is the
    // case when processing media queries
    for (extendIndex = 0; extendIndex < extendsList.length; extendIndex++) {
      for (targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++) {
        extend = extendsList[extendIndex];
        targetExtend = extendsListTarget[targetExtendIndex];

        // look for circular references
        if (extend.parent_ids.indexOf(targetExtend.object_id) >= 0) {
          continue;
        }

        // find a match in the target extends self selector (the bit before :extend)
        selectorPath = [targetExtend.selfSelectors[0]];
        matches = extendVisitor.findMatch(extend, selectorPath);
        if (matches.length) {
          extend.hasFoundMatches = true;

          // we found a match, so for each self selector..
          extend.selfSelectors.forEach(function (selfSelector) {
            const info = targetExtend.visibilityInfo();

            // process the extend as usual
            newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector, extend.isVisible());

            // but now we create a new extend from it
            newExtend = new _tree.default.Extend(targetExtend.selector, targetExtend.option, 0, targetExtend.fileInfo(), info);
            newExtend.selfSelectors = newSelector;

            // add the extend onto the list of extends for that selector
            newSelector[newSelector.length - 1].extendList = [newExtend];

            // record that we need to add it.
            extendsToAdd.push(newExtend);
            newExtend.ruleset = targetExtend.ruleset;

            // remember its parents for circular references
            newExtend.parent_ids = newExtend.parent_ids.concat(targetExtend.parent_ids, extend.parent_ids);

            // only process the selector once.. if we have :extend(.a,.b) then multiple
            // extends will look at the same selector path, so when extending
            // we know that any others will be duplicates in terms of what is added to the css
            if (targetExtend.firstExtendOnThisSelectorPath) {
              newExtend.firstExtendOnThisSelectorPath = true;
              targetExtend.ruleset.paths.push(newSelector);
            }
          });
        }
      }
    }
    if (extendsToAdd.length) {
      // try to detect circular references to stop a stack overflow.
      // may no longer be needed.
      this.extendChainCount++;
      if (iterationCount > 100) {
        let selectorOne = '{unable to calculate}';
        let selectorTwo = '{unable to calculate}';
        try {
          selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
          selectorTwo = extendsToAdd[0].selector.toCSS();
        } catch (e) {}
        throw {
          message: `extend circular reference detected. One of the circular extends is currently:${selectorOne}:extend(${selectorTwo})`
        };
      }

      // now process the new extends on the existing rules so that we can handle a extending b extending c extending
      // d extending e...
      return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount + 1));
    } else {
      return extendsToAdd;
    }
  }
  visitDeclaration(ruleNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitMixinDefinition(mixinDefinitionNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitSelector(selectorNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitRuleset(rulesetNode, visitArgs) {
    if (rulesetNode.root) {
      return;
    }
    let matches;
    let pathIndex;
    let extendIndex;
    const allExtends = this.allExtendsStack[this.allExtendsStack.length - 1];
    const selectorsToAdd = [];
    const extendVisitor = this;
    let selectorPath;

    // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

    for (extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
      for (pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {
        selectorPath = rulesetNode.paths[pathIndex];

        // extending extends happens initially, before the main pass
        if (rulesetNode.extendOnEveryPath) {
          continue;
        }
        const extendList = selectorPath[selectorPath.length - 1].extendList;
        if (extendList && extendList.length) {
          continue;
        }
        matches = this.findMatch(allExtends[extendIndex], selectorPath);
        if (matches.length) {
          allExtends[extendIndex].hasFoundMatches = true;
          allExtends[extendIndex].selfSelectors.forEach(function (selfSelector) {
            let extendedSelectors;
            extendedSelectors = extendVisitor.extendSelector(matches, selectorPath, selfSelector, allExtends[extendIndex].isVisible());
            selectorsToAdd.push(extendedSelectors);
          });
        }
      }
    }
    rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
  }
  findMatch(extend, haystackSelectorPath) {
    //
    // look through the haystack selector path to try and find the needle - extend.selector
    // returns an array of selector matches that can then be replaced
    //
    let haystackSelectorIndex;
    let hackstackSelector;
    let hackstackElementIndex;
    let haystackElement;
    let targetCombinator;
    let i;
    const extendVisitor = this;
    const needleElements = extend.selector.elements;
    const potentialMatches = [];
    let potentialMatch;
    const matches = [];

    // loop through the haystack elements
    for (haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
      hackstackSelector = haystackSelectorPath[haystackSelectorIndex];
      for (hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {
        haystackElement = hackstackSelector.elements[hackstackElementIndex];

        // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.
        if (extend.allowBefore || haystackSelectorIndex === 0 && hackstackElementIndex === 0) {
          potentialMatches.push({
            pathIndex: haystackSelectorIndex,
            index: hackstackElementIndex,
            matched: 0,
            initialCombinator: haystackElement.combinator
          });
        }
        for (i = 0; i < potentialMatches.length; i++) {
          potentialMatch = potentialMatches[i];

          // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
          // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to
          // work out what the resulting combinator will be
          targetCombinator = haystackElement.combinator.value;
          if (targetCombinator === '' && hackstackElementIndex === 0) {
            targetCombinator = ' ';
          }

          // if we don't match, null our match to indicate failure
          if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) || potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator) {
            potentialMatch = null;
          } else {
            potentialMatch.matched++;
          }

          // if we are still valid and have finished, test whether we have elements after and whether these are allowed
          if (potentialMatch) {
            potentialMatch.finished = potentialMatch.matched === needleElements.length;
            if (potentialMatch.finished && !extend.allowAfter && (hackstackElementIndex + 1 < hackstackSelector.elements.length || haystackSelectorIndex + 1 < haystackSelectorPath.length)) {
              potentialMatch = null;
            }
          }
          // if null we remove, if not, we are still valid, so either push as a valid match or continue
          if (potentialMatch) {
            if (potentialMatch.finished) {
              potentialMatch.length = needleElements.length;
              potentialMatch.endPathIndex = haystackSelectorIndex;
              potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match
              potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again
              matches.push(potentialMatch);
            }
          } else {
            potentialMatches.splice(i, 1);
            i--;
          }
        }
      }
    }
    return matches;
  }
  isElementValuesEqual(elementValue1, elementValue2) {
    if (typeof elementValue1 === 'string' || typeof elementValue2 === 'string') {
      return elementValue1 === elementValue2;
    }
    if (elementValue1 instanceof _tree.default.Attribute) {
      if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
        return false;
      }
      if (!elementValue1.value || !elementValue2.value) {
        if (elementValue1.value || elementValue2.value) {
          return false;
        }
        return true;
      }
      elementValue1 = elementValue1.value.value || elementValue1.value;
      elementValue2 = elementValue2.value.value || elementValue2.value;
      return elementValue1 === elementValue2;
    }
    elementValue1 = elementValue1.value;
    elementValue2 = elementValue2.value;
    if (elementValue1 instanceof _tree.default.Selector) {
      if (!(elementValue2 instanceof _tree.default.Selector) || elementValue1.elements.length !== elementValue2.elements.length) {
        return false;
      }
      for (let i = 0; i < elementValue1.elements.length; i++) {
        if (elementValue1.elements[i].combinator.value !== elementValue2.elements[i].combinator.value) {
          if (i !== 0 || (elementValue1.elements[i].combinator.value || ' ') !== (elementValue2.elements[i].combinator.value || ' ')) {
            return false;
          }
        }
        if (!this.isElementValuesEqual(elementValue1.elements[i].value, elementValue2.elements[i].value)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  extendSelector(matches, selectorPath, replacementSelector, isVisible) {
    // for a set of matches, replace each match with the replacement selector

    let currentSelectorPathIndex = 0,
      currentSelectorPathElementIndex = 0,
      path = [],
      matchIndex,
      selector,
      firstElement,
      match,
      newElements;
    for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
      match = matches[matchIndex];
      selector = selectorPath[match.pathIndex];
      firstElement = new _tree.default.Element(match.initialCombinator, replacementSelector.elements[0].value, replacementSelector.elements[0].isVariable, replacementSelector.elements[0].getIndex(), replacementSelector.elements[0].fileInfo());
      if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
        path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
        currentSelectorPathElementIndex = 0;
        currentSelectorPathIndex++;
      }
      newElements = selector.elements.slice(currentSelectorPathElementIndex, match.index).concat([firstElement]).concat(replacementSelector.elements.slice(1));
      if (currentSelectorPathIndex === match.pathIndex && matchIndex > 0) {
        path[path.length - 1].elements = path[path.length - 1].elements.concat(newElements);
      } else {
        path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));
        path.push(new _tree.default.Selector(newElements));
      }
      currentSelectorPathIndex = match.endPathIndex;
      currentSelectorPathElementIndex = match.endPathElementIndex;
      if (currentSelectorPathElementIndex >= selectorPath[currentSelectorPathIndex].elements.length) {
        currentSelectorPathElementIndex = 0;
        currentSelectorPathIndex++;
      }
    }
    if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
      path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
      currentSelectorPathIndex++;
    }
    path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));
    path = path.map(function (currentValue) {
      // we can re-use elements here, because the visibility property matters only for selectors
      const derived = currentValue.createDerived(currentValue.elements);
      if (isVisible) {
        derived.ensureVisibility();
      } else {
        derived.ensureInvisibility();
      }
      return derived;
    });
    return path;
  }
  visitMedia(mediaNode, visitArgs) {
    let newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
    newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
    this.allExtendsStack.push(newAllExtends);
  }
  visitMediaOut(mediaNode) {
    const lastIndex = this.allExtendsStack.length - 1;
    this.allExtendsStack.length = lastIndex;
  }
  visitAtRule(atRuleNode, visitArgs) {
    let newAllExtends = atRuleNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
    newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, atRuleNode.allExtends));
    this.allExtendsStack.push(newAllExtends);
  }
  visitAtRuleOut(atRuleNode) {
    const lastIndex = this.allExtendsStack.length - 1;
    this.allExtendsStack.length = lastIndex;
  }
}
var _default = ProcessExtendsVisitor;
exports.default = _default;

},{"../logger":48,"../tree":76,"../utils":98,"./visitor":106}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class ImportSequencer {
  constructor(onSequencerEmpty) {
    this.imports = [];
    this.variableImports = [];
    this._onSequencerEmpty = onSequencerEmpty;
    this._currentDepth = 0;
  }
  addImport(callback) {
    const importSequencer = this,
      importItem = {
        callback,
        args: null,
        isReady: false
      };
    this.imports.push(importItem);
    return function () {
      importItem.args = Array.prototype.slice.call(arguments, 0);
      importItem.isReady = true;
      importSequencer.tryRun();
    };
  }
  addVariableImport(callback) {
    this.variableImports.push(callback);
  }
  tryRun() {
    this._currentDepth++;
    try {
      while (true) {
        while (this.imports.length > 0) {
          const importItem = this.imports[0];
          if (!importItem.isReady) {
            return;
          }
          this.imports = this.imports.slice(1);
          importItem.callback.apply(null, importItem.args);
        }
        if (this.variableImports.length === 0) {
          break;
        }
        const variableImport = this.variableImports[0];
        this.variableImports = this.variableImports.slice(1);
        variableImport();
      }
    } finally {
      this._currentDepth--;
    }
    if (this._currentDepth === 0 && this._onSequencerEmpty) {
      this._onSequencerEmpty();
    }
  }
}
var _default = ImportSequencer;
exports.default = _default;

},{}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contexts = _interopRequireDefault(require("../contexts"));
var _visitor = _interopRequireDefault(require("./visitor"));
var _importSequencer = _interopRequireDefault(require("./import-sequencer"));
var utils = _interopRequireWildcard(require("../utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ImportVisitor = function (importer, finish) {
  this._visitor = new _visitor.default(this);
  this._importer = importer;
  this._finish = finish;
  this.context = new _contexts.default.Eval();
  this.importCount = 0;
  this.onceFileDetectionMap = {};
  this.recursionDetector = {};
  this._sequencer = new _importSequencer.default(this._onSequencerEmpty.bind(this));
};
ImportVisitor.prototype = {
  isReplacing: false,
  run: function (root) {
    try {
      // process the contents
      this._visitor.visit(root);
    } catch (e) {
      this.error = e;
    }
    this.isFinished = true;
    this._sequencer.tryRun();
  },
  _onSequencerEmpty: function () {
    if (!this.isFinished) {
      return;
    }
    this._finish(this.error);
  },
  visitImport: function (importNode, visitArgs) {
    const inlineCSS = importNode.options.inline;
    if (!importNode.css || inlineCSS) {
      const context = new _contexts.default.Eval(this.context, utils.copyArray(this.context.frames));
      const importParent = context.frames[0];
      this.importCount++;
      if (importNode.isVariableImport()) {
        this._sequencer.addVariableImport(this.processImportNode.bind(this, importNode, context, importParent));
      } else {
        this.processImportNode(importNode, context, importParent);
      }
    }
    visitArgs.visitDeeper = false;
  },
  processImportNode: function (importNode, context, importParent) {
    let evaldImportNode;
    const inlineCSS = importNode.options.inline;
    try {
      evaldImportNode = importNode.evalForImport(context);
    } catch (e) {
      if (!e.filename) {
        e.index = importNode.getIndex();
        e.filename = importNode.fileInfo().filename;
      }
      // attempt to eval properly and treat as css
      importNode.css = true;
      // if that fails, this error will be thrown
      importNode.error = e;
    }
    if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {
      if (evaldImportNode.options.multiple) {
        context.importMultiple = true;
      }

      // try appending if we haven't determined if it is css or not
      const tryAppendLessExtension = evaldImportNode.css === undefined;
      for (let i = 0; i < importParent.rules.length; i++) {
        if (importParent.rules[i] === importNode) {
          importParent.rules[i] = evaldImportNode;
          break;
        }
      }
      const onImported = this.onImported.bind(this, evaldImportNode, context),
        sequencedOnImported = this._sequencer.addImport(onImported);
      this._importer.push(evaldImportNode.getPath(), tryAppendLessExtension, evaldImportNode.fileInfo(), evaldImportNode.options, sequencedOnImported);
    } else {
      this.importCount--;
      if (this.isFinished) {
        this._sequencer.tryRun();
      }
    }
  },
  onImported: function (importNode, context, e, root, importedAtRoot, fullPath) {
    if (e) {
      if (!e.filename) {
        e.index = importNode.getIndex();
        e.filename = importNode.fileInfo().filename;
      }
      this.error = e;
    }
    const importVisitor = this,
      inlineCSS = importNode.options.inline,
      isPlugin = importNode.options.isPlugin,
      isOptional = importNode.options.optional,
      duplicateImport = importedAtRoot || fullPath in importVisitor.recursionDetector;
    if (!context.importMultiple) {
      if (duplicateImport) {
        importNode.skip = true;
      } else {
        importNode.skip = function () {
          if (fullPath in importVisitor.onceFileDetectionMap) {
            return true;
          }
          importVisitor.onceFileDetectionMap[fullPath] = true;
          return false;
        };
      }
    }
    if (!fullPath && isOptional) {
      importNode.skip = true;
    }
    if (root) {
      importNode.root = root;
      importNode.importedFilename = fullPath;
      if (!inlineCSS && !isPlugin && (context.importMultiple || !duplicateImport)) {
        importVisitor.recursionDetector[fullPath] = true;
        const oldContext = this.context;
        this.context = context;
        try {
          this._visitor.visit(root);
        } catch (e) {
          this.error = e;
        }
        this.context = oldContext;
      }
    }
    importVisitor.importCount--;
    if (importVisitor.isFinished) {
      importVisitor._sequencer.tryRun();
    }
  },
  visitDeclaration: function (declNode, visitArgs) {
    if (declNode.value.type === 'DetachedRuleset') {
      this.context.frames.unshift(declNode);
    } else {
      visitArgs.visitDeeper = false;
    }
  },
  visitDeclarationOut: function (declNode) {
    if (declNode.value.type === 'DetachedRuleset') {
      this.context.frames.shift();
    }
  },
  visitAtRule: function (atRuleNode, visitArgs) {
    this.context.frames.unshift(atRuleNode);
  },
  visitAtRuleOut: function (atRuleNode) {
    this.context.frames.shift();
  },
  visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
    this.context.frames.unshift(mixinDefinitionNode);
  },
  visitMixinDefinitionOut: function (mixinDefinitionNode) {
    this.context.frames.shift();
  },
  visitRuleset: function (rulesetNode, visitArgs) {
    this.context.frames.unshift(rulesetNode);
  },
  visitRulesetOut: function (rulesetNode) {
    this.context.frames.shift();
  },
  visitMedia: function (mediaNode, visitArgs) {
    this.context.frames.unshift(mediaNode.rules[0]);
  },
  visitMediaOut: function (mediaNode) {
    this.context.frames.shift();
  }
};
var _default = ImportVisitor;
exports.default = _default;

},{"../contexts":22,"../utils":98,"./import-sequencer":100,"./visitor":106}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _visitor = _interopRequireDefault(require("./visitor"));
var _importVisitor = _interopRequireDefault(require("./import-visitor"));
var _setTreeVisibilityVisitor = _interopRequireDefault(require("./set-tree-visibility-visitor"));
var _extendVisitor = _interopRequireDefault(require("./extend-visitor"));
var _joinSelectorVisitor = _interopRequireDefault(require("./join-selector-visitor"));
var _toCssVisitor = _interopRequireDefault(require("./to-css-visitor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  Visitor: _visitor.default,
  ImportVisitor: _importVisitor.default,
  MarkVisibleSelectorsVisitor: _setTreeVisibilityVisitor.default,
  ExtendVisitor: _extendVisitor.default,
  JoinSelectorVisitor: _joinSelectorVisitor.default,
  ToCSSVisitor: _toCssVisitor.default
};
exports.default = _default;

},{"./extend-visitor":99,"./import-visitor":101,"./join-selector-visitor":103,"./set-tree-visibility-visitor":104,"./to-css-visitor":105,"./visitor":106}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _visitor = _interopRequireDefault(require("./visitor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class JoinSelectorVisitor {
  constructor() {
    this.contexts = [[]];
    this._visitor = new _visitor.default(this);
  }
  run(root) {
    return this._visitor.visit(root);
  }
  visitDeclaration(declNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitMixinDefinition(mixinDefinitionNode, visitArgs) {
    visitArgs.visitDeeper = false;
  }
  visitRuleset(rulesetNode, visitArgs) {
    const context = this.contexts[this.contexts.length - 1];
    const paths = [];
    let selectors;
    this.contexts.push(paths);
    if (!rulesetNode.root) {
      selectors = rulesetNode.selectors;
      if (selectors) {
        selectors = selectors.filter(function (selector) {
          return selector.getIsOutput();
        });
        rulesetNode.selectors = selectors.length ? selectors : selectors = null;
        if (selectors) {
          rulesetNode.joinSelectors(paths, context, selectors);
        }
      }
      if (!selectors) {
        rulesetNode.rules = null;
      }
      rulesetNode.paths = paths;
    }
  }
  visitRulesetOut(rulesetNode) {
    this.contexts.length = this.contexts.length - 1;
  }
  visitMedia(mediaNode, visitArgs) {
    const context = this.contexts[this.contexts.length - 1];
    mediaNode.rules[0].root = context.length === 0 || context[0].multiMedia;
  }
  visitAtRule(atRuleNode, visitArgs) {
    const context = this.contexts[this.contexts.length - 1];
    if (atRuleNode.rules && atRuleNode.rules.length) {
      atRuleNode.rules[0].root = atRuleNode.isRooted || context.length === 0 || null;
    }
  }
}
var _default = JoinSelectorVisitor;
exports.default = _default;

},{"./visitor":106}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class SetTreeVisibilityVisitor {
  constructor(visible) {
    this.visible = visible;
  }
  run(root) {
    this.visit(root);
  }
  visitArray(nodes) {
    if (!nodes) {
      return nodes;
    }
    const cnt = nodes.length;
    let i;
    for (i = 0; i < cnt; i++) {
      this.visit(nodes[i]);
    }
    return nodes;
  }
  visit(node) {
    if (!node) {
      return node;
    }
    if (node.constructor === Array) {
      return this.visitArray(node);
    }
    if (!node.blocksVisibility || node.blocksVisibility()) {
      return node;
    }
    if (this.visible) {
      node.ensureVisibility();
    } else {
      node.ensureInvisibility();
    }
    node.accept(this);
    return node;
  }
}
var _default = SetTreeVisibilityVisitor;
exports.default = _default;

},{}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tree = _interopRequireDefault(require("../tree"));
var _visitor = _interopRequireDefault(require("./visitor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CSSVisitorUtils {
  constructor(context) {
    this._visitor = new _visitor.default(this);
    this._context = context;
  }
  containsSilentNonBlockedChild(bodyRules) {
    let rule;
    if (!bodyRules) {
      return false;
    }
    for (let r = 0; r < bodyRules.length; r++) {
      rule = bodyRules[r];
      if (rule.isSilent && rule.isSilent(this._context) && !rule.blocksVisibility()) {
        // the atrule contains something that was referenced (likely by extend)
        // therefore it needs to be shown in output too
        return true;
      }
    }
    return false;
  }
  keepOnlyVisibleChilds(owner) {
    if (owner && owner.rules) {
      owner.rules = owner.rules.filter(thing => thing.isVisible());
    }
  }
  isEmpty(owner) {
    return owner && owner.rules ? owner.rules.length === 0 : true;
  }
  hasVisibleSelector(rulesetNode) {
    return rulesetNode && rulesetNode.paths ? rulesetNode.paths.length > 0 : false;
  }
  resolveVisibility(node, originalRules) {
    if (!node.blocksVisibility()) {
      if (this.isEmpty(node) && !this.containsSilentNonBlockedChild(originalRules)) {
        return;
      }
      return node;
    }
    const compiledRulesBody = node.rules[0];
    this.keepOnlyVisibleChilds(compiledRulesBody);
    if (this.isEmpty(compiledRulesBody)) {
      return;
    }
    node.ensureVisibility();
    node.removeVisibilityBlock();
    return node;
  }
  isVisibleRuleset(rulesetNode) {
    if (rulesetNode.firstRoot) {
      return true;
    }
    if (this.isEmpty(rulesetNode)) {
      return false;
    }
    if (!rulesetNode.root && !this.hasVisibleSelector(rulesetNode)) {
      return false;
    }
    return true;
  }
}
const ToCSSVisitor = function (context) {
  this._visitor = new _visitor.default(this);
  this._context = context;
  this.utils = new CSSVisitorUtils(context);
};
ToCSSVisitor.prototype = {
  isReplacing: true,
  run: function (root) {
    return this._visitor.visit(root);
  },
  visitDeclaration: function (declNode, visitArgs) {
    if (declNode.blocksVisibility() || declNode.variable) {
      return;
    }
    return declNode;
  },
  visitMixinDefinition: function (mixinNode, visitArgs) {
    // mixin definitions do not get eval'd - this means they keep state
    // so we have to clear that state here so it isn't used if toCSS is called twice
    mixinNode.frames = [];
  },
  visitExtend: function (extendNode, visitArgs) {},
  visitComment: function (commentNode, visitArgs) {
    if (commentNode.blocksVisibility() || commentNode.isSilent(this._context)) {
      return;
    }
    return commentNode;
  },
  visitMedia: function (mediaNode, visitArgs) {
    const originalRules = mediaNode.rules[0].rules;
    mediaNode.accept(this._visitor);
    visitArgs.visitDeeper = false;
    return this.utils.resolveVisibility(mediaNode, originalRules);
  },
  visitImport: function (importNode, visitArgs) {
    if (importNode.blocksVisibility()) {
      return;
    }
    return importNode;
  },
  visitAtRule: function (atRuleNode, visitArgs) {
    if (atRuleNode.rules && atRuleNode.rules.length) {
      return this.visitAtRuleWithBody(atRuleNode, visitArgs);
    } else {
      return this.visitAtRuleWithoutBody(atRuleNode, visitArgs);
    }
  },
  visitAnonymous: function (anonymousNode, visitArgs) {
    if (!anonymousNode.blocksVisibility()) {
      anonymousNode.accept(this._visitor);
      return anonymousNode;
    }
  },
  visitAtRuleWithBody: function (atRuleNode, visitArgs) {
    // if there is only one nested ruleset and that one has no path, then it is
    // just fake ruleset
    function hasFakeRuleset(atRuleNode) {
      const bodyRules = atRuleNode.rules;
      return bodyRules.length === 1 && (!bodyRules[0].paths || bodyRules[0].paths.length === 0);
    }
    function getBodyRules(atRuleNode) {
      const nodeRules = atRuleNode.rules;
      if (hasFakeRuleset(atRuleNode)) {
        return nodeRules[0].rules;
      }
      return nodeRules;
    }
    // it is still true that it is only one ruleset in array
    // this is last such moment
    // process childs
    const originalRules = getBodyRules(atRuleNode);
    atRuleNode.accept(this._visitor);
    visitArgs.visitDeeper = false;
    if (!this.utils.isEmpty(atRuleNode)) {
      this._mergeRules(atRuleNode.rules[0].rules);
    }
    return this.utils.resolveVisibility(atRuleNode, originalRules);
  },
  visitAtRuleWithoutBody: function (atRuleNode, visitArgs) {
    if (atRuleNode.blocksVisibility()) {
      return;
    }
    if (atRuleNode.name === '@charset') {
      // Only output the debug info together with subsequent @charset definitions
      // a comment (or @media statement) before the actual @charset atrule would
      // be considered illegal css as it has to be on the first line
      if (this.charset) {
        if (atRuleNode.debugInfo) {
          const comment = new _tree.default.Comment(`/* ${atRuleNode.toCSS(this._context).replace(/\n/g, '')} */\n`);
          comment.debugInfo = atRuleNode.debugInfo;
          return this._visitor.visit(comment);
        }
        return;
      }
      this.charset = true;
    }
    return atRuleNode;
  },
  checkValidNodes: function (rules, isRoot) {
    if (!rules) {
      return;
    }
    for (let i = 0; i < rules.length; i++) {
      const ruleNode = rules[i];
      if (isRoot && ruleNode instanceof _tree.default.Declaration && !ruleNode.variable) {
        throw {
          message: 'Properties must be inside selector blocks. They cannot be in the root',
          index: ruleNode.getIndex(),
          filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename
        };
      }
      if (ruleNode instanceof _tree.default.Call) {
        throw {
          message: `Function '${ruleNode.name}' did not return a root node`,
          index: ruleNode.getIndex(),
          filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename
        };
      }
      if (ruleNode.type && !ruleNode.allowRoot) {
        throw {
          message: `${ruleNode.type} node returned by a function is not valid here`,
          index: ruleNode.getIndex(),
          filename: ruleNode.fileInfo() && ruleNode.fileInfo().filename
        };
      }
    }
  },
  visitRuleset: function (rulesetNode, visitArgs) {
    // at this point rulesets are nested into each other
    let rule;
    const rulesets = [];
    this.checkValidNodes(rulesetNode.rules, rulesetNode.firstRoot);
    if (!rulesetNode.root) {
      // remove invisible paths
      this._compileRulesetPaths(rulesetNode);

      // remove rulesets from this ruleset body and compile them separately
      const nodeRules = rulesetNode.rules;
      let nodeRuleCnt = nodeRules ? nodeRules.length : 0;
      for (let i = 0; i < nodeRuleCnt;) {
        rule = nodeRules[i];
        if (rule && rule.rules) {
          // visit because we are moving them out from being a child
          rulesets.push(this._visitor.visit(rule));
          nodeRules.splice(i, 1);
          nodeRuleCnt--;
          continue;
        }
        i++;
      }
      // accept the visitor to remove rules and refactor itself
      // then we can decide nogw whether we want it or not
      // compile body
      if (nodeRuleCnt > 0) {
        rulesetNode.accept(this._visitor);
      } else {
        rulesetNode.rules = null;
      }
      visitArgs.visitDeeper = false;
    } else {
      // if (! rulesetNode.root) {
      rulesetNode.accept(this._visitor);
      visitArgs.visitDeeper = false;
    }
    if (rulesetNode.rules) {
      this._mergeRules(rulesetNode.rules);
      this._removeDuplicateRules(rulesetNode.rules);
    }

    // now decide whether we keep the ruleset
    if (this.utils.isVisibleRuleset(rulesetNode)) {
      rulesetNode.ensureVisibility();
      rulesets.splice(0, 0, rulesetNode);
    }
    if (rulesets.length === 1) {
      return rulesets[0];
    }
    return rulesets;
  },
  _compileRulesetPaths: function (rulesetNode) {
    if (rulesetNode.paths) {
      rulesetNode.paths = rulesetNode.paths.filter(p => {
        let i;
        if (p[0].elements[0].combinator.value === ' ') {
          p[0].elements[0].combinator = new _tree.default.Combinator('');
        }
        for (i = 0; i < p.length; i++) {
          if (p[i].isVisible() && p[i].getIsOutput()) {
            return true;
          }
        }
        return false;
      });
    }
  },
  _removeDuplicateRules: function (rules) {
    if (!rules) {
      return;
    }

    // remove duplicates
    const ruleCache = {};
    let ruleList;
    let rule;
    let i;
    for (i = rules.length - 1; i >= 0; i--) {
      rule = rules[i];
      if (rule instanceof _tree.default.Declaration) {
        if (!ruleCache[rule.name]) {
          ruleCache[rule.name] = rule;
        } else {
          ruleList = ruleCache[rule.name];
          if (ruleList instanceof _tree.default.Declaration) {
            ruleList = ruleCache[rule.name] = [ruleCache[rule.name].toCSS(this._context)];
          }
          const ruleCSS = rule.toCSS(this._context);
          if (ruleList.indexOf(ruleCSS) !== -1) {
            rules.splice(i, 1);
          } else {
            ruleList.push(ruleCSS);
          }
        }
      }
    }
  },
  _mergeRules: function (rules) {
    if (!rules) {
      return;
    }
    const groups = {};
    const groupsArr = [];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.merge) {
        const key = rule.name;
        groups[key] ? rules.splice(i--, 1) : groupsArr.push(groups[key] = []);
        groups[key].push(rule);
      }
    }
    groupsArr.forEach(group => {
      if (group.length > 0) {
        const result = group[0];
        let space = [];
        const comma = [new _tree.default.Expression(space)];
        group.forEach(rule => {
          if (rule.merge === '+' && space.length > 0) {
            comma.push(new _tree.default.Expression(space = []));
          }
          space.push(rule.value);
          result.important = result.important || rule.important;
        });
        result.value = new _tree.default.Value(comma);
      }
    });
  }
};
var _default = ToCSSVisitor;
exports.default = _default;

},{"../tree":76,"./visitor":106}],106:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tree = _interopRequireDefault(require("../tree"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _visitArgs = {
  visitDeeper: true
};
let _hasIndexed = false;
function _noop(node) {
  return node;
}
function indexNodeTypes(parent, ticker) {
  // add .typeIndex to tree node types for lookup table
  let key, child;
  for (key in parent) {
    /* eslint guard-for-in: 0 */
    child = parent[key];
    switch (typeof child) {
      case 'function':
        // ignore bound functions directly on tree which do not have a prototype
        // or aren't nodes
        if (child.prototype && child.prototype.type) {
          child.prototype.typeIndex = ticker++;
        }
        break;
      case 'object':
        ticker = indexNodeTypes(child, ticker);
        break;
    }
  }
  return ticker;
}
class Visitor {
  constructor(implementation) {
    this._implementation = implementation;
    this._visitInCache = {};
    this._visitOutCache = {};
    if (!_hasIndexed) {
      indexNodeTypes(_tree.default, 1);
      _hasIndexed = true;
    }
  }
  visit(node) {
    if (!node) {
      return node;
    }
    const nodeTypeIndex = node.typeIndex;
    if (!nodeTypeIndex) {
      // MixinCall args aren't a node type?
      if (node.value && node.value.typeIndex) {
        this.visit(node.value);
      }
      return node;
    }
    const impl = this._implementation;
    let func = this._visitInCache[nodeTypeIndex];
    let funcOut = this._visitOutCache[nodeTypeIndex];
    const visitArgs = _visitArgs;
    let fnName;
    visitArgs.visitDeeper = true;
    if (!func) {
      fnName = `visit${node.type}`;
      func = impl[fnName] || _noop;
      funcOut = impl[`${fnName}Out`] || _noop;
      this._visitInCache[nodeTypeIndex] = func;
      this._visitOutCache[nodeTypeIndex] = funcOut;
    }
    if (func !== _noop) {
      const newNode = func.call(impl, node, visitArgs);
      if (node && impl.isReplacing) {
        node = newNode;
      }
    }
    if (visitArgs.visitDeeper && node) {
      if (node.length) {
        for (let i = 0, cnt = node.length; i < cnt; i++) {
          if (node[i].accept) {
            node[i].accept(this);
          }
        }
      } else if (node.accept) {
        node.accept(this);
      }
    }
    if (funcOut != _noop) {
      funcOut.call(impl, node);
    }
    return node;
  }
  visitArray(nodes, nonReplacing) {
    if (!nodes) {
      return nodes;
    }
    const cnt = nodes.length;
    let i;

    // Non-replacing
    if (nonReplacing || !this._implementation.isReplacing) {
      for (i = 0; i < cnt; i++) {
        this.visit(nodes[i]);
      }
      return nodes;
    }

    // Replacing
    const out = [];
    for (i = 0; i < cnt; i++) {
      const evald = this.visit(nodes[i]);
      if (evald === undefined) {
        continue;
      }
      if (!evald.splice) {
        out.push(evald);
      } else if (evald.length) {
        this.flatten(evald, out);
      }
    }
    return out;
  }
  flatten(arr, out) {
    if (!out) {
      out = [];
    }
    let cnt, i, item, nestedCnt, j, nestedItem;
    for (i = 0, cnt = arr.length; i < cnt; i++) {
      item = arr[i];
      if (item === undefined) {
        continue;
      }
      if (!item.splice) {
        out.push(item);
        continue;
      }
      for (j = 0, nestedCnt = item.length; j < nestedCnt; j++) {
        nestedItem = item[j];
        if (nestedItem === undefined) {
          continue;
        }
        if (!nestedItem.splice) {
          out.push(nestedItem);
        } else if (nestedItem.length) {
          this.flatten(nestedItem, out);
        }
      }
    }
    return out;
  }
}
var _default = Visitor;
exports.default = _default;

},{"../tree":76}]},{},[19])(19)
});

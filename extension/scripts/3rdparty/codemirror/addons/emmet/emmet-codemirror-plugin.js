(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Minimalistic backwards stream reader
 */
var StreamReader = function StreamReader(string) {
	this.string = string;
	this.pos = this.string.length;
};

StreamReader.prototype.sol = function sol () {
	return this.pos === 0;
};

StreamReader.prototype.peek = function peek (offset) {
	return this.string.charCodeAt(this.pos - 1 + (offset || 0));
};

StreamReader.prototype.prev = function prev () {
	if (!this.sol()) {
		return this.string.charCodeAt(--this.pos);
	}
};

StreamReader.prototype.eat = function eat (match) {
	var ok = typeof match === 'function'
		? match(this.peek())
		: match === this.peek();

	if (ok) {
		this.pos--;
	}

	return ok;
};

StreamReader.prototype.eatWhile = function eatWhile (match) {
	var start = this.pos;
	while (this.eat(match)) {}
	return this.pos < start;
};

/**
 * Quotes-related utilities
 */

var SINGLE_QUOTE = 39; // '
var DOUBLE_QUOTE = 34; // "
var ESCAPE       = 92; // \

/**
 * Check if given character code is a quote
 * @param  {Number}  c
 * @return {Boolean}
 */
function isQuote(c) {
	return c === SINGLE_QUOTE || c === DOUBLE_QUOTE;
}

/**
 * Consumes quoted value, if possible
 * @param  {StreamReader} stream
 * @return {Boolean}      Returns `true` is value was consumed
 */
function eatQuoted(stream) {
	var start = stream.pos;
	var quote = stream.prev();

	if (isQuote(quote)) {
		while (!stream.sol()) {
			if (stream.prev() === quote && stream.peek() !== ESCAPE) {
				return true;
			}
		}
	}

	stream.pos = start;
	return false;
}

var TAB         = 9;
var SPACE       = 32;
var SLASH       = 47; // /
var COLON       = 58; // :
var EQUALS      = 61; // =
var ANGLE_LEFT  = 60; // <
var ANGLE_RIGHT = 62; // >

/**
 * Check if given reader’s current position points at the end of HTML tag
 * @param  {StreamReader} stream
 * @return {Boolean}
 */
var isAtHTMLTag = function(stream) {
	var start = stream.pos;

	if (!stream.eat(ANGLE_RIGHT)) {
		return false;
	}

	var ok = false;
	stream.eat(SLASH); // possibly self-closed element

	while (!stream.sol()) {
		stream.eatWhile(isWhiteSpace);

		if (eatIdent(stream)) {
			// ate identifier: could be a tag name, boolean attribute or unquoted
			// attribute value
			if (stream.eat(SLASH)) {
				// either closing tag or invalid tag
				ok = stream.eat(ANGLE_LEFT);
				break;
			} else if (stream.eat(ANGLE_LEFT)) {
				// opening tag
				ok = true;
				break;
			} else if (stream.eat(isWhiteSpace)) {
				// boolean attribute
				continue;
			} else if (stream.eat(EQUALS)) {
				// simple unquoted value or invalid attribute
				ok = eatIdent(stream);
				break;
			} else if (eatAttributeWithUnquotedValue(stream)) {
				// identifier was a part of unquoted value
				ok = true;
				break;
			}

			// invalid tag
			break;
		}

		if (eatAttribute(stream)) {
			continue;
		}

		break;
	}

	stream.pos = start;
	return ok;
};

/**
 * Eats HTML attribute from given string.
 * @param  {StreamReader} state
 * @return {Boolean}       `true` if attribute was consumed.
 */
function eatAttribute(stream) {
	return eatAttributeWithQuotedValue(stream) || eatAttributeWithUnquotedValue(stream);
}

/**
 * @param  {StreamReader} stream
 * @return {Boolean}
 */
function eatAttributeWithQuotedValue(stream) {
	var start = stream.pos;
	if (eatQuoted(stream) && stream.eat(EQUALS) && eatIdent(stream)) {
		return true;
	}

	stream.pos = start;
	return false;
}

/**
 * @param  {StreamReader} stream
 * @return {Boolean}
 */
function eatAttributeWithUnquotedValue(stream) {
	var start = stream.pos;
	if (stream.eatWhile(isUnquotedValue) && stream.eat(EQUALS) && eatIdent(stream)) {
		return true;
	}

	stream.pos = start;
	return false;
}

/**
 * Eats HTML identifier from stream
 * @param  {StreamReader} stream
 * @return {Boolean}
 */
function eatIdent(stream) {
	return stream.eatWhile(isIdent);
}

/**
 * Check if given character code belongs to HTML identifier
 * @param  {Number}  c
 * @return {Boolean}
 */
function isIdent(c) {
	return c === COLON || isAlpha(c) || isNumber(c);
}

/**
 * Check if given character code is alpha code (letter though A to Z)
 * @param  {Number}  c
 * @return {Boolean}
 */
function isAlpha(c) {
	c &= ~32; // quick hack to convert any char code to uppercase char code
	return c >= 65 && c <= 90; // A-Z
}

/**
 * Check if given code is a number
 * @param  {Number}  c
 * @return {Boolean}
 */
function isNumber(c) {
	return c > 47 && c < 58;
}

/**
 * Check if given code is a whitespace
 * @param  {Number}  c
 * @return {Boolean}
 */
function isWhiteSpace(c) {
	return c === SPACE || c === TAB;
}

/**
 * Check if given code may belong to unquoted attribute value
 * @param  {Number}  c
 * @return {Boolean}
 */
function isUnquotedValue(c) {
	return c && c !== EQUALS && !isWhiteSpace(c) && !isQuote(c);
}

var code = function (ch) { return ch.charCodeAt(0); };
var SQUARE_BRACE_L = code('[');
var SQUARE_BRACE_R = code(']');
var ROUND_BRACE_L  = code('(');
var ROUND_BRACE_R  = code(')');
var CURLY_BRACE_L  = code('{');
var CURLY_BRACE_R  = code('}');

var specialChars = new Set('#.*:$-_!@%^+>/'.split('').map(code));
var bracePairs = new Map()
.set(SQUARE_BRACE_L, SQUARE_BRACE_R)
.set(ROUND_BRACE_L,  ROUND_BRACE_R)
.set(CURLY_BRACE_L,  CURLY_BRACE_R);

/**
 * Extracts Emmet abbreviation from given string.
 * The goal of this module is to extract abbreviation from current editor’s line,
 * e.g. like this: `<span>.foo[title=bar|]</span>` -> `.foo[title=bar]`, where
 * `|` is a current caret position.
 * @param {String}  line A text line where abbreviation should be expanded
 * @param {Number}  [pos] Caret position in line. If not given, uses end-of-line
 * @param {Boolean} [lookAhead] Allow parser to look ahead of `pos` index for
 * searching of missing abbreviation parts. Most editors automatically inserts
 * closing braces for `[`, `{` and `(`, which will most likely be right after
 * current caret position. So in order to properly expand abbreviation, user
 * must explicitly move caret right after auto-inserted braces. Whith this option
 * enabled, parser will search for closing braces right after `pos`. Default is `true`
 * @return {Object} Object with `abbreviation` and its `location` in given line
 * if abbreviation can be extracted, `null` otherwise
 */
function extractAbbreviation$1(line, pos, lookAhead) {
	// make sure `pos` is within line range
	pos = Math.min(line.length, Math.max(0, pos == null ? line.length : pos));

	if (lookAhead == null || lookAhead === true) {
		pos = offsetPastAutoClosed(line, pos);
	}

	var c;
	var stream = new StreamReader(line);
	stream.pos = pos;
	var stack = [];

	while (!stream.sol()) {
		c = stream.peek();

		if (isCloseBrace(c)) {
			stack.push(c);
		} else if (isOpenBrace(c)) {
			if (stack.pop() !== bracePairs.get(c)) {
				// unexpected brace
				break;
			}
		} else if (has(stack, SQUARE_BRACE_R) || has(stack, CURLY_BRACE_R)) {
			// respect all characters inside attribute sets or text nodes
			stream.pos--;
			continue;
		} else if (isAtHTMLTag(stream) || !isAbbreviation(c)) {
			break;
		}

		stream.pos--;
	}

	if (!stack.length && stream.pos !== pos) {
		// found something, remove some invalid symbols from the
		// beginning and return abbreviation
		var abbreviation = line.slice(stream.pos, pos).replace(/^[\*\+\>\^]+/, '');
		return {
			abbreviation: abbreviation,
			location: pos - abbreviation.length
		};
	}
}

/**
 * Returns new `line` index which is right after characters beyound `pos` that
 * edditor will likely automatically close, e.g. }, ], and quotes
 * @param {String} line
 * @param {Number} pos
 * @return {Number}
 */
function offsetPastAutoClosed(line, pos) {
	// closing quote is allowed only as a next character
	if (isQuote(line.charCodeAt(pos))) {
		pos++;
	}

	// offset pointer until non-autoclosed character is found
	while (isCloseBrace(line.charCodeAt(pos))) {
		pos++;
	}

	return pos;
}

function has(arr, value) {
	return arr.indexOf(value) !== -1;
}

function isAbbreviation(c) {
	return (c > 64 && c < 91)   // uppercase letter
		|| (c > 96 && c < 123)  // lowercase letter
		|| (c > 47 && c < 58)   // number
		|| specialChars.has(c); // special character
}

function isOpenBrace(c) {
	return c === SQUARE_BRACE_L || c === ROUND_BRACE_L || c === CURLY_BRACE_L;
}

function isCloseBrace(c) {
	return c === SQUARE_BRACE_R || c === ROUND_BRACE_R || c === CURLY_BRACE_R;
}

var defaultOptions$1 = {
	/**
	 * String for one-level indentation
	 * @type {String}
	 */
	indent: '\t',

	/**
	 * Tag case: 'lower', 'upper' or '' (keep as-is)
	 * @type {String}
	 */
	tagCase: '',

	/**
	 * Attribute name case: 'lower', 'upper' or '' (keep as-is)
	 * @type {String}
	 */
	attributeCase: '',

	/**
	 * Attribute value quotes: 'single' or 'double'
	 * @type {String}
	 */
	attributeQuotes: 'double',

	/**
	 * Enable output formatting (indentation and line breaks)
	 * @type {Boolean}
	 */
	format: true,

	/**
	 * A list of tag names that should not get inner indentation
	 * @type {Set}
	 */
	formatSkip: ['html'],

	/**
	 * A list of tag names that should *always* get inner indentation.
	 * @type {Set}
	 */
	formatForce: ['body'],

	/**
	 * How many inline sibling elements should force line break for each tag.
	 * Set to 0 to output all inline elements without formatting.
	 * Set to 1 to output all inline elements with formatting (same as block-level).
	 * @type {Number}
	 */
	inlineBreak: 3,

	/**
	 * Produce compact notation of boolean attribues: attributes where name equals value.
	 * With this option enabled, output `<div contenteditable>` instead of
	 * `<div contenteditable="contenteditable">`
	 * @type {Boolean}
	 */
	compactBooleanAttributes: false,

	/**
	 * A set of boolean attributes
	 * @type {Set}
	 */
	booleanAttributes: ['contenteditable', 'seamless', 'async', 'autofocus',
		'autoplay', 'checked', 'controls', 'defer', 'disabled', 'formnovalidate',
		'hidden', 'ismap', 'loop', 'multiple', 'muted', 'novalidate', 'readonly',
		'required', 'reversed', 'selected', 'typemustmatch'],

	/**
	 * Style of self-closing tags:
	 * 'html'  – <br>
	 * 'xml'   – <br/>
	 * 'xhtml' – <br />
	 * @type {String}
	 */
	selfClosingStyle: 'html',

	/**
	 * A set of inline-level elements
	 * @type {Set}
	 */
	inlineElements: ['a', 'abbr', 'acronym', 'applet', 'b', 'basefont', 'bdo',
		'big', 'br', 'button', 'cite', 'code', 'del', 'dfn', 'em', 'font', 'i',
		'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'object', 'q',
		's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
		'textarea', 'tt', 'u', 'var']
};

/**
 * Creates output profile for given options (@see defaults)
 * @param {defaults} options
 */
var Profile = function Profile(options) {
        this.options = Object.assign({}, defaultOptions$1, options);
        this.quoteChar = this.options.attributeQuotes === 'single' ? '\'' : '"';
    };

/**
	 * Returns value of given option name
	 * @param {String} name
	 * @return {*}
	 */
Profile.prototype.get = function get (name) {
	return this.options[name];
};

    /**
     * Quote given string according to profile
     * @param {String} str String to quote
     * @return {String}
     */
    Profile.prototype.quote = function quote (str) {
        return ("" + (this.quoteChar) + (str != null ? str : '') + (this.quoteChar));
    };

    /**
     * Output given tag name accoding to options
     * @param {String} name
     * @return {String}
     */
    Profile.prototype.name = function name (name$1) {
        return strcase(name$1, this.options.tagCase);
    };

/**
	 * Outputs attribute name accoding to current settings
	 * @param {String} Attribute name
	 * @return {String}
	 */
    Profile.prototype.attribute = function attribute (attr) {
        return strcase(attr, this.options.attributeCase);
    };

    /**
     * Check if given attribute is boolean
     * @param {Attribute} attr
     * @return {Boolean}
     */
    Profile.prototype.isBooleanAttribute = function isBooleanAttribute (attr) {
        return attr.options.boolean
		|| this.get('booleanAttributes').indexOf((attr.name || '').toLowerCase()) !== -1;
    };

/**
	 * Returns a token for self-closing tag, depending on current options
	 * @return {String}
	 */
Profile.prototype.selfClose = function selfClose () {
	switch (this.options.selfClosingStyle) {
		case 'xhtml': return ' /';
		case 'xml':   return '/';
		default:      return '';
	}
};

/**
	 * Returns indent for given level
	 * @param {Number} level Indentation level
	 * @return {String}
	 */
Profile.prototype.indent = function indent (level) {
		var this$1 = this;

	level = level || 0;
	var output = '';
	while (level--) {
		output += this$1.options.indent;
	}

	return output;
};

/**
	 * Check if given tag name belongs to inline-level element
	 * @param {Node|String} node Parsed node or tag name
	 * @return {Boolean}
	 */
Profile.prototype.isInline = function isInline (node) {
        if (typeof node === 'string') {
            return this.get('inlineElements').indexOf(node.toLowerCase()) !== -1;
        }

        // inline node is a node either with inline-level name or text-only node
        return node.name != null ? this.isInline(node.name) : node.isTextOnly;
};

/**
	 * Outputs formatted field for given params
	 * @param {Number} index Field index
	 * @param {String} [placeholder] Field placeholder, can be empty
	 * @return {String}
	 */
Profile.prototype.field = function field (index, placeholder) {
	return this.options.field(index, placeholder);
};

function strcase(string, type) {
    if (type) {
        string = type === 'upper' ? string.toUpperCase() : string.toLowerCase();
    }
    return string;
}

var Snippet = function Snippet(key, value) {
    this.key = key;
    this.value = value;
};

var SnippetsStorage = function SnippetsStorage(data) {
    this._string = new Map();
    this._regexp = new Map();
    this._disabled = false;

    this.load(data);
};

var prototypeAccessors = { disabled: {} };

prototypeAccessors.disabled.get = function () {
    return this._disabled;
};

/**
 * Disables current store. A disabled store always returns `undefined`
 * on `get()` method
 */
SnippetsStorage.prototype.disable = function disable () {
    this._disabled = true;
};

/**
 * Enables current store.
 */
SnippetsStorage.prototype.enable = function enable () {
    this._disabled = false;
};

/**
 * Registers a new snippet item
 * @param {String|Regexp} key
 * @param {String|Function} value
 */
SnippetsStorage.prototype.set = function set (key, value) {
        var this$1 = this;

    if (typeof key === 'string') {
        key.split('|').forEach(function (k) { return this$1._string.set(k, new Snippet(k, value)); });
    } else if (key instanceof RegExp) {
        this._regexp.set(key, new Snippet(key, value));
    } else {
        throw new Error('Unknow snippet key: ' + key);
    }

    return this;
};

/**
 * Returns a snippet matching given key. It first tries to find snippet
 * exact match in a string key map, then tries to match one with regexp key
 * @param {String} key
 * @return {Snippet}
 */
SnippetsStorage.prototype.get = function get (key) {
        var this$1 = this;

    if (this.disabled) {
        return undefined;
    }

    if (this._string.has(key)) {
        return this._string.get(key);
    }

    var keys = Array.from(this._regexp.keys());
    for (var i = 0, il = keys.length; i < il; i++) {
        if (keys[i].test(key)) {
            return this$1._regexp.get(keys[i]);
        }
    }
};

/**
 * Batch load of snippets data
 * @param {Object|Map} data
 */
SnippetsStorage.prototype.load = function load (data) {
        var this$1 = this;

    this.reset();
    if (data instanceof Map) {
        data.forEach(function (value, key) { return this$1.set(key, value); });
    } else if (data && typeof data === 'object') {
        Object.keys(data).forEach(function (key) { return this$1.set(key, data[key]); });
    }
};

/**
 * Clears all stored snippets
 */
SnippetsStorage.prototype.reset = function reset () {
    this._string.clear();
    this._regexp.clear();
};

/**
 * Returns all available snippets from given store
 */
SnippetsStorage.prototype.values = function values () {
    if (this.disabled) {
        return [];
    }
        
    var string = Array.from(this._string.values());
    var regexp = Array.from(this._regexp.values());
    return string.concat(regexp);
};

Object.defineProperties( SnippetsStorage.prototype, prototypeAccessors );

/**
 * A snippets registry. Contains snippets, separated by store and sorted by
 * priority: a store with higher priority takes precedence when resolving snippet
 * for given key
 */
var SnippetsRegistry = function SnippetsRegistry(data) {
    var this$1 = this;

    this._registry = [];

    if (Array.isArray(data)) {
        data.forEach(function (snippets, level) { return this$1.add(level, snippets); });
    } else if (typeof data === 'object') {
        this.add(data);
    }
};

/**
 * Return store for given level
 * @param {Number} level
 * @return {SnippetsStorage}
 */
SnippetsRegistry.prototype.get = function get (level) {
        var this$1 = this;

    for (var i = 0; i < this._registry.length; i++) {
        var item = this$1._registry[i];
        if (item.level === level) {
            return item.store;
        }
    }
};

/**
 * Adds new store for given level
 * @param {Number} [level] Store level (priority). Store with higher level
 * takes precedence when resolving snippets
 * @param {Object} [snippets] A snippets data for new store
 * @return {SnipetsStorage}
 */
SnippetsRegistry.prototype.add = function add (level, snippets) {
    if (level != null && typeof level === 'object') {
        snippets = level;
        level = 0;
    }

    var store = new SnippetsStorage(snippets);

    // remove previous store from same level
    this.remove(level);

    this._registry.push({level: level, store: store});
    this._registry.sort(function (a, b) { return b.level - a.level; });

    return store;
};

/**
 * Remove registry with given level or store
 * @param {Number|SnippetsStorage} data Either level or snippets store
 */
SnippetsRegistry.prototype.remove = function remove (data) {
    this._registry = this._registry
    .filter(function (item) { return item.level !== data && item.store !== data; });
};

/**
 * Returns snippet from registry that matches given name
 * @param {String} name
 * @return {Snippet}
 */
SnippetsRegistry.prototype.resolve = function resolve (name) {
        var this$1 = this;

    for (var i = 0; i < this._registry.length; i++) {
        var snippet = this$1._registry[i].store.get(name);
        if (snippet) {
            return snippet;
        }
    }
};

/**
 * Returns all available snippets from current registry. Snippets with the
 * same key are resolved by their storage priority.
 * @param {Object} options
 * @param {Object} options.type Return snippets only of given type: 'string'
 * or 'regexp'. Returns all snippets if not defined
 * @return {Array}
 */
SnippetsRegistry.prototype.all = function all (options) {
    options = options || {};
    var result = new Map();

    var fillResult = function (snippet) {
        var type = snippet.key instanceof RegExp ? 'regexp' : 'string';
        if ((!options.type || options.type === type) && !result.has(snippet.key)) {
            result.set(snippet.key, snippet);
        }
    };

    this._registry.forEach(function (item) {
        item.store.values().forEach(fillResult);
    });

    return Array.from(result.values());
};

/**
 * Removes all stores from registry
 */
SnippetsRegistry.prototype.clear = function clear () {
    this._registry.length = 0;
};

/**
 * Attribute descriptor of parsed abbreviation node
 * @param {String} name Attribute name
 * @param {String} value Attribute value
 * @param {Object} options Additional custom attribute options
 * @param {Boolean} options.boolean Attribute is boolean (e.g. name equals value)
 * @param {Boolean} options.implied Attribute is implied (e.g. must be outputted
 * only if contains non-null value)
 */
var Attribute = function Attribute(name, value, options) {
	this.name = name;
	this.value = value != null ? value : null;
	this.options = options || {};
};

/**
	 * Create a copy of current attribute
	 * @return {Attribute}
	 */
Attribute.prototype.clone = function clone () {
	return new Attribute(this.name, this.value, Object.assign({}, this.options));
};

/**
	 * A string representation of current node
	 */
Attribute.prototype.valueOf = function valueOf () {
	return ((this.name) + "=\"" + (this.value) + "\"");
};

/**
 * A parsed abbreviation AST node. Nodes build up an abbreviation AST tree
 */
var Node = function Node(name, attributes) {
	var this$1 = this;

	// own properties
	this.name = name || null;
	this.value = null;
	this.repeat = null;
	this.selfClosing = false;

	this.children = [];

	/** @type {Node} Pointer to parent node */
	this.parent = null;

	/** @type {Node} Pointer to next sibling */
	this.next = null;

	/** @type {Node} Pointer to previous sibling */
	this.previous = null;

	this._attributes = [];

	if (Array.isArray(attributes)) {
		attributes.forEach(function (attr) { return this$1.setAttribute(attr); });
	}
};

var prototypeAccessors$1 = { attributes: {},attributesMap: {},isGroup: {},isTextOnly: {},firstChild: {},lastChild: {},childIndex: {},nextSibling: {},previousSibling: {},classList: {} };

/**
	 * Array of current node attributes
	 * @return {Attribute[]} Array of attributes
	 */
prototypeAccessors$1.attributes.get = function () {
	return this._attributes;
};

/**
	 * A shorthand to retreive node attributes as map
	 * @return {Object}
	 */
prototypeAccessors$1.attributesMap.get = function () {
	return this.attributes.reduce(function (out, attr) {
		out[attr.name] = attr.options.boolean ? attr.name : attr.value;
		return out;
	}, {});
};

/**
	 * Check if current node is a grouping one, e.g. has no actual representation
	 * and is used for grouping subsequent nodes only
	 * @return {Boolean}
	 */
prototypeAccessors$1.isGroup.get = function () {
	return !this.name && !this.value && !this._attributes.length;
};

/**
	 * Check if given node is a text-only node, e.g. contains only value
	 * @return {Boolean}
	 */
prototypeAccessors$1.isTextOnly.get = function () {
	return !this.name && !!this.value && !this._attributes.length;
};

/**
	 * Returns first child node
	 * @return {Node}
	 */
prototypeAccessors$1.firstChild.get = function () {
	return this.children[0];
};

/**
	 * Returns last child of current node
	 * @return {Node}
	 */
prototypeAccessors$1.lastChild.get = function () {
	return this.children[this.children.length - 1];
};

/**
	 * Return index of current node in its parent child list
	 * @return {Number} Returns -1 if current node is a root one
	 */
prototypeAccessors$1.childIndex.get = function () {
	return this.parent ? this.parent.children.indexOf(this) : -1;
};

/**
	 * Returns next sibling of current node
	 * @return {Node}
	 */
prototypeAccessors$1.nextSibling.get = function () {
	return this.next;
};

/**
	 * Returns previous sibling of current node
	 * @return {Node}
	 */
prototypeAccessors$1.previousSibling.get = function () {
	return this.previous;
};

/**
	 * Returns array of unique class names in current node
	 * @return {String[]}
	 */
prototypeAccessors$1.classList.get = function () {
	var attr = this.getAttribute('class');
	return attr && attr.value
		? attr.value.split(/\s+/g).filter(uniqueClass)
		: [];
};

/**
	 * Convenient alias to create a new node instance
	 * @param {String} [name] Node name
	 * @param {Object} [attributes] Attributes hash
	 * @return {Node}
	 */
Node.prototype.create = function create (name, attributes) {
	return new Node(name, attributes);
};

/**
	 * Sets given attribute for current node
	 * @param {String|Object|Attribute} name Attribute name or attribute object
	 * @param {String} [value] Attribute value
	 */
Node.prototype.setAttribute = function setAttribute (name, value) {
	var attr = createAttribute(name, value);
	var curAttr = this.getAttribute(name);
	if (curAttr) {
		this.replaceAttribute(curAttr, attr);
	} else {
		this._attributes.push(attr);
	}
};

/**
	 * Check if attribute with given name exists in node
	 * @param  {String} name
	 * @return {Boolean}
	 */
Node.prototype.hasAttribute = function hasAttribute (name) {
	return !!this.getAttribute(name);
};

/**
	 * Returns attribute object by given name
	 * @param  {String} name
	 * @return {Attribute}
	 */
Node.prototype.getAttribute = function getAttribute (name) {
		var this$1 = this;

	if (typeof name === 'object') {
		name = name.name;
	}

	for (var i = 0; i < this._attributes.length; i++) {
		var attr = this$1._attributes[i];
		if (attr.name === name) {
			return attr;
		}
	}
};

/**
	 * Replaces attribute with new instance
	 * @param {String|Attribute} curAttribute Current attribute name or instance
	 * to replace
	 * @param {String|Object|Attribute} newName New attribute name or attribute object
	 * @param {String} [newValue] New attribute value
	 */
Node.prototype.replaceAttribute = function replaceAttribute (curAttribute, newName, newValue) {
	if (typeof curAttribute === 'string') {
		curAttribute = this.getAttribute(curAttribute);
	}

	var ix = this._attributes.indexOf(curAttribute);
	if (ix !== -1) {
		this._attributes.splice(ix, 1, createAttribute(newName, newValue));
	}
};

/**
	 * Removes attribute with given name
	 * @param  {String|Attribute} attr Atrtibute name or instance
	 */
Node.prototype.removeAttribute = function removeAttribute (attr) {
	if (typeof attr === 'string') {
		attr = this.getAttribute(attr);
	}

	var ix = this._attributes.indexOf(attr);
	if (ix !== -1) {
		this._attributes.splice(ix, 1);
	}
};

/**
	 * Removes all attributes from current node
	 */
Node.prototype.clearAttributes = function clearAttributes () {
	this._attributes.length = 0;
};

/**
	 * Adds given class name to class attribute
	 * @param {String} token Class name token
	 */
Node.prototype.addClass = function addClass (token) {
	token = normalize(token);

	if (!this.hasAttribute('class')) {
		this.setAttribute('class', token);
	} else if (token && !this.hasClass(token)) {
		this.setAttribute('class', this.classList.concat(token).join(' '));
	}
};

/**
	 * Check if current node contains given class name
	 * @param {String} token Class name token
	 * @return {Boolean}
	 */
Node.prototype.hasClass = function hasClass (token) {
	return this.classList.indexOf(normalize(token)) !== -1;
};

/**
	 * Removes given class name from class attribute
	 * @param {String} token Class name token
	 */
Node.prototype.removeClass = function removeClass (token) {
	token = normalize(token);
	if (this.hasClass(token)) {
		this.setAttribute('class', this.classList.filter(function (name) { return name !== token; }).join(' '));
	}
};

/**
	 * Appends child to current node
	 * @param {Node} node
	 */
Node.prototype.appendChild = function appendChild (node) {
	this.insertAt(node, this.children.length);
};

/**
	 * Inserts given `newNode` before `refNode` child node
	 * @param {Node} newNode
	 * @param {Node} refNode
	 */
Node.prototype.insertBefore = function insertBefore (newNode, refNode) {
	this.insertAt(newNode, this.children.indexOf(refNode));
};

/**
	 * Insert given `node` at `pos` position of child list
	 * @param {Node} node
	 * @param {Number} pos
	 */
Node.prototype.insertAt = function insertAt (node, pos) {
	if (pos < 0 || pos > this.children.length) {
		throw new Error('Unable to insert node: position is out of child list range');
	}

	var prev = this.children[pos - 1];
	var next = this.children[pos];

	node.remove();
	node.parent = this;
	this.children.splice(pos, 0, node);

	if (prev) {
		node.previous = prev;
		prev.next = node;
	}

	if (next) {
		node.next = next;
		next.previous = node;
	}
};

/**
	 * Removes given child from current node
	 * @param {Node} node
	 */
Node.prototype.removeChild = function removeChild (node) {
	var ix = this.children.indexOf(node);
	if (ix !== -1) {
		this.children.splice(ix, 1);
		if (node.previous) {
			node.previous.next = node.next;
		}

		if (node.next) {
			node.next.previous = node.previous;
		}

		node.parent = node.next = node.previous = null;
	}
};

/**
	 * Removes current node from its parent
	 */
Node.prototype.remove = function remove () {
	if (this.parent) {
		this.parent.removeChild(this);
	}
};

/**
	 * Creates a detached copy of current node
	 * @param {Boolean} deep Clone node contents as well
	 * @return {Node}
	 */
Node.prototype.clone = function clone (deep) {
	var clone = new Node(this.name);
	clone.value = this.value;
	clone.selfClosing = this.selfClosing;
	if (this.repeat) {
		clone.repeat = Object.assign({}, this.repeat);
	}

	this._attributes.forEach(function (attr) { return clone.setAttribute(attr.clone()); });

	if (deep) {
		this.children.forEach(function (child) { return clone.appendChild(child.clone(true)); });
	}

	return clone;
};

/**
	 * Walks on each descendant node and invokes given `fn` function on it.
	 * The function receives two arguments: the node itself and its depth level
	 * from current node. If function returns `false`, it stops walking
	 * @param {Function} fn
	 */
Node.prototype.walk = function walk (fn, _level) {
	_level = _level || 0;
	var ctx = this.firstChild;

	while (ctx) {
		// in case if context node will be detached during `fn` call
		var next = ctx.next;

		if (fn(ctx, _level) === false || ctx.walk(fn, _level + 1) === false) {
			return false;
		}

		ctx = next;
	}
};

/**
	 * A helper method for transformation chaining: runs given `fn` function on
	 * current node and returns the same node
	 */
Node.prototype.use = function use (fn) {
		var arguments$1 = arguments;

	var args = [this];
	for (var i = 1; i < arguments.length; i++) {
		args.push(arguments$1[i]);
	}

	fn.apply(null, args);
	return this;
};

Node.prototype.toString = function toString () {
		var this$1 = this;

	var attrs = this.attributes.map(function (attr) {
		attr = this$1.getAttribute(attr.name);
		var opt = attr.options;
		var out = "" + (opt && opt.implied ? '!' : '') + (attr.name || '');
		if (opt && opt.boolean) {
			out += '.';
		} else if (attr.value != null) {
			out += "=\"" + (attr.value) + "\"";
		}
		return out;
	});

	var out = "" + (this.name || '');
	if (attrs.length) {
		out += "[" + (attrs.join(' ')) + "]";
	}

	if (this.value != null) {
		out += "{" + (this.value) + "}";
	}

	if (this.selfClosing) {
		out += '/';
	}

	if (this.repeat) {
		out += "*" + (this.repeat.count ? this.repeat.count : '');
		if (this.repeat.value != null) {
			out += "@" + (this.repeat.value);
		}
	}

	return out;
};

Object.defineProperties( Node.prototype, prototypeAccessors$1 );

/**
 * Attribute factory
 * @param  {String|Attribute|Object} name  Attribute name or attribute descriptor
 * @param  {*} value Attribute value
 * @return {Attribute}
 */
function createAttribute(name, value) {
	if (name instanceof Attribute) {
		return name;
	}

	if (typeof name === 'string') {
		return new Attribute(name, value);
	}

	if (name && typeof name === 'object') {
		return new Attribute(name.name, name.value, name.options);
	}
}

/**
 * @param  {String} str
 * @return {String}
 */
function normalize(str) {
	return String(str).trim();
}

function uniqueClass(item, i, arr) {
	return item && arr.indexOf(item) === i;
}

/**
 * A streaming, character code-based string reader
 */
var StreamReader$1 = function StreamReader(string, start, end) {
	if (end == null && typeof string === 'string') {
		end = string.length;
	}

	this.string = string;
	this.pos = this.start = start || 0;
	this.end = end;
};

/**
	 * Returns true only if the stream is at the end of the file.
	 * @returns {Boolean}
	 */
StreamReader$1.prototype.eof = function eof () {
	return this.pos >= this.end;
};

/**
	 * Creates a new stream instance which is limited to given `start` and `end`
	 * range. E.g. its `eof()` method will look at `end` property, not actual
	 * stream end
	 * @param  {Point} start
	 * @param  {Point} end
	 * @return {StreamReader}
	 */
StreamReader$1.prototype.limit = function limit (start, end) {
	return new this.constructor(this.string, start, end);
};

/**
	 * Returns the next character code in the stream without advancing it.
	 * Will return NaN at the end of the file.
	 * @returns {Number}
	 */
StreamReader$1.prototype.peek = function peek () {
	return this.string.charCodeAt(this.pos);
};

/**
	 * Returns the next character in the stream and advances it.
	 * Also returns <code>undefined</code> when no more characters are available.
	 * @returns {Number}
	 */
StreamReader$1.prototype.next = function next () {
	if (this.pos < this.string.length) {
		return this.string.charCodeAt(this.pos++);
	}
};

/**
	 * `match` can be a character code or a function that takes a character code
	 * and returns a boolean. If the next character in the stream 'matches'
	 * the given argument, it is consumed and returned.
	 * Otherwise, `false` is returned.
	 * @param {Number|Function} match
	 * @returns {Boolean}
	 */
StreamReader$1.prototype.eat = function eat (match) {
	var ch = this.peek();
	var ok = typeof match === 'function' ? match(ch) : ch === match;

	if (ok) {
		this.next();
	}

	return ok;
};

/**
	 * Repeatedly calls <code>eat</code> with the given argument, until it
	 * fails. Returns <code>true</code> if any characters were eaten.
	 * @param {Object} match
	 * @returns {Boolean}
	 */
StreamReader$1.prototype.eatWhile = function eatWhile (match) {
	var start = this.pos;
	while (!this.eof() && this.eat(match)) {}
	return this.pos !== start;
};

/**
	 * Backs up the stream n characters. Backing it up further than the
	 * start of the current token will cause things to break, so be careful.
	 * @param {Number} n
	 */
StreamReader$1.prototype.backUp = function backUp (n) {
	this.pos -= (n || 1);
};

/**
	 * Get the string between the start of the current token and the
	 * current stream position.
	 * @returns {String}
	 */
StreamReader$1.prototype.current = function current () {
	return this.substring(this.start, this.pos);
};

/**
	 * Returns substring for given range
	 * @param  {Number} start
	 * @param  {Number} [end]
	 * @return {String}
	 */
StreamReader$1.prototype.substring = function substring (start, end) {
	return this.string.slice(start, end);
};

/**
	 * Creates error object with current stream state
	 * @param {String} message
	 * @return {Error}
	 */
StreamReader$1.prototype.error = function error (message) {
	var err = new Error((message + " at char " + (this.pos + 1)));
	err.originalMessage = message;
	err.pos = this.pos;
	err.string = this.string;
	return err;
};

/**
 * Methods for consuming quoted values
 */

var SINGLE_QUOTE$1 = 39; // '
var DOUBLE_QUOTE$1 = 34; // "

var defaultOptions$2 = {
	escape: 92,   // \ character
	throws: false
};

/**
 * Consumes 'single' or "double"-quoted string from given string, if possible
 * @param  {StreamReader} stream
 * @param  {Number}  options.escape A character code of quote-escape symbol
 * @param  {Boolean} options.throws Throw error if quotes string can’t be properly consumed
 * @return {Boolean} `true` if quoted string was consumed. The contents
 *                   of quoted string will be availabe as `stream.current()`
 */
var eatQuoted$1 = function(stream, options) {
	options = options ? Object.assign({}, defaultOptions$2, options) : defaultOptions$2;
	var start = stream.pos;
	var quote = stream.peek();

	if (stream.eat(isQuote$1)) {
		while (!stream.eof()) {
			switch (stream.next()) {
				case quote:
					stream.start = start;
					return true;

				case options.escape:
					stream.next();
					break;
			}
		}

		// If we’re here then stream wasn’t properly consumed.
		// Revert stream and decide what to do
		stream.pos = start;

		if (options.throws) {
			throw stream.error('Unable to consume quoted string');
		}
	}

	return false;
};

function isQuote$1(code) {
	return code === SINGLE_QUOTE$1 || code === DOUBLE_QUOTE$1;
}

/**
 * Check if given code is a number
 * @param  {Number}  code
 * @return {Boolean}
 */
function isNumber$1(code) {
	return code > 47 && code < 58;
}

/**
 * Check if given character code is alpha code (letter through A to Z)
 * @param  {Number}  code
 * @param  {Number}  [from]
 * @param  {Number}  [to]
 * @return {Boolean}
 */
function isAlpha$1(code, from, to) {
	from = from || 65; // A
	to   = to   || 90; // Z
	code &= ~32; // quick hack to convert any char code to uppercase char code

	return code >= from && code <= to;
}

/**
 * Check if given character code is alpha-numeric (letter through A to Z or number)
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAlphaNumeric(code) {
	return isNumber$1(code) || isAlpha$1(code);
}

function isWhiteSpace$1(code) {
	return code === 32   /* space */
		|| code === 9    /* tab */
		|| code === 160; /* non-breaking space */
}

/**
 * Check if given character code is a space
 * @param  {Number}  code
 * @return {Boolean}
 */
function isSpace(code) {
	return isWhiteSpace$1(code)
		|| code === 10  /* LF */
		|| code === 13; /* CR */
}

var defaultOptions$1$1 = {
	escape: 92,   // \ character
	throws: false
};

/**
 * Eats paired characters substring, for example `(foo)` or `[bar]`
 * @param  {StreamReader} stream
 * @param  {Number} open      Character code of pair openinig
 * @param  {Number} close     Character code of pair closing
 * @param  {Object} [options]
 * @return {Boolean}       Returns `true` if chacarter pair was successfully
 *                         consumed, it’s content will be available as `stream.current()`
 */
function eatPair(stream, open, close, options) {
	options = options ? Object.assign({}, defaultOptions$1$1, options) : defaultOptions$1$1;
	var start = stream.pos;

	if (stream.eat(open)) {
		var stack = 1, ch;

		while (!stream.eof()) {
			if (eatQuoted$1(stream, options)) {
				continue;
			}

			ch = stream.next();
			if (ch === open) {
				stack++;
			} else if (ch === close) {
				stack--;
				if (!stack) {
					stream.start = start;
					return true;
				}
			} else if (ch === options.escape) {
				stream.next();
			}
		}

		// If we’re here then paired character can’t be consumed
		stream.pos = start;

		if (options.throws) {
			throw stream.error(("Unable to find matching pair for " + (String.fromCharCode(open))));
		}
	}

	return false;
}

var ASTERISK = 42; // *

/**
 * Consumes node repeat token from current stream position and returns its
 * parsed value
 * @param  {StringReader} stream
 * @return {Object}
 */
var consumeRepeat = function(stream) {
	if (stream.eat(ASTERISK)) {
		stream.start = stream.pos;

		// XXX think about extending repeat syntax with through numbering
		return { count: stream.eatWhile(isNumber$1) ? +stream.current() : null };
	}
};

var opt = { throws: true };

/**
 * Consumes quoted literal from current stream position and returns it’s inner,
 * unquoted, value
 * @param  {StringReader} stream
 * @return {String} Returns `null` if unable to consume quoted value from current
 * position
 */
var consumeQuoted = function(stream) {
	if (eatQuoted$1(stream, opt)) {
		return stream.current().slice(1, -1);
	}
};

var LCURLY = 123; // {
var RCURLY = 125; // }

var opt$1 = { throws: true };

/**
 * Consumes text node, e.g. contents of `{...}` and returns its inner value
 * @param  {StringReader} stream
 * @return {String} Consumed text content or `null` otherwise
 */
var consumeTextNode = function(stream) {
	return eatPair(stream, LCURLY, RCURLY, opt$1)
		? stream.current().slice(1, -1)
		: null;
};

var EXCL       = 33; // .
var DOT$1        = 46; // .
var EQUALS$1     = 61; // =
var ATTR_OPEN  = 91; // [
var ATTR_CLOSE = 93; // ]

var reAttributeName = /^\!?[\w\-:\$@]+\.?$/;

/**
 * Consumes attributes defined in square braces from given stream.
 * Example:
 * [attr col=3 title="Quoted string" selected. support={react}]
 * @param {StringReader} stream
 * @returns {Array} Array of consumed attributes
 */
var consumeAttributes = function(stream) {
	if (!stream.eat(ATTR_OPEN)) {
		return null;
	}

	var result = [];
	var token, attr;

	while (!stream.eof()) {
		stream.eatWhile(isWhiteSpace$1);

		if (stream.eat(ATTR_CLOSE)) {
			return result; // End of attribute set
		} else if ((token = consumeQuoted(stream)) != null) {
			// Consumed quoted value: anonymous attribute
			result.push({
				name: null,
				value: token
			});
		} else if (eatUnquoted(stream)) {
			// Consumed next word: could be either attribute name or unquoted default value
			token = stream.current();
			if (!reAttributeName.test(token)) {
				// anonymous attribute
				result.push({ name: null, value: token });
			} else {
				// Looks like a regular attribute
				attr = parseAttributeName(token);
				result.push(attr);

				if (stream.eat(EQUALS$1)) {
					// Explicitly defined value. Could be a word, a quoted string
					// or React-like expression
					if ((token = consumeQuoted(stream)) != null) {
						attr.value = token;
					} else if ((token = consumeTextNode(stream)) != null) {
						attr.value = token;
						attr.options = {
							before: '{',
							after: '}'
						};
					} else if (eatUnquoted(stream)) {
						attr.value = stream.current();
					}
				}
			}
		} else {
			throw stream.error('Expected attribute name');
		}
	}

	throw stream.error('Expected closing "]" brace');
};

function parseAttributeName(name) {
	var options = {};

	// If a first character in attribute name is `!` — it’s an implied
	// default attribute
	if (name.charCodeAt(0) === EXCL) {
		name = name.slice(1);
		options.implied = true;
	}

	// Check for last character: if it’s a `.`, user wants boolean attribute
	if (name.charCodeAt(name.length - 1) === DOT$1) {
		name = name.slice(0, name.length - 1);
		options.boolean = true;
	}

	var attr = { name: name };
	if (Object.keys(options).length) {
		attr.options = options;
	}

	return attr;
}

/**
 * Eats token that can be an unquoted value from given stream
 * @param  {StreamReader} stream
 * @return {Boolean}
 */
function eatUnquoted(stream) {
	var start = stream.pos;
	if (stream.eatWhile(isUnquoted)) {
		stream.start = start;
		return true;
	}
}

function isUnquoted(code) {
	return !isSpace(code) && !isQuote$1(code)
		&& code !== ATTR_OPEN && code !== ATTR_CLOSE && code !== EQUALS$1;
}

var HASH    = 35; // #
var DOT     = 46; // .
var SLASH$1   = 47; // /

/**
 * Consumes a single element node from current abbreviation stream
 * @param  {StringReader} stream
 * @return {Node}
 */
var consumeElement = function(stream) {
	// consume element name, if provided
	var start = stream.pos;
	var node = new Node(eatName(stream));
	var next;

	while (!stream.eof()) {
		if (stream.eat(DOT)) {
			node.addClass(eatName(stream));
		} else if (stream.eat(HASH)) {
			node.setAttribute('id', eatName(stream));
		} else if (stream.eat(SLASH$1)) {
			// A self-closing indicator must be at the end of non-grouping node
			if (node.isGroup) {
				stream.backUp(1);
				throw stream.error('Unexpected self-closing indicator');
			}
			node.selfClosing = true;
			if (next = consumeRepeat(stream)) {
				node.repeat = next;
			}
			break;
		} else if (next = consumeAttributes(stream)) {
			for (var i = 0, il = next.length; i < il; i++) {
				node.setAttribute(next[i]);
			}
		} else if ((next = consumeTextNode(stream)) !== null) {
			node.value = next;
		} else if (next = consumeRepeat(stream)) {
			node.repeat = next;
		} else {
			break;
		}
	}

	if (start === stream.pos) {
		throw stream.error(("Unable to consume abbreviation node, unexpected " + (stream.peek())));
	}

	return node;
};

function eatName(stream) {
	stream.start = stream.pos;
	stream.eatWhile(isName);
	return stream.current();
}

function isName(code) {
	return isAlphaNumeric(code)
		|| code === 45 /* - */
		|| code === 58 /* : */
		|| code === 36 /* $ */
		|| code === 64 /* @ */
		|| code === 33 /* ! */
		|| code === 95 /* _ */
		|| code === 37 /* % */;
}

var GROUP_START = 40; // (
var GROUP_END   = 41; // )
var OP_SIBLING  = 43; // +
var OP_CHILD    = 62; // >
var OP_CLIMB    = 94; // ^

/**
 * Parses given string into a node tree
 * @param  {String} str Abbreviation to parse
 * @return {Node}
 */
function parse(str) {
	var stream = new StreamReader$1(str.trim());
	var root = new Node();
	var ctx = root, groupStack = [], ch;

	while (!stream.eof()) {
		ch = stream.peek();

		if (ch === GROUP_START) { // start of group
			// The grouping node should be detached to properly handle
			// out-of-bounds `^` operator. Node will be attached right on group end
			var node = new Node();
			var groupCtx = groupStack.length ? last(groupStack)[0] : ctx;
			groupStack.push([node, groupCtx, stream.pos]);
			ctx = node;
			stream.next();
			continue;
		} else if (ch === GROUP_END) { // end of group
			var lastGroup = groupStack.pop();
			if (!lastGroup) {
				throw stream.error('Unexpected ")" group end');
			}

			var node$1 = lastGroup[0];
			ctx = lastGroup[1];
			stream.next();

			// a group can have a repeater
			if (node$1.repeat = consumeRepeat(stream)) {
				ctx.appendChild(node$1);
			} else {
				// move all children of group into parent node
				while (node$1.firstChild) {
					ctx.appendChild(node$1.firstChild);
				}
				// for convenience, groups can be joined with optional `+` operator
				stream.eat(OP_SIBLING);
			}

			continue;
		}

		var node$2 = consumeElement(stream);
		ctx.appendChild(node$2);

		if (stream.eof()) {
			break;
		}

		switch (stream.peek()) {
			case OP_SIBLING:
				stream.next();
				continue;

			case OP_CHILD:
				stream.next();
				ctx = node$2;
				continue;

			case OP_CLIMB:
				// it’s perfectly valid to have multiple `^` operators
				while (stream.eat(OP_CLIMB)) {
					ctx = ctx.parent || ctx;
				}
				continue;
		}
	}

	if (groupStack.length) {
		stream.pos = groupStack.pop()[2];
		throw stream.error('Expected group close');
	}

	return root;
}

function last(arr) {
	return arr[arr.length - 1];
}

/**
 * Parses given abbreviation and un-rolls it into a full tree: recursively
 * replaces repeated elements with actual nodes
 * @param  {String} abbr
 * @return {Node}
 */
var index = function(abbr) {
	var tree = parse(abbr);
	tree.walk(unroll);
	return tree;
};

function unroll(node) {
	if (!node.repeat || !node.repeat.count) {
		return;
	}

	for (var i = 1; i < node.repeat.count; i++) {
		var clone = node.clone(true);
		clone.repeat.value = i;
		clone.walk(unroll);
		node.parent.insertBefore(clone, node);
	}

	node.repeat.value = node.repeat.count;
}

/**
 * For every node in given `tree`, finds matching snippet from `registry` and
 * resolves it into a parsed abbreviation. Resolved node is then updated or
 * replaced with matched abbreviation tree.
 *
 * A HTML registry basically contains aliases to another Emmet abbreviations,
 * e.g. a predefined set of name, attribues and so on, possibly a complex
 * abbreviation with multiple elements. So we have to get snippet, parse it
 * and recursively resolve it.
 *
 * @param  {Node} tree                 Parsed Emmet abbreviation
 * @param  {SnippetsRegistry} registry Registry with all available snippets
 * @return {Node} Updated tree
 */

var index$1 = function(tree, registry) {
    tree.walk(function (node) { return resolveNode(node, registry); });
    return tree;
};

function resolveNode(node, registry) {
    var stack = new Set();
    var resolve = function (node) {
        var snippet = registry.resolve(node.name);
        // A snippet in stack means circular reference.
        // It can be either a user error or a perfectly valid snippet like
        // "img": "img[src alt]/", e.g. an element with predefined shape.
        // In any case, simply stop parsing and keep element as is
        if (!snippet || stack.has(snippet)) {
            return;
        }

        // In case if matched snippet is a function, pass control into it
        if (typeof snippet.value === 'function') {
            return snippet.value(node, registry, resolve);
        }

        var tree = index(snippet.value);

        stack.add(snippet);
        tree.walk(resolve);
        stack.delete(snippet);

        // move current node contents into new tree
        var childTarget = findDeepestNode(tree);
        merge(childTarget, node);

        while (tree.firstChild) {
            node.parent.insertBefore(tree.firstChild, node);
        }

        childTarget.parent.insertBefore(node, childTarget);
        childTarget.remove();
    };

    resolve(node);
}

/**
 * Adds data from first node into second node and returns it
 * @param  {Node} from
 * @param  {Node} to
 * @return {Node}
 */
function merge(from, to) {
    to.name = from.name;

    if (from.selfClosing) {
        to.selfClosing = true;
    }

    if (from.value != null) {
        to.value = from.value;
    }

    if (from.repeat) {
        to.repeat = Object.assign({}, from.repeat);
    }

    return mergeAttributes(from, to);
}

/**
 * Transfer attributes from first element to second one and preserve first
 * element’s attributes order
 * @param  {Node} from
 * @param  {Node} to
 * @return {Node}
 */
function mergeAttributes(from, to) {
    mergeClassNames(from, to);

    // It’s important to preserve attributes order: ones in `from` have higher
    // pripority than in `to`. Collect attributes in map in order they should
    // appear in `to`
    var attrMap = new Map();

    var attrs = from.attributes;
    for (var i = 0; i < attrs.length; i++) {
        attrMap.set(attrs[i].name, attrs[i].clone());
    }

    attrs = to.attributes.slice();
    for (var i$1 = 0, attr = (void 0), a = (void 0); i$1 < attrs.length; i$1++) {
        attr = attrs[i$1];
        if (attrMap.has(attr.name)) {
            a = attrMap.get(attr.name);
            a.value = attr.value;

            // If user explicitly wrote attribute in abbreviation, it’s no longer
            // implied and should be outputted even if value is empty
            if (a.options.implied) {
                a.options.implied = false;
            }
        } else {
            attrMap.set(attr.name, attr);
        }

        to.removeAttribute(attr);
    }

    var newAttrs = Array.from(attrMap.values());
    for (var i$2 = 0; i$2 < newAttrs.length; i$2++) {
        to.setAttribute(newAttrs[i$2]);
    }

    return to;
}

/**
 * Adds class names from first node to second one
 * @param  {Node} from
 * @param  {Node} to
 * @return {Node}
 */
function mergeClassNames(from, to) {
    var classNames = from.classList;
    for (var i = 0; i < classNames.length; i++) {
        to.addClass(classNames[i]);
    }

    return to;
}

/**
 * Finds node which is the deepest for in current node or node iteself.
 * @param  {Node} node
 * @return {Node}
 */
function findDeepestNode(node) {
	while (node.children.length) {
		node = node.children[node.children.length - 1];
	}

	return node;
}

var inlineElements = new Set('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'.split(','));
var elementMap = {
    p: 'span',
    ul: 'li',
    ol: 'li',
    table: 'tr',
    tr: 'td',
    tbody: 'tr',
    thead: 'tr',
    tfoot: 'tr',
    colgroup: 'col',
    select: 'option',
    optgroup: 'option',
    audio: 'source',
    video: 'source',
    object: 'param',
    map: 'area'
};

/**
 * Returns best child node name for given parent node name
 * @param  {String} parentName Name of parent node
 * @return {String}
 */
function resolveImplicitName(parentName) {
    parentName = (parentName || '').toLowerCase();
    return elementMap[parentName]
        || (inlineElements.has(parentName) ? 'span' : 'div');
}

/**
 * Adds missing tag names for given tree depending on node’s parent name
 */
var implicitTags = function(tree) {
    tree.walk(function (node) {
        // resolve only nameless nodes without content
        if (node.name == null && node.attributes.length) {
            node.name = resolveImplicitName(node.parent.name);
        }
    });
    return tree;
};

/**
 * Locates all occurances of given `token` which are not escaped (e.g. are not
 * preceded with `\`) given in `str`
 * @param  {String} str
 * @return {Array}  Array of token ranges
 */
function findUnescapedTokens(str, token) {
    var result = new Set();
    var tlen = token.length;

    // 1. Find all occurances of tokens
    var pos = 0;
    while ((pos = str.indexOf(token, pos)) !== -1) {
        result.add(pos);
        pos += tlen;
    }

    if (result.size) {
        // 2. Remove ones that escaped
        var pos$1 = 0;
        var len = str.length;

        while (pos$1 < len) {
            if (str[pos$1++] === '\\') {
                result.delete(pos$1++);
            }
        }
    }

    return Array.from(result).map(function (ix) { return range(ix, tlen); });
}

/**
 * Replaces `ranges`, generated by `range()` function, with given `value` in `str`
 * @param  {String} str    Where to replace ranges
 * @param  {Array} ranges Ranes, created by `range()` function
 * @param  {String|Function} value  Replacement value. If it’s a function, it
 * will take a range value as argument and should return a new string
 * @return {String}
 */
function replaceRanges(str, ranges, value) {
	// should walk from the end of array to keep ranges valid after replacement
	for (var i = ranges.length - 1; i >= 0; i--) {
		var r = ranges[i];

		str = str.substring(0, r[0])
			+ (typeof value === 'function' ? value(str.substr(r[0], r[1])) : value)
			+ str.substring(r[0] + r[1]);
	}

	return str;
}

function range(start, length) {
    return [start, length];
}

var numberingToken = '$';

/**
 * Numbering of expanded abbreviation: finds all nodes with `$` in value
 * or attributes and replaces its occurances with repeater value
 */
var applyNumbering = function(tree) {
    tree.walk(applyNumbering$1);
    return tree;
};

/**
 * Applies numbering for given node: replaces occurances of numbering token
 * in node’s name, content and attributes
 * @param  {Node} node
 * @return {Node}
 */
function applyNumbering$1(node) {
    var repeater = findRepeater(node);

    if (repeater && repeater.value != null) {
        // NB replace numbering in nodes with explicit repeater only:
        // it solves issues with abbreviations like `xsl:if[test=$foo]` where
        // `$foo` is preferred output
        var value = repeater.value;

        node.name = replaceNumbering(node.name, value);
        node.value = replaceNumbering(node.value, value);
        node.attributes.forEach(function (attr) {
            var copy = node.getAttribute(attr.name).clone();
            copy.name = replaceNumbering(attr.name, value);
            copy.value = replaceNumbering(attr.value, value);
            node.replaceAttribute(attr.name, copy);
        });
    }

    return node;
}

/**
 * Returns repeater object for given node
 * @param  {Node} node
 * @return {Object}
 */
function findRepeater(node) {
    while (node) {
        if (node.repeat) {
            return node.repeat;
        }

        node = node.parent;
    }
}

/**
 * Replaces numbering in given string
 * @param  {String} str
 * @param  {Number} value
 * @return {String}
 */
function replaceNumbering(str, value) {
    // replace numbering in strings only: skip explicit wrappers that could
    // contain unescaped numbering tokens
    if (typeof str === 'string') {
        var ranges = getNumberingRanges(str);
        return replaceNumberingRanges(str, ranges, value);
    }

    return str;
}

/**
 * Returns numbering ranges, e.g. ranges of `$` occurances, in given string.
 * Multiple adjacent ranges are combined
 * @param  {String} str
 * @return {Array}
 */
function getNumberingRanges(str) {
    return findUnescapedTokens(str || '', numberingToken)
    .reduce(function (out, range$$1) {
        // skip ranges that actually belongs to output placeholder or tabstops
        if (!/[#{]/.test(str[range$$1[0] + 1] || '')) {
            var lastRange = out[out.length - 1];
            if (lastRange && lastRange[0] + lastRange[1] === range$$1[0]) {
                lastRange[1] += range$$1[1];
            } else {
                out.push(range$$1);
            }
        }

        return out;
    }, []);
}

/**
 * @param  {String} str
 * @param  {Array} ranges
 * @param  {Number} value
 * @return {String}
 */
function replaceNumberingRanges(str, ranges, value) {
    var replaced = replaceRanges(str, ranges, function (token) {
        var _value = String(value);
        // pad values for multiple numbering tokens, e.g. 3 for $$$ becomes 003
        while (_value.length < token.length) {
            _value = '0' + _value;
        }
        return _value;
    });

    // unescape screened numbering tokens
    return unescapeString(replaced);
}

/**
 * Unescapes characters, screened with `\`, in given string
 * @param  {String} str
 * @return {String}
 */
function unescapeString(str) {
    var i = 0, result = '';
    var len = str.length;

    while (i < len) {
        var ch = str[i++];
        result += (ch === '\\') ? (str[i++] || '') : ch;
    }

    return result;
}

/** Placeholder for inserted content */
var placeholder = '$#';

/** Placeholder for caret */
var caret = '|';

var reUrl = /^((?:https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var reEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
var reProto = /^([a-z]+:)?\/\//i;

/**
 * Inserts content into node with implicit repeat count: this node is then
 * duplicated for each content item and content itself is inserted either into
 * deepest child or instead of a special token.
 *
 * This method uses two distinct steps: `prepare()` and `insert()` since most
 * likely these steps will be used separately to properly insert content
 * with unescaped `$` numbering markers.
 *
 * @param {Node} tree Parsed abbreviation
 * @param {String[]} content Array of content items to insert
 * @return {Node}
 */
/**
 * Finds nodes with implicit repeat and creates `amount` copies of it in tree
 * @param  {Node} tree
 * @param  {Number} amount
 * @return {Node}
 */
function prepare(tree, amount) {
    amount = amount || 1;
    tree.walk(function (node) {
        if (node.repeat && node.repeat.count === null) {
            for (var i = 0; i < amount; i++) {
                var clone = node.clone(true);
                clone.repeat.implicit = true;
                clone.repeat.count = amount;
                clone.repeat.value = i + 1;
                clone.repeat.index = i;
                node.parent.insertBefore(clone, node);
            }

            node.remove();
        }
    });

    return tree;
}

/**
 * Inserts content into implicitly repeated nodes, created by `prepare()` method
 * @param  {Node} tree
 * @param  {String[]} content
 * @return {Node}
 */
function insert(tree, content) {
    if (Array.isArray(content) && content.length) {
        var updated = false;
        tree.walk(function (node) {
            if (node.repeat && node.repeat.implicit) {
                updated = true;
                insertContent(node, content[node.repeat.index]);
            }
        });

        if (!updated) {
            // no node with implicit repeat was found, insert content as
            // deepest child
            setNodeContent(findDeepestNode$1(tree), content.join('\n'));
        }
    }

    return tree;
}

/**
 * Inserts `content` into given `node`: either replaces output placeholders
 * or inserts it into deepest child node
 * @param  {Node} node
 * @param  {String} content
 * @return {Node}
 */
function insertContent(node, content) {
	var inserted = insertContentIntoPlaceholder(node, content);
	node.walk(function (child) { return inserted |= insertContentIntoPlaceholder(child, content); });

	if (!inserted) {
		// no placeholders were found in node, insert content into deepest child
		setNodeContent(findDeepestNode$1(node), content);
	}

	return node;
}

/**
 * Inserts given `content` into placeholders for given `node`. Placeholders
 * might be available in attribute values and node content
 * @param  {Node} node
 * @param  {String} content
 * @return {Boolean} Returns `true` if placeholders were found and replaced in node
 */
function insertContentIntoPlaceholder(node, content) {
	var state = {replaced: false};

	node.value = replacePlaceholder(node.value, content, state);
	node.attributes.forEach(function (attr) {
		if (attr.value) {
			node.setAttribute(attr.name, replacePlaceholder(attr.value, content, state));
		}
	});

	return state.replaced;
}

/**
 * Replaces all placeholder occurances in given `str` with `value`
 * @param  {String} str
 * @param  {String} value
 * @param  {Object} [_state] If provided, set `replaced` property of given
 * object to `true` if placeholder was found and replaced
 * @return {String}
 */
function replacePlaceholder(str, value, _state) {
	if (typeof str === 'string') {
		var ranges = findUnescapedTokens(str, placeholder);
		if (ranges.length) {
			if (_state) {
				_state.replaced = true;
			}

			str = replaceRanges(str, ranges, value);
		}
	}

	return str;
}

/**
 * Finds node which is the deepest for in current node or node iteself.
 * @param  {Node} node
 * @return {Node}
 */
function findDeepestNode$1(node) {
	while (node.children.length) {
		node = node.children[node.children.length - 1];
	}

	return node;
}

/**
 * Updates content of given node
 * @param {Node} node
 * @param {String} content
 */
function setNodeContent(node, content) {
	// find caret position and replace it with content, if possible
	if (node.value) {
		var ranges = findUnescapedTokens(node.value, caret);
		if (ranges.length) {
			node.value = replaceRanges(node.value, ranges, content);
			return;
		}
	}

	if (node.name.toLowerCase('a') || node.hasAttribute('href')) {
		// special case: inserting content into `<a>` tag
		if (reUrl.test(content)) {
			node.setAttribute('href', (reProto.test(content) ? '' : 'http://') + content);
		} else if (reEmail.test(content)) {
			node.setAttribute('href', 'mailto:' + content);
		}
	}

	node.value = content;
}

var defaultOptions$3 = {
	element: '__',
	modifier: '_'
};

var reElement  = /^(-+)([a-z0-9]+)/i;
var reModifier = /^(_+)([a-z0-9]+)/i;
var blockCandidates1 = function (className) { return /^[a-z]\-/i.test(className); };
var blockCandidates2 = function (className) { return /^[a-z]/i.test(className); };

/**
 * BEM transformer: updates class names written as `-element` and
 * `_modifier` into full class names as described in BEM specs. Also adds missing
 * class names: fir example, if node contains `.block_modifier` class, ensures
 * that element contains `.block` class as well
 */
var bem = function(tree, options) {
	options = Object.assign({}, defaultOptions$3, options);

	tree.walk(function (node) { return expandClassNames(node, options); });

	var lookup = createBlockLookup(tree);
    tree.walk(function (node) { return expandShortNotation(node, lookup, options); });

	return tree;
};

/**
 * Expands existing class names in BEM notation in given `node`.
 * For example, if node contains `b__el_mod` class name, this method ensures
 * that element contains `b__el` class as well
 * @param  {Node} node
 * @param  {Object} options
 * @return {Set}
 */
function expandClassNames(node, options) {
	var classNames = node.classList.reduce(function (out, cl) {
		// remove all modifiers from class name to get a base element name
		var ix = cl.indexOf(options.modifier);
		if (ix !== -1) {
			out.add(cl.slice(0, ix));
		}

		return out.add(cl);
	}, new Set());

	if (classNames.size) {
		node.setAttribute('class', Array.from(classNames).join(' '));
	}
}

/**
 * Expands short BEM notation, e.g. `-element` and `_modifier`
 * @param  {Node} node      Parsed Emmet abbreviation node
 * @param  {Map} lookup     BEM block name lookup
 * @param  {Object} options
 */
function expandShortNotation(node, lookup, options) {
	var classNames = node.classList.reduce(function (out, cl) {
		var prefix, m;
		var originalClass = cl;

		// parse element definition (could be only one)
		if (m = cl.match(reElement)) {
			prefix = getBlockName(node, lookup, m[1]) + options.element + m[2];
			out.add(prefix);
			cl = cl.slice(m[0].length);
		}

		// parse modifiers definitions (may contain multiple)
		while (m = cl.match(reModifier)) {
			if (!prefix) {
				prefix = getBlockName(node, lookup, m[1]);
				out.add(prefix);
			}

			out.add(("" + prefix + (options.modifier) + (m[2])));
			cl = cl.slice(m[0].length);
		}

		if (cl === originalClass) {
			// class name wasn’t modified: it’s not a BEM-specific class,
			// add it as-is into output
			out.add(originalClass);
		}

		return out;
	}, new Set());

	node.setAttribute('class', Array.from(classNames).join(' '));
}

/**
 * Creates block name lookup for each node in given tree, e.g. finds block
 * name explicitly for each node
 * @param  {Node} tree
 * @return {Map}
 */
function createBlockLookup(tree) {
	var lookup = new Map();

	tree.walk(function (node) {
		var classNames = node.classList;
		if (classNames.length) {
			// guess best block name from class or use parent’s block name
			lookup.set(node,
				find(classNames, blockCandidates1)
				|| find(classNames, blockCandidates2)
				|| lookup.get(node.parent)
			);
		}
	});

	return lookup;
}

/**
 * Returns block name for given `node` by `prefix`, which tells the depth of
 * of parent node lookup
 * @param  {Node} node
 * @param  {Map} lookup
 * @param  {String} prefix
 * @return {String}
 */
function getBlockName(node, lookup, prefix) {
	var depth = prefix.length > 1 ? prefix.length : 0;
	while (node.parent && depth--) {
		node = node.parent;
	}

	return lookup.get(node);
}

function find(arr, filter) {
	return arr.filter(filter)[0];
}

/**
 * JSX transformer: replaces `class` and `for` attributes with `className` and
 * `htmlFor` attributes respectively
 */
var jsx = function(tree) {
	tree.walk(function (node) {
		replace(node, 'class', 'className');
		replace(node, 'for', 'htmlFor');
	});
	return tree;
};

function replace(node, oldName, newName) {
	var attr = node.getAttribute(oldName);
	if (attr) {
		attr.name = newName;
	}
}

var reSupporterNames = /^xsl:(variable|with\-param)$/i;

/**
 * XSL transformer: removes `select` attributes from certain nodes that contain
 * children
 */
var xsl = function(tree) {
	tree.walk(function (node) {
		if (reSupporterNames.test(node.name || '') && (node.children.length || node.value)) {
			node.removeAttribute('select');
		}
	});
	return tree;
};

var supportedAddons = { bem: bem, jsx: jsx, xsl: xsl };

/**
 * Runs additional transforms on given tree.
 * These transforms may introduce side-effects and unexpected result
 * so they are not applied by default, authors must specify which addons
 * in `addons` argument as `{addonName: addonOptions}`
 * @param {Node} tree Parsed Emmet abbreviation
 * @param {Object} addons Add-ons to apply and their options
 */
var addons = function(tree, addons) {
    Object.keys(addons || {}).forEach(function (key) {
        if (key in supportedAddons) {
            var addonOpt = typeof addons[key] === 'object' ? addons[key] : null;
            tree = tree.use(supportedAddons[key], addonOpt);
        }
    });

    return tree;
};

/**
 * Applies basic HTML-specific transformations for given parsed abbreviation:
 * – resolve implied tag names
 * – insert repeated content
 * – resolve node numbering
 */
var index$2 = function(tree, content, appliedAddons) {
    if (typeof content === 'string') {
        content = [content];
    } else if (content && typeof content === 'object' && !Array.isArray(content)) {
        appliedAddons = content;
        content = null;
    }

    return tree
    .use(implicitTags)
    .use(prepare, Array.isArray(content) ? content.length : null)
    .use(applyNumbering)
    .use(insert, content)
    .use(addons, appliedAddons);
};

/**
 * Replaces all unescaped ${variable} occurances in given parsed abbreviation
 * `tree` with values provided in `variables` hash. Precede `$` with `\` to
 * escape it and skip replacement
 * @param {Node} tree Parsed abbreviation tree
 * @param {Object} variables Variables values
 * @return {Node}
 */
function replaceVariables(tree, variables) {
	variables = variables || {};
    tree.walk(function (node) { return replaceInNode(node, variables); });
    return tree;
}

function replaceInNode(node, variables) {
    // Replace variables in attributes.
    var attrs = node.attributes;

    for (var i = 0, il = attrs.length; i < il; i++) {
        var attr = attrs[i];
        if (typeof attr.value === 'string') {
            node.setAttribute(attr.name, replaceInString(attr.value, variables));
        }
    }

    if (node.value != null) {
        node.value = replaceInString(node.value, variables);
    }

    return node;
}

/**
 * Replaces all unescaped `${variable}` occurances in given string with values
 * from `variables` object
 * @param  {String} string
 * @param  {Object} variables
 * @return {String}
 */
function replaceInString(string, variables) {
    var model = createModel(string);
    var offset = 0;
    var output = '';

    for (var i = 0, il = model.variables.length; i < il; i++) {
        var v = model.variables[i];
        var value = v.name in variables ? variables[v.name] : v.name;
        if (typeof value === 'function') {
            value = value(model.string, v, offset + v.location);
        }

        output += model.string.slice(offset, v.location) + value;
        offset = v.location + v.length;
    }

    return output + model.string.slice(offset);
}

/**
 * Creates variable model from given string. The model contains a `string` with
 * all escaped variable tokens written without escape symbol and `variables`
 * property with all unescaped variables and their ranges
 * @param  {String} string
 * @return {Object}
 */
function createModel(string) {
    var reVariable = /\$\{([a-z][\w\-]*)\}/ig;
    var escapeCharCode = 92; // `\` symbol
    var variables = [];

    // We have to replace unescaped (e.g. not preceded with `\`) tokens.
    // Instead of writing a stream parser, we’ll cut some edges here:
    // 1. Find all tokens
    // 2. Walk string char-by-char and resolve only tokens that are not escaped
    var tokens = new Map();
    var m;
    while (m = reVariable.exec(string)) {
        tokens.set(m.index, m);
    }

    if (tokens.size) {
        var start = 0, pos = 0, len = string.length;
        var output = '';
        while (pos < len) {
            if (string.charCodeAt(pos) === escapeCharCode && tokens.has(pos + 1)) {
                // Found escape symbol that escapes variable: we should
                // omit this symbol in output string and skip variable
                var token = tokens.get(pos + 1);
                output += string.slice(start, pos) + token[0];
                start = pos = token.index + token[0].length;
                tokens.delete(pos + 1);
                continue;
            }

            pos++;
        }

        string = output + string.slice(start);

        // Not using `.map()` here to reduce memory allocations
        var validMatches = Array.from(tokens.values());
        for (var i = 0, il = validMatches.length; i < il; i++) {
            var token$1 = validMatches[i];
            variables.push({
                name: token$1[1],
                location: token$1.index,
                length: token$1[0].length
            });
        }
    }

    return {string: string, variables: variables};
}

var DOLLAR      = 36;  // $
var COLON$1       = 58;  // :
var ESCAPE$1      = 92;  // \
var OPEN_BRACE  = 123; // {
var CLOSE_BRACE = 125; // }

/**
 * Finds fields in given string and returns object with field-less string
 * and array of fileds found
 * @param  {String} string
 * @return {Object}
 */
function parse$2$1(string) {
	var stream = new StreamReader$1(string);
	var fields = [];
	var cleanString = '', offset = 0, pos = 0;
	var code, field;

	while (!stream.eof()) {
		code = stream.peek();
		pos = stream.pos;

		if (code === ESCAPE$1) {
			stream.next();
			stream.next();
		} else if (field = consumeField(stream, cleanString.length + pos - offset)) {
			fields.push(field);
			cleanString += stream.string.slice(offset, pos) + field.placeholder;
			offset = stream.pos;
		} else {
			stream.next();
		}
	}

	return new FieldString(cleanString + stream.string.slice(offset), fields);
}

/**
 * Marks given `string` with `fields`: wraps each field range with
 * `${index:placeholder}` (by default) or any other token produced by `token`
 * function, if provided
 * @param  {String} string String to mark
 * @param  {Array} fields Array of field descriptor. A field descriptor is a
 * `{index, location, length}` array. It is important that fields in array
 * must be ordered by their location in string: some fields my refer the same
 * location so they must appear in order that user expects.
 * @param  {Function} [token] Function that generates field token. This function
 * received two arguments: `index` and `placeholder` and should return string
 * @return {String}  String with marked fields
 */
function mark(string, fields, token) {
	token = token || createToken;

	// order fields by their location and appearence
	// NB field ranges should not overlap! (not supported yet)
	var ordered = fields
	.map(function (field, order) { return ({order: order, field: field, end: field.location + field.length}); })
	.sort(function (a, b) { return (a.end - b.end) || (a.order - b.order); });

	// mark ranges in string
	var offset = 0;
	var result = ordered.map(function (item) {
		var placeholder = string.substr(item.field.location, item.field.length);
		var prefix = string.slice(offset, item.field.location);
		offset = item.end;
		return prefix + token(item.field.index, placeholder);
	});

	return result.join('') + string.slice(offset);
}

/**
 * Creates field token for string
 * @param  {Number} index       Field index
 * @param  {String} placeholder Field placeholder, could be empty string
 * @return {String}
 */
function createToken(index, placeholder) {
	return placeholder ? ("${" + index + ":" + placeholder + "}") : ("${" + index + "}");
}

/**
 * Consumes field from current stream position: it can be an `$index` or
 * or `${index}` or `${index:placeholder}`
 * @param  {StreamReader} stream
 * @param  {Number}       location Field location in *clean* string
 * @return {Object} Object with `index` and `placeholder` properties if
 * fieald was successfully consumed, `null` otherwise
 */
function consumeField(stream, location) {
	var start = stream.pos;

	if (stream.eat(DOLLAR)) {
		// Possible start of field
		var index = consumeIndex(stream);
		var placeholder = '';

		// consumed $index placeholder
		if (index != null) {
			return new Field(index, placeholder, location);
		}

		if (stream.eat(OPEN_BRACE)) {
			index = consumeIndex(stream);
			if (index != null) {
				if (stream.eat(COLON$1)) {
					placeholder = consumePlaceholder(stream);
				}

				if (stream.eat(CLOSE_BRACE)) {
					return new Field(index, placeholder, location);
				}
			}
		}
	}

	// If we reached here then there’s no valid field here, revert
	// back to starting position
	stream.pos = start;
}

/**
 * Consumes a placeholder: value right after `:` in field. Could be empty
 * @param  {StreamReader} stream
 * @return {String}
 */
function consumePlaceholder(stream) {
	var code;
	var stack = [];
	stream.start = stream.pos;

	while (!stream.eof()) {
		code = stream.peek();

		if (code === OPEN_BRACE) {
			stack.push(stream.pos);
		} else if (code === CLOSE_BRACE) {
			if (!stack.length) {
				break;
			}
			stack.pop();
		}
		stream.next();
	}

	if (stack.length) {
		throw stream.error('Unable to find matching "}" for curly brace at ' + stack.pop());
	}

	return stream.current();
}

/**
 * Consumes integer from current stream position
 * @param  {StreamReader} stream
 * @return {Number}
 */
function consumeIndex(stream) {
	stream.start = stream.pos;
	if (stream.eatWhile(isNumber$1)) {
		return Number(stream.current());
	}
}

var Field = function Field(index, placeholder, location) {
	this.index = index;
	this.placeholder = placeholder;
	this.location = location;
	this.length = this.placeholder.length;
};

var FieldString = function FieldString(string, fields) {
	this.string = string;
	this.fields = fields;
};

FieldString.prototype.mark = function mark$1 (token) {
	return mark(this.string, this.fields, token);
};

FieldString.prototype.toString = function toString () {
	return string;
};

var defaultFieldsRenderer = function (text) { return text; };

/**
 * Output node is an object containing generated output for given Emmet
 * abbreviation node. Output node can be passed to various processors that
 * may shape-up final node output. The final output is simply a concatenation
 * of `.open`, `.text` and `.close` properties and its `.before*` and `.after*`
 * satellites
 * @param {Node}     node           Parsed Emmet abbreviation node
 * @param {Function} fieldsRenderer A function for rendering fielded text (text with
 * tabstops) for current node. @see ./render.js for details
 */
var OutputNode = function OutputNode(node, fieldsRenderer, options) {
	if (typeof fieldsRenderer === 'object') {
		options = fieldsRenderer;
		fieldsRenderer = null;
	}

	this.node = node;
	this._fieldsRenderer = fieldsRenderer || defaultFieldsRenderer;

	this.open = null;
	this.beforeOpen = '';
	this.afterOpen = '';

	this.close = null;
	this.beforeClose = '';
	this.afterClose = '';

	this.text = null;
	this.beforeText = '';
	this.afterText = '';

	this.indent = '';
	this.newline = '';

	if (options) {
            Object.assign(this, options);
        }
};

OutputNode.prototype.clone = function clone () {
	return new this.constructor(this.node, this);
};

/**
	 * Properly indents given multiline text
	 * @param {String} text
	 */
OutputNode.prototype.indentText = function indentText (text) {
		var this$1 = this;

	var lines = splitByLines$1(text);
        if (lines.length === 1) {
            // no newlines, nothing to indent
            return text;
        }

        // No newline and no indent means no formatting at all:
        // in this case we should replace newlines with spaces
        var nl = (!this.newline && !this.indent) ? ' ' : this.newline;
        return lines.map(function (line, i) { return i ? this$1.indent + line : line; }).join(nl);
};

/**
	 * Renders given text with fields
	 * @param {String} text
	 * @return {String}
	 */
OutputNode.prototype.renderFields = function renderFields (text) {
	return this._fieldsRenderer(text);
};

OutputNode.prototype.toString = function toString (children) {
	var open = this._wrap(this.open, this.beforeOpen, this.afterOpen);
	var close = this._wrap(this.close, this.beforeClose, this.afterClose);
	var text = this._wrap(this.text, this.beforeText, this.afterText);

	return open + text + (children != null ? children : '') + close;
};

OutputNode.prototype._wrap = function _wrap (str, before, after) {
	before = before != null ? before : '';
	after = after != null ? after : '';

        // automatically trim whitespace for non-empty wraps
        if (str != null) {
            str = before ? str.replace(/^\s+/, '') : str;
            str = after ? str.replace(/\s+$/, '') : str;
            return before + this.indentText(str) + after;
        }

        return '';
};

/**
 * Splits given text by lines
 * @param  {String} text
 * @return {String[]}
 */
function splitByLines$1(text) {
	return (text || '').split(/\r\n|\r|\n/g);
}

/**
 * Default output of field (tabstop)
 * @param  {Number} index       Field index
 * @param  {String} placeholder Field placeholder, can be null
 * @return {String}
 */
var defaultField = function (index, placeholder) { return (placeholder || ''); };

/**
 * Renders given parsed abbreviation `tree` via `formatter` function.

 * @param {Node}     tree      Parsed Emmet abbreviation
 * @param {Function} [field]   Optional function to format field/tabstop (@see `defaultField`)
 * @param {Function} formatter Output formatter function. It takes an output node—
 * a special wrapper for parsed node that holds formatting and output properties—
 * and updates its output properties to shape-up node’s output.
 * Function arguments:
 * 	– `outNode`: OutputNode
 * 	– `renderFields`: a helper function that parses fields/tabstops from given
 * 	   text and replaces them with `field` function output.
 * 	   It also takes care about field indicies and ensures that the same indicies
 * 	   from different nodes won’t collide
 */
function render(tree, field, formatter) {
    if (typeof formatter === 'undefined') {
        formatter = field;
        field = null;
    }

    field = field || defaultField;

    // Each node may contain fields like `${1:placeholder}`.
	// Since most modern editors will link all fields with the same
	// index, we have to ensure that different nodes has their own indicies.
	// We’ll use this `fieldState` object to globally increment field indices
	// during output
	var fieldState = { index: 1 };

    var fieldsRenderer = function (text) { return text == null
        ? field(fieldState.index++)
        : getFieldsModel(text, fieldState).mark(field); };

	return run(tree.children, formatter, fieldsRenderer);
}

function run(nodes, formatter, fieldsRenderer) {
	return nodes.filter(notGroup).map(function (node) {
		var outNode = formatter(new OutputNode(node, fieldsRenderer));
		return outNode ? outNode.toString(run(node.children, formatter, fieldsRenderer)) : '';
	}).join('');
}

function notGroup(node) {
    return !node.isGroup;
}

/**
 * Returns fields (tab-stops) model with properly updated indices that won’t
 * collide with fields in other nodes of foprmatted tree
 * @param  {String|Object} text Text to get fields model from or model itself
 * @param  {Object} fieldState Abbreviation tree-wide field state reference
 * @return {Object} Field model
 */
function getFieldsModel(text, fieldState) {
	var model = typeof text === 'object' ? text : parse$2$1(text);
    var largestIndex = -1;

    model.fields.forEach(function (field) {
		field.index += fieldState.index;
		if (field.index > largestIndex) {
			largestIndex = field.index;
		}
	});

	if (largestIndex !== -1) {
		fieldState.index = largestIndex + 1;
	}

    return model;
}

var TOKEN       = /^(.*?)([A-Z_]+)(.*?)$/;
var TOKEN_OPEN  = 91; // [
var TOKEN_CLOSE = 93; // ]

/**
 * A basic templating engine.
 * Takes every `[TOKEN]` from given string and replaces it with
 * `TOKEN` value from given `data` attribute. The token itself may contain
 * various characters between `[`, token name and `]`. Contents of `[...]` will
 * be outputted only if `TOKEN` value is not empty. Also, only `TOKEN` name will
 * be replaced with actual value, all other characters will remain as is.
 *
 * Example:
 * ```
 * template('[<NAME>]', {NAME: 'foo'}) -> "<foo>"
 * template('[<NAME>]', {}) -> ""
 * ```
 */
function template(str, data) {
	if (str == null) {
		return str;
	}

	// NB since token may contain inner `[` and `]`, we can’t just use regexp
	// for replacement, should manually parse string instead
	var stack = [];
	var replacer = function (str, left, token, right) { return data[token] != null ? left + data[token] + right : ''; };

	var output = '';
	var offset = 0, i = 0;
	var code, lastPos;

	while (i < str.length) {
		code = str.charCodeAt(i);
		if (code === TOKEN_OPEN) {
			stack.push(i);
		} else if (code === TOKEN_CLOSE) {
			lastPos = stack.pop();
			if (!stack.length) {
				output += str.slice(offset, lastPos) +
					str.slice(lastPos + 1, i).replace(TOKEN, replacer);
				offset = i + 1;
			}
		}

		i++;
	}

	return output + str.slice(offset);
}

/**
 * Various utility methods used by formatters
 */

/**
 * Splits given text by lines
 * @param  {String} text
 * @return {String[]}
 */
function splitByLines(text) {
	return (text || '').split(/\r\n|\r|\n/g);
}

/**
 * Check if given node is a first child in its parent
 * @param  {Node}  node
 * @return {Boolean}
 */
function isFirstChild(node) {
	return node.parent.firstChild === node;
}

/**
 * Check if given node is a last child in its parent node
 * @param  {Node}  node
 * @return {Boolean}
 */


/**
 * Check if given node is a root node
 * @param  {Node}  node
 * @return {Boolean}
 */
function isRoot(node) {
	return node && !node.parent;
}

/**
 * Check if given node is a pseudo-snippet: a text-only node with explicitly
 * defined children
 * @param  {Node}  node
 * @return {Boolean}
 */
function isPseudoSnippet(node) {
    return node.isTextOnly && !!node.children.length;
}

/**
 * Handles pseudo-snippet node.
 * A pseudo-snippet is a text-only node with explicitly defined children.
 * For such case, we have to figure out if pseudo-snippet contains fields
 * (tab-stops) in node value and “split” it: make contents before field with
 * lowest index node’s “open” part and contents after lowest index — “close”
 * part. With this trick a final output will look like node’s children
 * are nested inside node value
 * @param  {OutputNode} outNode
 * @return {Boolean} Returns “true” if given node is a pseudo-snippets,
 * `false` otherwise
 */
function handlePseudoSnippet(outNode) {
	var node = outNode.node; // original abbreviaiton node

	if (isPseudoSnippet(node)) {
		var fieldsModel = parse$2$1(node.value);
		var field = findLowestIndexField(fieldsModel);
		if (field) {
			var parts = splitFieldsModel(fieldsModel, field);
            outNode.open = outNode.renderFields(parts[0]);
			outNode.close = outNode.renderFields(parts[1]);
		} else {
			outNode.text = outNode.renderFields(fieldsModel);
		}

		return true;
	}

	return false;
}

/**
 * Finds field with lowest index in given text
 * @param  {Object} model
 * @return {Object}
 */
function findLowestIndexField(model) {
	return model.fields.reduce(function (result, field) { return !result || field.index < result.index ? field : result; }
		, null);
}

/**
 * Splits given fields model in two parts by given field
 * @param  {Object} model
 * @param  {Object} field
 * @return {Array} Two-items array
 */
function splitFieldsModel(model, field) {
	var ix = model.fields.indexOf(field);

	var left = new model.constructor(
		model.string.slice(0, field.location),
		model.fields.slice(0, ix)
	);

	var right = new model.constructor(
		model.string.slice(field.location + field.length),
		model.fields.slice(ix + 1)
	);

	return [left, right];
}

var commentOptions = {
	// enable node commenting
	enabled: false,

	// attributes that should trigger node commenting on specific node,
	// if commenting is enabled
	trigger: ['id', 'class'],

	// comment before opening tag
	before: '',

	// comment after closing tag
	after: '\n<!-- /[#ID][.CLASS] -->'
};

/**
 * Renders given parsed Emmet abbreviation as HTML, formatted according to
 * `profile` options
 * @param  {Node}     tree    Parsed Emmet abbreviation
 * @param  {Profile}  profile Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
function html(tree, profile, options) {
	options = Object.assign({}, options);
	options.comment = Object.assign({}, commentOptions, options.comment);

	return render(tree, options.field, function (outNode) {
		outNode = setFormatting(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			var node = outNode.node;

			if (node.name) {
				var name = profile.name(node.name);
				var attrs = formatAttributes(outNode, profile);

				outNode.open = "<" + name + attrs + (node.selfClosing ? profile.selfClose() : '') + ">";
				if (!node.selfClosing) {
					outNode.close = "</" + name + ">";
				}

				commentNode(outNode, options.comment);
			}

			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(node.value);
			}
		}

		return outNode;
	});
}

/**
 * Updates formatting properties for given output node
 * @param  {OutputNode} outNode Output wrapper of farsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function setFormatting(outNode, profile) {
	var node = outNode.node;

    if (shouldFormatNode(node, profile)) {
        outNode.indent = profile.indent(getIndentLevel(node, profile));
        outNode.newline = '\n';
        var prefix = outNode.newline + outNode.indent;

        // do not format the very first node in output
        if (!isRoot(node.parent) || !isFirstChild(node)) {
            outNode.beforeOpen = prefix;
            if (node.isTextOnly) {
                outNode.beforeText = prefix;
            }
        }

        if (hasInnerFormatting(node, profile)) {
            if (!node.isTextOnly) {
                outNode.beforeText = prefix + profile.indent(1);
            }
            outNode.beforeClose = prefix;
        }
    }

    return outNode;
}

/**
 * Check if given node should be formatted
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function shouldFormatNode(node, profile) {
	if (!profile.get('format')) {
		return false;
	}

    if (node.parent.isTextOnly
        && node.parent.children.length === 1
        && parse$2$1(node.parent.value).fields.length) {
        // Edge case: do not format the only child of text-only node,
        // but only if parent contains fields
        return false;
    }

	return isInline(node, profile) ? shouldFormatInline(node, profile) : true;
}

/**
 * Check if given inline node should be formatted as well, e.g. it contains
 * enough adjacent siblings that should force formatting
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function shouldFormatInline(node, profile) {
	if (!isInline(node, profile)) {
		return false;
	}

    if (isPseudoSnippet(node)) {
        return true;
    }

    // check if inline node is the next sibling of block-level node
    if (node.childIndex === 0) {
        // first node in parent: format if it’s followed by a block-level element
        var next = node;
        while (next = next.nextSibling) {
            if (!isInline(next, profile)) {
                return true;
            }
        }
    } else if (!isInline(node.previousSibling, profile)) {
        // node is right after block-level element
        return true;
    }

    if (profile.get('inlineBreak')) {
        // check for adjacent inline elements before and after current element
        var adjacentInline = 1;
        var before = node, after = node;

        while (isInlineElement((before = before.previousSibling), profile)) {
            adjacentInline++;
        }

        while (isInlineElement((after = after.nextSibling), profile)) {
            adjacentInline++;
        }

		if (adjacentInline >= profile.get('inlineBreak')) {
			return true;
		}
    }

	// Another edge case: inline node contains node that should receive foramtting
	for (var i = 0, il = node.children.length; i < il; i++) {
		if (shouldFormatNode(node.children[i], profile)) {
			return true;
		}
	}

    return false;
}

/**
 * Check if given node contains inner formatting, e.g. any of its children should
 * be formatted
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function hasInnerFormatting(node, profile) {
    // check if node if forced for inner formatting
    var nodeName = (node.name || '').toLowerCase();
    if (profile.get('formatForce').indexOf(nodeName) !== -1) {
        return true;
    }

    // check if any of children should receive formatting
    // NB don’t use `childrent.some()` to reduce memory allocations
    for (var i = 0; i < node.children.length; i++) {
        if (shouldFormatNode(node.children[i], profile)) {
            return true;
        }
    }

    return false;
}

/**
 * Outputs attributes of given abbreviation node as HTML attributes
 * @param  {OutputNode} outNode
 * @param  {Profile}    profile
 * @return {String}
 */
function formatAttributes(outNode, profile) {
	var node = outNode.node;

    return node.attributes.map(function (attr) {
        if (attr.options.implied && attr.value == null) {
    		return null;
    	}

    	var attrName = profile.attribute(attr.name);
    	var attrValue = null;

        // handle boolean attributes
    	if (attr.options.boolean || profile.get('booleanAttributes').indexOf(attrName.toLowerCase()) !== -1) {
    		if (profile.get('compactBooleanAttributes') && attr.value == null) {
    			return (" " + attrName);
    		} else if (attr.value == null) {
    			attrValue = attrName;
    		}
    	}

    	if (attrValue == null) {
    		attrValue = outNode.renderFields(attr.value);
    	}

    	return (" " + attrName + "=" + (profile.quote(attrValue)));
    }).join('');
}

/**
 * Check if given node is inline-level
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInline(node, profile) {
	return (node && node.isTextOnly) || isInlineElement(node, profile);
}

/**
 * Check if given node is inline-level element, e.g. element with explicitly
 * defined node name
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInlineElement(node, profile) {
	return node && profile.isInline(node);
}

/**
 * Computes indent level for given node
 * @param  {Node} node
 * @param  {Profile} profile
 * @param  {Number} level
 * @return {Number}
 */
function getIndentLevel(node, profile) {
	// Increase indent level IF NOT:
	// * parent is text-only node
	// * there’s a parent node with a name that is explicitly set to decrease level
	var skip = profile.get('formatSkip') || [];
	var level = node.parent.isTextOnly ? -2 : -1;
	var ctx = node;
	while (ctx = ctx.parent) {
		if (skip.indexOf( (ctx.name || '').toLowerCase() ) === -1) {
			level++;
		}
	}

	return level < 0 ? 0 : level;
}

/**
 * Comments given output node, if required
 * @param  {OutputNode} outNode
 * @param  {Object} options
 */
function commentNode(outNode, options) {
	var node = outNode.node;

	if (!options.enabled || !options.trigger || !node.name) {
		return;
	}

	var attrs = outNode.node.attributes.reduce(function (out, attr) {
		if (attr.name && attr.value != null) {
			out[attr.name.toUpperCase().replace(/-/g, '_')] = attr.value;
		}

		return out;
	}, {});

	// add comment only if attribute trigger is present
	for (var i = 0, il = options.trigger.length; i < il; i++) {
		if (options.trigger[i].toUpperCase() in attrs) {
			outNode.open = template(options.before, attrs) + outNode.open;
			if (outNode.close) {
				outNode.close += template(options.after, attrs);
			}
			break;
		}
	}
}

/**
 * Common utility methods for indent-based syntaxes (Slim, Pug, etc.)
 */

var reId = /^id$/i;
var reClass = /^class$/i;
var defaultAttrOptions = {
	primary: function (attrs) { return attrs.join(''); },
	secondary: function (attrs) { return attrs.map(function (attr) { return attr.isBoolean ? attr.name : ((attr.name) + "=" + (attr.value)); }).join(', '); }
};

var defaultNodeOptions = {
	open: null,
	close: null,
	omitName: /^div$/i,
	attributes: defaultAttrOptions
};

function indentFormat(outNode, profile, options) {
	options = Object.assign({}, defaultNodeOptions, options);
	var node = outNode.node;

	outNode.indent = profile.indent(getIndentLevel$1(node, profile));
	outNode.newline = '\n';

	// Do not format the very first node in output
    if (!isRoot(node.parent) || !isFirstChild(node)) {
        outNode.beforeOpen = outNode.newline + outNode.indent;
    }

	if (node.name) {
		var data = Object.assign({
			NAME: profile.name(node.name),
			SELF_CLOSE: node.selfClosing ? options.selfClose : null
		}, getAttributes(outNode, profile, options.attributes));

		// omit tag name if node has primary attributes
		if (options.omitName && options.omitName.test(data.NAME) && data.PRIMARY_ATTRS) {
			data.NAME = null;
		}

		if (options.open != null) {
			outNode.open = template(options.open, data);
		}

		if (options.close != null) {
			outNode.close = template(options.close, data);
		}
	}

	return outNode;
}

/**
 * Formats attributes of given node into a string.
 * @param  {OutputNode} node          Output node wrapper
 * @param  {Profile}    profile       Output profile
 * @param  {Object}     options       Additional formatting options
 * @return {String}
 */
function getAttributes(outNode, profile, options) {
	options = Object.assign({}, defaultAttrOptions, options);
	var primary = [], secondary = [];
	var node = outNode.node;

	node.attributes.forEach(function (attr) {
		if (attr.options.implied && attr.value == null) {
			return null;
		}

		var name = profile.attribute(attr.name);
		var value = outNode.renderFields(attr.value);

		if (reId.test(name)) {
			value && primary.push(("#" + value));
		} else if (reClass.test(name)) {
			value && primary.push(("." + (value.replace(/\s+/g, '.'))));
		} else {
			var isBoolean = attr.value == null
				&& (attr.options.boolean || profile.get('booleanAttributes').indexOf(name.toLowerCase()) !== -1);

			secondary.push({ name: name, value: value, isBoolean: isBoolean });
		}
	});

	return {
		PRIMARY_ATTRS: options.primary(primary) || null,
		SECONDARY_ATTRS: options.secondary(secondary) || null
	};
}

/**
 * Computes indent level for given node
 * @param  {Node} node
 * @param  {Profile} profile
 * @param  {Number} level
 * @return {Number}
 */
function getIndentLevel$1(node, profile) {
	var level = node.parent.isTextOnly ? -2 : -1;
	var ctx = node;
	while (ctx = ctx.parent) {
		level++;
	}

	return level < 0 ? 0 : level;
}

var reNl = /\n|\r/;

/**
 * Renders given parsed Emmet abbreviation as HAML, formatted according to
 * `profile` options
 * @param  {Node}    tree      Parsed Emmet abbreviation
 * @param  {Profile} profile   Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
function haml(tree, profile, options) {
	options = options || {};
	var nodeOptions = {
		open: '[%NAME][PRIMARY_ATTRS][(SECONDARY_ATTRS)][SELF_CLOSE]',
		selfClose: '/',
		attributes: {
			secondary: function secondary(attrs) {
				return attrs.map(function (attr) { return attr.isBoolean
					? ("" + (attr.name) + (profile.get('compactBooleanAttributes') ? '' : '=true'))
					: ((attr.name) + "=" + (profile.quote(attr.value))); }
				).join(' ');
			}
		}
	};

	return render(tree, options.field, function (outNode) {
		outNode = indentFormat(outNode, profile, nodeOptions);
		outNode = updateFormatting(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			var node = outNode.node;

			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(formatNodeValue(node, profile));
			}
		}

        return outNode;
	});
}

/**
 * Updates formatting properties for given output node
 * NB Unlike HTML, HAML is indent-based format so some formatting options from
 * `profile` will not take effect, otherwise output will be broken
 * @param  {OutputNode} outNode Output wrapper of parsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function updateFormatting(outNode, profile) {
	var node = outNode.node;

    if (!node.isTextOnly && node.value) {
        // node with text: put a space before single-line text
        outNode.beforeText = reNl.test(node.value)
			? outNode.newline + outNode.indent + profile.indent(1)
			: ' ';
    }

	return outNode;
}
/**
 * Formats value of given node: for multiline text we should add a ` |` suffix
 * at the end of each line. Also ensure that text is perfectly aligned.
 * @param  {Node}    node
 * @param  {Profile} profile
 * @return {String|null}
 */
function formatNodeValue(node, profile) {
	if (node.value != null && reNl.test(node.value)) {
		var lines = splitByLines(node.value);
		var indent = profile.indent(1);
		var maxLength = lines.reduce(function (prev, line) { return Math.max(prev, line.length); }, 0);

		return lines.map(function (line, i) { return ("" + (i ? indent : '') + (pad(line, maxLength)) + " |"); }).join('\n');
	}

	return node.value;
}

function pad(text, len) {
	while (text.length < len) {
		text += ' ';
	}

	return text;
}

var reNl$1 = /\n|\r/;
var secondaryAttrs = {
	none:   '[ SECONDARY_ATTRS]',
	round:  '[(SECONDARY_ATTRS)]',
	curly:  '[{SECONDARY_ATTRS}]',
	square: '[[SECONDARY_ATTRS]'
};

/**
 * Renders given parsed Emmet abbreviation as Slim, formatted according to
 * `profile` options
 * @param  {Node}    tree      Parsed Emmet abbreviation
 * @param  {Profile} profile   Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
function slim(tree, profile, options) {
	options = options || {};
	var SECONDARY_ATTRS = options.attributeWrap
		&& secondaryAttrs[options.attributeWrap]
		|| secondaryAttrs.none;

	var booleanAttr = SECONDARY_ATTRS === secondaryAttrs.none
		? function (attr) { return ((attr.name) + "=true"); }
		: function (attr) { return attr.name; };

	var nodeOptions = {
		open: ("[NAME][PRIMARY_ATTRS]" + SECONDARY_ATTRS + "[SELF_CLOSE]"),
		selfClose: '/',
		attributes: {
			secondary: function secondary(attrs) {
				return attrs.map(function (attr) { return attr.isBoolean
					? booleanAttr(attr)
					: ((attr.name) + "=" + (profile.quote(attr.value))); }
				).join(' ');
			}
		}
	};

	return render(tree, options.field, function (outNode, renderFields) {
		outNode = indentFormat(outNode, profile, nodeOptions);
		outNode = updateFormatting$1(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			var node = outNode.node;

			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(formatNodeValue$1(node, profile));
			}
		}

        return outNode;
	});
}

/**
 * Updates formatting properties for given output node
 * NB Unlike HTML, Slim is indent-based format so some formatting options from
 * `profile` will not take effect, otherwise output will be broken
 * @param  {OutputNode} outNode Output wrapper of farsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function updateFormatting$1(outNode, profile) {
	var node = outNode.node;
	var parent = node.parent;

	// Edge case: a single inline-level child inside node without text:
	// allow it to be inlined
	if (profile.get('inlineBreak') === 0 && isInline$1(node, profile)
		&& !isRoot(parent) && parent.value == null && parent.children.length === 1) {
		outNode.beforeOpen = ': ';
	}

    if (!node.isTextOnly && node.value) {
        // node with text: put a space before single-line text
        outNode.beforeText = reNl$1.test(node.value)
			? outNode.newline + outNode.indent + profile.indent(1)
			: ' ';
    }

	return outNode;
}

/**
 * Formats value of given node: for multiline text we should precede each
 * line with `| ` with one-level deep indent
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {String|null}
 */
function formatNodeValue$1(node, profile) {
	if (node.value != null && reNl$1.test(node.value)) {
		var indent = profile.indent(1);
		return splitByLines(node.value).map(function (line, i) { return ("" + indent + (i ? ' ' : '|') + " " + line); }).join('\n');
	}

	return node.value;
}

/**
 * Check if given node is inline-level
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInline$1(node, profile) {
	return node && (node.isTextOnly || profile.isInline(node));
}

var reNl$2 = /\n|\r/;

/**
 * Renders given parsed Emmet abbreviation as Pug, formatted according to
 * `profile` options
 * @param  {Node}    tree      Parsed Emmet abbreviation
 * @param  {Profile} profile   Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
function pug(tree, profile, options) {
	options = options || {};
	var nodeOptions = {
		open: '[NAME][PRIMARY_ATTRS][(SECONDARY_ATTRS)]',
		attributes: {
			secondary: function secondary(attrs) {
				return attrs.map(function (attr) { return attr.isBoolean ? attr.name : ((attr.name) + "=" + (profile.quote(attr.value))); }).join(', ');
			}
		}
	};

	return render(tree, options.field, function (outNode) {
		outNode = indentFormat(outNode, profile, nodeOptions);
		outNode = updateFormatting$2(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			var node = outNode.node;
			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(formatNodeValue$2(node, profile));
			}
		}

        return outNode;
	});
}

/**
 * Updates formatting properties for given output node
 * NB Unlike HTML, Pug is indent-based format so some formatting options from
 * `profile` will not take effect, otherwise output will be broken
 * @param  {OutputNode} outNode Output wrapper of parsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function updateFormatting$2(outNode, profile) {
	var node = outNode.node;

    if (!node.isTextOnly && node.value) {
        // node with text: put a space before single-line text
        outNode.beforeText = reNl$2.test(node.value)
			? outNode.newline + outNode.indent + profile.indent(1)
			: ' ';
    }

	return outNode;
}

/**
 * Formats value of given node: for multiline text we should precede each
 * line with `| ` with one-level deep indent
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {String|null}
 */
function formatNodeValue$2(node, profile) {
	if (node.value != null && reNl$2.test(node.value)) {
		var indent = profile.indent(1);
		return splitByLines(node.value).map(function (line) { return (indent + "| " + line); }).join('\n');
	}

	return node.value;
}

var supportedSyntaxed = { html: html, haml: haml, slim: slim, pug: pug };

/**
 * Outputs given parsed abbreviation in specified syntax
 * @param {Node}     tree     Parsed abbreviation tree
 * @param {Profile}  profile  Output profile
 * @param {String}   [syntax] Output syntax. If not given, `html` syntax is used
 * @param {Function} options.field A function to output field/tabstop for
 * host editor. This function takes two arguments: `index` and `placeholder` and
 * should return a string that represents tabstop in host editor. By default
 * only a placeholder is returned
 * @example
 * {
 * 	field(index, placeholder) {
 * 		// return field in TextMate-style, e.g. ${1} or ${2:foo}
 * 		return `\${${index}${placeholder ? ':' + placeholder : ''}}`;
 *  }
 * }
 * @return {String}
 */
var index$3 = function(tree, profile, syntax, options) {
	if (typeof syntax === 'object') {
		options = syntax;
		syntax = null;
	}

	if (!supports(syntax)) {
		// fallback to HTML if given syntax is not supported
		syntax = 'html';
	}

	return supportedSyntaxed[syntax](tree, profile, options);
};

/**
 * Check if given syntax is supported
 * @param {String} syntax
 * @return {Boolean}
 */
function supports(syntax) {
	return !!syntax && syntax in supportedSyntaxed;
}

/**
 * A wrapper for holding CSS value
 */
var CSSValue = function CSSValue() {
	this.type = 'css-value';
	this.value = [];
};

var prototypeAccessors$2 = { size: {} };

prototypeAccessors$2.size.get = function () {
	return this.value.length;
};

CSSValue.prototype.add = function add (value) {
	this.value.push(value);
};

CSSValue.prototype.has = function has (value) {
	return this.value.indexOf(value) !== -1;
};

CSSValue.prototype.toString = function toString () {
	return this.value.join(' ');
};

Object.defineProperties( CSSValue.prototype, prototypeAccessors$2 );

var HASH$1 = 35; // #
var DOT$1$1  = 46; // .

/**
 * Consumes a color token from given string
 * @param  {StreamReader} stream
 * @return {Color} Returns consumend color object, `undefined` otherwise
 */
var consumeColor = function(stream) {
	// supported color variations:
	// #abc   → #aabbccc
	// #0     → #000000
	// #fff.5 → rgba(255, 255, 255, 0.5)
	// #t     → transparent
	if (stream.peek() === HASH$1) {
		stream.start = stream.pos;
		stream.next();

		stream.eat(116) /* t */ || stream.eatWhile(isHex);
		var base = stream.current();

		// a hex color can be followed by `.num` alpha value
		stream.start = stream.pos;
		if (stream.eat(DOT$1$1) && !stream.eatWhile(isNumber$1)) {
			throw stream.error('Unexpected character for alpha value of color');
		}

		return new Color(base, stream.current());
	}
};

var Color = function Color(value, alpha) {
	this.type = 'color';
	this.raw = value;
	this.alpha = Number(alpha != null && alpha !== '' ? alpha : 1);
	value = value.slice(1); // remove #

	var r = 0, g = 0, b = 0;

	if (value === 't') {
		this.alpha = 0;
	} else {
		switch (value.length) {
			case 0:
				break;

			case 1:
				r = g = b = value + value;
				break;

			case 2:
				r = g = b = value;
				break;

			case 3:
				r = value[0] + value[0];
				g = value[1] + value[1];
				b = value[2] + value[2];
				break;

			default:
				value += value;
				r = value.slice(0, 2);
				g = value.slice(2, 4);
				b = value.slice(4, 6);
		}
	}

	this.r = parseInt(r, 16);
	this.g = parseInt(g, 16);
	this.b = parseInt(b, 16);
};

/**
	 * Output current color as hex value
	 * @param {Boolean} shor Produce short value (e.g. #fff instead of #ffffff), if possible
	 * @return {String}
	 */
Color.prototype.toHex = function toHex$1 (short) {
	var fn = (short && isShortHex(this.r) && isShortHex(this.g) && isShortHex(this.b))
		? toShortHex : toHex;

	return '#' + fn(this.r)  + fn(this.g) + fn(this.b);
};

/**
	 * Output current color as `rgba?(...)` CSS color
	 * @return {String}
	 */
Color.prototype.toRGB = function toRGB () {
	var values = [this.r, this.g, this.b];
	if (this.alpha !== 1) {
		values.push(this.alpha.toFixed(8).replace(/\.?0+$/, ''));
	}

	return ((values.length === 3 ? 'rgb' : 'rgba') + "(" + (values.join(', ')) + ")");
};

Color.prototype.toString = function toString (short) {
	if (!this.r && !this.g && !this.b && !this.alpha) {
		return 'transparent';
	}
	return this.alpha === 1 ? this.toHex(short) : this.toRGB();
};

/**
 * Check if given code is a hex value (/0-9a-f/)
 * @param  {Number}  code
 * @return {Boolean}
 */
function isHex(code) {
	return isNumber$1(code) || isAlpha$1(code, 65, 70); // A-F
}

function isShortHex(hex) {
	return !(hex % 17);
}

function toShortHex(num) {
	return (num >> 4).toString(16);
}

function toHex(num) {
	return pad$1(num.toString(16), 2);
}

function pad$1(value, len) {
	while (value.length < len) {
		value = '0' + value;
	}
	return value;
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAlphaNumericWord(code) {
	return isNumber$1(code) || isAlphaWord(code);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAlphaWord(code) {
	return code === 95 /* _ */ || isAlpha$1(code);
}

var PERCENT = 37; // %
var DOT$1$2     = 46; // .
var DASH$1    = 45; // -

/**
 * Consumes numeric CSS value (number with optional unit) from current stream,
 * if possible
 * @param  {StreamReader} stream
 * @return {NumericValue}
 */
var consumeNumericValue = function(stream) {
	stream.start = stream.pos;
	if (eatNumber(stream)) {
		var num = stream.current();
		stream.start = stream.pos;

		// eat unit, which can be a % or alpha word
		stream.eat(PERCENT) || stream.eatWhile(isAlphaWord);
		return new NumericValue(num, stream.current());
	}
};

/**
 * A numeric CSS value with optional unit
 */
var NumericValue = function NumericValue(value, unit) {
	this.type = 'numeric';
	this.value = Number(value);
	this.unit = unit || '';
};

NumericValue.prototype.toString = function toString () {
	return ("" + (this.value) + (this.unit));
};

/**
 * Eats number value from given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if number was consumed
 */
function eatNumber(stream) {
	var start = stream.pos;
	var negative = stream.eat(DASH$1);
	var hadDot = false, consumed = false, code;

	while (!stream.eof()) {
		code = stream.peek();

		// either a second dot or not a number: stop parsing
		if (code === DOT$1$2 ? hadDot : !isNumber$1(code)) {
			break;
		}

		consumed = true;

		if (code === DOT$1$2) {
			hadDot = true;
		}

		stream.next();
	}

	if (negative && !consumed) {
		// edge case: consumed dash only, bail out
		stream.pos = start;
	}

	return start !== stream.pos;
}

var DOLLAR$1 = 36; // $
var DASH$2   = 45; // -
var AT$1     = 64; // @

/**
 * Consumes a keyword: either a variable (a word that starts with $ or @) or CSS
 * keyword or shorthand
 * @param  {StreamReader} stream
 * @param  {Boolean} [short] Use short notation for consuming value.
 * The difference between “short” and “full” notation is that first one uses
 * alpha characters only and used for extracting keywords from abbreviation,
 * while “full” notation also supports numbers and dashes
 * @return {String} Consumed variable
 */
var consumeKeyword = function(stream, short) {
	stream.start = stream.pos;

	if (stream.eat(DOLLAR$1) || stream.eat(AT$1)) {
		// SCSS or LESS variable
		stream.eatWhile(isVariableName);
	} else if (short) {
		stream.eatWhile(isAlphaWord);
	} else {
		stream.eatWhile(isKeyword);
	}

	return stream.start !== stream.pos ? new Keyword(stream.current()) : null;
};

var Keyword = function Keyword(value) {
	this.type = 'keyword';
	this.value = value;
};

Keyword.prototype.toString = function toString () {
	return this.value;
};

function isKeyword(code) {
	return isAlphaNumericWord(code) || code === DASH$2;
}

function isVariableName(code) {
	return code === 45 /* - */ || isAlphaNumericWord(code);
}

var opt$1$1 = { throws: true };

/**
 * Consumes 'single' or "double"-quoted string from given string, if possible
 * @param  {StreamReader} stream
 * @return {String}
 */
var consumeQuoted$1 = function(stream) {
	if (eatQuoted$1(stream, opt$1$1)) {
		return new QuotedString(stream.current());
	}
};

var QuotedString = function QuotedString(value) {
	this.type = 'string';
	this.value = value;
};

QuotedString.prototype.toString = function toString () {
	return this.value;
};

var LBRACE = 40; // (
var RBRACE = 41; // )
var COMMA  = 44; // ,

/**
 * Consumes arguments from given string.
 * Arguments are comma-separated list of CSS values inside round braces, e.g.
 * `(1, a2, 'a3')`. Nested lists and quoted strings are supported
 * @param  {StreamReader} stream
 * @return {Array}        Array of arguments, `null` if arguments cannot be consumed
 */
function consumeArgumentList(stream) {
	if (!stream.eat(LBRACE)) {
		// not an argument list
		return null;
	}

	var level = 1, code, arg;
	var argsList = [];

	while (!stream.eof()) {
		if (arg = consumeArgument(stream)) {
			argsList.push(arg);
		} else {
			// didn’t consumed argument, expect argument separator or end-of-arguments
			stream.eatWhile(isWhiteSpace$1);

			if (stream.eat(RBRACE)) {
				// end of arguments list
				break;
			}

			if (!stream.eat(COMMA)) {
				throw stream.error('Expected , or )');
			}
		}
	}

	return argsList;
}

/**
 * Consumes a single argument. An argument is a `CSSValue`, e.g. it could be
 * a space-separated string of value
 * @param  {StreamReader} stream
 * @return {CSSValue}
 */
function consumeArgument(stream) {
	var result = new CSSValue();
	var value;

	while (!stream.eof()) {
		stream.eatWhile(isWhiteSpace$1);
		value = consumeNumericValue(stream) || consumeColor(stream)
			|| consumeQuoted$1(stream) || consumeKeywordOrFunction(stream);

		if (!value) {
			break;
		}

		result.add(value);
	}

	return result.size ? result : null;
}

/**
 * Consumes either function call like `foo()` or keyword like `foo`
 * @param  {StreamReader} stream
 * @return {Keyword|FunctionCall}
 */
function consumeKeywordOrFunction(stream) {
	var kw = consumeKeyword(stream);
	if (kw) {
		var args = consumeArgumentList(stream);
		return args ? new FunctionCall(kw.toString(), args) : kw;
	}
}

var FunctionCall = function FunctionCall(name, args) {
	this.type = 'function';
	this.name = name;
	this.args = args || [];
};

FunctionCall.prototype.toString = function toString () {
	return ((this.name) + "(" + (this.args.join(', ')) + ")");
};

var EXCL$1   = 33; // !
var DOLLAR$1$1 = 36; // $
var PLUS   = 43; // +
var DASH   = 45; // -
var COLON$2  = 58; // :
var AT     = 64; // @

/**
 * Parses given Emmet CSS abbreviation and returns it as parsed Node tree
 * @param {String} abbr
 * @return {Node}
 */
var index$4 = function(abbr) {
	var root = new Node();
	var stream = new StreamReader$1(abbr);
	var node;

	while (!stream.eof()) {
		var node$1 = new Node(consumeIdent(stream));
		node$1.value = consumeValue(stream);

		var args = consumeArgumentList(stream);
		if (args) {
			// technically, arguments in CSS are anonymous Emmet Node attributes,
			// but since Emmet can support only one anonymous, `null`-name
			// attribute (for good reasons), we’ll use argument index as name
			for (var i = 0; i < args.length; i++) {
				node$1.setAttribute(String(i), args[i]);
			}
		}

		// Consume `!important` modifier at the end of expression
		if (stream.eat(EXCL$1)) {
			node$1.value.add('!');
		}

		root.appendChild(node$1);

		// CSS abbreviations cannot be nested, only listed
		if (!stream.eat(PLUS)) {
			break;
		}
	}

	if (!stream.eof()) {
		throw stream.error('Unexpected character');
	}

	return root;
};

/**
 * Consumes CSS property identifier from given stream
 * @param  {StreamReader} stream
 * @return {String}
 */
function consumeIdent(stream) {
	stream.start = stream.pos;
	stream.eatWhile(isIdentPrefix);
	stream.eatWhile(isIdent$1);
	return stream.start !== stream.pos ? stream.current() : null;
}

/**
 * Consumes embedded value from Emmet CSS abbreviation stream
 * @param  {StreamReader} stream
 * @return {CSSValue}
 */
function consumeValue(stream) {
	var values = new CSSValue();
	var value;

	while (!stream.eof()) {
		// use colon as value separator
		stream.eat(COLON$2);
		if (value = consumeNumericValue(stream) || consumeColor(stream)) {
			// edge case: a dash after unit-less numeric value or color should
			// be treated as value separator, not negative sign
			if (!value.unit) {
				stream.eat(DASH);
			}
		} else {
			stream.eat(DASH);
			value = consumeKeyword(stream, true);
		}

		if (!value) {
			break;
		}

		values.add(value);
	}

	return values;
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isIdent$1(code) {
	return isAlphaWord(code);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isIdentPrefix(code) {
	return code === AT || code === DOLLAR$1$1 || code === EXCL$1;
}

var DASH$1$1 = 45; // -

/**
 * Calculates fuzzy match score of how close `abbr` matches given `string`.
 * @param  {String} abbr        Abbreviation to score
 * @param  {String} string      String to match
 * @param  {Number} [fuzziness] Fuzzy factor
 * @return {Number}             Match score
 */
var stringScore = function(abbr, string) {
    if (abbr === string) {
        return 1;
    }

    // a string MUST start with the same character as abbreviation
    if (!string || abbr.charCodeAt(0) !== string.charCodeAt(0)) {
        return 0;
    }

    var abbrLength = abbr.length;
    var stringLength = string.length;
    var i = 1, j = 1, score = stringLength;
    var ch1, ch2, found, acronym;

    while (i < abbrLength) {
        ch1 = abbr.charCodeAt(i);
        found = false;
        acronym = false;

        while (j < stringLength) {
            ch2 = string.charCodeAt(j);

            if (ch1 === ch2) {
                found = true;
                score += (stringLength - j) * (acronym ? 2 : 1);
                break;
            }

            // add acronym bonus for exactly next match after unmatched `-`
            acronym = ch2 === DASH$1$1;
            j++;
        }

        if (!found) {
            break;
        }

        i++;
    }

    return score && score * (i / abbrLength) / sum(stringLength);
};

/**
 * Calculates sum of first `n` natural numbers, e.g. 1+2+3+...n
 * @param  {Number} n
 * @return {Number}
 */
function sum(n) {
    return n * (n + 1) / 2;
}

var reProperty = /^([a-z\-]+)(?:\s*:\s*([^\n\r]+))?$/;
var DASH$1$2 = 45; // -

/**
 * Creates a special structure for resolving CSS properties from plain CSS
 * snippets.
 * Almost all CSS snippets are aliases for real CSS properties with available
 * value variants, optionally separated by `|`. Most values are keywords that
 * can be fuzzy-resolved as well. Some CSS properties are shorthands for other,
 * more specific properties, like `border` and `border-style`. For such cases
 * keywords from more specific properties should be available in shorthands too.
 * @param {Snippet[]} snippets
 * @return {CSSSnippet[]}
 */
var cssSnippets = function(snippets) {
    return nest( snippets.map(function (snippet) { return new CSSSnippet(snippet.key, snippet.value); }) );
};

var CSSSnippet = function CSSSnippet(key, value) {
    this.key = key;
    this.value = value;
    this.property = null;

    // detect if given snippet is a property
    var m = value && value.match(reProperty);
    if (m) {
        this.property = m[1];
        this.value = m[2];
    }

    this.dependencies = [];
};

var prototypeAccessors$3 = { defaulValue: {} };

CSSSnippet.prototype.addDependency = function addDependency (dep) {
    this.dependencies.push(dep);
};

prototypeAccessors$3.defaulValue.get = function () {
    return this.value != null ? splitValue(this.value)[0] : null;
};

/**
 * Returns list of unique keywords for current CSS snippet and its dependencies
 * @return {String[]}
 */
CSSSnippet.prototype.keywords = function keywords () {
    var stack = [];
    var keywords = new Set();
    var i = 0, item, candidates;

    if (this.property) {
        // scan valid CSS-properties only
        stack.push(this);
    }

    while (i < stack.length) {
        // NB Keep items in stack instead of push/pop to avoid possible
        // circular references
        item = stack[i++];

        if (item.value) {
            candidates = splitValue(item.value).filter(isKeyword$1);

            // extract possible keywords from snippet value
            for (var j = 0; j < candidates.length; j++) {
                keywords.add(candidates[j].trim());
            }

            // add dependencies into scan stack
            for (var j$1 = 0, deps = item.dependencies; j$1 < deps.length; j$1++) {
                if (stack.indexOf(deps[j$1]) === -1) {
                    stack.push(deps[j$1]);
                }
            }
        }
    }

    return Array.from(keywords);
};

Object.defineProperties( CSSSnippet.prototype, prototypeAccessors$3 );

/**
 * Nests more specific CSS properties into shorthand ones, e.g.
 * background-position-x -> background-position -> background
 * @param  {CSSSnippet[]} snippets
 * @return {CSSSnippet[]}
 */
function nest(snippets) {
    snippets = snippets.sort(snippetsSort);
    var stack = [];

    // For sorted list of CSS properties, create dependency graph where each
    // shorthand property contains its more specific one, e.g.
    // backgound -> background-position -> background-position-x
    for (var i = 0, cur = (void 0), prev = (void 0); i < snippets.length; i++) {
        cur = snippets[i];

        if (!cur.property) {
            // not a CSS property, skip it
            continue;
        }

        // Check if current property belongs to one from parent stack.
        // Since `snippets` array is sorted, items are perfectly aligned
        // from shorthands to more specific variants
        while (stack.length) {
            prev = stack[stack.length - 1];

            if (cur.property.indexOf(prev.property) === 0
                && cur.property.charCodeAt(prev.property.length) === DASH$1$2) {
                prev.addDependency(cur);
                stack.push(cur);
                break;
            }

            stack.pop();
        }

        if (!stack.length) {
            stack.push(cur);
        }
    }

    return snippets;
}

/**
 * A sorting function for array of snippets
 * @param  {CSSSnippet} a
 * @param  {CSSSnippet} b
 * @return {Number}
 */
function snippetsSort(a, b) {
    if (a.key === b.key) {
        return 0;
    }

    return a.key < b.key ? -1 : 1;
}

/**
 * Check if given string is a keyword candidate
 * @param  {String}  str
 * @return {Boolean}
 */
function isKeyword$1(str) {
    return /^\s*[\w\-]+/.test(str);
}

function splitValue(value) {
    return String(value).split('|');
}

var globalKeywords = ['auto', 'inherit', 'unset'];
var unitlessProperties = [
    'z-index', 'line-height', 'opacity', 'font-weight', 'zoom',
    'flex', 'flex-grow', 'flex-shrink'
];
var unitAliases = {
    e :'em',
    p: '%',
    x: 'ex',
    r: 'rem'
};

/**
 * For every node in given `tree`, finds matching snippet from `registry` and
 * updates node with snippet data.
 *
 * This resolver uses fuzzy matching for searching matched snippets and their
 * keyword values.
 */

var index$5 = function(tree, registry) {
	var snippets = convertToCSSSnippets(registry);
	tree.walk(function (node) { return resolveNode$1(node, snippets); });
	return tree;
};

function convertToCSSSnippets(registry) {
    return cssSnippets(registry.all({type: 'string'}))
}

/**
 * Resolves given node: finds matched CSS snippets using fuzzy match and resolves
 * keyword aliases from node value
 * @param  {Node} node
 * @param  {CSSSnippet[]} snippets
 * @return {Node}
 */
function resolveNode$1(node, snippets) {
	var snippet = findBestMatch(node.name, snippets, 'key');

	if (!snippet) {
		// Edge case: `!important` snippet
		return node.name === '!' ? setNodeAsText(node, '!important') : node;
	}

	return snippet.property
		? resolveAsProperty(node, snippet)
		: resolveAsSnippet(node, snippet);
}

/**
 * Resolves given parsed abbreviation node as CSS propery
 * @param {Node} node
 * @param {CSSSnippet} snippet
 * @return {Node}
 */
function resolveAsProperty(node, snippet) {
    var abbr = node.name;
	node.name = snippet.property;

	if (node.value && typeof node.value === 'object') {
		// resolve keyword shortcuts
		var keywords = snippet.keywords();

		if (!node.value.size) {
			// no value defined, try to resolve unmatched part as a keyword alias
			var kw = findBestMatch(getUnmatchedPart(abbr, snippet.key), keywords);

            if (!kw) {
                // no matching value, try to get default one
                kw = snippet.defaulValue;
                if (kw && kw.indexOf('${') === -1) {
                    // Quick and dirty test for existing field. If not, wrap
                    // default value in a field
                    kw = "${1:" + kw + "}";
                }
            }

			if (kw) {
				node.value.add(kw);
			}
		} else {
			// replace keyword aliases in current node value
			for (var i = 0, token = (void 0); i < node.value.value.length; i++) {
				token = node.value.value[i];

				if (token === '!') {
					token = (!i ? '${1} ' : '') + "!important";
				} else if (isKeyword$1$1(token)) {
					token = findBestMatch(token.value, keywords)
						|| findBestMatch(token.value, globalKeywords)
						|| token;
				} else if (isNumericValue(token)) {
                    token = resolveNumericValue(node.name, token);
                }

                node.value.value[i] = token;
			}
		}
	}

	return node;
}

/**
 * Resolves given parsed abbreviation node as a snippet: a plain code chunk
 * @param {Node} node
 * @param {CSSSnippet} snippet
 * @return {Node}
 */
function resolveAsSnippet(node, snippet) {
	return setNodeAsText(node, snippet.value);
}

/**
 * Sets given parsed abbreviation node as a text snippet
 * @param {Node} node
 * @param {String} text
 * @return {Node}
 */
function setNodeAsText(node, text) {
	node.name = null;
	node.value = text;
	return node;
}

/**
 * Finds best matching item from `items` array
 * @param {String} abbr  Abbreviation to match
 * @param {Array}  items List of items for match
 * @param {String} [key] If `items` is a list of objects, use `key` as object
 * property to test against
 * @return {*}
 */
function findBestMatch(abbr, items, key) {
	if (!abbr) {
		return null;
	}

	var matchedItem = null;
	var maxScore = 0;

	for (var i = 0, item = (void 0); i < items.length; i++) {
		item = items[i];
		var score = stringScore(abbr, getScoringPart(item, key));

		if (score === 1) {
			// direct hit, no need to look further
			return item;
		}

		if (score && score >= maxScore) {
			maxScore = score;
			matchedItem = item;
		}
	}

	return matchedItem;
}

function getScoringPart(item, key) {
    var value = item && typeof item === 'object' ? item[key] : item;
    var m = (value || '').match(/^[\w-@]+/);
    return m ? m[0] : value;
}

/**
 * Returns a part of `abbr` that wasn’t directly matched agains `string`.
 * For example, if abbreviation `poas` is matched against `position`, the unmatched part will be `as`
 * since `a` wasn’t found in string stream
 * @param {String} abbr
 * @param {String} string
 * @return {String}
 */
function getUnmatchedPart(abbr, string) {
	for (var i = 0, lastPos = 0; i < abbr.length; i++) {
		lastPos = string.indexOf(abbr[i], lastPos);
		if (lastPos === -1) {
			return abbr.slice(i);
		}
        lastPos++;
	}

	return '';
}

/**
 * Check if given CSS value token is a keyword
 * @param {*} token
 * @return {Boolean}
 */
function isKeyword$1$1(token) {
	return tokenTypeOf(token, 'keyword');
}

/**
 * Check if given CSS value token is a numeric value
 * @param  {*}  token
 * @return {Boolean}
 */
function isNumericValue(token) {
    return tokenTypeOf(token, 'numeric');
}

function tokenTypeOf(token, type) {
	return token && typeof token === 'object' && token.type === type;
}

/**
 * Resolves numeric value for given CSS property
 * @param  {String} property    CSS property name
 * @param  {NumericValue} token CSS numeric value token
 * @return {NumericValue}
 */
function resolveNumericValue(property, token) {
    if (token.unit) {
        token.unit = unitAliases[token.unit] || token.unit;
    } else if (token.value !== 0 && unitlessProperties.indexOf(property) === -1) {
        // use `px` for integers, `em` for floats
        // NB: num|0 is a quick alternative to Math.round(0)
        token.unit = token.value === (token.value|0) ? 'px' : 'em';
    }

    return token;
}

var defaultOptions$4 = {
	shortHex: true,
	format: {
		between: ': ',
		after: ';'
	}
};

/**
 * Renders given parsed Emmet CSS abbreviation as CSS-like
 * stylesheet, formatted according to `profile` options
 * @param  {Node}     tree    Parsed Emmet abbreviation
 * @param  {Profile}  profile Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
function css(tree, profile, options) {
	options = Object.assign({}, defaultOptions$4, options);

	return render(tree, options.field, function (outNode) {
		var node = outNode.node;
		var value = String(node.value || '');

		if (node.attributes.length) {
			var fieldValues = node.attributes.map(function (attr) { return stringifyAttribute(attr, options); });
			value = injectFields(value, fieldValues);
		}

		outNode.open = node.name && profile.name(node.name);
		outNode.afterOpen = options.format.between;
		outNode.text = outNode.renderFields(value || null);

		if (outNode.open) {
			outNode.afterText = options.format.after;
		}

		if (profile.get('format')) {
			outNode.newline = '\n';
			if (tree.lastChild !== node) {
				outNode.afterText += outNode.newline;
			}
		}

		return outNode;
	});
}

/**
 * Injects given field values at each field of given string
 * @param  {String}   string
 * @param  {String[]} attributes
 * @return {FieldString}
 */
function injectFields(string, values) {
	var fieldsModel = parse$2$1(string);
	var fieldsAmount = fieldsModel.fields.length;

	if (fieldsAmount) {
		values = values.slice();
		if (values.length > fieldsAmount) {
			// More values that output fields: collapse rest values into
			// a single token
			values = values.slice(0, fieldsAmount - 1)
				.concat(values.slice(fieldsAmount - 1).join(', '));
		}

		while (values.length) {
			var value = values.shift();
			var field = fieldsModel.fields.shift();
			var delta = value.length - field.length;

			fieldsModel.string = fieldsModel.string.slice(0, field.location)
				+ value
				+ fieldsModel.string.slice(field.location + field.length);

			// Update location of the rest fields in string
			for (var i = 0, il = fieldsModel.fields.length; i < il; i++) {
				fieldsModel.fields[i].location += delta;
			}
		}
	}

	return fieldsModel;
}

function stringifyAttribute(attr, options) {
	if (attr.value && typeof attr.value === 'object' && attr.value.type === 'css-value') {
		return attr.value.value
		.map(function (token) {
			if (token && typeof token === 'object') {
				return token.type === 'color'
					? token.toString(options.shortHex)
					: token.toString();
			}

			return String(token);
		})
		.join(' ');
	}

	return attr.value != null ? String(attr.value) : '';
}

var syntaxFormat = {
	css: {
		between: ': ',
		after: ';'
	},
	scss: 'css',
	less: 'css',
	sass: {
		between: ': ',
		after: ''
	},
	stylus: {
		between: ' ',
		after: ''
	}
};

/**
 * Outputs given parsed abbreviation in specified stylesheet syntax
 * @param {Node}     tree     Parsed abbreviation tree
 * @param {Profile}  profile  Output profile
 * @param {String}   [syntax] Output syntax. If not given, `css` syntax is used
 * @param {Function} options.field A function to output field/tabstop for
 * host editor. This function takes two arguments: `index` and `placeholder` and
 * should return a string that represents tabstop in host editor. By default
 * only a placeholder is returned
 * @example
 * {
 * 	field(index, placeholder) {
 * 		// return field in TextMate-style, e.g. ${1} or ${2:foo}
 * 		return `\${${index}${placeholder ? ':' + placeholder : ''}}`;
 *  }
 * }
 * @return {String}
 */
var index$6 = function(tree, profile, syntax, options) {
	if (typeof syntax === 'object') {
		options = syntax;
		syntax = null;
	}

	if (!supports$1(syntax)) {
		// fallback to CSS if given syntax is not supported
		syntax = 'css';
	}

	options = Object.assign({}, options, {
		format: getFormat(syntax, options)
	});

	// CSS abbreviations doesn’t support nesting so simply
	// output root node children
	return css(tree, profile, options);
};

/**
 * Check if given syntax is supported
 * @param {String} syntax
 * @return {Boolean}
 */
function supports$1(syntax) {
	return !!syntax && syntax in syntaxFormat;
}

/**
 * Returns formatter object for given syntax
 * @param  {String} syntax
 * @param  {Object} [options]
 * @return {Object} Formatter object as defined in `syntaxFormat`
 */
function getFormat(syntax, options) {
	var format = syntaxFormat[syntax];
	if (typeof format === 'string') {
		format = syntaxFormat[format];
	}

	return Object.assign({}, format, options && options.format);
}

var html$1 = {
	"a": "a[href]",
	"a:link": "a[href='http://${0}']",
	"a:mail": "a[href='mailto:${0}']",
	"abbr": "abbr[title]",
	"acr|acronym": "acronym[title]",
	"base": "base[href]/",
	"basefont": "basefont/",
	"br": "br/",
	"frame": "frame/",
	"hr": "hr/",
	"bdo": "bdo[dir]",
	"bdo:r": "bdo[dir=rtl]",
	"bdo:l": "bdo[dir=ltr]",
	"col": "col/",
	"link": "link[rel=stylesheet href]/",
	"link:css": "link[href='${1:style}.css']",
	"link:print": "link[href='${1:print}.css' media=print]",
	"link:favicon": "link[rel='shortcut icon' type=image/x-icon href='${1:favicon.ico}']",
	"link:touch": "link[rel=apple-touch-icon href='${1:favicon.png}']",
	"link:rss": "link[rel=alternate type=application/rss+xml title=RSS href='${1:rss.xml}']",
	"link:atom": "link[rel=alternate type=application/atom+xml title=Atom href='${1:atom.xml}']",
	"link:im|link:import": "link[rel=import href='${1:component}.html']",
	"meta": "meta/",
	"meta:utf": "meta[http-equiv=Content-Type content='text/html;charset=UTF-8']",
	"meta:vp": "meta[name=viewport content='width=${1:device-width}, initial-scale=${2:1.0}']",
	"meta:compat": "meta[http-equiv=X-UA-Compatible content='${1:IE=7}']",
	"meta:edge": "meta:compat[content='${1:ie=edge}']",
	"meta:redirect": "meta[http-equiv=refresh content='0; url=${1:http://example.com}']",
	"style": "style",
	"script": "script[!src]",
	"script:src": "script[src]",
	"img": "img[src alt]/",
	"img:s|img:srcset": "img[srcset src alt]",
	"img:z|img:sizes": "img[sizes srcset src alt]",
	"picture": "picture",
	"src|source": "source/",
	"src:sc|source:src": "source[src type]",
	"src:s|source:srcset": "source[srcset]",
	"src:t|source:type": "source[srcset type='${1:image/}']",
	"src:z|source:sizes": "source[sizes srcset]",
	"src:m|source:media": "source[media='(${1:min-width: })' srcset]",
	"src:mt|source:media:type": "source:media[type='${2:image/}']",
	"src:mz|source:media:sizes": "source:media[sizes srcset]",
	"src:zt|source:sizes:type": "source[sizes srcset type='${1:image/}']",
	"iframe": "iframe[src frameborder=0]",
	"embed": "embed[src type]/",
	"object": "object[data type]",
	"param": "param[name value]/",
	"map": "map[name]",
	"area": "area[shape coords href alt]/",
	"area:d": "area[shape=default]",
	"area:c": "area[shape=circle]",
	"area:r": "area[shape=rect]",
	"area:p": "area[shape=poly]",
	"form": "form[action]",
	"form:get": "form[method=get]",
	"form:post": "form[method=post]",
	"label": "label[for]",
	"input": "input[type=${1:text}]/",
	"inp": "input[name=${1} id=${1}]",
	"input:h|input:hidden": "input[type=hidden name]",
	"input:t|input:text": "inp",
	"input:search": "inp[type=search]",
	"input:email": "inp[type=email]",
	"input:url": "inp[type=url]",
	"input:p|input:password": "inp[type=password]",
	"input:datetime": "inp[type=datetime]",
	"input:date": "inp[type=date]",
	"input:datetime-local": "inp[type=datetime-local]",
	"input:month": "inp[type=month]",
	"input:week": "inp[type=week]",
	"input:time": "inp[type=time]",
	"input:tel": "inp[type=tel]",
	"input:number": "inp[type=number]",
	"input:color": "inp[type=color]",
	"input:c|input:checkbox": "inp[type=checkbox]",
	"input:r|input:radio": "inp[type=radio]",
	"input:range": "inp[type=range]",
	"input:f|input:file": "inp[type=file]",
	"input:s|input:submit": "input[type=submit value]",
	"input:i|input:image": "input[type=image src alt]",
	"input:b|input:button": "input[type=button value]",
    "input:reset": "input:button[type=reset]",
	"isindex": "isindex/",
	"select": "select[name=${1} id=${1}]",
	"select:d|select:disabled": "select[disabled.]",
	"opt|option": "option[value]",
	"textarea": "textarea[name=${1} id=${1} cols=${2:30} rows=${3:10}]",
	"marquee": "marquee[behavior direction]",
	"menu:c|menu:context": "menu[type=context]",
	"menu:t|menu:toolbar": "menu[type=toolbar]",
	"video": "video[src]",
	"audio": "audio[src]",
	"html:xml": "html[xmlns=http://www.w3.org/1999/xhtml]",
	"keygen": "keygen/",
	"command": "command/",
	"btn:s|button:s|button:submit" : "button[type=submit]",
	"btn:r|button:r|button:reset" : "button[type=reset]",
	"btn:d|button:d|button:disabled" : "button[disabled.]",
	"fst:d|fset:d|fieldset:d|fieldset:disabled" : "fieldset[disabled.]",

	"bq": "blockquote",
	"fig": "figure",
	"figc": "figcaption",
	"pic": "picture",
	"ifr": "iframe",
	"emb": "embed",
	"obj": "object",
	"cap": "caption",
	"colg": "colgroup",
	"fst": "fieldset",
	"btn": "button",
	"optg": "optgroup",
	"tarea": "textarea",
	"leg": "legend",
	"sect": "section",
	"art": "article",
	"hdr": "header",
	"ftr": "footer",
	"adr": "address",
	"dlg": "dialog",
	"str": "strong",
	"prog": "progress",
	"mn": "main",
	"tem": "template",
	"fset": "fieldset",
	"datag": "datagrid",
	"datal": "datalist",
	"kg": "keygen",
	"out": "output",
	"det": "details",
	"cmd": "command",

	"ri:d|ri:dpr": "img:s",
	"ri:v|ri:viewport": "img:z",
	"ri:a|ri:art": "pic>src:m+img",
	"ri:t|ri:type": "pic>src:t+img",

	"!!!": "{<!DOCTYPE html>}",
	"doc": "html[lang=${lang}]>(head>meta[charset=${charset}]+meta:vp+meta:edge+title{${1:Document}})+body",
	"!|html:5": "!!!+doc",

	"c": "{<!-- ${0} -->}",
	"cc:ie": "{<!--[if IE]>${0}<![endif]-->}",
	"cc:noie": "{<!--[if !IE]><!-->${0}<!--<![endif]-->}"
};

var css$1 = {
	"@f": "@font-face {\n\tfont-family: ${1};\n\tsrc: url(${1});\n}",
	"@ff": "@font-face {\n\tfont-family: '${1:FontName}';\n\tsrc: url('${2:FileName}.eot');\n\tsrc: url('${2:FileName}.eot?#iefix') format('embedded-opentype'),\n\t\t url('${2:FileName}.woff') format('woff'),\n\t\t url('${2:FileName}.ttf') format('truetype'),\n\t\t url('${2:FileName}.svg#${1:FontName}') format('svg');\n\tfont-style: ${3:normal};\n\tfont-weight: ${4:normal};\n}",
	"@i|@import": "@import url(${0});",
	"@kf": "@keyframes ${1:identifier} {\n\t${2}\n}",
	"@m|@media": "@media ${1:screen} {\n\t${0}\n}",
	"ac": "align-content:flex-start|flex-end|center|space-between|space-around|stretch",
	"ai": "align-items:flex-start|flex-end|center|baseline|stretch",
	"anim": "animation:${1:name} ${2:duration} ${3:timing-function} ${4:delay} ${5:iteration-count} ${6:direction} ${7:fill-mode}",
	"animdel": "animation-delay:${1:time}",
	"animdir": "animation-direction:normal|reverse|alternate|alternate-reverse",
	"animdur": "animation-duration:${1:0}s",
	"animfm": "animation-fill-mode:both|forwards|backwards",
	"animic": "animation-iteration-count:1|infinite",
	"animn": "animation-name",
	"animps": "animation-play-state:running|paused",
	"animtf": "animation-timing-function:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(${1:0.1}, ${2:0.7}, ${3:1.0}, ${3:0.1})",
	"ap": "appearance:none",
	"as": "align-self:auto|flex-start|flex-end|center|baseline|stretch",
	"b": "bottom",
	"bd": "border:${1:1px} ${2:solid} ${3:#000}",
	"bdb": "border-bottom:${1:1px} ${2:solid} ${3:#000}",
	"bdbc": "border-bottom-color:#${1:000}",
	"bdbi": "border-bottom-image:url(${0})",
	"bdbk": "border-break:close",
	"bdbli": "border-bottom-left-image:url(${0})|continue",
	"bdblrs": "border-bottom-left-radius",
	"bdbri": "border-bottom-right-image:url(${0})|continue",
	"bdbrrs": "border-bottom-right-radius",
	"bdbs": "border-bottom-style",
	"bdbw": "border-bottom-width",
	"bdc": "border-color:#${1:000}",
	"bdci": "border-corner-image:url(${0})|continue",
	"bdcl": "border-collapse:collapse|separate",
	"bdf": "border-fit:repeat|clip|scale|stretch|overwrite|overflow|space",
	"bdi": "border-image:url(${0})",
	"bdl": "border-left:${1:1px} ${2:solid} ${3:#000}",
	"bdlc": "border-left-color:#${1:000}",
	"bdlen": "border-length",
	"bdli": "border-left-image:url(${0})",
	"bdls": "border-left-style",
	"bdlw": "border-left-width",
	"bdr": "border-right:${1:1px} ${2:solid} ${3:#000}",
	"bdrc": "border-right-color:#${1:000}",
	"bdri": "border-right-image:url(${0})",
	"bdrs": "border-radius",
	"bdrst": "border-right-style",
	"bdrw": "border-right-width",
	"bds": "border-style:hidden|dotted|dashed|solid|double|dot-dash|dot-dot-dash|wave|groove|ridge|inset|outset",
	"bdsp": "border-spacing",
	"bdt": "border-top:${1:1px} ${2:solid} ${3:#000}",
	"bdtc": "border-top-color:#${1:000}",
	"bdti": "border-top-image:url(${0})",
	"bdtli": "border-top-left-image:url(${0})|continue",
	"bdtlrs": "border-top-left-radius",
	"bdtri": "border-top-right-image:url(${0})|continue",
	"bdtrrs": "border-top-right-radius",
	"bdts": "border-top-style",
	"bdtw": "border-top-width",
	"bdw": "border-width",
	"bfv": "backface-visibility:hidden|visible",
	"bg": "background:#${1:000}",
	"bga": "background-attachment:fixed|scroll",
	"bgbk": "background-break:bounding-box|each-box|continuous",
	"bgc": "background-color:#${1:fff}",
	"bgcp": "background-clip:padding-box|border-box|content-box|no-clip",
	"bgi": "background-image:url(${0})",
	"bgo": "background-origin:padding-box|border-box|content-box",
	"bgp": "background-position:${1:0} ${2:0}",
	"bgpx": "background-position-x",
	"bgpy": "background-position-y",
	"bgr": "background-repeat:no-repeat|repeat-x|repeat-y|space|round",
	"bgsz": "background-size:contain|cover",
	"bxsh": "box-shadow:${1:inset }${2:hoff} ${3:voff} ${4:blur} ${5:color}|none",
	"bxsz": "box-sizing:border-box|content-box|border-box",
	"c": "color:#${1:000}",
	"cl": "clear:both|left|right|none",
	"cm": "/* ${0} */",
	"cnt": "content:'${0}'|normal|open-quote|no-open-quote|close-quote|no-close-quote|attr(${0})|counter(${0})|counters({$0})",
	"coi": "counter-increment",
	"colm": "columns",
	"colmc": "column-count",
	"colmf": "column-fill",
	"colmg": "column-gap",
	"colmr": "column-rule",
	"colmrc": "column-rule-color",
	"colmrs": "column-rule-style",
	"colmrw": "column-rule-width",
	"colms": "column-span",
	"colmw": "column-width",
	"cor": "counter-reset",
	"cp": "clip:auto|rect(${1:top} ${2:right} ${3:bottom} ${4:left})",
	"cps": "caption-side:top|bottom",
	"cur": "cursor:pointer|auto|default|crosshair|hand|help|move|pointer|text",
	"d": "display:block|none|flex|inline-flex|inline|inline-block|list-item|run-in|compact|table|inline-table|table-caption|table-column|table-column-group|table-header-group|table-footer-group|table-row|table-row-group|table-cell|ruby|ruby-base|ruby-base-group|ruby-text|ruby-text-group",
	"ec": "empty-cells:show|hide",
	"f": "font:${1:1em} ${2:sans-serif}",
	"fef": "font-effect:none|engrave|emboss|outline",
	"fem": "font-emphasize",
	"femp": "font-emphasize-position:before|after",
	"fems": "font-emphasize-style:none|accent|dot|circle|disc",
	"ff": "font-family:serif|sans-serif|cursive|fantasy|monospace",
	"fl": "float:left|right|none",
	"fs": "font-style:italic|normal|oblique",
	"fsm": "font-smoothing:antialiased|subpixel-antialiased|none",
	"fst": "font-stretch:normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",
	"fv": "font-variant:normal|small-caps",
	"fw": "font-weight:normal|bold|bolder|lighter",
	"fx": "flex",
	"fxb": "flex-basis:fill|max-content|min-content|fit-content|content",
	"fxd": "flex-direction:row|row-reverse|column|column-reverse",
	"fxf": "flex-flow",
	"fxg": "flex-grow",
	"fxsh": "flex-shrink",
	"fxw": "flex-wrap:nowrap|wrap|wrap-reverse",
	"fz": "font-size",
	"fza": "font-size-adjust",
	"h": "height",
	"jc": "justify-content:flex-start|flex-end|center|space-between|space-around",
	"l": "left",
	"lg": "background-image:linear-gradient(${1})",
	"lh": "line-height",
	"lis": "list-style",
	"lisi": "list-style-image",
	"lisp": "list-style-position:inside|outside",
	"list": "list-style-type:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman",
	"lts": "letter-spacing:normal",
	"m": "margin",
	"mah": "max-height",
	"mar": "max-resolution",
	"maw": "max-width",
	"mb": "margin-bottom",
	"mih": "min-height",
	"mir": "min-resolution",
	"miw": "min-width",
	"ml": "margin-left",
	"mr": "margin-right",
	"mt": "margin-top",
	"ol": "outline",
	"olc": "outline-color:#${1:000}|invert",
	"olo": "outline-offset",
	"ols": "outline-style:none|dotted|dashed|solid|double|groove|ridge|inset|outset",
	"olw": "outline-width|thin|medium|thick",
	"op": "opacity",
	"ord": "order",
	"ori": "orientation:landscape|portrait",
	"orp": "orphans",
	"ov": "overflow:hidden|visible|hidden|scroll|auto",
	"ovs": "overflow-style:scrollbar|auto|scrollbar|panner|move|marquee",
	"ovx": "overflow-x:hidden|visible|hidden|scroll|auto",
	"ovy": "overflow-y:hidden|visible|hidden|scroll|auto",
	"p": "padding",
	"pb": "padding-bottom",
	"pgba": "page-break-after:auto|always|left|right",
	"pgbb": "page-break-before:auto|always|left|right",
	"pgbi": "page-break-inside:auto|avoid",
	"pl": "padding-left",
	"pos": "position:relative|absolute|relative|fixed|static",
	"pr": "padding-right",
	"pt": "padding-top",
	"q": "quotes",
	"qen": "quotes:'\\201C' '\\201D' '\\2018' '\\2019'",
	"qru": "quotes:'\\00AB' '\\00BB' '\\201E' '\\201C'",
	"r": "right",
	"rsz": "resize:none|both|horizontal|vertical",
	"t": "top",
	"ta": "text-align:left|center|right|justify",
	"tal": "text-align-last:left|center|right",
	"tbl": "table-layout:fixed",
	"td": "text-decoration:none|underline|overline|line-through",
	"te": "text-emphasis:none|accent|dot|circle|disc|before|after",
	"th": "text-height:auto|font-size|text-size|max-size",
	"ti": "text-indent",
	"tj": "text-justify:auto|inter-word|inter-ideograph|inter-cluster|distribute|kashida|tibetan",
	"to": "text-outline:${1:0} ${2:0} ${3:#000}",
	"tov": "text-overflow:ellipsis|clip",
	"tr": "text-replace",
	"trf": "transform:${1}|skewX(${1:angle})|skewY(${1:angle})|scale(${1:x}, ${2:y})|scaleX(${1:x})|scaleY(${1:y})|scaleZ(${1:z})|scale3d(${1:x}, ${2:y}, ${3:z})|rotate(${1:angle})|rotateX(${1:angle})|rotateY(${1:angle})|rotateZ(${1:angle})|translate(${1:x}, ${2:y})|translateX(${1:x})|translateY(${1:y})|translateZ(${1:z})|translate3d(${1:tx}, ${2:ty}, ${3:tz})",
	"trfo": "transform-origin",
	"trfs": "transform-style:preserve-3d",
	"trs": "transition:${1:prop} ${2:time}",
	"trsde": "transition-delay:${1:time}",
	"trsdu": "transition-duration:${1:time}",
	"trsp": "transition-property:${1:prop}",
	"trstf": "transition-timing-function:${1:fn}",
	"tsh": "text-shadow:${1:hoff} ${2:voff} ${3:blur} ${4:#000}",
	"tt": "text-transform:uppercase|lowercase|capitalize|none",
	"tw": "text-wrap:none|normal|unrestricted|suppress",
	"us": "user-select:none",
	"v": "visibility:hidden|visible|collapse",
	"va": "vertical-align:top|super|text-top|middle|baseline|bottom|text-bottom|sub",
	"w": "width",
	"whs": "white-space:nowrap|pre|pre-wrap|pre-line|normal",
	"whsc": "white-space-collapse:normal|keep-all|loose|break-strict|break-all",
	"wid": "widows",
	"wm": "writing-mode:lr-tb|lr-tb|lr-bt|rl-tb|rl-bt|tb-rl|tb-lr|bt-lr|bt-rl",
	"wob": "word-break:normal|keep-all|break-all",
	"wos": "word-spacing",
	"wow": "word-wrap:none|unrestricted|suppress|break-word|normal",
	"z": "z-index",
	"zom": "zoom:1"
};

var index$7 = { html: html$1, css: css$1 };

var latin = {
	"common": ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipisicing", "elit"],
	"words": ["exercitationem", "perferendis", "perspiciatis", "laborum", "eveniet",
		"sunt", "iure", "nam", "nobis", "eum", "cum", "officiis", "excepturi",
		"odio", "consectetur", "quasi", "aut", "quisquam", "vel", "eligendi",
		"itaque", "non", "odit", "tempore", "quaerat", "dignissimos",
		"facilis", "neque", "nihil", "expedita", "vitae", "vero", "ipsum",
		"nisi", "animi", "cumque", "pariatur", "velit", "modi", "natus",
		"iusto", "eaque", "sequi", "illo", "sed", "ex", "et", "voluptatibus",
		"tempora", "veritatis", "ratione", "assumenda", "incidunt", "nostrum",
		"placeat", "aliquid", "fuga", "provident", "praesentium", "rem",
		"necessitatibus", "suscipit", "adipisci", "quidem", "possimus",
		"voluptas", "debitis", "sint", "accusantium", "unde", "sapiente",
		"voluptate", "qui", "aspernatur", "laudantium", "soluta", "amet",
		"quo", "aliquam", "saepe", "culpa", "libero", "ipsa", "dicta",
		"reiciendis", "nesciunt", "doloribus", "autem", "impedit", "minima",
		"maiores", "repudiandae", "ipsam", "obcaecati", "ullam", "enim",
		"totam", "delectus", "ducimus", "quis", "voluptates", "dolores",
		"molestiae", "harum", "dolorem", "quia", "voluptatem", "molestias",
		"magni", "distinctio", "omnis", "illum", "dolorum", "voluptatum", "ea",
		"quas", "quam", "corporis", "quae", "blanditiis", "atque", "deserunt",
		"laboriosam", "earum", "consequuntur", "hic", "cupiditate",
		"quibusdam", "accusamus", "ut", "rerum", "error", "minus", "eius",
		"ab", "ad", "nemo", "fugit", "officia", "at", "in", "id", "quos",
		"reprehenderit", "numquam", "iste", "fugiat", "sit", "inventore",
		"beatae", "repellendus", "magnam", "recusandae", "quod", "explicabo",
		"doloremque", "aperiam", "consequatur", "asperiores", "commodi",
		"optio", "dolor", "labore", "temporibus", "repellat", "veniam",
		"architecto", "est", "esse", "mollitia", "nulla", "a", "similique",
		"eos", "alias", "dolore", "tenetur", "deleniti", "porro", "facere",
		"maxime", "corrupti"]
};

var ru = {
	"common": ["далеко-далеко", "за", "словесными", "горами", "в стране", "гласных", "и согласных", "живут", "рыбные", "тексты"],
	"words": ["вдали", "от всех", "они", "буквенных", "домах", "на берегу", "семантика",
		"большого", "языкового", "океана", "маленький", "ручеек", "даль",
		"журчит", "по всей", "обеспечивает", "ее","всеми", "необходимыми",
		"правилами", "эта", "парадигматическая", "страна", "которой", "жаренные",
		"предложения", "залетают", "прямо", "рот", "даже", "всемогущая",
		"пунктуация", "не", "имеет", "власти", "над", "рыбными", "текстами",
		"ведущими", "безорфографичный", "образ", "жизни", "однажды", "одна",
		"маленькая", "строчка","рыбного", "текста", "имени", "lorem", "ipsum",
		"решила", "выйти", "большой", "мир", "грамматики", "великий", "оксмокс",
		"предупреждал", "о", "злых", "запятых", "диких", "знаках", "вопроса",
		"коварных", "точках", "запятой", "но", "текст", "дал", "сбить",
		"себя", "толку", "он", "собрал", "семь", "своих", "заглавных", "букв",
		"подпоясал", "инициал", "за", "пояс", "пустился", "дорогу",
		"взобравшись", "первую", "вершину", "курсивных", "гор", "бросил",
		"последний", "взгляд", "назад", "силуэт", "своего", "родного", "города",
		"буквоград", "заголовок", "деревни", "алфавит", "подзаголовок", "своего",
		"переулка", "грустный", "реторический", "вопрос", "скатился", "его",
		"щеке", "продолжил", "свой", "путь", "дороге", "встретил", "рукопись",
		"она", "предупредила",  "моей", "все", "переписывается", "несколько",
		"раз", "единственное", "что", "меня", "осталось", "это", "приставка",
		"возвращайся", "ты", "лучше", "свою", "безопасную", "страну", "послушавшись",
		"рукописи", "наш", "продолжил", "свой", "путь", "вскоре", "ему",
		"повстречался", "коварный", "составитель", "рекламных", "текстов",
		"напоивший", "языком", "речью", "заманивший", "свое", "агентство",
		"которое", "использовало", "снова", "снова", "своих", "проектах",
		"если", "переписали", "то", "живет", "там", "до", "сих", "пор"]
};

var sp = {
	"common": ["mujer", "uno", "dolor", "más", "de", "poder", "mismo", "si"],
	"words": ["ejercicio", "preferencia", "perspicacia", "laboral", "paño",
		"suntuoso", "molde", "namibia", "planeador", "mirar", "demás", "oficinista", "excepción",
		"odio", "consecuencia", "casi", "auto", "chicharra", "velo", "elixir",
		"ataque", "no", "odio", "temporal", "cuórum", "dignísimo",
		"facilismo", "letra", "nihilista", "expedición", "alma", "alveolar", "aparte",
		"león", "animal", "como", "paria", "belleza", "modo", "natividad",
		"justo", "ataque", "séquito", "pillo", "sed", "ex", "y", "voluminoso",
		"temporalidad", "verdades", "racional", "asunción", "incidente", "marejada",
		"placenta", "amanecer", "fuga", "previsor", "presentación", "lejos",
		"necesariamente", "sospechoso", "adiposidad", "quindío", "pócima",
		"voluble", "débito", "sintió", "accesorio", "falda", "sapiencia",
		"volutas", "queso", "permacultura", "laudo", "soluciones", "entero",
		"pan", "litro", "tonelada", "culpa", "libertario", "mosca", "dictado",
		"reincidente", "nascimiento", "dolor", "escolar", "impedimento", "mínima",
		"mayores", "repugnante", "dulce", "obcecado", "montaña", "enigma",
		"total", "deletéreo", "décima", "cábala", "fotografía", "dolores",
		"molesto", "olvido", "paciencia", "resiliencia", "voluntad", "molestias",
		"magnífico", "distinción", "ovni", "marejada", "cerro", "torre", "y",
		"abogada", "manantial", "corporal", "agua", "crepúsculo", "ataque", "desierto",
		"laboriosamente", "angustia", "afortunado", "alma", "encefalograma",
		"materialidad", "cosas", "o", "renuncia", "error", "menos", "conejo",
		"abadía", "analfabeto", "remo", "fugacidad", "oficio", "en", "almácigo", "vos", "pan",
		"represión", "números", "triste", "refugiado", "trote", "inventor",
		"corchea", "repelente", "magma", "recusado", "patrón", "explícito",
		"paloma", "síndrome", "inmune", "autoinmune", "comodidad",
		"ley", "vietnamita", "demonio", "tasmania", "repeler", "apéndice",
		"arquitecto", "columna", "yugo", "computador", "mula", "a", "propósito",
		"fantasía", "alias", "rayo", "tenedor", "deleznable", "ventana", "cara",
		"anemia", "corrupto"]
};

var langs = { latin: latin, ru: ru, sp: sp };

var defaultOptions$5 = {
	wordCount: 30,
	skipCommon: false,
	lang: 'latin'
};

/**
 * Replaces given parsed Emmet abbreviation node with nodes filled with
 * Lorem Ipsum stub text.
 * @param {Node} node
 * @return {Node}
 */
var index$8 = function(node, options) {
	options = Object.assign({}, defaultOptions$5, options);
	var dict = langs[options.lang] || langs.latin;
    var startWithCommon = !options.skipCommon && !isRepeating(node);

	if (!node.repeat && !isRoot$1(node.parent)) {
		// non-repeating element, insert text stub as a content of parent node
		// and remove current one
		node.parent.value = paragraph(dict, options.wordCount, startWithCommon);
		node.remove();
	} else {
		// Replace named node with generated content
		node.value = paragraph(dict, options.wordCount, startWithCommon);
		node.name = resolveImplicitName(node.parent.name);
	}

	return node;
};

function isRoot$1(node) {
	return !node.parent;
}

/**
 * Returns random integer between <code>from</code> and <code>to</code> values
 * @param {Number} from
 * @param {Number} to
 * @returns {Number}
 */
function rand(from, to) {
	return Math.floor(Math.random() * (to - from) + from);
}

/**
 * @param {Array} arr
 * @param {Number} count
 * @returns {Array}
 */
function sample(arr, count) {
	var len = arr.length;
	var iterations = Math.min(len, count);
	var result = new Set();

	while (result.size < iterations) {
		result.add(arr[rand(0, len)]);
	}

	return Array.from(result);
}

function choice(val) {
	return val[rand(0, val.length - 1)];
}

function sentence(words, end) {
	if (words.length) {
		words = [capitalize(words[0])].concat(words.slice(1));
	}

	return words.join(' ') + (end || choice('?!...')); // more dots than question marks
}

function capitalize(word) {
	return word[0].toUpperCase() + word.slice(1);
}

/**
 * Insert commas at randomly selected words. This function modifies values
 * inside <code>words</code> array
 * @param {Array} words
 */
function insertCommas(words) {
	if (words.length < 2) {
		return words;
	}

	words = words.slice();
	var len = words.length;
	var hasComma = /,$/;
	var totalCommas = 0;

	if (len > 3 && len <= 6) {
		totalCommas = rand(0, 1);
	} else if (len > 6 && len <= 12) {
		totalCommas = rand(0, 2);
	} else {
		totalCommas = rand(1, 4);
	}

	for (var i = 0, pos = (void 0), word = (void 0); i < totalCommas; i++) {
		pos = rand(0, len - 2);
		if (!hasComma.test(words[pos])) {
			words[pos] += ',';
		}
	}

	return words;
}

/**
 * Generate a paragraph of "Lorem ipsum" text
 * @param {Object} dict Words dictionary (see `lang/*.json`)
 * @param {Number} wordCount Words count in paragraph
 * @param {Boolean} startWithCommon Should paragraph start with common
 * "lorem ipsum" sentence.
 * @returns {String}
 */
function paragraph(dict, wordCount, startWithCommon) {
	var result = [];
	var totalWords = 0;
	var words;

	if (startWithCommon && dict.common) {
		words = dict.common.slice(0, wordCount);
		totalWords += words.length;
		result.push(sentence(insertCommas(words), '.'));
	}

	while (totalWords < wordCount) {
		words = sample(dict.words, Math.min(rand(2, 30), wordCount - totalWords));
		totalWords += words.length;
		result.push(sentence(insertCommas(words)));
	}

	return result.join(' ');
}

/**
 * Check if given node is in repeating context, e.g. node itself or one of its
 * parent is repeated
 * @param  {Node}  node
 * @return {Boolean}
 */
function isRepeating(node) {
    while (node.parent) {
        if (node.repeat && node.repeat.value && node.repeat.value > 1) {
            return true;
        }

        node = node.parent;
    }

    return false;
}

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {String}
 */
function expand$1(abbr, options) {
	options = options || {};

	if (typeof abbr === 'string') {
		abbr = parse$1(abbr, options);
	}

	return index$3(abbr, options.profile, options.syntax, options.format);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String} Abbreviation to parse
 * @param  {Object} options
 * @return {Node}
 */
function parse$1(abbr, options) {
	return index(abbr)
	.use(index$1, options.snippets)
	.use(replaceVariables, options.variables)
	.use(index$2, options.text, options.addons);
}

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {String}
 */
function expand$2(abbr, options) {
	options = options || {};

	if (typeof abbr === 'string') {
		abbr = parse$2(abbr, options);
	}

	return index$6(abbr, options.profile, options.syntax, options.format);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String|Node} Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {Node}
 */
function parse$2(abbr, options) {
	if (typeof abbr === 'string') {
		abbr = index$4(abbr);
	}

	return abbr.use(index$5, options.snippets);
}

var reLorem = /^lorem([a-z]*)(\d*)$/;

/**
 * Constructs a snippets registry, filled with snippets, for given options
 * @param  {String} syntax  Abbreviation syntax
 * @param  {Object|Object[]} snippets Additional snippets
 * @return {SnippetsRegistry}
 */
var snippetsRegistryFactory = function(syntax, snippets) {
	var registrySnippets = [index$7[syntax] || index$7.html];

	if (Array.isArray(snippets)) {
		snippets.forEach(function (item) {
			// if array item is a string, treat it as a reference to globally
			// defined snippets
			registrySnippets.push(typeof item === 'string' ? index$7[item] : item);
		});
	} else if (typeof snippets === 'object') {
		registrySnippets.push(snippets);
	}

	var registry = new SnippetsRegistry(registrySnippets.filter(Boolean));

	// for non-stylesheet syntaxes add Lorem Ipsum generator
	if (syntax !== 'css') {
		registry.get(0).set(reLorem, loremGenerator);
	}

	return registry;
};

function loremGenerator(node) {
	var options = {};
	var m = node.name.match(reLorem);
	if (m[1]) {
		options.lang = m[1];
	}

	if (m[2]) {
		options.wordCount = +m[2];
	}

	return index$8(node, options);
}

/**
 * Default variables used in snippets to insert common values into predefined snippets
 * @type {Object}
 */
var defaultVariables = {
	lang: 'en',
	locale: 'en-US',
	charset: 'UTF-8'
};

/**
 * A list of syntaxes that should use Emmet CSS abbreviations:
 * a variations of default abbreivation that holds values right in abbreviation name
 * @type {Set}
 */
var stylesheetSyntaxes = new Set(['css', 'sass', 'scss', 'less', 'stylus', 'sss']);

var defaultOptions = {
	/**
	 * Abbreviation output syntax
	 * @type {String}
	 */
	syntax: 'html',

	/**
	 * Field/tabstop generator for editor. Most editors support TextMate-style
	 * fields: ${0} or ${1:item}. So for TextMate-style fields this function
	 * will look like this:
	 * @example
	 * (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`
	 *
	 * @param  {Number} index         Placeholder index. Fields with the same indices
	 * should be linked
	 * @param  {String} [placeholder] Field placeholder
	 * @return {String}
	 */
	field: function (index$$1, placeholder) { return placeholder || ''; },

	/**
	 * Insert given text string(s) into expanded abbreviation
	 * If array of strings is given, the implicitly repeated element (e.g. `li*`)
	 * will be repeated by the amount of items in array
	 * @type {String|String[]}
	 */
	text: null,

	/**
	 * Either predefined output profile or options for output profile. Used for
	 * abbreviation output
	 * @type {Profile|Object}
	 */
	profile: null,

	/**
	 * Custom variables for variable resolver
	 * @see @emmetio/variable-resolver
	 * @type {Object}
	 */
	variables: {},

	/**
	 * Custom predefined snippets for abbreviation. The expanded abbreviation
	 * will try to match given snippets that may contain custom elements,
	 * predefined attributes etc.
	 * May also contain array of items: either snippets (Object) or references
	 * to default syntax snippets (String; the key in default snippets hash)
	 * @see @emmetio/snippets
	 * @type {Object|SnippetsRegistry}
	 */
	snippets: {},

	/**
	 * Hash of additional transformations that should be applied to expanded
	 * abbreviation, like BEM or JSX. Since these transformations introduce
	 * side-effect, they are disabled by default and should be enabled by
	 * providing a transform name as a key and transform options as value:
	 * @example
	 * {
	 *     bem: {element: '--'},
	 *     jsx: true // no options, just enable transform
	 * }
	 * @see @emmetio/html-transform/lib/addons
	 * @type {Object}
	 */
	addons: null,

	/**
	 * Additional options for syntax formatter
	 * @see @emmetio/markup-formatters
	 * @type {Object}
	 */
	format: null
};

/**
 * Expands given abbreviation into string, formatted according to provided
 * syntax and options
 * @param  {String|Node} abbr        Abbreviation string or parsed abbreviation tree
 * @param  {String|Object} [options] Parsing and formatting options (object) or
 * abbreviation syntax (string)
 * @return {String}
 */
function expand$$1(abbr, options) {
	options = createOptions(options);

	return isStylesheet(options.syntax)
		? expand$2(abbr, options)
		: expand$1(abbr, options);
}

/**
 * Parses given abbreviation into AST tree. This tree can be later formatted to
 * string with `expand` function
 * @param  {String} abbr             Abbreviation to parse
 * @param  {String|Object} [options] Parsing and formatting options (object) or
 * abbreviation syntax (string)
 * @return {Node}
 */
function parse$$1(abbr, options) {
	options = createOptions(options);

	return isStylesheet(options.syntax)
		? parse$2(abbr, options)
		: parse$1(abbr, options);
}

/**
 * Creates snippets registry for given syntax and additional `snippets`
 * @param  {String} syntax   Snippets syntax, used for retreiving predefined snippets
 * @param  {SnippetsRegistry|Object|Object[]} [snippets] Additional snippets
 * @return {SnippetsRegistry}
 */
function createSnippetsRegistry(syntax, snippets) {
	return snippets instanceof SnippetsRegistry
		? snippets
		: snippetsRegistryFactory(isStylesheet(syntax) ? 'css' : syntax, snippets);
}

function createOptions(options) {
	if (typeof options === 'string') {
		options = { syntax: options };
	}

	options = Object.assign({}, defaultOptions, options);
	options.format = Object.assign({field: options.field}, options.format);
	options.profile = createProfile(options);
	options.variables = Object.assign({}, defaultVariables, options.variables);
	options.snippets = createSnippetsRegistry(isStylesheet(options.syntax) ? 'css' : options.syntax, options.snippets);

	return options;
}

/**
 * Check if given syntax belongs to stylesheet markup.
 * Emmet uses different abbreviation flavours: one is a default markup syntax,
 * used for HTML, Slim, Pug etc, the other one is used for stylesheets and
 * allows embedded values in abbreviation name
 * @param  {String}  syntax
 * @return {Boolean}
 */
function isStylesheet(syntax) {
	return stylesheetSyntaxes.has(syntax);
}

/**
 * Creates output profile from given options
 * @param  {Object} options
 * @return {Profile}
 */
function createProfile(options) {
	return options.profile instanceof Profile
		? options.profile
		: new Profile(options.profile);
}

/**
 * Syntaxes known by Emmet. All other syntaxes shoud map to one of these
 * @type {Set}
 */
var knownSyntaxes = new Set([
	'html', 'xml', 'xsl', 'jsx', 'js', 'pug', 'slim', 'haml',
	'css', 'sass', 'scss', 'less', 'sss', 'stylus'
]);

/**
 * Common context checker for abbreviation auto-activation for
 * stylesheet syntaxes (CSS, SCSS, LESS etc.)
 * @param  {CodeMirror} editor
 * @return {Boolean}
 */
var stylesheetAutoActivationContext = function (editor, pos) {
	var tokenType = editor.getTokenTypeAt(pos || editor.getCursor());
	// NB may return `property` or `property error` type
	return tokenType && /^property\b/.test(tokenType);
};

var autoActivationContext = {
	html: function html(editor, pos) {
		// Do not provide automatic abbreviation completion inside HTML tags,
		// e.g. work only inside plain text token
		return editor.getTokenTypeAt(pos || editor.getCursor()) === null;
	},

	css:  stylesheetAutoActivationContext,
	less: stylesheetAutoActivationContext,
	sass: stylesheetAutoActivationContext,
	scss: stylesheetAutoActivationContext
};

/**
 * Detect Emmet syntax from given editor’s position.
 * @param {CodeMirror}     editor
 * @param {CodeMirror.Pos} [pos]
 * @return {String}        Returns `null` if Emmet syntax can’t be detected
 */
function detectSyntax(editor, pos) {
	var mode = editor.getModeAt(pos || editor.getCursor());
	var syntax = mode.name === 'xml' ? 'html' : mode.name;

	if (isSupported(syntax)) {
		return syntax;
	}

	// No supported syntax found, try from Emmet-specific options
	var emmetOpt = editor.getOption('emmet');
	if (emmetOpt && isSupported(emmetOpt.syntax)) {
		return emmetOpt.syntax;
	}

	return null;
}

/**
 * Check if given syntax is supported by Emmet
 * @param  {String}  syntax
 * @return {Boolean}
 */
function isSupported(syntax) {
	return knownSyntaxes.has(syntax);
}

/**
 * Check if current editor’s context (syntax, scope) allows automatic Emmet
 * abbreviation activation as user types text. If this function returns `false`,
 * it is recommended to not create any Emmet completions when user types text,
 * but insert them when user activated autocomplete popup manually
 * @param  {CodeMirror}  editor
 * @param  {CodeMirror.Pos} [pos]
 * @return {Boolean}
 */
function hasAutoActivateContext(editor, pos) {
	var syntax = detectSyntax(editor, pos);
	return syntax && (!autoActivationContext[syntax] || autoActivationContext[syntax](editor, pos));
}

/**
 * Returns token used for single indentation in given editor
 * @param  {CodeMirror} editor
 * @return {String}
 */
function getIndentation(editor) {
	if (!editor.getOption('indentWithTabs')) {
		return repeatString(' ', editor.getOption('indentUnit'));
	}

	return '\t';
}

/**
 * Normalizes text according to given CodeMirror instance indentation
 * preferences
 * @param  {String}     text
 * @param  {CodeMirror} editor
 * @param  {String}     [indentation] Applies `indentText()` with given argument,
 *                                    if provided
 * @return {String}
 */
function normalizeText(editor, text, indentation) {
	var lines = splitByLines$2(text);
	var indent = getIndentation(editor);

	if (indent !== '\t') {
		lines = lines.map(function (line) { return line.replace(/^\t+/,
			function (tabs) { return repeatString(indent, tabs.length); }); });
	}

	if (indentation) {
		lines = lines.map(function (line, i) { return i ? indentation + line : line; });
	}

	return lines.join('\n');
}

/**
 * Indents each line, except first one, in given text
 * @param  {String} text
 * @param  {String} indentation
 * @return {String}
 */


/**
 * Splits given text by lines
 * @param  {String} text
 * @return {String[]} Lines of text
 */
function splitByLines$2(text) {
	return Array.isArray(text) ? text : text.split(/\r\n|\r|\n/g);
}

function repeatString(str, count) {
	var result = '';
	while (0 < count--) {
		result += str;
	}

	return result;
}

/**
 * Quick and dirty way to remove fields from given string
 * @param  {String} str
 * @return {String}
 */
function removeFields(str) {
	return str.replace(/\$\{\d+(:[^\}]+)?\}/g, '');
}

/**
 * Check if given range contains point
 * @param  {CodeMirror.Range} range
 * @param  {CodeMirror.Pos} pos
 * @param  {Boolean} [exclude] Exclude range and and start
 * @return {Boolean}
 */
function containsPos(range, pos, exclude) {
	return exclude
		? comparePos(pos, range.from) > 0 && comparePos(pos, range.to) < 0
		: comparePos(pos, range.from) >= 0 && comparePos(pos, range.to) <= 0;
}

function comparePos(a, b) {
	return a.line - b.line || a.ch - b.ch;
}

var cursorMark = '[[::emmet-cursor::]]';

// NB CodeMirror doesn’t natively supports tabstops
var editorField = function (index, placeholder) {
	if ( placeholder === void 0 ) placeholder = '';

	return placeholder;
};

/**
 * Expands given abbreviation for given editor.
 * The editor is used to detect abbreviation syntax and provide
 * tag context for markup abbreviations
 * @param  {String|Node} abbr
 * @param  {CodeMirror}  editor
 * @return {String}
 * @throws Error if abbreviation is invalid
 */
function expandAbbreviation(abbr, editor, options) {
	return expand$$1(abbr, Object.assign({
		syntax: detectSyntax(editor),
		field: editorField
	}, getExpandOptions(editor), options));
}

/**
 * Parses abbreviation for given editor
 * @param  {String} abbr
 * @param  {CodeMirror} editor
 * @return {Node}
 * @throws Error if abbreviation is invalid
 */
function parseAbbreviation(abbr, editor) {
	return parse$$1(abbr, Object.assign({
		syntax: detectSyntax(editor),
	}, getExpandOptions(editor)));
}

/**
 * Extracts abbreviation from given position of editor
 * @param  {CodeMirror}     editor
 * @param  {CodeMirror.Pos} [pos]
 * @return {Object}         Object with `{abbreviation, location}` properties or `null`
 */
function extractAbbreviation(editor, pos) {
	pos = pos || pos.getCursor();
	var line = editor.getLine(pos.line);

	return extractAbbreviation$1(line, pos.ch, true);
}

/**
 * Returns abbreviation model: object with `ast` and `snippet` properties
 * that contains parsed and expanded abbreviation respectively
 * @param  {String} abbreviation
 * @param  {CodeMirror} editor
 * @return {Object} Returns `null` if abbreviation cannot be parsed
 */
function createAbbreviationModel(abbreviation, editor) {
	try {
		var ast = parseAbbreviation(abbreviation, editor);
		return {
			ast: ast,
			abbreviation: abbreviation,
			snippet: expandAbbreviation(abbreviation, editor)
		};
	} catch (err) {
		// console.warn('Unable to build Emmet abbreviation model', err);
		return null;
	}
}

/**
 * Expands given abbreviation and inserts expanded result into editor, maintaining
 * proper indentation and final cursor position
 * @param  {CodeMirror} editor CodeMirror editor instance
 * @param  {String|Object} abbr  Abbreviation to expand (string or parsed)
 * @param  {CodeMirror.Range} range Location of abbreviation in editor
 * @return {Boolean} Returns `true` if abbreviation was successfully expanded and inserted
 */
function expandAndInsert(editor, abbr, range) {
	var cursorMarked = false;
	var newSelectionSize = 0;
	var expanded;

	try {
		expanded = expandAbbreviation(abbr, editor, {
			// CodeMirror doesn’t support snippets with tab-stops natively so we have
			// to mark first output with a special token so we can find it later
			// to properly plant cursor into new position
			field: function field(index, placeholder) {
				if ( placeholder === void 0 ) placeholder = '';

				if (!cursorMarked) {
					cursorMarked = true;
					newSelectionSize = placeholder.length;
					placeholder = cursorMark + placeholder;
				}

				return placeholder;
			}
		});
	} catch (err) {
		// Invalid abbreviation
		// console.warn(err);
		return false;
	}

	var line = editor.getLine(range.from.line);
	var matchIndent = line.match(/^\s+/);
	expanded = normalizeText(editor, expanded, matchIndent && matchIndent[0]);

	var newCursorPos = expanded.length;

	if (cursorMarked) {
		// Remove cursor stub and re-position cursor
		newCursorPos = expanded.indexOf(cursorMark);
		expanded = expanded.slice(0, newCursorPos) + expanded.slice(newCursorPos + cursorMark.length);
	}

	// Replace abbreviation with expanded result
	return editor.operation(function () {
		editor.replaceRange(expanded, range.from, range.to);

		// Position cursor
		var startIx = editor.indexFromPos(range.from);
		var newCursor = editor.posFromIndex(newCursorPos + startIx);
		if (newSelectionSize) {
			editor.setSelection(newCursor, {
				line: newCursor.line,
				ch: newCursor.ch + newSelectionSize
			});
		} else {
			editor.setCursor(newCursor);
		}

		return true;
	});
}

/**
 * Returns options object for syntax from given editor. In most cases, it detects
 * XML-style syntax (HTML, XML, XHTML) and returns options configured for proper
 * output
 * @param  {CodeMirror} editor
 * @param  {Point}      [pos]  Point in editor where syntax should be detected.
 *                             Uses `editor.getCursor()` in not given
 * @return {Object}
 */
function getExpandOptions(editor, pos) {
	var mode = editor.getModeAt(pos || editor.getCursor());
	var emmetOpt = editor.getOption('emmet');
	var profile = emmetOpt && emmetOpt.profile;

	if (mode.name === 'xml') {
		profile = Object.assign({ selfClosingStyle: mode.configuration }, profile);
	}

	return Object.assign({
		profile: profile,
		snippets: snippetsFromOptions(editor, detectSyntax(editor, pos))
	}, emmetOpt);
}

/**
 * Returns custom snippets from Emmet options of given editor
 * @param  {CodeMirror} editor
 * @param  {String} syntax
 * @return {Object}
 */
function snippetsFromOptions(editor, syntax) {
	var emmetOpt = editor.getOption('emmet');
	if (emmetOpt) {
		return isStylesheet(syntax)
			? emmetOpt.stylesheetSnippets
			: emmetOpt.markupSnippets;
	}
}

var emmetMarkerClass = 'emmet-abbreviation';

/**
 * Editor’s `change` event handler that marks Emmet abbreviation when editor
 * content is updated
 * @param  {CodeMirror} editor
 */
function markOnEditorChange(editor) {
	var marker = findMarker(editor, editor.getCursor());
	if (marker && isValidMarker(editor, marker)) {
		return;
	}

	// No valid marker under caret, remove all registered markers
	// and create a new one
	clearMarkers(editor);
	if (hasAutoActivateContext(editor)) {
		markAbbreviation(editor, editor.getCursor());
	}
}

/**
 * Returns *valid* Emmet abbreviation marker (if any) for given position of editor
 * @param  {CodeMirror}     editor
 * @param  {CodeMirror.Pos} [pos]
 * @return {CodeMirror.TextMarker}
 */
function findMarker(editor, pos) {
	var markers = editor.findMarksAt(pos);
	for (var i = 0; i < markers.length; i++) {
		if (markers[i].className === emmetMarkerClass) {
			return markers[i];
		}
	}
}

/**
 * Marks Emmet abbreviation for given editor position, if possible
 * @param  {TextEditor} editor   Editor where abbreviation marker should be created
 * @param  {Point}      pos      Buffer position where abbreviation should be created.
 *                               Abbreviation will be automatically extracted from
 *                               given position
 * @param  {Boolean}    [forced] Indicates that user forcibly requested abbreviation
 *                               marker (e.g. was not activated automatically).
 *                               Affects abbreviation detection policy
 * @return {DisplayMarker} Returns `undefined` if no valid abbreviation under caret
 */
function markAbbreviation(editor, pos, forced) {
	var marker = findMarker(editor, pos);
	if (marker) {
		// there’s active marker with valid abbreviation
		return marker;
	}

	// No active marker: remove previous markers and create new one, if possible
	clearMarkers(editor);

	var extracted = extractAbbreviation(editor, pos);
	var model = extracted && createAbbreviationModel(extracted.abbreviation, editor);

	if (model && (forced || allowedForAutoActivation(model))) {
		var from = { line: pos.line, ch: extracted.location };
		var to = { line: pos.line, ch: extracted.location + extracted.abbreviation.length };

		var marker$1 = editor.markText(from, to, {
			inclusiveRight: true,
			clearWhenEmpty: true,
			className: emmetMarkerClass
		});
		marker$1.model = model;
		return marker$1;
	}
}

/**
 * Removes Emmmet abbreviation markers from given editor
 * @param  {TextEditor} editor
 */
function clearMarkers(editor) {
	var markers = editor.getAllMarks();
	for (var i = 0; i < markers.length; i++) {
		if (markers[i].className === emmetMarkerClass) {
			markers[i].clear();
		}
	}
}

/**
 * Check if given abbreviation model is allowed for auto-activated abbreviation
 * marker. Used to reduce falsy activations
 * @param  {Object} model Parsed abbreviation model (see `createAbbreviationModel()`)
 * @return {Boolean}
 */
function allowedForAutoActivation(model) {
	var rootNode = model.ast.children[0];
	// The very first node should start with alpha character
	// Skips falsy activations for something like `$foo` etc.
	return rootNode && /^[a-z]/i.test(rootNode.name);
}

/**
 * Ensures that given editor Emmet abbreviation marker contains valid Emmet abbreviation
 * and updates abbreviation model if required
 * @param {CodeMirror} editor
 * @param {CodeMirror.TextMarket} marker
 * @return {Boolean} `true` if marker contains valid abbreviation
 */
function isValidMarker(editor, marker) {
	var range = marker.find();

	// No newlines inside abreviation
	if (range.from.line !== range.to.line) {
		return false;
	}

	// Make sure marker contains valid abbreviation
	var text = editor.getRange(range.from, range.to);
	if (!text || /^\s|\s$/g.test(text)) {
		return false;
	}

	if (!marker.model || marker.model.abbreviation !== text) {
		// marker contents was updated, re-parse abbreviation
		marker.model = createAbbreviationModel(text, editor);
	}

	return !!(marker.model && marker.model.snippet);
}

/**
 * Expand abbreviation command
 * @param  {CodeMirror} editor
 */
var emmetExpandAbbreviation = function(editor) {
	if (editor.somethingSelected()) {
		return editor.constructor.Pass;
	}

	var pos = editor.getCursor();
	var marker = findMarker(editor, pos);

	var result = false;

	// Handle two possible options: expand abbreviation from Emmet marker that
	// matches given location or extract & expand abbreviation from cursor
	// position. The last one may happen if either `markeEmmetAbbreviation`
	// option is turned off or user moved cursor away from Emmet marker and
	// tries to expand another abbreviation

	if (marker) {
		result = expandAndInsert(editor, marker.model.ast, marker.find());
	} else {
		var abbrData = extractAbbreviation(editor, pos);
		if (abbrData) {
			var range = {
				from: {
					line: pos.line,
					ch: abbrData.location
				},
				to: {
					line: pos.line,
					ch: abbrData.location + abbrData.abbreviation.length
				}
			};

			result = expandAndInsert(editor, abbrData.abbreviation, range);
		}
	}

	clearMarkers(editor);

	// If no abbreviation was expanded, allow editor to handle different
	// action for keyboard shortcut (Tab key mostly)
	return result || editor.constructor.Pass;
};

/**
 * Inserts formatted line tag between tags
 * @param  {CodeMirror} editor
 */
var emmetInsertLineBreak = function(editor) {
	var cursor = editor.getCursor();
	var mode = editor.getModeAt(cursor);

	if (mode.name === 'xml') {
		var next = Object.assign({}, cursor, { ch: cursor.ch + 1 });
		var left = editor.getTokenAt(cursor);
		var right = editor.getTokenAt(Object.assign({}, cursor, { ch: cursor.ch + 1 }));

		if (left.type === 'tag bracket' && left.string === '>'
			&& right.type === 'tag bracket' && right.string === '</') {
				var matchIndent = editor.getLine(cursor.line).match(/^\s+/);
				var curIndent = matchIndent ? matchIndent[0] : '';
				var indent = getIndentation(editor);

				// Insert formatted line break
				var before = "\n" + curIndent + indent;
				var after = "\n" + curIndent;
				editor.replaceRange(before + after, cursor, cursor);

				// Position cursor
				var startIx = editor.indexFromPos(cursor);
				var newCursor = editor.posFromIndex(startIx + before.length);
				editor.setCursor(newCursor);

				return;
			}
	}

	return editor.constructor.Pass;
};

/**
 * Returns available completions from given editor
 * @param  {CodeMirror}      editor
 * @param  {String}          abbrModel   Parsed Emmet abbreviation model for which
 *                                       completions should be populated
 *                                       (see `createAbbreviationModel()`)
 * @param  {CodeMirror.Pos}  abbrPos     Abbreviation location in editor
 * @param  {CodeMirror.Pos}  [cursorPos] Cursor position in editor
 * @return {EmmetCompletion[]}
 */
var autocompleteProvider = function(editor, abbrModel, abbrPos, cursorPos) {
	cursorPos = cursorPos || editor.getCursor();
	var syntax = detectSyntax(editor, cursorPos);
	if (!syntax) {
		// Unsupported syntax
		return [];
	}

	return isStylesheet(syntax)
		? getStylesheetCompletions(editor, abbrModel, abbrPos, cursorPos)
		: getMarkupCompletions(editor, abbrModel, abbrPos, cursorPos);
};

/**
 * Returns completions for markup syntaxes (HTML, Slim, Pug etc.)
 * @param  {CodeMirror}      editor
 * @param  {Object}          abbrModel   Parsed Emmet abbreviation model for which
 *                                       completions should be populated
 *                                       (see `createAbbreviationModel()`)
 * @param  {CodeMirror.Pos}  abbrPos     Abbreviation location in editor
 * @param  {CodeMirror.Pos}  [cursorPos] Cursor position in editor
 * @return {EmmetCompletion[]}
 */
function getMarkupCompletions(editor, abbrModel, abbrPos, cursorPos) {
	var result = [];
	cursorPos = cursorPos || editor.getCursor();

	var abbrRange = {
		from: abbrPos,
		to: { line: abbrPos.line, ch: abbrPos.ch + abbrModel.abbreviation.length }
	};

	result.push(new EmmetCompletion('expanded-abbreviation', editor, abbrRange, 'Expand abbreviation',
		abbrModel.snippet, function () { return expandAndInsert(editor, abbrModel.abbreviation, abbrRange); }));

	// Make sure that current position precedes element name (e.g. not attribute,
	// class, id etc.)
	var prefix = getMarkupPrefix(abbrModel.abbreviation, cursorPos.ch - abbrPos.ch);
	if (prefix !== null) {
		var prefixRange = {
			from: { line: cursorPos.line, ch: cursorPos.ch - prefix.length },
			to: cursorPos
		};

		var completions = getSnippetCompletions(editor, cursorPos)
		.filter(function (snippet) { return snippet.key !== prefix && snippet.key.indexOf(prefix) === 0; })
		.map(function (snippet) { return new EmmetCompletion('snippet', editor, prefixRange, snippet.key,
			snippet.preview, snippet.key); });

		result = result.concat(completions);
	}

	return result;
}

/**
 * Returns completions for stylesheet syntaxes
 * @param  {CodeMirror} editor
 * @param  {Object} abbrModel
 * @param  {CodeMirror.Pos} abbrPos
 * @param  {CodeMirror.Pos} cursorPos
 * @return {EmmetCompletion[]}
 */
function getStylesheetCompletions(editor, abbrModel, abbrPos, cursorPos) {
	var result = [];
	cursorPos = cursorPos || editor.getCursor();

	var abbrRange = {
		from: abbrPos,
		to: { line: abbrPos.line, ch: abbrPos.ch + abbrModel.abbreviation.length }
	};

	result.push(new EmmetCompletion('expanded-abbreviation', editor, abbrRange, 'Expand abbreviation',
		abbrModel.snippet, function () { return expandAndInsert(editor, abbrModel.abbreviation, abbrRange); }));

	// Make sure that current position precedes element name (e.g. not attribute,
	// class, id etc.)
	var prefix = getStylesheetPrefix(abbrModel.abbreviation, cursorPos.ch - abbrPos.ch);
	if (prefix !== null) {
		var prefixRange = {
			from: { line: cursorPos.line, ch: cursorPos.ch - prefix.length },
			to: cursorPos
		};

		var completions = getSnippetCompletions(editor, cursorPos)
		.filter(function (snippet) { return snippet.key !== prefix && snippet.key.indexOf(prefix) === 0; })
		.map(function (snippet) { return new EmmetCompletion('snippet', editor, prefixRange,
			snippet.key, snippet.preview, snippet.key); });

		result = result.concat(completions);
	}

	return result;
}

/**
 * Returns all possible snippets completions for given editor context.
 * Completions are cached in editor for for re-use
 * @param  {CodeMirror} editor
 * @param  {CodeMirror.Pos} pos
 * @return {Array}
 */
function getSnippetCompletions(editor, pos) {
	var syntax = detectSyntax(editor, pos);

	if (!editor.state.emmetCompletions) {
		editor.state.emmetCompletions = {};
	}

	var cache = editor.state.emmetCompletions;

	if (!(syntax in cache)) {
		var registry = createSnippetsRegistry(syntax, snippetsFromOptions(editor, syntax));

		if (isStylesheet(syntax)) {
			// Collect snippets for stylesheet context: just a plain list of
			// snippets, converted specifically for CSS context
			cache[syntax] = convertToCSSSnippets(registry).map(function (snippet) {
				var preview = snippet.property;
				var keywords = snippet.keywords();
				if (keywords.length) {
					preview += ": " + (removeFields(keywords.join(' | ')));
				}

				return {
					key: snippet.key,
					value: snippet.value,
					keywords: keywords,
					preview: preview
				};
			});
		} else {
			// Collect snippets for markup syntaxes: HTML, XML, Slim, Pug etc.
			// Not just a plain snippets list but thier expanded result as well
			var field = function (index, placeholder) { return placeholder || ''; };
			var expandOpt = { syntax: syntax, field: field };

			cache[syntax] = registry.all({type: 'string'}).map(function (snippet) { return ({
				key: snippet.key,
				value: snippet.value,
				preview: expandAbbreviation(snippet.value, editor, expandOpt)
			}); });
		}
	}

	return cache[syntax];
}

/**
 * Returns node element prefix, if applicable, for given `pos` in abbreviation
 * for markup syntaxes completions
 * @param  {String} abbr
 * @param  {Number} pos
 * @return {String} Returns `null` if not in element name context
 */
function getMarkupPrefix(abbr, pos) {
	return getPrefix(abbr, pos, /[\w:\-\$@]+$/);
}

/**
 * Returns node element prefix, if applicable, for given `pos` in abbreviation
 * for stylesheet syntaxes completions
 * @param  {String} abbr
 * @param  {Number} pos
 * @return {String} Returns `null` if not in element name context
 */
function getStylesheetPrefix(abbr, pos) {
	return getPrefix(abbr, pos, /[\w-@$]+$/);
}

/**
 * Get snippet completion prefix that matches given `match` regexp from `pos`
 * character pasition of given `abbr` abbreviation
 * @param  {String} abbr
 * @param  {Number} pos
 * @param  {RegExp} match
 * @return {String}
 */
function getPrefix(abbr, pos, match) {
	if (pos === 0) {
		// Word prefix is at the beginning of abbreviation: it’s an element
		// context for sure
		return '';
	}

	var m = abbr.slice(0, pos).match(match);
	var prefix = m && m[0] || '';

	// Check if matched prefix is either at the beginning of abbreviation or
	// at the element bound, e.g. right after operator
	if (prefix && (prefix === abbr || /[>\^\+\(\)]/.test(abbr[pos - prefix.length - 1]))) {
		return prefix;
	}

	return null;
}

var EmmetCompletion = function EmmetCompletion(type, editor, range, label, preview, snippet) {
	this.type = type;
	this.editor = editor;
	this.range = range;
	this.label = label;
	this.preview = preview;
	this.snippet = snippet;

	this._inserted = false;
};

EmmetCompletion.prototype.insert = function insert () {
	if (!this._inserted) {
		this._inserted = true;
		if (typeof this.snippet === 'function') {
			this.snippet(this.editor, this.range);
		} else {
			this.editor.replaceRange(this.snippet, this.range.from, this.range.to);

			// Position cursor
			var startIx = this.editor.indexFromPos(this.range.from);
			var newCursor = this.editor.posFromIndex(startIx + this.snippet.length);
			this.editor.setCursor(newCursor);
		}
	}
};

var Node$2 = function Node(stream, type, open, close) {
	this.stream = stream;
	this.type = type;
	this.open = open;
	this.close = close;

	this.children = [];
	this.parent = null;
};

var prototypeAccessors$4 = { name: {},attributes: {},start: {},end: {},firstChild: {},nextSibling: {},previousSibling: {} };

/**
	 * Returns node name
	 * @return {String}
	 */
prototypeAccessors$4.name.get = function () {
	if (this.type === 'tag' && this.open) {
		return this.open && this.open.name && this.open.name.value;
	}

	return '#' + this.type;
};

/**
	 * Returns attributes of current node
	 * @return {Array}
	 */
prototypeAccessors$4.attributes.get = function () {
	return this.open && this.open.attributes;
};

/**
	 * Returns node’s start position in stream
	 * @return {*}
	 */
prototypeAccessors$4.start.get = function () {
	return this.open && this.open.start;
};

/**
	 * Returns node’s start position in stream
	 * @return {*}
	 */
prototypeAccessors$4.end.get = function () {
	return this.close ? this.close.end : this.open && this.open.end;
};

prototypeAccessors$4.firstChild.get = function () {
	return this.children[0];
};

prototypeAccessors$4.nextSibling.get = function () {
	var ix = this.getIndex();
	return ix !== -1 ? this.parent.children[ix + 1] : null;
};

prototypeAccessors$4.previousSibling.get = function () {
	var ix = this.getIndex();
	return ix !== -1 ? this.parent.children[ix - 1] : null;
};

/**
	 * Returns current element’s index in parent list of child nodes
	 * @return {Number}
	 */
Node$2.prototype.getIndex = function getIndex () {
	return this.parent ? this.parent.children.indexOf(this) : -1;
};

/**
	 * Adds given node as a child
	 * @param {Node} node
	 * @return {Node} Current node
	 */
Node$2.prototype.addChild = function addChild (node) {
	this.removeChild(node);
	this.children.push(node);
	node.parent = this;
	return this;
};

/**
	 * Removes given node from current node’s child list
	 * @param  {Node} node
	 * @return {Node} Current node
	 */
Node$2.prototype.removeChild = function removeChild (node) {
	var ix = this.children.indexOf(node);
	if (ix !== -1) {
		this.children.splice(ix, 1);
		node.parent = null;
	}

	return this;
};

Object.defineProperties( Node$2.prototype, prototypeAccessors$4 );

/**
 * A token factory method
 * @param  {StreamReader}   stream
 * @param  {Point|Function} start  Tokens’ start location or stream consumer
 * @param  {Point}          [end]  Tokens’ end location
 * @return {Token}
 */
var token = function(stream, start, end) {
	return typeof start === 'function'
		? eatToken(stream, start)
		: new Token(stream, start, end);
};

/**
 * Consumes characters from given stream that matches `fn` call and returns it
 * as token, if consumed
 * @param  {StreamReader} stream
 * @param  {Function} test
 * @return {Token}
 */
function eatToken(stream, test) {
	var start = stream.pos;
	if (stream.eatWhile(test)) {
		return new Token(stream, start, stream.pos);
	}

	stream.pos = start;
}

/**
 * A structure describing text fragment in content stream
 */
var Token = function Token(stream, start, end) {
	this.stream = stream;
	this.start = start != null ? start : stream.start;
	this.end   = end   != null ? end   : stream.pos;
	this._value = null;
};

var prototypeAccessors$1$1 = { value: {} };

/**
	 * Returns token textual value
	 * NB implemented as getter to reduce unnecessary memory allocations for
	 * strings that not required
	 * @return {String}
	 */
prototypeAccessors$1$1.value.get = function () {
	if (this._value === null) {
		var start = this.stream.start;
		var end = this.stream.pos;

		this.stream.start = this.start;
		this.stream.pos = this.end;
		this._value = this.stream.current();

		this.stream.start = start;
		this.stream.pos = end;
	}

	return this._value;
};

Token.prototype.toString = function toString () {
	return this.value;
};

Token.prototype.valueOf = function valueOf () {
	return ((this.value) + " [" + (this.start) + "; " + (this.end) + "]");
};

Object.defineProperties( Token.prototype, prototypeAccessors$1$1 );

var LANGLE  = 60;
var RANGLE  = 62;  // < and >
var LSQUARE = 91;
var RSQUARE = 93;  // [ and ]
var LROUND  = 40;
var RROUND  = 41;  // ( and )
var LCURLY$1  = 123;
var RCURLY$1  = 125; // { and }

var opt$2 = { throws: true };

/**
 * Consumes paired tokens (like `[` and `]`) with respect of nesting and embedded
 * quoted values
 * @param  {StreamReader} stream
 * @return {Token} A token with consumed paired character
 */
var eatPaired = function(stream) {
	var start = stream.pos;
	var consumed = eatPair(stream, LANGLE, RANGLE, opt$2)
		|| eatPair(stream, LSQUARE, RSQUARE, opt$2)
		|| eatPair(stream, LROUND,  RROUND,  opt$2)
		|| eatPair(stream, LCURLY$1,  RCURLY$1,  opt$2);

	if (consumed) {
		return token(stream, start);
	}
};

var SLASH$1$1        = 47;  // /
var EQUALS$2       = 61;  // =
var RIGHT_ANGLE$1  = 62;  // >

/**
 * Consumes attributes from given stream
 * @param {StreamReader} stream
 * @return {Array} Array of consumed attributes
 */
var eatAttributes = function(stream) {
	var result = [];
	var name, value, attr;

	while (!stream.eof()) {
		stream.eatWhile(isSpace);
		attr = { start: stream.pos };

		// A name could be a regular name or expression:
		// React-style – <div {...props}>
		// Angular-style – <div [ng-for]>
		if (attr.name = eatAttributeName(stream)) {
			// Consumed attribute name. Can be an attribute with name
			// or boolean attribute. The value can be React-like expression
			if (stream.eat(EQUALS$2)) {
				attr.value = eatAttributeValue(stream);
			} else {
				attr.boolean = true;
			}
			attr.end = stream.pos;
			result.push(attr);
		} else if (isTerminator(stream.peek())) {
			// look for tag terminator in order to skip any other possible characters
			// (maybe junk)
			break;
		} else {
			stream.next();
		}
	}

	return result;
};

/**
 * Consumes attribute name from current location
 * @param  {StreamReader} stream
 * @return {Token}
 */
function eatAttributeName(stream) {
	return eatPaired(stream) || token(stream, isAttributeName);
}

/**
 * Consumes attribute value from given location
 * @param  {StreamReader} stream
 * @return {Token}
 */
function eatAttributeValue(stream) {
	var start = stream.pos;
	if (eatQuoted$1(stream)) {
		// Should return token that points to unquoted value.
		// Use stream readers’ public API to traverse instead of direct
		// manipulation
		var current = stream.pos;
		var valueStart, valueEnd;

		stream.pos = start;
		stream.next();
		valueStart = stream.start = stream.pos;

		stream.pos = current;
		stream.backUp(1);
		valueEnd = stream.pos;

		var result = token(stream, valueStart, valueEnd);
		stream.pos = current;
		return result;
	}

	return eatPaired(stream) || eatUnquoted$1(stream);
}

/**
 * Check if given code belongs to attribute name.
 * NB some custom HTML variations allow non-default values in name, like `*ngFor`
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAttributeName(code) {
	return code !== EQUALS$2 && !isTerminator(code) && !isSpace(code);
}

/**
 * Check if given code is tag terminator
 * @param  {Number}  code
 * @return {Boolean}
 */
function isTerminator(code) {
	return code === RIGHT_ANGLE$1 || code === SLASH$1$1;
}

/**
 * Eats unquoted value from stream
 * @param  {StreamReader} stream
 * @return {Token}
 */
function eatUnquoted$1(stream) {
	return token(stream, isUnquoted$1);
}

/**
 * Check if given character code is valid unquoted value
 * @param  {Number}  code
 * @return {Boolean}
 */
function isUnquoted$1(code) {
	return !isNaN(code) && !isQuote$1(code) && !isSpace(code) && !isTerminator(code);
}

var DASH$2$1        = 45; // -
var DOT$2         = 46; // .
var SLASH$2       = 47; // /
var COLON$3       = 58; // :
var LEFT_ANGLE  = 60; // <
var RIGHT_ANGLE = 62; // >
var UNDERSCORE  = 95; // _

/**
 * Parses tag definition (open or close tag) from given stream state
 * @param {StreamReader} stream Content stream reader
 * @return {Object}
 */
var tag = function(stream) {
	var start = stream.pos;

	if (stream.eat(LEFT_ANGLE)) {
		var model = { type: stream.eat(SLASH$2) ? 'close' : 'open' };

		if (model.name = eatTagName(stream)) {
			if (model.type !== 'close') {
				model.attributes = eatAttributes(stream);
				stream.eatWhile(isSpace);
				model.selfClosing = stream.eat(SLASH$2);
			}

			if (stream.eat(RIGHT_ANGLE)) {
				// tag properly closed
				return Object.assign(token(stream, start), model);
			}
		}
	}

	// invalid tag, revert to original position
	stream.pos = start;
	return null;
};

/**
 * Eats HTML identifier (tag or attribute name) from given stream
 * @param  {StreamReader} stream
 * @return {Token}
 */
function eatTagName(stream) {
	return token(stream, isTagName);
}

/**
 * Check if given character code can be used as HTML/XML tag name
 * @param  {Number}  code
 * @return {Boolean}
 */
function isTagName(code) {
	return isAlphaNumeric(code)
		|| code === COLON$3 // colon is used for namespaces
		|| code === DOT$2   // in rare cases declarative tag names may have dots in names
		|| code === DASH$2$1
		|| code === UNDERSCORE;
}

/**
 * Eats array of character codes from given stream
 * @param  {StreamReader} stream
 * @param  {Number[]} codes  Array of character codes
 * @return {Boolean}
 */
function eatArray(stream, codes) {
	var start = stream.pos;

	for (var i = 0; i < codes.length; i++) {
		if (!stream.eat(codes[i])) {
			stream.pos = start;
			return false;
		}
	}

	stream.start = start;
	return true;
}

/**
 * Consumes section from given string which starts with `open` character codes
 * and ends with `close` character codes
 * @param  {StreamReader} stream
 * @param  {Number[]} open
 * @param  {Number[]} close
 * @return {Boolean}  Returns `true` if section was consumed
 */
function eatSection(stream, open, close, allowUnclosed) {
	var start = stream.pos;
	if (eatArray(stream, open)) {
		// consumed `<!--`, read next until we find ending part or reach the end of input
		while (!stream.eof()) {
			if (eatArray(stream, close)) {
				return true;
			}

			stream.next();
		}

		// unclosed section is allowed
		if (allowUnclosed) {
			return true;
		}

		stream.pos = start;
		return false;
	}

	// unable to find section, revert to initial position
	stream.pos = start;
	return null;
}

/**
 * Converts given string into array of character codes
 * @param  {String} str
 * @return {Number[]}
 */
function toCharCodes(str) {
	return str.split('').map(function (ch) { return ch.charCodeAt(0); });
}

var open  = toCharCodes('<!--');
var close = toCharCodes('-->');

/**
 * Consumes HTML comment from given stream
 * @param  {StreamReader} stream
 * @return {Token}
 */
var comment = function(stream) {
	var start = stream.pos;
	if (eatSection(stream, open, close, true)) {
		var result = token(stream, start);
		result.type = 'comment';
		return result;
	}

	return null;
};

var open$1  = toCharCodes('<![CDATA[');
var close$1 = toCharCodes(']]>');

/**
 * Consumes CDATA from given stream
 * @param  {StreamReader} stream
 * @return {Token}
 */
var cdata = function(stream) {
	var start = stream.pos;
	if (eatSection(stream, open$1, close$1, true)) {
		var result = token(stream, start);
		result.type = 'cdata';
		return result;
	}

	return null;
};

var defaultOptions$6 = {
	/**
	 * Expect XML content in searching content. It alters how should-be-empty
	 * elements are treated: for example, in XML mode parser will try to locate
	 * closing pair for `<br>` tag
	 * @type {Boolean}
	 */
	xml: false,

	special: ['script', 'style'],

	/**
	 * List of elements that should be treated as empty (e.g. without closing tag)
	 * in non-XML syntax
	 * @type {Array}
	 */
	empty: ['img', 'meta', 'link', 'br', 'base', 'hr', 'area', 'wbr']
};

/**
 * Parses given content into a DOM-like structure
 * @param  {String|StreamReader} content
 * @param  {Object} options
 * @return {Node}
 */
function parse$3(content, options) {
	options = Object.assign({}, defaultOptions$6, options);
	var stream = typeof content === 'string'
		? new StreamReader$1(content)
		: content;

	var root = new Node$2(stream, 'root');
	var empty = new Set(options.empty);
	var special = options.special.reduce(
		function (map, name) { return map.set(name, toCharCodes(("</" + name + ">"))); }, new Map());
	var isEmpty = function (token, name) { return token.selfClosing || (!options.xml && empty.has(name)); };

	var m, node, name, stack = [root];

	while (!stream.eof()) {
		if (m = match(stream)) {
			name = getName(m);

			if (m.type === 'open') {
				// opening tag
				node = new Node$2(stream, 'tag', m);
				last$1(stack).addChild(node);
				if (special.has(name)) {
					node.close = consumeSpecial(stream, special.get(name));
				} else if (!isEmpty(m, name)) {
					stack.push(node);
				}
			} else if (m.type === 'close') {
				// closing tag, find it’s matching opening tag
				for (var i = stack.length - 1; i > 0; i--) {
					if (stack[i].name.toLowerCase() === name) {
						stack[i].close = m;
						stack = stack.slice(0, i);
						break;
					}
				}
			} else {
				last$1(stack).addChild(new Node$2(stream, m.type, m));
			}
		} else {
			stream.next();
		}
	}

	return root;
}

/**
 * Matches known token in current state of given stream
 * @param  {ContentStreamReader} stream
 * @return {Token}
 */
function match(stream) {
	// fast-path optimization: check for `<` code
	if (stream.peek() === 60 /* < */) {
		return comment(stream) || cdata(stream) || tag(stream);
	}
}

/**
 * @param  {StreamReader} stream
 * @param  {Number[]} codes
 * @return {Token}
 */
function consumeSpecial(stream, codes) {
	var start = stream.pos;
	var m;

	while (!stream.eof()) {
		if (eatArray(stream, codes)) {
			stream.pos = stream.start;
			return tag(stream);
		}
		stream.next();
	}

	stream.pos = start;
	return null;
}

/**
 * Returns name of given matched token
 * @param  {Token} tag
 * @return {String}
 */
function getName(tag$$1) {
	return tag$$1.name ? tag$$1.name.value.toLowerCase() : ("#" + (tag$$1.type));
}

function last$1(arr) {
	return arr[arr.length - 1];
}

/**
 * A syntax-specific model container, used to get unified access to underlying
 * parsed document
 */
var SyntaxModel = function SyntaxModel(dom, type, syntax) {
	this.dom = dom;
	this.type = type;
	this.syntax = syntax;
};

/**
	 * Returns best matching node for given point
	 * @param  {CodeMirror.Pos}   pos
	 * @param  {Boolean} [exclude] Exclude node’s start and end positions from
	 *                             search
	 * @return {Node}
	 */
SyntaxModel.prototype.nodeForPoint = function nodeForPoint (pos, exclude) {
	var ctx = this.dom.firstChild;
	var found = null;

	while (ctx) {
		if (containsPos(range$1(ctx), pos, exclude)) {
			// Found matching tag. Try to find deeper, more accurate match
			found = ctx;
			ctx = ctx.firstChild;
		} else {
			ctx = ctx.nextSibling;
		}
	}

	return found;
};

function range$1(node) {
	return {
		from: node.start,
		to: node.end
	};
}

var LINE_END = 10; // \n

/**
 * A stream reader for CodeMirror editor
 */
var CodeMirrorStreamReader = (function (StreamReader) {
	function CodeMirrorStreamReader(editor, pos, limit) {
		StreamReader.call(this);
		var CodeMirror = editor.constructor;
		this.editor = editor;
		this.start = this.pos = pos || CodeMirror.Pos(0, 0);

		var lastLine = editor.lastLine();
		this._eof = limit ? limit.to   : CodeMirror.Pos(lastLine, this._lineLength(lastLine));
		this._sof = limit ? limit.from : CodeMirror.Pos(0, 0);
	}

	if ( StreamReader ) CodeMirrorStreamReader.__proto__ = StreamReader;
	CodeMirrorStreamReader.prototype = Object.create( StreamReader && StreamReader.prototype );
	CodeMirrorStreamReader.prototype.constructor = CodeMirrorStreamReader;

	/**
	 * Returns true only if the stream is at the beginning of the file.
	 * @returns {Boolean}
	 */
	CodeMirrorStreamReader.prototype.sof = function sof () {
		return comparePos(this.pos, this._sof) <= 0;
	};

	/**
	 * Returns true only if the stream is at the end of the file.
	 * @returns {Boolean}
	 */
	CodeMirrorStreamReader.prototype.eof = function eof () {
		return comparePos(this.pos, this._eof) >= 0;
	};

	/**
	 * Creates a new stream instance which is limited to given `start` and `end`
	 * points for underlying buffer
	 * @param  {CodeMirror.Pos} start
	 * @param  {CodeMirror.Pos} end
	 * @return {CodeMirrorStreamReader}
	 */
	CodeMirrorStreamReader.prototype.limit = function limit (from, to) {
		return new this.constructor(this.editor, from, { from: from, to: to });
	};

	/**
	 * Returns the next character code in the stream without advancing it.
	 * Will return NaN at the end of the file.
	 * @returns {Number}
	 */
	CodeMirrorStreamReader.prototype.peek = function peek () {
		var ref = this.pos;
		var line = ref.line;
		var ch = ref.ch;
		var lineStr = this.editor.getLine(this.pos.line);
		return ch < lineStr.length ? lineStr.charCodeAt(ch) : LINE_END;
	};

	/**
	 * Returns the next character in the stream and advances it.
	 * Also returns NaN when no more characters are available.
	 * @returns {Number}
	 */
	CodeMirrorStreamReader.prototype.next = function next () {
		if (!this.eof()) {
			var code = this.peek();
			this.pos = Object.assign({}, this.pos, { ch: this.pos.ch + 1 });

			if (this.pos.ch >= this._lineLength(this.pos.line)) {
				this.pos.line++;
				this.pos.ch = 0;
			}

			if (this.eof()) {
				// handle edge case where position can move on next line
				// after EOF
				this.pos = Object.assign({}, this._eof);
			}

			return code;
		}

		return NaN;
	};

	/**
	 * Backs up the stream n characters. Backing it up further than the
	 * start of the current token will cause things to break, so be careful.
	 * @param {Number} n
	 */
	CodeMirrorStreamReader.prototype.backUp = function backUp (n) {
		var this$1 = this;

		var CodeMirror = this.editor.constructor;

		var ref = this.pos;
		var line = ref.line;
		var ch = ref.ch;
		ch -= (n || 1);

		while (line >= 0 && ch < 0) {
			line--;
			ch += this$1._lineLength(line);
		}

		this.pos = line < 0 || ch < 0
			? CodeMirror.Pos(0, 0)
			: CodeMirror.Pos(line, ch);

		return this.peek();
	};

	/**
	 * Get the string between the start of the current token and the
	 * current stream position.
	 * @returns {String}
	 */
	CodeMirrorStreamReader.prototype.current = function current () {
		return this.substring(this.start, this.pos);
	};

	/**
	 * Returns contents for given range
	 * @param  {Point} from
	 * @param  {Point} to
	 * @return {String}
	 */
	CodeMirrorStreamReader.prototype.substring = function substring (from, to) {
		return this.editor.getRange(from, to);
	};

	/**
	 * Creates error object with current stream state
	 * @param {String} message
	 * @return {Error}
	 */
	CodeMirrorStreamReader.prototype.error = function error (message) {
		var err = new Error((message + " at line " + (this.pos.line) + ", column " + (this.pos.ch)));
		err.originalMessage = message;
		err.pos = this.pos;
		err.string = this.string;
		return err;
	};

	/**
	 * Returns length of given line, including line ending
	 * @param  {Number} line
	 * @return {Number}
	 */
	CodeMirrorStreamReader.prototype._lineLength = function _lineLength (line) {
		var isLast = line === this.editor.lastLine();
		return this.editor.getLine(line).length + (isLast ? 0 : 1);
	};

	return CodeMirrorStreamReader;
}(StreamReader$1));

/**
 * Creates DOM-like model for given text editor
 * @param  {CodeMirror} editor
 * @param  {String}     syntax
 * @return {Node}
 */
function create(editor, syntax) {
	var stream = new CodeMirrorStreamReader(editor);
	var xml = syntax === 'xml';

	try {
		return new SyntaxModel(parse$3(stream, { xml: xml }), 'html', syntax || 'html');
	} catch (err) {
		console.warn(err);
	}
}

function getModel(editor) {
	var syntax = getSyntax(editor);
	return create(editor, syntax);
}

function getCachedModel(editor) {
	if (!editor.state._emmetModel) {
		editor.state._emmetModel = getModel(editor);
	}

	return editor.state._emmetModel;
}

function resetCachedModel(editor) {
	editor.state._emmetModel = null;
}

/**
 * Returns parser-supported syntax of given editor (like 'html', 'css' etc.).
 * Returns `null` if editor’s syntax is unsupported
 * @param  {CodeMirror} editor
 * @return {String}
 */
function getSyntax(editor) {
	var mode = editor.getMode();

	if (mode.name === 'htmlmixed') {
		return 'html';
	}

	return mode.name === 'xml' ? mode.configuration : mode.name;
}

var openTagMark = 'emmet-open-tag';
var closeTagMark = 'emmet-close-tag';

/**
 * Finds matching tag pair for given position in editor
 * @param  {CodeMirror} editor
 * @param  {CodeMirror.Pos} pos
 * @return {Object}
 */
function matchTag(editor, pos) {
	pos = pos || editor.getCursor();

	// First, check if there are tag markers in editor
	var marked = getMarkedTag(editor);

	// If marks found, validate them: make sure cursor is either in open
	// or close tag
	if (marked) {
		if (containsPos(marked.open.find(), pos)) {
			// Point is inside open tag, make sure if there’s a closing tag,
			// it matches open tag content
			if (!marked.close || text(editor, marked.open) === text(editor, marked.close)) {
				return marked;
			}
		} else if (marked.close) {
			// There’s a close tag, make sure pointer is inside it and it matches
			// open tag
			if (containsPos(marked.close.find(), pos) && text(editor, marked.open) === text(editor, marked.close)) {
				return marked;
			}
		}
	}
	
	// Markers are not valid anymore, remove them
	clearTagMatch(editor);

	// Find new tag pair from parsed HTML model and mark them
	var node = findTagPair(editor, pos);
	if (node && node.type === 'tag') {
		return {
			open: createTagMark(editor, node.open.name, openTagMark),
			close: node.close && createTagMark(editor, node.close.name, closeTagMark)
		};
	}
}

function getMarkedTag(editor) {
	var open, close;
	editor.getAllMarks().forEach(function (mark) {
		if (mark.className === openTagMark) {
			open = mark;
		} else if (mark.className === closeTagMark) {
			close = mark;
		}
	});

	return open ? { open: open, close: close } : null;
}

/**
 * Removes all matched tag pair markers from editor
 * @param  {CodeMirror} editor
 */
function clearTagMatch(editor) {
	editor.getAllMarks().forEach(function (mark) {
		if (mark.className === openTagMark || mark.className === closeTagMark) {
			mark.clear();
		}
	});
}

/**
 * Finds tag pair (open and close, if any) form parsed HTML model of given editor
 * @param  {CodeMirror} editor
 * @param  {CodeMirror.Pos} pos
 * @return {Object}
 */
function findTagPair(editor, pos) {
	var model = editor.getEmmetDocumentModel();
	return model && model.nodeForPoint(pos || editor.getCursor());
}

function createTagMark(editor, tag, className) {
	return editor.markText(tag.start, tag.end, {
		className: className,
		inclusiveLeft: true,
		inclusiveRight: true,
		clearWhenEmpty: false
	});
}

function text(editor, mark) {
	var range = mark.find();
	return range ? editor.getRange(range.from, range.to) : '';
}

function renameTag(editor, obj) {
	var tag = getMarkedTag(editor);
	var pos = obj.from;

	if (!tag) {
		return;
	}

	if (containsPos(tag.open.find(), pos) && tag.close) {
		// Update happened inside open tag, update close tag as well
		updateTag(editor, tag.open, tag.close);
	} else if (tag.close && containsPos(tag.close.find(), pos)) {
		// Update happened inside close tag, update open tag as well
		updateTag(editor, tag.close, tag.open);
	}
}

function updateTag(editor, source, dest) {
	var name = text$1(editor, source);
	var range = dest.find();
	var m = name.match(/[\w:\-]+/);
	var newName = !name ? '' : (m && m[0]);

	if (newName != null) {
		if (editor.getRange(range.from, range.to) !== newName) {
			editor.replaceRange(newName, range.from, range.to);
		}
	} else {
		// User entered something that wasn’t a valid tag name.
		clearTagMatch(editor);
	}
}

function text$1(editor, mark) {
	var range = mark.find();
	return range ? editor.getRange(range.from, range.to) : '';
}

var commands = { emmetExpandAbbreviation: emmetExpandAbbreviation, emmetInsertLineBreak: emmetInsertLineBreak };

/**
 * Registers Emmet extension on given CodeMirror constructor.
 * This file is designed to be imported somehow into the app (CommonJS, ES6,
 * Rollup/Webpack/whatever). If you simply want to add a <script> into your page
 * that registers Emmet extension on global CodeMirror constructor, use
 * `browser.js` instead
 */
function registerEmmetExtension(CodeMirror) {
	// Register Emmet commands
	Object.assign(CodeMirror.commands, commands);

	// Defines options that allows abbreviation marking in text editor
	CodeMirror.defineOption('markEmmetAbbreviation', true, function (editor, value) {
		if (value) {
			editor.on('change', markOnEditorChange);
		} else {
			editor.off('change', markOnEditorChange);
			clearMarkers(editor);
		}
	});

	CodeMirror.defineOption('autoRenameTags', true, function (editor, value) {
		value ? editor.on('change', renameTag) : editor.off('change', renameTag);
	});

	CodeMirror.defineOption('markTagPairs', false, function (editor, value) {
		if (value) {
			editor.on('cursorActivity', matchTag);
			editor.on('change', resetCachedModel);
		} else {
			editor.off('cursorActivity', matchTag);
			editor.off('change', resetCachedModel);
			resetCachedModel(editor);
			clearTagMatch(editor);
		}
	});

	// Additional options for Emmet, for Expand Abbreviation action mostly:
	// https://github.com/emmetio/expand-abbreviation/blob/master/index.js#L26
	CodeMirror.defineOption('emmet', {});

	/**
	 * Returns Emmet completions for context from `pos` position.
	 * Abbreviations are calculated for marked abbreviation at given position.
	 * If no parsed abbreviation marker is available and `force` argument is
	 * given, tries to mark abbreviation and populate completions list again.
	 * @param  {CodeMirror.Pos} [pos]
	 * @param  {Boolean}        [force]
	 * @return {EmmetCompletion[]}
	 */
	CodeMirror.defineExtension('getEmmetCompletions', function(pos, force) {
		var editor = this;
		if (typeof pos === 'boolean') {
			force = pos;
			pos = null;
		}

		var abbrRange, list;

		pos = pos || editor.getCursor();
		if (editor.getOption('markEmmetAbbreviation')) {
			// Get completions from auto-inserted marker
			var marker = findMarker(editor, pos) || (force && markAbbreviation(editor, pos, true));
			if (marker) {
				abbrRange = marker.find();
				list = autocompleteProvider(editor, marker.model, abbrRange.from, pos);
			}
		} else {
			// No abbreviation auto-marker, try to extract abbreviation from given
			// cursor location
			var extracted = extractAbbreviation(editor, pos);
			if (extracted) {
				var model = createAbbreviationModel(extracted.abbreviation, editor);
				if (model) {
					abbrRange = {
						from: { line: pos.line, ch: extracted.location },
						to: { line: pos.line, ch: extracted.location + extracted.abbreviation.length }
					};
					list = autocompleteProvider(editor, model, abbrRange.from, pos);
				}
			}
		}

		if (list && list.length) {
			return {
				from: abbrRange.from,
				to: abbrRange.to,
				list: list
			};
		}
	});

	/**
	 * Returns valid Emmet abbreviation and its location in editor from given
	 * position
	 * @param  {CodeMirror.Pos} [pos] Position from which abbreviation should be
	 *                                extracted. If not given, current cursor
	 *                                position is used
	 * @return {Object} Object with `abbreviation` and `location` properties
	 * or `null` if there’s no valid abbreviation
	 */
	CodeMirror.defineExtension('getEmmetAbbreviation', function(pos) {
		var editor = this;
		pos = pos || editor.getCursor();
		var marker = findMarker(editor, pos);

		if (marker) {
			return {
				abbreviation: marker.model.abbreviation,
				ast: marker.model.ast,
				location: marker.find().from,
				fromMarker: true
			};
		}

		var extracted = extractAbbreviation(editor, pos);
		if (extracted) {
			try {
				return {
					abbreviation: extracted.abbreviation,
					ast: parseAbbreviation(extracted.abbreviation, editor),
					location: { line: pos.line,  ch: extracted.location },
					fromMarker: false
				};
			} catch (err) {
				// Will throw if abbreviation is invalid
			}
		}

		return null;
	});

	CodeMirror.defineExtension('findEmmetMarker', function(pos) {
		return findMarker(this, pos || this.getCursor());
	});

	CodeMirror.defineExtension('getEmmetDocumentModel', function() {
		var editor = this;
		return editor.getOption('markTagPairs')
			? getCachedModel(editor)
			: getModel(editor);
	});
}

if (typeof CodeMirror !== 'undefined') {
	registerEmmetExtension(CodeMirror);
}

})));

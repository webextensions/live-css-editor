// NOTE: This file is not being used as of now. It is being kept here for future reference.

/*
 * Load a script
 *
 * @param {Object|string} cfg Configuration object or Path of the JS source
 * @param {Document} [cfg.doc=document] Which "document" object to use
 * @param {String} [cfg.parent='body'] Which tag to append to (the "parent" tag value would be used if that element is available)
 * @param {String} cfg.src Path of the JS source
 * @param {Boolean} [cfg.freshCopy=true] Load a fresh JS source
 */
const loadScript = function (cfg) {
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

export { loadScript };

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
const addStyleTag = function (config) {
    var doc = config.doc || document,
        id = config.id;
    if (id) {
        var removeExistingStyleTag = config.removeExistingStyleTagWithSameId;
        if (removeExistingStyleTag === true) {
            var existingStyleTag = document.getElementById(id);
            existingStyleTag.parentNode.removeChild(existingStyleTag);
        }
    }

    var overwriteExistingStyleTag = config.overwriteExistingStyleTagWithSameId,
        styleNode;
    if (overwriteExistingStyleTag && id) {
        styleNode = document.getElementById(id);
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

const StyleTag = function (config) {
    this.cssText = config.cssText;
    this.id = config.id;
    this.parentTag = config.parentTag;
    this.overwriteExistingStyleTagWithSameId = config.overwriteExistingStyleTagWithSameId;
    this.removeExistingStyleTagWithSameId = config.removeExistingStyleTagWithSameId;

    var proto = StyleTag.prototype;
    if (typeof proto.firstExecution == 'undefined') {
        proto.firstExecution = true;

        proto.applyTag = function () {
            addStyleTag({
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

export {
    addStyleTag,
    StyleTag
};

const alertNote = (function () {
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

export { alertNote };

/* globals utils, amplify */

(function () {
    // TODO: Refactor/Reuse the definition of "userPreference"
    var userPreference = function (pref, value) {
        var prefix = 'MagiCSS-bookmarklet-';
        if (value === undefined) {
            return amplify.store(prefix + pref) || '';
        } else {
            amplify.store(prefix + pref, value);
            return this;
        }
    };

    var localStorageDisableStyles = 'disable-styles';
    var disableStyles = userPreference(localStorageDisableStyles) === 'yes';

    var localStorageApplyStylesAutomatically = 'apply-styles-automatically';
    var applyStylesAutomatically = userPreference(localStorageApplyStylesAutomatically) === 'yes';

    var localStorageLastAppliedCss = 'last-applied-css';
    var cssText = userPreference(localStorageLastAppliedCss).trim();

    if (cssText && applyStylesAutomatically && !disableStyles) {
        utils.alertNote('Activating styles provided in Magic CSS.<br/><span style="font-weight:normal;">Run Magic CSS extension to make any changes.</span>', 500, {
            alignment: 'right',
            margin: '0'
        });
        setTimeout(function () {
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

            newStyleTag.cssText = cssText;

            newStyleTag.disabled = disableStyles;
            newStyleTag.applyTag();

            utils.alertNote('Activated styles provided in Magic CSS.<br/><span style="font-weight:normal;">Run Magic CSS extension to make any changes.</span>', 5000, {
                alignment: 'right',
                margin: '0'
            });
        }, 500);
    }
}());

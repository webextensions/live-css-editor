/* global CSSLint */

(function () {
    var originalRules = CSSLint.getRules(),
        rulesToIgnore = [
            'box-model',
            'adjoining-classes',
            'box-sizing',
            'compatible-vendor-prefixes',
            'gradients',
            'fallback-colors',
            'bulletproof-font-face',
            'regex-selectors',
            'overqualified-elements',
            'shorthand',
            'duplicate-background-images',
            'floats',
            'font-sizes',
            'ids',
            'order-alphabetical'
        ],
        newRules = originalRules.filter(function (rule) {
            if (rulesToIgnore.indexOf(rule.id) >= 0) {
                return false;
            }
            return true;
        });

    CSSLint.clearRules();
    newRules.forEach(function (rule) {
        CSSLint.addRule(rule);
    });
}());

/* global jQuery, utils, chrome */

// TODO: Share constants across files (like magicss.js, editor.js and options.js) (probably keep them in a separate file as global variables)
var USER_PREFERENCE_AUTOCOMPLETE_SELECTORS = 'autocomplete-css-selectors',
    USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES = 'autocomplete-css-properties-and-values',
    USER_PREFERENCE_ALL_FRAMES = 'all-frames',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION = 'show-reapplying-styles-notification',
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT = 'show-reapplying-styles-notification-at',
    USER_PREFERENCE_USE_CUSTOM_FONT_SIZE = 'use-custom-font-size',
    USER_PREFERENCE_FONT_SIZE_IN_PX = 'font-size-in-px',
    USER_PREFERENCE_STORAGE_MODE = 'storage-mode',
    USER_PREFERENCE_THEME = 'theme',
    USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT = 'hide-on-page-mouseout';

jQuery(function ($) {
    // TODO: DUPLICATE: Code duplication for browser detection in commands.js, ext-lib.js, magicss.js and options.js
    var isChrome = false,
        isEdge = false,
        isFirefox = false,
        isOpera = false,
        isChromiumBased = false;

    // Note that we are checking for "Edg/" which is the test required for identifying Chromium based Edge browser
    if (/Edg\//.test(navigator.appVersion)) {           // Test for "Edge" before Chrome, because Microsoft Edge browser also adds "Chrome" in navigator.appVersion
        isEdge = true; // eslint-disable-line no-unused-vars
    } else if (/OPR\//.test(navigator.appVersion)) {    // Test for "Opera" before Chrome, because Opera browser also adds "Chrome" in navigator.appVersion
        isOpera = true; // eslint-disable-line no-unused-vars
    } else if (/Chrome/.test(navigator.appVersion)) {
        isChrome = true; // eslint-disable-line no-unused-vars
    } else if (/Firefox/.test(navigator.userAgent)) {   // For Mozilla Firefox browser, navigator.appVersion is not useful, so we need to fallback to navigator.userAgent
        isFirefox = true;
    }
    if (isEdge || isOpera || isChrome) {
        isChromiumBased = true; // eslint-disable-line no-unused-vars
    }

    const flagAllowSassUi = isFirefox ? false : true;

    if (!flagAllowSassUi) {
        $('body').addClass('do-not-allow-sass-ui');
    }

    var chromeStorageForExtensionData = chrome.storage.sync || chrome.storage.local;

    var RadionButtonSelectedValueSet = function (name, SelectedValue) {
        $('input[name="' + name+ '"]').val([SelectedValue]);
    };

    var notifyUser = function () {
        utils.alertNote('Your change would apply next time onwards :-)', 2500);
    };

    chromeStorageForExtensionData.get(USER_PREFERENCE_AUTOCOMPLETE_SELECTORS, function (values) {
        var $useAutocompleteForCssSelectors = $('#autocomplete-selectors'),
            markChecked = true;
        if (values && values[USER_PREFERENCE_AUTOCOMPLETE_SELECTORS] === 'no') {
            markChecked = false;
        }
        $useAutocompleteForCssSelectors.prop('checked', markChecked);
    });
    $('#autocomplete-selectors').on('click', function () {
        var valueToSet = 'no';
        if($(this).is(':checked')) {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_AUTOCOMPLETE_SELECTORS]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES, function (values) {
        var $useAutocompleteForCssPropertyAndValue = $('#autocomplete-css-properties-and-values'),
            markChecked = true;
        if (values && values[USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES] === 'no') {
            markChecked = false;
        }
        $useAutocompleteForCssPropertyAndValue.prop('checked', markChecked);
    });
    $('#autocomplete-css-properties-and-values').on('click', function () {
        var valueToSet = 'no';
        if($(this).is(':checked')) {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_ALL_FRAMES, function (values) {
        var $allFrames = $('#all-frames'),
            markChecked = false;
        if (values && values[USER_PREFERENCE_ALL_FRAMES] === 'yes') {
            markChecked = true;
        }
        $allFrames.prop('checked', markChecked);
    });
    $('#all-frames').on('click', function () {
        var valueToSet = 'no';
        if($(this).is(':checked')) {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_ALL_FRAMES]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION, function (values) {
        var $reapplyingStylesNotification = $('#reapplying-styles-notification'),
            markChecked = true;
        if (values && values[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION] === 'no') {
            markChecked = false;
        }
        $reapplyingStylesNotification.prop('checked', markChecked);
    });
    $('#reapplying-styles-notification').on('click', function () {
        var valueToSet = 'yes';
        if(!$(this).is(':checked')) {
            valueToSet = 'no';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT, function (values) {
        var value = values && values[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT];
        if (['bottom-right', 'bottom-left', 'top-left'].indexOf(value) >= 0) {
            // do nothing
        } else {
            value = 'top-right';
        }
        $('.notification-at-corner').val(value);
    });
    $('.notification-at-corner').change(function () {
        var value = $(this).val(),
            valueToSet = 'top-right';
        if (['bottom-right', 'bottom-left', 'top-left'].indexOf(value) >= 0) {
            valueToSet = value; // default value
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT]: valueToSet});

        // Also mark that "Show notification" would be checked
        $('#reapplying-styles-notification').prop('checked', true);
        chromeStorageForExtensionData.set({[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION]: 'yes'});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT, function (values) {
        var $hideOnPageMouseOut = $('#hide-on-page-mouseout'),
            markChecked = false;
        if (values && values[USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT] === 'yes') {
            markChecked = true;
        }
        $hideOnPageMouseOut.prop('checked', markChecked);
    });
    $('#hide-on-page-mouseout').on('click', function () {
        var valueToSet = 'no';
        if($(this).is(':checked')) {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_STORAGE_MODE, function (values) {
        if (values && values[USER_PREFERENCE_STORAGE_MODE] === 'localStorage') {
            RadionButtonSelectedValueSet(USER_PREFERENCE_STORAGE_MODE, 'localStorage');
        } else if (values && values[USER_PREFERENCE_STORAGE_MODE] === 'chrome.storage.sync') {
            RadionButtonSelectedValueSet(USER_PREFERENCE_STORAGE_MODE, 'chrome.storage.sync');
        } else {
            RadionButtonSelectedValueSet(USER_PREFERENCE_STORAGE_MODE, 'chrome.storage.local');
        }
    });
    $('input[name=storage-mode]').change(function () {
        var value = $(this).val(),
            valueToSet;
        if (value === 'localStorage') {
            valueToSet = 'localStorage';
        } else if (value === 'chrome.storage.sync') {
            valueToSet = 'chrome.storage.sync';
        } else {
            valueToSet = 'chrome.storage.local';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_STORAGE_MODE]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get('default-language-mode', function (values) {
        if (values && values['default-language-mode'] === 'less') {
            RadionButtonSelectedValueSet('default-language-mode', 'less');
        } else if (values && values['default-language-mode'] === 'sass') {
            RadionButtonSelectedValueSet('default-language-mode', 'sass');
        } else {
            RadionButtonSelectedValueSet('default-language-mode', 'css');
        }
    });
    $('input[name=default-language-mode]').change(function () {
        var value = $(this).val(),
            valueToSet;
        if (value === 'less') {
            valueToSet = 'less';
        } else if (value === 'sass') {
            valueToSet = 'sass';
        } else {
            valueToSet = 'css';
        }
        chromeStorageForExtensionData.set({'default-language-mode': valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_THEME, function (values) {
        if (values && values[USER_PREFERENCE_THEME] === 'dark') {
            RadionButtonSelectedValueSet(USER_PREFERENCE_THEME, 'dark');
        } else {
            RadionButtonSelectedValueSet(USER_PREFERENCE_THEME, 'light');
        }
    });
    $('input[name=theme]').change(function () {
        var value = $(this).val(),
            valueToSet;
        if (value === 'dark') {
            valueToSet = 'dark';
        } else {
            valueToSet = 'light';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_THEME]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get('use-tab-for-indentation', function (values) {
        if (values && values['use-tab-for-indentation'] === 'yes') {
            RadionButtonSelectedValueSet('indentation', 'tab');
        } else {
            RadionButtonSelectedValueSet('indentation', 'spaces');
        }
    });
    $('input[name=indentation]').change(function () {
        var value = $(this).val(),
            valueToSet = 'no';
        if (value === 'tab') {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({'use-tab-for-indentation': valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get('indentation-spaces-count', function (values) {
        var value = parseInt(values && values['indentation-spaces-count'], 10);
        if (isNaN(value) || !(value >= 1 && value <= 8)) {
            value = 4;
        }
        $('.indentation-spaces-count').val('' + value);
    });
    $('.indentation-spaces-count').change(function () {
        var value = $(this).val(),
            valueToSet = value;
        if (!(value >= 1 && value <= 8)) {
            valueToSet = 4; // default value
        }
        chromeStorageForExtensionData.set({'indentation-spaces-count': valueToSet});

        // Also mark that space characters would be used for indentation
        RadionButtonSelectedValueSet('indentation', 'spaces');
        chromeStorageForExtensionData.set({'use-tab-for-indentation': 'no'});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_USE_CUSTOM_FONT_SIZE, function (values) {
        if (values && values[USER_PREFERENCE_USE_CUSTOM_FONT_SIZE] === 'yes') {
            RadionButtonSelectedValueSet('font-size-setting', 'custom');
        } else {
            RadionButtonSelectedValueSet('font-size-setting', 'default');
        }
    });
    $('input[name=font-size-setting]').change(function () {
        var value = $(this).val(),
            valueToSet = 'no';
        if (value === 'custom') {
            valueToSet = 'yes';
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_USE_CUSTOM_FONT_SIZE]: valueToSet});
        notifyUser();
    });

    chromeStorageForExtensionData.get(USER_PREFERENCE_FONT_SIZE_IN_PX, function (values) {
        var value = parseInt(values && values[USER_PREFERENCE_FONT_SIZE_IN_PX], 10);
        if (isNaN(value) || !(value >= 8 && value <= 36)) {
            value = 12;
        }
        $('.font-size-in-px').val('' + value);
    });
    $('.font-size-in-px').change(function () {
        var value = $(this).val(),
            intValue = parseInt(value, 10),
            valueToSet = value;
        if (!(intValue >= 8 && intValue <= 36)) {
            valueToSet = "12"; // default value
        }
        chromeStorageForExtensionData.set({[USER_PREFERENCE_FONT_SIZE_IN_PX]: valueToSet});

        // Also mark that "Custom" font-size would be used
        RadionButtonSelectedValueSet('font-size-setting', 'custom');
        chromeStorageForExtensionData.set({[USER_PREFERENCE_USE_CUSTOM_FONT_SIZE]: 'yes'});
        notifyUser();
    });


    $('#done').on('click', function () {
        window.close();
    });
});

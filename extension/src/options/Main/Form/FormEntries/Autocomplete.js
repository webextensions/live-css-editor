import React, { useState, useEffect } from 'react';

import {
    chromeStorageForExtensionData,
    notifyUser
} from '../../../helpers/helpers.js';
import {
    USER_PREFERENCE_AUTOCOMPLETE_SELECTORS,
    USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES
} from '../../../../../constants.js';

const Autocomplete = function () {
    const [autocompleteSelectors, setAutocompleteSelectors] = useState('');

    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_AUTOCOMPLETE_SELECTORS, function (values) {
            let valueToSet = 'yes';
            if (values && values[USER_PREFERENCE_AUTOCOMPLETE_SELECTORS] === 'no') {
                valueToSet = 'no';
            }
            setAutocompleteSelectors(valueToSet);
        });
    }, []);

    const handleAutocompleteSelectorsChange = function (evt) {
        let valueToSet = 'no';
        if (evt.target.checked) {
            valueToSet = 'yes';
        }
        setAutocompleteSelectors(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_AUTOCOMPLETE_SELECTORS]: valueToSet });
        notifyUser();
    };

    const [autocompleteCssPropertiesAndValues, setAutocompleteCssPropertiesAndValues] = useState('');

    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES, function (values) {
            let valueToSet = 'yes';
            if (values && values[USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES] === 'no') {
                valueToSet = 'no';
            }
            setAutocompleteCssPropertiesAndValues(valueToSet);
        });
    }, []);

    const handleAutocompleteCssPropertiesAndValuesChange = function (evt) {
        let valueToSet = 'no';
        if (evt.target.checked) {
            valueToSet = 'yes';
        }
        setAutocompleteCssPropertiesAndValues(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_AUTOCOMPLETE_CSS_PROPERTIES_AND_VALUES]: valueToSet });
        notifyUser();
    };

    return (
        <div className="option">
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label>
                        <div>
                            <input
                                type="checkbox"
                                checked={autocompleteSelectors === 'yes'}
                                onChange={handleAutocompleteSelectorsChange}
                            /> &nbsp;CSS selectors
                            <div style={{ marginLeft: 24, fontSize: '1.1rem', fontWeight: 'normal', color: '#777' }}>
                                If your selectors are pre-processed, you may wish to uncheck it.
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label>
                        <div>
                            <input
                                type="checkbox"
                                checked={autocompleteCssPropertiesAndValues === 'yes'}
                                onChange={handleAutocompleteCssPropertiesAndValuesChange}
                            /> &nbsp;CSS properties and values
                            <div style={{ marginLeft: 24, fontSize: '1.1rem', fontWeight: 'normal', color: '#777' }}>
                                If you mostly use Emmet autocomplete, you may wish to uncheck it.
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export { Autocomplete };

import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser,
    isSassUiAllowed
} from '../helpers.js';

import {
    USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT,
    USER_PREFERENCE_USE_SASS_SYNTAX
} from '../../../../constants.js';

const ExperimentalOptions = function () {
    const [flagSassUiAllowed, setFlagSassUiAllowed] = useState(null);
    useEffect(() => {
        (async () => {
            const isSassUiAllowedValue = await isSassUiAllowed();
            setFlagSassUiAllowed(isSassUiAllowedValue);
        })();
    }, []);

    const [hideOnPageMouseOut, setHideOnPageMouseOut] = useState('');
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT, function (values) {
            let valueToSet = 'no';
            if (values && values[USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT] === 'yes') {
                valueToSet = 'yes';
            }
            setHideOnPageMouseOut(valueToSet);
        });
    }, []);
    const handleHideOnPageMouseOutChange = function (evt) {
        let valueToSet = 'no';
        if (evt.target.checked) {
            valueToSet = 'yes';
        }
        setHideOnPageMouseOut(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_HIDE_ON_PAGE_MOUSEOUT]: valueToSet });
        notifyUser();
    };

    const [useSassSyntax, setUseSassSyntax] = useState('');
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_USE_SASS_SYNTAX, function (values) {
            let valueToSet = 'no';
            if (values && values[USER_PREFERENCE_USE_SASS_SYNTAX] === 'yes') {
                valueToSet = 'yes';
            }
            setUseSassSyntax(valueToSet);
        });
    }, []);
    const handleUseSassSyntaxChange = function (evt) {
        let valueToSet = 'no';
        if (evt.target.checked) {
            valueToSet = 'yes';
        }
        setUseSassSyntax(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_USE_SASS_SYNTAX]: valueToSet });
        notifyUser();
    };

    return (
        <div className="option">
            <div className="option-heading">
                Experimental options:
                <div style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>These options may not work perfectly in all the scenarios.</div>
            </div>
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label title="This may not work well when you are working in &quot;no mouse support&quot; mode.&#013;&#010;&#013;&#010;It should work well in &quot;Responsive&quot; mode of browser's &quot;Developer tools&quot; when having support for touch and mouse, both.">
                        <input
                            type="checkbox"
                            checked={hideOnPageMouseOut === 'yes'}
                            onChange={handleHideOnPageMouseOutChange}
                        /> <div>Hide editor when mouse pointer is outside the webpage</div>
                    </label>
                </div>
            </div>
            {
                flagSassUiAllowed &&
                <div style={{ marginLeft: 20 }}>
                    <div className="option-value">
                        <label>
                            <input
                                type="checkbox"
                                checked={useSassSyntax === 'yes'}
                                onChange={handleUseSassSyntaxChange}
                            /> <div>Use Sass syntax (rather than SCSS syntax)</div>
                        </label>
                    </div>
                </div>
            }
        </div>
    );
};

export { ExperimentalOptions };

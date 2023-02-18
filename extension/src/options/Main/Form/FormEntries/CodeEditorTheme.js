import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';
import { USER_PREFERENCE_THEME } from '../../../../../constants.js';

const CodeEditorTheme = function () {
    const [codeEditorTheme, setCodeEditorTheme] = useState('');

    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_THEME, function (values) {
            let valueToSet = 'light';
            if (values && values[USER_PREFERENCE_THEME] === 'dark') {
                valueToSet = 'dark';
            }
            setCodeEditorTheme(valueToSet);
        });
    }, []);

    const handleCodeEditorThemeChange = function (evt) {
        const valueToSet = evt.target.value;
        setCodeEditorTheme(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_THEME]: valueToSet });
        notifyUser();
    };

    return (
        <div className="option">
            <div className="option-heading">Code editor theme:</div>
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label>
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={codeEditorTheme === 'light'}
                            onChange={handleCodeEditorThemeChange}
                        /> &nbsp; Light
                    </label>
                </div>
                <div className="option-value">
                    <label>
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={codeEditorTheme === 'dark'}
                            onChange={handleCodeEditorThemeChange}
                        /> &nbsp; Dark
                    </label>
                </div>
            </div>
        </div>
    );
};

export { CodeEditorTheme };

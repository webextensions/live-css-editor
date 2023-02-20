import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser,
    isSassUiAllowed
} from '../helpers.js';

const DefaultMode = function () {
    const [defaultMode, setDefaultMode] = useState('');
    const [flagSassUiAllowed, setFlagSassUiAllowed] = useState(null);

    useEffect(() => {
        chromeStorageForExtensionData.get('default-language-mode', function (values) {
            let valueToSet = 'css';
            if (
                values &&
                (
                    values['default-language-mode'] === 'less' ||
                    values['default-language-mode'] === 'sass'
                )
            ) {
                valueToSet = values['default-language-mode'];
            }
            setDefaultMode(valueToSet);
        });

        (async () => {
            const isSassUiAllowedValue = await isSassUiAllowed();
            setFlagSassUiAllowed(isSassUiAllowedValue);
        })();
    }, []);

    const handleDefaultModeChange = function (evt) {
        const valueToSet = evt.target.value;
        setDefaultMode(valueToSet);
        chromeStorageForExtensionData.set({'default-language-mode': valueToSet});
        notifyUser();
    };

    return (
        <div className="option">
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label style={{ display: 'flex' }}>
                        <div>
                            <input
                                type="radio"
                                name="default-language-mode"
                                value="css"
                                checked={defaultMode === 'css'}
                                onChange={handleDefaultModeChange}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            CSS
                        </div>
                    </label>
                </div>
                <div className="option-value">
                    <label style={{ display: 'flex' }}>
                        <div>
                            <input
                                type="radio"
                                name="default-language-mode"
                                value="less"
                                checked={defaultMode === 'less'}
                                onChange={handleDefaultModeChange}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            Less
                        </div>
                    </label>
                </div>
                {
                    flagSassUiAllowed &&
                    <div className="option-value">
                        <label style={{ display: 'flex' }}>
                            <div>
                                <input
                                    type="radio"
                                    name="default-language-mode"
                                    value="sass"
                                    checked={defaultMode === 'sass'}
                                    onChange={handleDefaultModeChange}
                                />
                            </div>
                            <div style={{ marginLeft: 5 }}>
                                Sass
                            </div>
                        </label>
                    </div>
                }
            </div>
        </div>
    );
};

export { DefaultMode };

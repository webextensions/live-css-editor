import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';

import { USER_PREFERENCE_ALL_FRAMES } from '../../../../../constants.js';

const LoadForIframe = function () {
    const [allFrames, setAllFrames] = useState('');

    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_ALL_FRAMES, function (values) {
            let valueToSet = 'no';
            if (values && values[USER_PREFERENCE_ALL_FRAMES] === 'yes') {
                valueToSet = 'yes';
            }
            setAllFrames(valueToSet);
        });
    }, []);

    const handleAllFramesChange = function (evt) {
        let valueToSet = 'no';
        if (evt.target.checked) {
            valueToSet = 'yes';
        }
        setAllFrames(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_ALL_FRAMES]: valueToSet });
        notifyUser();
    };
    return (
        <div className="option">
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label
                        style={{ display: 'flex' }}
                    >
                        <div style={{ marginTop: 1 }}>
                            <input
                                type="checkbox"
                                checked={allFrames === 'yes'}
                                onChange={handleAllFramesChange}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            Load separate instances for each frame/iframe
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export { LoadForIframe };

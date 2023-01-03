import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';

import { USER_PREFERENCE_STORAGE_MODE } from '../../../../constants.js';

const Storage = function () {
    const [storageMode, setStorageMode] = useState('');

    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_STORAGE_MODE, function (values) {
            let valueToSet = 'chrome.storage.local';
            if (
                values &&
                (
                    values[USER_PREFERENCE_STORAGE_MODE] === 'chrome.storage.local' ||
                    values[USER_PREFERENCE_STORAGE_MODE] === 'chrome.storage.sync' ||
                    values[USER_PREFERENCE_STORAGE_MODE] === 'localStorage'
                )
            ) {
                valueToSet = values[USER_PREFERENCE_STORAGE_MODE];
            }
            setStorageMode(valueToSet);
        });
    }, []);

    const handleStorageModeChange = function (evt) {
        const valueToSet = evt.target.value;
        setStorageMode(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_STORAGE_MODE]: valueToSet });
        notifyUser();
    };

    return (
        <div className="option">
            <div className="option-heading">
                Storage:
                <div style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>If you change this option, the data would be auto-migrated between these storages per site when used.</div>
            </div>
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div>
                            <input
                                type="radio"
                                name="storage-mode"
                                value="chrome.storage.local"
                                checked={storageMode === 'chrome.storage.local'}
                                onChange={handleStorageModeChange}
                            /> Extension Storage <span style={{ color: '#aaa' }}>&nbsp;(browser.storage.local)</span>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', color: '#aaa', marginBottom: 8 }}>Remember all your changes and keep them accessible only through this extension.</div>
                    </label>
                </div>

                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div>
                            <input
                                type="radio"
                                name="storage-mode"
                                value="localStorage"
                                checked={storageMode === 'localStorage'}
                                onChange={handleStorageModeChange}
                            /> Web Storage <span style={{ color: '#aaa' }}>&nbsp;(localStorage)</span>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', color: '#aaa', marginBottom: 8 }}>
                            {'Your changes might be cleared/overwritten by "Clear History" feature of the browser or by JavaScript on the web page.'}
                        </div>
                    </label>
                </div>

                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div>
                            <input
                                type="radio"
                                name="storage-mode"
                                value="chrome.storage.sync"
                                checked={storageMode === 'chrome.storage.sync'}
                                onChange={handleStorageModeChange}
                            /> Extension Storage Sync (Alpha) <span style={{ color: '#aaa' }}>&nbsp;(browser.storage.sync)</span>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', marginBottom: 8, color: '#555' }}>
                            <span style={{ fontWeight: 'bold' }}>EXPERIMENTAL:</span> Try only if you use it for less than 25 sites.
                            <br />
                            <br />
                            <a target="_blank" rel="noreferrer" href="https://developer.chrome.com/docs/extensions/reference/storage/#property-sync" style={{ color: '#555', textDecoration: 'none' }}><span style={{ textDecoration: 'underline' }}>Click here</span> to understand the storage limits</a>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', color: '#aaa' }}>Remember all your changes on your connected computers and keep them accessible only through this extension.</div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export { Storage };

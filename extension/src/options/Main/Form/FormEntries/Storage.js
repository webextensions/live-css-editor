import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';

import { USER_PREFERENCE_STORAGE_MODE } from '../../../../../constants.js';

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
                <div style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>If you change this option, the data would be auto-migrated between these storages per site when used.</div>
            </div>
            <div style={{ marginLeft: 20, marginTop: 10 }}>
                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <input
                                    type="radio"
                                    name="storage-mode"
                                    value="chrome.storage.local"
                                    checked={storageMode === 'chrome.storage.local'}
                                    onChange={handleStorageModeChange}
                                />
                            </div>
                            <div style={{ marginLeft: 5 }}>
                                Extension Storage&nbsp; <span style={{ color: '#777' }}>(browser.storage.local)</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', color: '#777', marginBottom: 8 }}>Remember all your changes and keep them accessible only through this extension.</div>
                    </label>
                </div>

                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <input
                                    type="radio"
                                    name="storage-mode"
                                    value="localStorage"
                                    checked={storageMode === 'localStorage'}
                                    onChange={handleStorageModeChange}
                                />
                            </div>
                            <div style={{ marginLeft: 5 }}>
                                Web Storage&nbsp; <span style={{ color: '#777' }}>(localStorage)</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', color: '#777', marginBottom: 8 }}>
                            {'Your changes might be cleared/overwritten by "Clear History" feature of the browser or by JavaScript on the web page.'}
                        </div>
                    </label>
                </div>

                <div className="option-value">
                    <label style={{ display: 'block' }}>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <input
                                    type="radio"
                                    name="storage-mode"
                                    value="chrome.storage.sync"
                                    checked={storageMode === 'chrome.storage.sync'}
                                    onChange={handleStorageModeChange}
                                />
                            </div>
                            <div style={{ marginLeft: 5 }}>
                                Extension Storage Sync (Alpha)&nbsp; <span style={{ color: '#777' }}>(browser.storage.sync)</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 22, fontSize: '1.1rem', fontWeight: 'normal', marginTop: 5, color: '#555' }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>EXPERIMENTAL:</span> Try only if you use it for less than 25 sites.
                            </div>
                            <div style={{ marginTop: 5 }}>
                                <a target="_blank" rel="noreferrer" href="https://developer.chrome.com/docs/extensions/reference/storage/#property-sync" style={{ color: '#555', textDecoration: 'none' }}><span style={{ textDecoration: 'underline' }}>Click here</span> to understand the storage limits.</a>
                            </div>
                        </div>
                        <div style={{ marginLeft: 22, marginTop: 5, fontSize: '1.1rem', fontWeight: 'normal', color: '#777' }}>Remember all your changes on your connected computers and keep them accessible only through this extension.</div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export { Storage };

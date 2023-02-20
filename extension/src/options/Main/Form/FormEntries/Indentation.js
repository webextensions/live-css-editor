import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';

const Indentation = function () {
    const [indentation, setIndentation] = useState('');

    useEffect(function () {
        chromeStorageForExtensionData.get('use-tab-for-indentation', function (values) {
            if (values && values['use-tab-for-indentation'] === 'yes') {
                setIndentation('tab');
            } else {
                setIndentation('spaces');
            }
        });
    }, []);

    const handleIndentationChange = function (evt) {
        const valueToSet = evt.target.value;
        setIndentation(valueToSet);
        chromeStorageForExtensionData.set({'use-tab-for-indentation': valueToSet === 'tab' ? 'yes' : 'no'});
        notifyUser();
    };

    const [spacesCount, setSpacesCount] = useState('4');

    useEffect(function () {
        chromeStorageForExtensionData.get('indentation-spaces-count', function (values) {
            let value = parseInt(values && values['indentation-spaces-count'], 10);
            if (isNaN(value) || !(value >= 1 && value <= 8)) {
                value = 4;
            }
            setSpacesCount('' + value);
        });
    }, []);

    const handleSpacesCountChange = function (evt) {
        const value = evt.target.value;
        let valueToSet = value;
        if (!(value >= 1 && value <= 8)) {
            valueToSet = 4; // default value
        }
        setSpacesCount('' + valueToSet);
        chromeStorageForExtensionData.set({'indentation-spaces-count': valueToSet});

        // Also mark that space characters would be used for indentation
        setIndentation('spaces');
        chromeStorageForExtensionData.set({'use-tab-for-indentation': 'no'});

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
                                name="indentation"
                                value="tab"
                                checked={indentation === 'tab'}
                                onChange={handleIndentationChange}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            Tab character
                        </div>
                    </label>
                </div>
                <div className="option-value">
                    <label style={{ display: 'flex' }}>
                        <div>
                            <input
                                type="radio"
                                name="indentation"
                                value="spaces"
                                checked={indentation === 'spaces'}
                                onChange={handleIndentationChange}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            Space characters:
                        </div>
                    </label>
                    <select
                        className="indentation-spaces-count"
                        value={spacesCount}
                        style={{ marginLeft: 10,  width: 50 }}
                        onChange={handleSpacesCountChange}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export { Indentation };

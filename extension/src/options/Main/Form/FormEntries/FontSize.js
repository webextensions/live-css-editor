import React, { useState, useEffect } from 'react';
import {
    chromeStorageForExtensionData,
    notifyUser
} from '../helpers.js';

import {
    USER_PREFERENCE_USE_CUSTOM_FONT_SIZE,
    USER_PREFERENCE_FONT_SIZE_IN_PX
} from '../../../../../constants.js';

const FontSize = function () {
    const [useCustomFontSize, setUseCustomFontSize] = useState('');
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_USE_CUSTOM_FONT_SIZE, function (values) {
            let valueToSet = 'no';
            if (values && values[USER_PREFERENCE_USE_CUSTOM_FONT_SIZE] === 'yes') {
                valueToSet = 'yes';
            }
            setUseCustomFontSize(valueToSet);
        });
    }, []);
    const handleFontSizeSettingChange = (e) => {
        let value = e.target.value,
            valueToSet = 'no';
        if (value === 'custom') {
            valueToSet = 'yes';
        }
        setUseCustomFontSize(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_USE_CUSTOM_FONT_SIZE]: valueToSet });
        notifyUser();
    };

    const [fontSizeInPx, setFontSizeInPx] = useState('');
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_FONT_SIZE_IN_PX, function (values) {
            let value = parseInt(values && values[USER_PREFERENCE_FONT_SIZE_IN_PX], 10);
            if (isNaN(value) || !(value >= 8 && value <= 36)) {
                value = 12;
            }
            setFontSizeInPx('' + value);
        });
    }, []);
    const handleFontSizeChange = (e) => {
        let value = e.target.value,
            intValue = parseInt(value, 10),
            valueToSet = value;
        if (!(intValue >= 8 && intValue <= 36)) {
            valueToSet = '12'; // default value
        }
        setFontSizeInPx(valueToSet);
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_FONT_SIZE_IN_PX]: valueToSet });

        // Also mark that "Custom" font-size would be used
        setUseCustomFontSize('yes');
        chromeStorageForExtensionData.set({ [USER_PREFERENCE_USE_CUSTOM_FONT_SIZE]: 'yes' });

        notifyUser();
    };

    return (
        <div className="option">
            <div className="option-heading">Font size:</div>
            <div style={{ marginLeft: 20 }}>
                <div className="option-value">
                    <label>
                        <input
                            type="radio"
                            name="font-size-setting"
                            value="default"
                            checked={useCustomFontSize === 'no'}
                            onChange={handleFontSizeSettingChange}
                        /> &nbsp; Default
                    </label>
                </div>
                <div className="option-value">
                    <label>
                        <input
                            type="radio"
                            name="font-size-setting"
                            value="custom"
                            checked={useCustomFontSize === 'yes'}
                            onChange={handleFontSizeSettingChange}
                        /> &nbsp; Custom: &nbsp;
                    </label>
                    <select
                        className="font-size-in-px"
                        value={fontSizeInPx}
                        onChange={handleFontSizeChange}
                    >
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="36">36</option>
                    </select>
                    &nbsp;px
                </div>
            </div>
        </div>
    );
};

export { FontSize };

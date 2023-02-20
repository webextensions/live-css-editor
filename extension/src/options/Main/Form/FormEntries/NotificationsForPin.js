import React, { useState, useEffect } from 'react';

import {
    chromeStorageForExtensionData,
    notifyUser
} from '../../../helpers/helpers.js';
import {
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION,
    USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT
} from '../../../../../constants.js';

const NotificationsForPin = function () {
    const [showNotification, setShowNotification] = useState(false);
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION, function (values) {
            let markChecked = true;
            if (values && values[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION] === 'no') {
                markChecked = false;
            }
            setShowNotification(markChecked);
        });
    }, []);

    const [notificationAtCorner, setNotificationAtCorner] = useState('');
    useEffect(() => {
        chromeStorageForExtensionData.get(USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT, function (values) {
            let valueToSet = 'top-right';
            const value = values && values[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT];
            if (['bottom-right', 'bottom-left', 'top-left'].indexOf(value) >= 0) {
                valueToSet = values[USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT];
            }
            setNotificationAtCorner(valueToSet);
        });
    }, []);

    return (
        <div className="option">
            <div style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>When applying styles automatically:</div>
            <div style={{ marginLeft: 20, marginTop: 10 }}>
                <div className="option-value">
                    <label>
                        <div style={{ marginTop: 1 }}>
                            <input
                                type="checkbox"
                                checked={showNotification}
                                onChange={function (evt) {
                                    let valueToSet = 'yes';
                                    if(!evt.target.checked) {
                                        valueToSet = 'no';
                                    }
                                    setShowNotification(evt.target.checked);
                                    chromeStorageForExtensionData.set({ [USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION] : valueToSet });
                                    notifyUser();
                                }}
                            />
                        </div>
                        <div style={{ marginLeft: 5 }}>
                            Show notification at:
                        </div>
                    </label>
                    {
                        notificationAtCorner &&
                        <select
                            className="notification-at-corner"
                            value={notificationAtCorner}
                            style={{ marginLeft: 10 }}
                            onChange={function (evt) {
                                var value = evt.target.value,
                                    valueToSet = 'top-right'; // default value
                                if (['bottom-right', 'bottom-left', 'top-left'].indexOf(value) >= 0) {
                                    valueToSet = value;
                                }
                                setNotificationAtCorner(valueToSet);
                                chromeStorageForExtensionData.set({ [USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION_AT]: valueToSet });

                                // Also mark that "Show notification" would be checked
                                setShowNotification(true);
                                chromeStorageForExtensionData.set({ [USER_PREFERENCE_SHOW_REAPPLYING_STYLES_NOTIFICATION]: 'yes' });

                                notifyUser();
                            }}
                        >
                            <option value="top-right">top-right</option>
                            <option value="bottom-right">bottom-right</option>
                            <option value="bottom-left">bottom-left</option>
                            <option value="top-left">top-left</option>
                        </select>
                    }
                </div>
            </div>
        </div>
    );
};

export { NotificationsForPin };

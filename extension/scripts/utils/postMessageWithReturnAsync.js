import { randomUUID } from './randomUUID.js';

const originMatchesTargetOrigin = function (origin, targetOrigin) {
    if (
        targetOrigin === '*' ||
        origin === targetOrigin
    ) {
        return true;
    } else {
        return false;
    }
};

const postMessageWithReturnAsync = function (targetWindow, data, targetOrigin) {
    return new Promise((resolve) => {
        const uuid = randomUUID();

        const fn = (evt) => {
            if (
                !(
                    originMatchesTargetOrigin(evt.origin, targetOrigin)
                )
            ) {
                return;
            } else {
                if (evt.data && typeof evt.data === 'object') {
                    if (evt.data.originalData?.uuid === uuid) {
                        window.removeEventListener('message', fn);
                        resolve({
                            origin: evt.origin,
                            data: {
                                uuid: evt.data.uuid,
                                flagProxy: evt.data.flagProxy,
                                originalData: evt.data.originalData
                            }
                        });
                    }
                }
            }
        };
        window.addEventListener('message', fn);

        targetWindow.postMessage(
            {
                uuid,
                flagProxy: true,
                originalData: data
            },
            targetOrigin
        );
    });
};

export { postMessageWithReturnAsync };

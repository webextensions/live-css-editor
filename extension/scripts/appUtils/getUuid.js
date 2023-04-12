import { chromeStorageLocalGet } from '../utils/chromeStorage.js';

const INSTANCE_UUID = 'instance-uuid';

const timeout = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const getUuid = async function () {
    let uuid;

    for (let i = 0; i < 5; i++) {
        uuid = await chromeStorageLocalGet(INSTANCE_UUID);
        if (uuid) {
            break;
        }
        await timeout(1000);
    }

    if (uuid) {
        return [null, uuid];
    } else {
        const errToReport = new Error(`Unable to fetch the ${INSTANCE_UUID}`);
        console.error(errToReport);
        return [errToReport];
    }
};

export { getUuid };

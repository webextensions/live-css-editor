import { chromeStorageLocalGet } from '../utils/chromeStorage.js';
import { basisNumberFromUuid } from '../utils/basisNumberFromUuid.js';

const INSTANCE_UUID = 'instance-uuid';

const isFeatureEnabled = async function (enabledOrConditions) {
    let flag = false;

    const instanceUuid = await chromeStorageLocalGet(INSTANCE_UUID);
    const basisNumber = basisNumberFromUuid(instanceUuid);

    if (enabledOrConditions === true) {
        flag = true;
    } else if (Array.isArray(enabledOrConditions)) {
        const conditions = enabledOrConditions;
        for (const condition of conditions) {
            if (Array.isArray(condition)) {
                const [from, to] = condition;
                if (from <= basisNumber && basisNumber <= to) {
                    flag = true;
                    break;
                }
            } else if (typeof condition === 'string') {
                if (instanceUuid.indexOf(condition) >= 0) {
                    flag = true;
                    break;
                }
            }
        }
    }

    return flag;
};

export { isFeatureEnabled };

/* global chrome */

import { theWin } from './theWin.js';

const fetchInstanceInfo = function () {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { type: 'magicss-instance-info' },
            function ([instanceUuid, instanceBasisNumber]) {
                return resolve([instanceUuid, instanceBasisNumber]);
            }
        );
    });
};

const getInstanceInfo = async function () {
    let instanceUuid = null,
        instanceBasisNumber = null;

    if (theWin.instanceUuid && theWin.instanceBasisNumber) {
        instanceUuid = theWin.instanceUuid;
        instanceBasisNumber = theWin.instanceBasisNumber;
    } else {
        [
            instanceUuid,
            instanceBasisNumber
        ] = await fetchInstanceInfo();
    }

    return [
        instanceUuid,
        instanceBasisNumber
    ];
};

const initializeInstanceInfo = async function () {
    const [ instanceUuid, instanceBasisNumber ] = await getInstanceInfo();
    theWin.instanceUuid = instanceUuid;
    theWin.instanceBasisNumber = instanceBasisNumber;
};

const getConfigFromRemote = function () {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { type: '@magic-css/config' },
            function (remoteConfig) {
                return resolve(remoteConfig);
            }
        );
    });
};

const updateConfigFromRemoteForNextLoad = async function () {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            {
                type: '@magic-css/config',
                subType: 'update-for-next-load'
            },
            function (remoteConfig) {
                return resolve(remoteConfig);
            }
        );
    });
};

const getConfig = async function () {
    const flagDebug = false; // DEV-HELPER: Useful when developing / debugging
    if (flagDebug || !theWin.remoteConfig) {
        theWin.remoteConfig = await getConfigFromRemote();
    }
    return theWin.remoteConfig;
};

const setupIsFeatureEnabled = async function () {
    const [ instanceUuid, instanceBasisNumber ] = await getInstanceInfo();

    theWin.instanceUuid = instanceUuid;
    theWin.instanceBasisNumber = instanceBasisNumber;
};

const isFeatureEnabled = function (enabledOrConditions) {
    let flag = false;

    if (enabledOrConditions === true) {
        flag = true;
    } else if (Array.isArray(enabledOrConditions)) {
        const instanceUuid = theWin.instanceUuid;
        const basisNumber = theWin.instanceBasisNumber;

        if (
            typeof instanceUuid === 'string' &&
            typeof basisNumber === 'number'
        ) {
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
    }

    return flag;
};

export {
    getConfig,
    updateConfigFromRemoteForNextLoad,
    initializeInstanceInfo,
    setupIsFeatureEnabled,
    isFeatureEnabled
};

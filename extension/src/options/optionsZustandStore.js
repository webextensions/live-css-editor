/* global chrome */

import { create } from 'zustand';

import {
    READYSTATE,
    UNINITIALIZED,
    LOADED
} from '../appUtils/readyStateConstants.js';

const useDialogsStore = create((set) => ({
    flagShowConnectViaDialog: false,

    setFlagShowConnectViaDialog: (flagShowConnectViaDialog) => {
        set({ flagShowConnectViaDialog });
    }
}));

const useAuthStore = create((set, get) => ({ // eslint-disable-line no-unused-vars
    [READYSTATE]: UNINITIALIZED,
    value: null,

    isLoggedIn: () => {
        const auth = get();

        const authReadyState = auth[READYSTATE];
        const authValue = auth.value;

        const flagLoggedIn = !!(
            authReadyState === LOADED &&
            authValue &&
            authValue.accountUuid &&
            authValue.validUntil &&
            (authValue.validUntil > Date.now())
        );

        return flagLoggedIn;
    },
    logout: () => {
        set({
            [READYSTATE]: LOADED,
            value: null
        });
    },
    loginWithAuthValue: (authValue) => {
        set({
            [READYSTATE]: LOADED,
            value: authValue
        });
    }
}));
(async () => {
    const authValue = await new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        chrome.storage.local.get(['authValue'], (result) => {
            resolve(result.authValue || null);
        });
    });
    useAuthStore.setState({
        [READYSTATE]: LOADED,
        value: authValue || null
    });
})();

export {
    useDialogsStore,
    useAuthStore
};

/* globals chrome */

// import { useSetAtom } from 'jotai';
// import { showConnectViaDialogAtom } from './optionsJotaiState.js';

import { useDialogsStore } from './optionsZustandStore.js';

import { postMessageWithReturnAsync } from '../../scripts/utils/postMessageWithReturnAsync.js';

window.addEventListener("message", (evt) => {
    if (
        [
            'https://local.webextensions.org:4443',
            'https://www.webextensions.co.in',
            'https://www.webextensions.org'
        ].includes(evt.origin)
    ) {
        if (
            evt.data &&
            evt.data.flagProxy &&
            evt.data.uuid
        ) {
            if (evt.data.originalData?.type === 'connect-page-ready') {
                (async () => {
                    const manifest = chrome.runtime.getManifest();
                    // eslint-disable-next-line no-unused-vars
                    const newEvt = await postMessageWithReturnAsync(
                        evt.source,
                        {
                            uuid: evt.data.uuid,
                            type: 'connect-page-ready-response',
                            requesterName: manifest.name,
                            requesterType: 'extension',
                            requesterHref: window.location.href,
                            requesterAppId: 'magic-css',
                            requesterAppVersion: manifest.version
                        },
                        evt.origin
                    );
                })();
            } else if (evt.data.originalData?.type === 'connect-with-auth') {
                (async () => {
                    const authData = evt.data.originalData.message?.data?.auth;

                    await chrome.storage.local.set({
                        authData: authData
                    });


                    // const setVal = useUpdateAtom(showConnectViaDialogAtom);
                    // setFlagShowFrame(false);
                    // setVal(false);

                    // useSetAtom(showConnectViaDialogAtom, false);
                    useDialogsStore.setState({
                        flagShowConnectViaDialog: false
                    });

                    await postMessageWithReturnAsync(
                        evt.source,
                        {
                            uuid: evt.data.uuid,
                            type: 'connect-with-auth-response',
                            status: 'success'
                            // requesterName: manifest.name,
                            // requesterType: 'extension',
                            // requesterHref: window.location.href,
                            // requesterAppId: 'magic-css',
                            // requesterAppVersion: manifest.version
                        },
                        evt.origin
                    );
                })();
            }
        }
    } else {
        // do nothing
    }
}, false);

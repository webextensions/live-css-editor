/* global chrome, remoteConfig */

chrome.runtime.onInstalled.addListener((details) => {
    const {
        previousVersion,
        reason
    } = details;

    const {
        INSTALL,
        UPDATE
    } = chrome.runtime.OnInstalledReason;

    if (reason === INSTALL) {
        (async () => {
            await window.mainFnMetricsHandler({ event: 'install' });
        })();

        // chrome.tabs.create({
        //     url: 'https://www.webextensions.org/404-on-install'
        //     // url: 'onboarding.html'
        // });
    } else if (reason === UPDATE) {
        const extensionVersion = chrome.runtime.getManifest().version;
        // Using this check to avoid the case where clicking on the Refresh icon for the extension
        // at chrome://extensions/ page can also trigger "onInstalled" listener
        if (extensionVersion !== previousVersion) {
            (async () => {
                await window.mainFnMetricsHandler({ event: 'update' });
            })();

            // chrome.tabs.create({
            //     url: 'https://www.webextensions.org/404-on-update'
            //     // url: 'changelog.html'
            // });
        }
    }
});

(async () => {
    try {
        await window.remoteConfigLoadedFromRemote;
        if (
            remoteConfig.features &&
            remoteConfig.features.useUninstallUrl &&
            await window.isFeatureEnabled(remoteConfig.features.useUninstallUrl.enabled) &&
            remoteConfig.features.useUninstallUrl.uninstallUrl
        ) {
            const [err, uuid] = await window.getUuid();

            if (err) {
                const errToReport = new Error('Unable to get the uuid', { cause: err });
                console.error(errToReport);
                return;
            }

            const details = {
                uuid
            };
            const url = await window.metricsUrlGenerator({
                event: 'uninstall',
                details,
                uninstallPathOnServer: remoteConfig.features.useUninstallUrl.uninstallUrl
            });

            chrome.runtime.setUninstallURL(
                url,
                function () {
                    // do something
                }
            );
        }
    } catch (e) {
        // do nothing
    }
})();

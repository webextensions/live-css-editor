const metricsUrlGenerator = async function ({ remoteConfig, event, details, uninstallPathOnServer }) {
    if (uninstallPathOnServer) {
        const url = uninstallPathOnServer + '?uuid=' + details.uuid;
        return url;
    } else {
        const detailsParam = JSON.stringify(details);
        const parameters = {
            v: '1.0.0',
            appId: 'magic-css',
            event,
            details: detailsParam
        };
        const queryString = new URLSearchParams(parameters).toString();

        // The code would reach here only when the config is loaded from remote
        const metricsApiServer = remoteConfig.config.metricsApi.server;
        const metricsApiCollectionPath = remoteConfig.config.metricsApi.collectionPath;

        const url = metricsApiServer + metricsApiCollectionPath + '?' + queryString;
        return url;
    }
};

export { metricsUrlGenerator };

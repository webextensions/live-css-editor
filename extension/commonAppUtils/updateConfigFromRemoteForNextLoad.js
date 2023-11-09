import { updateConfigFromRemoteForNextLoad } from './instanceAndFeatures.js';

setTimeout(async () => {
    await updateConfigFromRemoteForNextLoad();
}, 500);

import { flagDevMode } from './flagDevMode.js';

let originToUse = 'https://www.webextensions.org';
if (flagDevMode) {
    originToUse = 'https://local.webextensions.org:4443';
}

export const siteOrigin = originToUse;

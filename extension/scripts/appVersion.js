/* globals module */
// Just a block
{
    const magicCssVersion = '8.10.1';
    if (typeof window === 'undefined') {
        module.exports = {
            version: magicCssVersion
        };
    } else {
        window.magicCssVersion = magicCssVersion;
    }
}

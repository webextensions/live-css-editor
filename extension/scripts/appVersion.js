// Just a block
{
    const magicCssVersion = '8.20.0';
    if (typeof window === 'undefined') {
        module.exports = {
            version: magicCssVersion
        };
    } else {
        window.magicCssVersion = magicCssVersion;
    }
}

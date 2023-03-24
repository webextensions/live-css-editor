import { csspretty } from 'helpmate-css/dist/format/csspretty.js';

const minifyCss = function (cssCode) {
    return csspretty({
        mode: 'minify',
        source: cssCode
    });

    // Alternatively, use Yahoo's CSS Min library:
    //     return YAHOO.compressor.cssmin(cssCode);
};

export { minifyCss };

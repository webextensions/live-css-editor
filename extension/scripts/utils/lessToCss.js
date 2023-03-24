/* global less */

const lessToCss = function (lessCode, cb) {
    less.default.render(
        lessCode,
        function (err, output) {
            if (err) {
                cb(err);
            } else {
                var cssCode = output.css;
                cb(null, cssCode);
            }
        }
    );

    // With older versions of less:
    //     less.Parser().parse(lessCode, function (err, tree) {
    //         if (err) {
    //             cb(err);
    //         } else {
    //             var cssCode = tree.toCSS();
    //             cb(null, cssCode);
    //         }
    //     });
};

export { lessToCss };

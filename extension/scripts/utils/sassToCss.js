/* global Sass */

const sassToCss = function (sassCode, options, cb) {
    Sass.compile(sassCode, options, function (output) {
        if (output.message) {
            cb(output);
        }  else {
            var cssCode = output.text;
            cb(null, cssCode);
        }
    });
};

export { sassToCss };

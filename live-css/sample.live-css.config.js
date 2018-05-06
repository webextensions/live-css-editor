// This configuration file is used for running "live-css" server (https://www.npmjs.com/package/live-css).
// It is meant to be used along with:
//     https://github.com/webextensions/live-css-editor
//
// To generate this file:
//     $ cd <project-folder>
//     $ npm install -g live-css
//     $ live-css --init
//     --------OR--------
//     Copy the default configuration file from:
//         https://github.com/webextensions/live-css-editor/tree/master/live-css/sample.live-css.config
//     and save it as a file with name ".live-css.config" (note that the file name begins with a dot character)
//
// For further guidance, visit the following links:
//     https://github.com/webextensions/live-css-editor
//     https://github.com/webextensions/live-css-editor/issues
//     https://github.com/webextensions/live-css-editor/tree/master/live-css
//     https://github.com/webextensions/live-css-editor/tree/master/live-css/sample.live-css.config
//     https://www.npmjs.com/package/live-css

module.exports = {                          // Learn more about "module.exports":
                                            //     https://www.sitepoint.com/understanding-module-exports-exports-node-js/
                                            //     http://www.tutorialsteacher.com/nodejs/nodejs-module-exports
                                            //     http://stackabuse.com/how-to-use-module-exports-in-node-js/
                                            //     https://nodejs.org/api/modules.html#modules_module_exports
    "port": 3456,                           // The "live-css" server would start at this port number
                                            // Learn more about ports:
                                            //     https://computer.howstuffworks.com/web-server8.htm
    "root": ".",                            // This is the root folder where
    "watch-rules": [                        // <string or array of strings>
                                            // Paths to files, directories to be watched recursively, or glob patterns.
                                            // https://www.npmjs.com/package/anymatch
                                            // https://github.com/paulmillr/chokidar#api ("paths")
        "**/*.css"
    ],
    "watch-ignore-rules": [                 // <string or array of strings>
        /(^|[/\\])\../,                     // A general rule to ignore the "." files/directories
        "node_modules"                      // A common folder in NodeJS projects which you may wish to exclude
        // , "!node_modules/package/exclude-from-ignore.css"  // This example
    ]
    "allow-symlinks": false,                // Learn more about symlinks / symbolic-links:
                                            //     https://en.wikipedia.org/wiki/Symbolic_link
                                            //     https://github.com/paulmillr/chokidar#path-filtering ("followSymlinks")
    "list-files": false                     // <true/false>
                                            // true: List the paths of the files being watched
                                            // false: Print a "." (dot) character on the terminal screen for each file being watched
};

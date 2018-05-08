/*
    This configuration file is used for running "live-css" server (https://www.npmjs.com/package/live-css)
    It is meant to be used along with:
        https://github.com/webextensions/live-css-editor

    To generate this file, download and install Node JS from https://nodejs.org/en/download/
        $ npm install -g live-css
        $ cd <project-folder>
        $ live-css --init
        --------OR--------
        Copy the default configuration file from:
            https://github.com/webextensions/live-css-editor/tree/master/live-css/example.live-css.config.js
        and save it as a file with name ".live-css.config.js" (note that the file name begins with a dot character)

    For further guidance, visit the following links:
        https://www.npmjs.com/package/live-css
        https://github.com/webextensions/live-css-editor
        https://github.com/webextensions/live-css-editor/issues
        https://github.com/webextensions/live-css-editor/tree/master/live-css
        https://github.com/webextensions/live-css-editor/tree/master/live-css/example.live-css.config.js
*/

/* eslint-env node */                       // https://eslint.org/docs/rules/no-undef#nodejs

module.exports = {                          // Learn more about "module.exports":
                                            //     https://www.sitepoint.com/understanding-module-exports-exports-node-js/
                                            //     http://www.tutorialsteacher.com/nodejs/nodejs-module-exports
                                            //     http://stackabuse.com/how-to-use-module-exports-in-node-js/
                                            //     https://nodejs.org/api/modules.html#modules_module_exports

    "port": 3456,                           // Recommended value: A number between 1024 and 49151
                                            // The "live-css" server would start at this port number
                                            // Learn more about ports:
                                            //     https://computer.howstuffworks.com/web-server8.htm
                                            //     https://en.wikipedia.org/wiki/Registered_port

    // IMPORTANT NOTE: Setting this to an incorrect value may result in failure to auto-refresh styles in the browser.
    //                 If you are in doubt, don't use this configuration option, live-css would still work fine.
    // Keeping this configuration option as commented out by default
    // "root": ".",                         // <relative-or-absolute-path>
                                            // This path should point to the root ("/") of your web server for which you are using live-css.
                                            // For example,
                                            //     If http://localhost/ points to /path/to/project/http-pub/
                                            //     And this configuration file is placed at /path/to/project/
                                            //     Then, you may use "root": "http-pub" <OR> "root": "/path/to/project/http-pub"
                                            // This is the root folder which contains the files you wish to watch for changes
                                            // This folder would be scanned recursively for files matching the "watch-patterns"
                                            // while skipping the files matching the "watch-ignore-patterns"
                                            // Learn more:
                                            //     https://en.wikipedia.org/wiki/Path_(computing)

    "watch-patterns": [                     // <Array/String/RegExp/Function>
                                            // Glob patterns or paths of files and directories to be watched recursively
                                            // Learn more:
                                            //     https://www.npmjs.com/package/anymatch
                                            //     https://github.com/paulmillr/chokidar#api ("paths" property)
                                            //     https://en.wikipedia.org/wiki/Path_(computing)

        "**/*.css"                          // Include all the ".css" files to watch for changes
    ],

    "watch-ignore-patterns": [              // <Array/String/RegExp/Function>
                                            // Glob patterns or paths of files and directories to be ignored from being watched
                                            // Learn more:
                                            //     https://www.npmjs.com/package/anymatch
                                            //     https://github.com/paulmillr/chokidar#path-filtering ("ignored" property)

        // Some of the common folders in various projects which you may wish to exclude
        /(^|[/\\])\../,                     // This regular expression ignores the files/directories having name beginning with "." character
                                            // Learn more about regular expressions:
                                            //     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        "node_modules",
        ".npm",
        "logs",
        "temp",
        "tmp",

        // "Negate" pattern to cancel ignore rule (by using "!" symbol)
        // An example path which is required to be watched, but its parent folder is ignored
        // **** IMPORTANT NOTE:
        // **** For watching, this path would also need to be included in the "watch-patterns" section (without the "!" symbol)
        "!node_modules/package/do-not-ignore.css"   // The "!" symbol in the beginning negates the matching pattern from the "watch-ignore-patterns". It means that
                                                    // the file matching this pattern would not be ignored even though "node_modules" is marked to be ignored.
                                                    // Learn more:
                                                    //     https://github.com/isaacs/minimatch/blob/master/README.md#properties ("negate" property)
    ],

    "allow-symlinks": false,                // <true/false>
                                            // Learn more about symlinks / symbolic-links:
                                            //     https://en.wikipedia.org/wiki/Symbolic_link
                                            //     https://github.com/paulmillr/chokidar#path-filtering ("followSymlinks")

    "list-files": false                     // <true/false>
                                            // true: List the paths of the files being watched
                                            // false: Print a "." (dot) character on the terminal screen for each file being watched
};

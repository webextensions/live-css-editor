Magic CSS extension code open-sourced at
========================================
- https://github.com/webextensions/live-css-editor

Magic CSS published in various extension stores
===============================================
- Google Chrome - https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol
- Microsoft Edge - https://www.microsoft.com/store/p/live-editor-for-css-and-less-magic-css/9nzmvhmw5md1
- Mozilla Firefox - https://addons.mozilla.org/firefox/addon/live-editor-for-css-and-less/
- Opera - https://addons.opera.com/extensions/details/live-editor-for-css-and-less-magic-css/

Notes about usage of 3rdparty code
==================================
- All of the 3rdparty code has been placed in the folder `<extension>/scripts/3rdparty/`
- Most of the 3rdparty code files have been used "as-is", while a few of them have been modified to a little extent
- Inside that `3rdparty` folder, the link to the original sources of all the files are placed along with those files as:
    `<3rd-party-filename>.<ext>.source.txt`
- A list of most of those files and their origins can also be seen at:
    https://github.com/webextensions/live-css-editor/blob/master/copy-third-party-front-end-scripts.json

3rdparty code which is used "as-is" from GitHub
-----------------------------------------------
- You would find that `<3d-party-filename>.<ext>.source.txt` refers to the GitHub URL pointing to the source

3rdparty code which is used "as-is" from npm
--------------------------------------------
You would be able to see that in some of the `<3rd-party-filename>.<ext>.source.txt`, the 3rdparty code has been copied from the `node_modules/<package>/<path>` after performing the following `npm install` operations as described in https://github.com/webextensions/live-css-editor/blob/master/package.json
- `npm install codemirror@<version-mentioned-in-package.json>`
- `npm install emmetio-codemirror-plugin-webextensions@<version-mentioned-in-package.json>`

Please note that:
- `emmetio-codemirror-plugin-webextensions` comes from https://www.npmjs.com/package/emmetio-codemirror-plugin-webextensions
- https://www.npmjs.com/package/emmetio-codemirror-plugin-webextensions is published from https://github.com/webextensions/codemirror-plugin
- https://github.com/webextensions/codemirror-plugin is a fork of https://github.com/emmetio/codemirror-plugin and differs from the original repository only with the commit https://github.com/webextensions/codemirror-plugin/commit/687c68a76804a8b20371ad54ddca803bfc66ed30 (the commit adds option to bundle a non-minified browser version of the library)

3rdparty code which is compiled/minified with minor customization (after forking from the official GitHub repository)
---------------------------------------------------------------------------------------------------------------------
The file, `<extension>/scripts/3rdparty/basic-less-with-sourcemap-support.browserified.uglified.js`, has been fetched from https://github.com/webextensions/less.js which is a fork of a popular open-source library (https://github.com/less/less.js/). More details about those minor changes can be found in `<extension>/scripts/3rdparty/basic-less-with-sourcemap-support.browserified.uglified.js.source.description.txt`

3rdparty code which is used "as-is" from https://cdnjs.cloudflare.com/ajax/libs/
--------------------------------------------------------------------------------
- For parsing Sass, during runtime, we load:  
  https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.9/sass.sync.min.js  
  The GitHub page for this library is at:  
  https://github.com/medialize/sass.js

3rdparty code which is customized
---------------------------------
Some of those 3rdparty files were customized and you would find the following files in such cases:
- `<3rd-party-filename>.<ext>` (original source code file) (not loaded when executing the extension)
- `<3rd-party-filename>.<ext>.source.txt` (source of the original file)
- `<3rd-party-filename>_customized.<ext>` (customized version of the original file) (this file is loaded when executing the extension)

Notes about usage of custom code
================================
- All the code apart from the folder `<extension>/scripts/3rdparty/` is custom code

If you wish to build a ZIP package of the extension on your own from the Git repository of Magic CSS project
============================================================================================================
```
$ git clone https://github.com/webextensions/live-css-editor.git
$ cd live-css-editor
$ nvm use
$ npm install
$ npm run zip-extension     # Now, the zip versions of the extension would be created for all the supported browsers (Chrome/Edge/Firefox/Opera)
```

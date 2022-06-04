## New Features
* Add functionality to export/import data (https://github.com/webextensions/live-css-editor/issues/69)
* Add Autoprefixer (References: https://github.com/postcss/autoprefixer https://autoprefixer.github.io/)
* Add link in the suggested selectors list, so that the user can directly edit the file containing the suggested selector.
* Add a "copy-to-clipboard" button
* Add support for running JavaScript code as well
* Anonymous GitHub gists do not work anymore (https://blog.github.com/2018-02-18-deprecation-notice-removing-anonymous-gist-creation/). Hence, "Mail code (via Gist)" feature has been disabled. Analyze if that feature can/should be brought back in some form.
* Optimize the data structure for improved usage of chrome.storage.sync
* Provide a scalable way to share CSS across computers. The current approach of chrome.storage.sync is limited. May use a solution via a custom or third-party service like "GitHub Gist".
* If technically possible, allow loading editor in a separate panel along with the extension icon.
* Add a keyboard shortcut to reload all CSS resources.
* Add support for converting from/to HTML-and-CSS to Tailwind-HTML (https://github.com/webextensions/live-css-editor/issues/76)
* Add support for converting from/to CSS to Tailwind classes (https://github.com/webextensions/live-css-editor/issues/76)

## Improvements
* Set a different icon when the styles are applied.
* Change the background color to neutral dark-gray with appropriate shadow
* Use black-and-white/grayscale + transparent/translucent for all icons under "+"
* "Reload CSS resources" feature should try to detect and reload `@import` instructions through `<style>` and `<link>` tags
* CodeMirror autocomplete suggestions should have fixed position OR they should not let scroll event pass through to parent-elements/body OR both
* Review if the fix for https://github.com/webextensions/live-css-editor/issues/2 (Changes aren't applied after reload until extension is opened) works well in Edge/Opera browsers (or has graceful degradation). Note: The fix doesn't work well in Firefox due to the pending bug https://bugzilla.mozilla.org/show_bug.cgi?id=1392624 (Also see: https://bugzilla.mozilla.org/show_bug.cgi?id=1397658)
* Autocompleting a CSS property adds `: ` (colon and space) characters, while autocompleting using Emmet expansion adds `: ;` (colon, space and semicolon) characters and puts the cursor before the semicolon character (for example, typing `p`, `d` and `<Tab>` expands to `padding: ;` ). We may make this behavior consistent.

## Environments
* Publish the latest versions for different browsers
* Make "editor" a standalone project, so that it can be added to an HTML page as well
* Make "Magic CSS" a standalone project, so that it can be added to an HTML page as well

## Compilation and Build
* Add webpack based compilation (currently, it is split into too many files, which increases load time)

## Refactoring
* Refactor code
* Move some functionalities into their own projects, for example, generate selectors, get existing selectors, point-and-click etc
* Use Web Components and Shadow DOM for Magic CSS UI (and remove some code which would not be required after that).  
  **Dependency:** Currently `customElements` cannot be defined in Chrome / Chromium extensions (See: https://bugs.chromium.org/p/chromium/issues/detail?id=390807)
* Once https://github.com/sass/dart-sass/issues/25 is fixed, then start using it in place of https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js (https://github.com/medialize/sass.js)

## Language Support
* Add translations/internationalization

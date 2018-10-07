#### New Features
* Add Autoprefixer (References: https://github.com/postcss/autoprefixer https://autoprefixer.github.io/)
* Add support for editing and saving the CSS/Less/Sass files (back-end would need to support saving those files, while keeping a check on line-ending)
* Add link in the suggested selectors list, so that the user can directly edit the file containing the suggested selector.
* Add a "copy-to-clipboard" button
* Add support for running JavaScript code as well
* Provide a way to share CSS across computers. Approach 1 (would work for same person): Make the code reusable via "sync". Approach 2 (would work for multiple users): Make the code reusable+shareable via "GitHub Gist".

#### Improvements
* Use black-and-white/grayscale + transparent/translucent for all icons under "+"
* "Reload CSS resources" feature should try to detect and reload @import instructions through <style> and <link> tags
* CodeMirror autocomplete suggestions should have fixed position OR they should not let scroll event pass through to parent-elements/body OR both
* Review if the fix for https://github.com/webextensions/live-css-editor/issues/2 (Changes aren't applied after reload until extension is opened) works well in Edge/Opera browsers (or has graceful degradation). Note: The fix doesn't work well in Firefox due to the pending bug https://bugzilla.mozilla.org/show_bug.cgi?id=1392624 (Also see: https://bugzilla.mozilla.org/show_bug.cgi?id=1397658)
* Autocompleting a CSS property adds ": " (colon and space) characters, while autocompleting using Emmet expansion adds ": ;" (colon, space and semicolon) characters and puts the cursor before the semicolon character (for example, typing "p", "d" and "<Tab>" expands to "padding: ;" ). We may make this behavior consistent.

#### Environments
* Make "editor" a standalone project, so that it can be added to an HTML page as well
* Make "Magic CSS" a standalone project, so that it can be added to an HTML page as well

#### Compilation and Build
* Add webpack based compilation (currently, it is split into too many files, which increases load time)

#### Refactoring
* Refactor code
* Move some functionalities into their own projects, for example, generate selectors, get existing selectors, point-and-click etc
* Use Shadow DOM for Magic CSS UI (and remove some code which would not be required after that)

#### Language Support
* Add translations/internationalization

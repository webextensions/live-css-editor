#### New Features
* Add Autoprefixer (References: https://github.com/postcss/autoprefixer https://autoprefixer.github.io/)
* Add support for editing and saving the CSS/Less files (back-end would need to support saving those files, while keeping a check on line-ending)
* Add a "copy-to-clipboard" button

#### Improvements
* If there are many small iframes in a page, we may not want to load Magic CSS in all of them (this might be added as a global setting)
* "Reload CSS resources" feature should try to detect and reload @import instructions through <style> and <link> tags
* CodeMirror autocomplete suggestions should have fixed position OR they should not let scroll event pass through to parent-elements/body OR both
* Review if it is possible to fix https://github.com/webextensions/live-css-editor/issues/2 (Changes aren't applied after reload until extension is opened) while keeping security concerns in mind
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

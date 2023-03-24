In `extension/scripts/utils.js`, there is a hacky comment added which says:

'This string is added to the end of this file to handle a weird bug/behavior for Firefox. Without this, if "reapply styles automatically" feature is activated, then it would not work and an error would occur in the background script. Reference: https://stackoverflow.com/questions/44567525/inject-scripts-error-script-returned-non-structured-clonable-data-on-firefox-ex/56597154#56597154';

Check the behavior before / after the ongoing `import` based refactoring.

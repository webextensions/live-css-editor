// Use this for the cases where the code should never reach in imaginable scenarios.
export const requestUserViaConsoleToReportUnexpectedError = function (e) {
    console.error(e);
    console.error([
        'An unexpected error was encountered by Magic CSS.',
        'Kindly report this issue at:',
        '    https://github.com/webextensions/live-css-editor/issues'
    ].join('\n'));
};

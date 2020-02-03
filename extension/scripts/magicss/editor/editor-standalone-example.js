/* global utils */

// Here goes the functional code
(async function(){
    if (window.editor) {
        console.log('Editor window is already there.');
        return;
    }

    // for HTML frameset pages, this value would be 'FRAMESET'
    // chrome.tabs.executeScript uses allFrames: true, to run inside all frames
    if (document.body.tagName !== 'BODY') {
        return;
    }

    // Just a block
    {
        await utils.delayFunctionUntilTestFunction({
            tryLimit: 100,
            waitFor: 500,
            fnTest: function () {
                if (
                    typeof window.Editor === 'function'
                    && window.Editor.usable
                ) {
                    return true;
                }
                return false;
            },
            fnFirstFailure: function () {
                // do nothing
            },
            fnFailure: function () {
                // do nothing
            },
            fnSuccess: async function () {
                var id = 'Editor';
                var options = {
                    id: id,

                    title: '<div>Editor</div>',
                    placeholder: 'Write your text here...',
                    syntaxHighlightingLanguage: 'text/x-less',

                    bgColor: '68,88,174,0.7',

                    events: {}
                };

                window.editor = new window.Editor(options);
                await window.editor.create();
            }
        });
    }
}());

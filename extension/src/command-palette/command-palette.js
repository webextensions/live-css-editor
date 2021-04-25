import React from 'react';

import ReactCommandPalette from 'react-command-palette';

const commands = [
    {
        name: 'Magic CSS for Chrome',
        command() {
            window.open('https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol');
        }
    },
    {
        name: 'Magic CSS for Edge',
        command() {
            window.open('https://microsoftedge.microsoft.com/addons/detail/live-editor-for-css-less/ahibbdhoijcafelmfepfpcmmdifchpdg');
        }
    },
    {
        name: 'Magic CSS for Firefox',
        command() {
            window.open('https://addons.mozilla.org/firefox/addon/live-editor-for-css-less-sass/');
        }
    },
    {
        name: 'Create color theme (Adobe Color)',
        command() {
            window.open('https://color.adobe.com/create/color-wheel');
        }
    },
    {
        name: 'Analyze CSS',
        command() {
            window.open('https://cssstats.com/');
        }
    },
    {
        name: 'CSS optimization test',
        command() {
            window.open('https://www.giftofspeed.com/css-delivery/');
        }
    },
    {
        name: 'Convert CSS to XPath',
        command() {
            window.open('https://css2xpath.github.io/');
        }
    },
    {
        name: 'CSS Houdini',
        command() {
            window.open('https://houdini.how/');
        }
    },
    {
        name: 'CSS reset template',
        command() {
            window.open('https://www.unpkg.com/styles-reset/styles-reset.css');
        }
    }
];

const styleOb = {
    backgroundColor: 'rgb(23, 23, 23)',
    borderRadius: '4px',
    color: '#b9b9b9',
    fontSize: '12px',
    marginRight: '6px',
    padding: '2px 4px'
};
const header = (
    <div
        style={{
            color: 'rgb(172, 172, 172)',
            display: 'inline-block',
            fontFamily: 'arial',
            fontSize: '12px',
            marginBottom: '6px'
        }}
    >
        <span style={{ paddingRight: '32px' }}>
            Search for a tool:
        </span>
        <span style={{ paddingRight: '32px' }}>
            <kbd style={styleOb}>↑↓</kbd>{' '}to navigate
        </span>
        <span style={{ paddingRight: '32px' }}>
            <kbd style={styleOb}>enter</kbd>{' '}to select
        </span>
        <span style={{ paddingRight: '32px' }}>
            <kbd style={styleOb}>esc</kbd>{' '}to dismiss
        </span>
    </div>
);

const theme = {
    modal:                      "atom-modal",
    overlay:                    "atom-overlay magicss-command-palette-overlay",
    container:                  "atom-container",
    content:                    "atom-content",
    containerOpen:              "atom-containerOpen",
    input:                      "atom-input",
    inputOpen:                  "atom-inputOpen",
    inputFocused:               "atom-inputFocused",
    spinner:                    "atom-spinner",
    suggestionsContainer:       "atom-suggestionsContainer",
    suggestionsContainerOpen:   "atom-suggestionsContainerOpen",
    suggestionsList:            "atom-suggestionsList",
    suggestion:                 "atom-suggestion",
    suggestionFirst:            "atom-suggestionFirst",
    suggestionHighlighted:      "atom-suggestionHighlighted",
    trigger:                    "atom-trigger"
};

const CommandPalette = function () {
    return (
        <div className="CommandPalette">
            <ReactCommandPalette
                hotKeys={['cmd+shift+p', 'ctrl+shift+p']}
                commands={commands}
                closeOnSelect={true}
                resetInputOnOpen={true}
                maxDisplayed={100}
                placeholder="What are you looking for?"
                header={header}
                theme={theme}
                trigger={
                    <div
                        style={{
                            width: 16,
                            height: 16
                        }}
                    />
                }
            />
        </div>
    );
};

export { CommandPalette };

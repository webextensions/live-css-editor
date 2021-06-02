import React from 'react';
import PropTypes from 'prop-types';

import ReactCommandPalette from 'react-command-palette';

import { commands } from './commands.js';

const renderCommand = function (suggestion) {
    const {
        name,
        iconCls,
        isNew,
        style
    } = suggestion;
    return (
        <div style={{ display: 'flex' }}>
            <div
                className={iconCls}
                style={{
                    marginRight: 10,
                    width: 16,
                    minWidth: 16, // Required, because otherwise, since the parent is 'display: flex', this element's `width` alone is not respected when parent's width is reduced a lot
                    height: 16,
                    backgroundSize: 'contain',
                    ...style
                }}
            />
            <div>{name}</div>
            {
                isNew &&
                <div className="magicss-palette-new">NEW</div>
            }
        </div>
    );
};

const styleOb = {
    backgroundColor: 'rgb(23, 23, 23)',
    borderRadius: '4px',
    color: '#b9b9b9',
    fontSize: '12px',
    marginRight: '6px',
    padding: '2px 4px'
};
const header = (
    <div className="magicss-palette-header" style={{ display: 'none' }}>
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

const CommandPalette = function (props) {
    const editor = window.MagiCSSEditor;
    const filteredCommands = commands.filter((item) => {
        if (item.id === 'show-line-numbers') {
            if (editor.cm.getOption('lineNumbers')) {
                return false;
            }
        } else if (item.id === 'hide-line-numbers') {
            if (!editor.cm.getOption('lineNumbers')) {
                return false;
            }
        } else if (item.id === 'enable-css-linting') {
            if (editor.cm.getOption('lint')) {
                return false;
            }
        } else if (item.id === 'disable-css-linting') {
            if (!editor.cm.getOption('lint')) {
                return false;
            }
        }
        return true;
    });

    return (
        <div className="CommandPalette">
            <ReactCommandPalette
                hotKeys={[]}
                open={props.open}
                onRequestClose={function () {
                    if (props.onClose) {
                        props.onClose();
                    }

                    // Focus the editor when the command palette gets closed by pressing the "Escape" key
                    // TODO: Ideally, the event should be passed from the library's end. For now, we can follow the standard way of utilizing "window.event".
                    if (window.event && window.event.code === 'Escape') {
                        editor.focus();
                    }
                }}
                onAfterOpen={function () {
                    const el = document.querySelector('.magicss-command-palette-overlay [role=combobox] .atom-input');
                    if (el) {
                        setTimeout(() => {
                            el.focus();
                        });
                    }
                }}
                commands={filteredCommands}
                renderCommand={renderCommand}
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
CommandPalette.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export { CommandPalette };

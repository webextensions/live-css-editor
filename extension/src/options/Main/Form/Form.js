import React from 'react';

import { DefaultMode         } from "./FormEntries/DefaultMode.js";
import { CodeEditorTheme     } from "./FormEntries/CodeEditorTheme.js";
import { Indentation         } from "./FormEntries/Indentation.js";
import { Storage             } from "./FormEntries/Storage.js";
import { Autocomplete        } from "./FormEntries/Autocomplete.js";
import { FontSize            } from "./FormEntries/FontSize.js";
import { LoadForIframe       } from "./FormEntries/LoadForIframe.js";
import { NotificationsForPin } from "./FormEntries/NotificationsForPin.js";
import { ExperimentalOptions } from "./FormEntries/ExperimentalOptions.js";

import './Form.css';
// import styles from './Form.css';

const Form = function () {
    return (
        <div className="baseBlock">
            <div>
                <div>
                    <DefaultMode />
                </div>

                <div style={{ marginTop: 20 }}>
                    <CodeEditorTheme />
                </div>

                <div style={{ marginTop: 20 }}>
                    <Indentation />
                </div>

                <div style={{ marginTop: 35 }}>
                    <Storage />
                </div>

                <div style={{ marginTop: 20 }}>
                    <Autocomplete />
                </div>

                <div style={{ marginTop: 20 }}>
                    <FontSize />
                </div>

                <div style={{ marginTop: 20 }}>
                    <LoadForIframe />
                </div>

                <div style={{ marginTop: 20 }}>
                    <NotificationsForPin />
                </div>

                <div style={{ marginTop: 20 }}>
                    <ExperimentalOptions />
                </div>

                <div style={{ marginTop: 30 }}>
                    <button
                        onClick={() => {
                            window.close();
                        }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export { Form };

import React from 'react';

import CodeIcon from '@mui/icons-material/Code.js';
import DarkModeIcon from '@mui/icons-material/DarkMode.js';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease.js';
import StorageIcon from '@mui/icons-material/Storage.js';
import KeyboardIcon from '@mui/icons-material/Keyboard.js';
import FormatSizeIcon from '@mui/icons-material/FormatSize.js';
import WebIcon from '@mui/icons-material/Web.js';
import AnnouncementIcon from '@mui/icons-material/Announcement.js';
import ScienceIcon from '@mui/icons-material/Science.js';

import { GenericAccordion } from 'GenericAccordion/GenericAccordion.js';

import { DefaultMode         } from "./FormEntries/DefaultMode.js";
import { CodeEditorTheme     } from "./FormEntries/CodeEditorTheme.js";
import { Indentation         } from "./FormEntries/Indentation.js";
import { Storage             } from "./FormEntries/Storage.js";
import { Autocomplete        } from "./FormEntries/Autocomplete.js";
import { FontSize            } from "./FormEntries/FontSize.js";
import { LoadForIframe       } from "./FormEntries/LoadForIframe.js";
import { NotificationsForPin } from "./FormEntries/NotificationsForPin.js";
import { ExperimentalOptions } from "./FormEntries/ExperimentalOptions.js";

import styles from './Form.css';

const Form = function () {
    return (
        <div className={styles.Form}>
            <div>
                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelDefaultMode"
                        localStorageDefaultValueForExpanded="yes"
                        title="Default mode"
                        icon={<CodeIcon />}
                    >
                        <DefaultMode />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelIndentation"
                        localStorageDefaultValueForExpanded="yes"
                        title="Indentation"
                        icon={<FormatIndentIncreaseIcon />}
                    >
                        <Indentation />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelCodeEditorTheme"
                        title="Code editor theme"
                        icon={<DarkModeIcon />}
                    >
                        <CodeEditorTheme />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelLoadForIframe"
                        title="Load for &lt;iframe&gt;"
                        icon={<WebIcon />}
                    >
                        <LoadForIframe />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelFontSize"
                        title="Font size"
                        icon={<FormatSizeIcon />}
                    >
                        <FontSize />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelNotificationsForPin"
                        // title="Notifications for pin"
                        title="Notifications"
                        icon={<AnnouncementIcon />}
                    >
                        <NotificationsForPin />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelAutocomplete"
                        title="Autocomplete"
                        icon={<KeyboardIcon />}
                    >
                        <Autocomplete />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelStorage"
                        title="Storage"
                        icon={<StorageIcon />}
                    >
                        <Storage />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelExperimentalOptions"
                        title="Experimental options"
                        icon={<ScienceIcon />}
                    >
                        <ExperimentalOptions />
                    </GenericAccordion>
                </div>
            </div>
        </div>
    );
};

export { Form };

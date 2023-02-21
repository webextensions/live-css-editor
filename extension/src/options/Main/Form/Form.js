import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { useLocalStorage } from 'react-use';

import { styled } from '@mui/material/styles/index.js';

import BaseAccordion from '@mui/material/Accordion/index.js';
import AccordionSummary from '@mui/material/AccordionSummary/index.js';
import AccordionDetails from '@mui/material/AccordionDetails/index.js';

import Button from '@mui/material/Button/index.js';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';

import CodeIcon from '@mui/icons-material/Code.js';
import DarkModeIcon from '@mui/icons-material/DarkMode.js';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease.js';
import StorageIcon from '@mui/icons-material/Storage.js';
import KeyboardIcon from '@mui/icons-material/Keyboard.js';
import FormatSizeIcon from '@mui/icons-material/FormatSize.js';
import WebIcon from '@mui/icons-material/Web.js';
import AnnouncementIcon from '@mui/icons-material/Announcement.js';
import ScienceIcon from '@mui/icons-material/Science.js';

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

const Accordion = styled((props) => (
    <BaseAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    border: `1px solid #b7b7b7`,
    backgroundColor: '#e7e7e7'
}));

const GenericAccordion = function ({
    children,
    localStorageIdForExpanded,
    localStorageDefaultValueForExpanded,
    title,
    icon
}) {
    const [expanded, setExpanded] = useLocalStorage(localStorageIdForExpanded, localStorageDefaultValueForExpanded);
    const [initialized, setInitialized] = useState(expanded === 'yes');

    return (
        <Accordion
            TransitionProps={{
                unmountOnExit: initialized ? false : true
            }}
            expanded={expanded === 'yes'}
            onChange={(evt, expanded) => {
                if (expanded) { setInitialized(true); }

                setExpanded(expanded ? 'yes' : 'no');
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div>
                    {icon}
                </div>
                <div className={styles.accordionSummary}>
                    {title}
                </div>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#ddd', borderTop: '1px solid #bbb' }}>
                <div style={{ paddingTop: 8, width: '100%' }}>
                    {children}
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
GenericAccordion.propTypes = {
    children: PropTypes.node.isRequired,
    localStorageIdForExpanded: PropTypes.string.isRequired,
    localStorageDefaultValueForExpanded: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired
};

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
                        localStorageDefaultValueForExpanded="yes"
                        title="Code editor theme"
                        icon={<DarkModeIcon />}
                    >
                        <CodeEditorTheme />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelLoadForIframe"
                        localStorageDefaultValueForExpanded="no"
                        title="Load for &lt;iframe&gt;"
                        icon={<WebIcon />}
                    >
                        <LoadForIframe />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelFontSize"
                        localStorageDefaultValueForExpanded="no"
                        title="Font size"
                        icon={<FormatSizeIcon />}
                    >
                        <FontSize />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelNotificationsForPin"
                        localStorageDefaultValueForExpanded="no"
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
                        localStorageDefaultValueForExpanded="no"
                        title="Autocomplete"
                        icon={<KeyboardIcon />}
                    >
                        <Autocomplete />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelStorage"
                        localStorageDefaultValueForExpanded="no"
                        title="Storage"
                        icon={<StorageIcon />}
                    >
                        <Storage />
                    </GenericAccordion>
                </div>

                <div className={styles.inputSection}>
                    <GenericAccordion
                        localStorageIdForExpanded="flagPanelExperimentalOptions"
                        localStorageDefaultValueForExpanded="no"
                        title="Experimental options"
                        icon={<ScienceIcon />}
                    >
                        <ExperimentalOptions />
                    </GenericAccordion>
                </div>

                <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={() => {
                                window.close();
                            }}
                            variant="contained"
                            color="primary"
                            size="medium"
                            style={{
                                fontSize: 14 /* https://code.visualstudio.com/ */
                            }}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Form };

import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs/index.js';
import Tab from '@mui/material/Tab/index.js';

import SettingsIcon from '@mui/icons-material/Settings.js';
import HelpIcon from '@mui/icons-material/Help.js';

import { TabOptions } from './Tabs/TabOptions.js';
import { TabHelp } from './Tabs/TabHelp.js';

const TabPanel = function (props) {
    const { children, value, index, renderedIndexes } = props;

    const previouslyRendered = renderedIndexes.includes(index);

    return (
        <div hidden={value !== index}>
            {
                (
                    value === index ||
                    previouslyRendered
                ) &&
                children
            }
        </div>
    );
};
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    renderedIndexes: PropTypes.array.isRequired
};

const MainTabs = function () {
    const defaultTabIndex = (() => {
        const hash = window.location.hash;
        switch (hash) {
            case '#help':
                return 1;
            case '#options':
            default:
                return 0;
        }
    })();

    const [value, setValue] = React.useState(defaultTabIndex);
    const [renderedIndexes, setRenderedIndexes] = React.useState([defaultTabIndex]);

    const onChange = function (event, newValue) {
        setValue(newValue);

        if (!renderedIndexes.includes(newValue)) {
            setRenderedIndexes([
                ...renderedIndexes,
                newValue
            ]);
        }
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%'
        }}>
            <div>
                <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={onChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        label="Options"
                        icon={<SettingsIcon />}
                        iconPosition="start"
                        href="#options"
                        sx={{
                            justifyContent: 'flex-start', // Align contents to the left
                            fontSize: 12,
                            minHeight: 48,
                            paddingLeft: 0
                        }}
                    />

                    <Tab
                        label="Help"
                        icon={<HelpIcon />}
                        iconPosition="start"
                        href="#help"
                        sx={{
                            justifyContent: 'flex-start', // Align contents to the left
                            fontSize: 12,
                            minHeight: 48,
                            paddingLeft: 0
                        }}
                    />
                </Tabs>
            </div>

            <div
                style={{
                    flex: 1, // Make this occupy the available width
                    marginLeft: 30
                }}
            >
                <TabPanel value={value} index={0} renderedIndexes={renderedIndexes}>
                    <TabOptions />
                </TabPanel>
                <TabPanel value={value} index={1} renderedIndexes={renderedIndexes}>
                    <TabHelp />
                </TabPanel>
            </div>
        </div>
    );
};

export { MainTabs };

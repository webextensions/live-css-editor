import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs/index.js';
import Tab from '@mui/material/Tab/index.js';

import SettingsIcon from '@mui/icons-material/Settings.js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle.js';
import HelpIcon from '@mui/icons-material/Help.js';

import { TabOptions } from './Tabs/TabOptions.js';
import { TabAccount } from './Tabs/TabAccount.js';
import { TabHelp } from './Tabs/TabHelp.js';

import { Loading } from 'Loading/Loading.js';
import { AfterDelay } from 'AfterDelay/AfterDelay.js';
import {
    getConfig,
    isFeatureEnabled
} from '../../../commonAppUtils/instanceAndFeatures.js';

const TabPanel = function (props) {
    const { children, value, label, renderedValues } = props;

    const previouslyRendered = renderedValues.includes(label);

    return (
        <div hidden={value !== label}>
            {
                (
                    value === label ||
                    previouslyRendered
                ) &&
                children
            }
        </div>
    );
};
TabPanel.propTypes = {
    children: PropTypes.node,
    label: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    renderedValues: PropTypes.array.isRequired
};

const MainTabs = function () {
    const defaultTabLabel = (() => {
        const hash = window.location.hash;
        switch (hash) {
            case '#help':
                return 'tab-help';
            case '#account':
                return 'tab-account';
            case '#options':
            default:
                return 'tab-options';
        }
    })();

    const [value, setValue] = React.useState(defaultTabLabel);
    const [renderedValues, setRenderedValues] = React.useState([defaultTabLabel]);

    const onChange = function (event, newValue) {
        setValue(newValue);

        if (!renderedValues.includes(newValue)) {
            setRenderedValues([
                ...renderedValues,
                newValue
            ]);
        }
    };

    const [config, setConfig] = React.useState(null);

    useEffect(() => {
        (async function () {
            const config = await getConfig();
            setConfig(config);
        })();
    }, []);

    if (!config) {
        return (
            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center'
            }}>
                <div style={{ marginLeft: 15, marginRight: 15, display: 'flex', justifyContent: 'center' }}>
                    <AfterDelay delay={350}>
                        <Loading type="line-scale" />
                    </AfterDelay>
                </div>
            </div>
        );
    }

    const showAccountStatusEnabled = (((config || {}).features || {}).showAccountStatus || {}).enabled;

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
                        value="tab-options"
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

                    {
                        isFeatureEnabled(showAccountStatusEnabled) &&
                        <Tab
                            value="tab-account"
                            label="Account"
                            icon={<AccountCircleIcon />}
                            iconPosition="start"
                            href="#account"
                            sx={{
                                justifyContent: 'flex-start', // Align contents to the left
                                fontSize: 12,
                                minHeight: 48,
                                paddingLeft: 0
                            }}
                        />
                    }

                    <Tab
                        value="tab-help"
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
                <TabPanel label="tab-options" value={value} renderedValues={renderedValues}>
                    <TabOptions />
                </TabPanel>

                {
                    isFeatureEnabled(showAccountStatusEnabled) &&
                    <TabPanel label="tab-account" value={value} renderedValues={renderedValues}>
                        <TabAccount />
                    </TabPanel>
                }

                <TabPanel label="tab-help" value={value} renderedValues={renderedValues}>
                    <TabHelp />
                </TabPanel>
            </div>
        </div>
    );
};

export { MainTabs };

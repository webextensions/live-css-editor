/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import { createRoot } from 'react-dom/client';

import './optionsSetup.js';

import { Main } from './Main/Main.js';

const renderReactApp = function () {
    // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
    const container = document.getElementById('root');
    const root = createRoot(container); // createRoot(container!) if you use TypeScript

    root.render(<Main />);
};

renderReactApp();

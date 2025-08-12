#!/usr/bin/env node

// This Git hook finds mismatches between Node version in use and the .nvmrc file and informs the user

import fs from 'fs';
import path from 'path';

import logger from '../logger.mjs';

const __dirname = path.dirname(import.meta.url).replace('file://', '');

var nodeVersion = process.versions.node;
try {
    var dotNvmrcPath = path.resolve(__dirname, '../../.nvmrc'),
        dotNvmrcContents = fs.readFileSync(dotNvmrcPath, 'utf8');
    if(dotNvmrcContents !== nodeVersion) {
        logger.log('');
        logger.success(' ✔   .nvmrc suggests: Node JS ' + dotNvmrcContents);
        logger.warn(' ✗ You currently use: Node JS ' + nodeVersion);
        logger.warn('\nYou might want to run:');
        logger.warn('    $ nvm use\n');
    }
} catch (e) {
    logger.warn('\nWarning: Unable to read the .nvmrc file\n');
}

#!/usr/bin/env node
/* eslint-env node */

import path from 'path';

import chalk from 'chalk';
import jsonfile from 'jsonfile';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const packageJson = require('../package.json');

const __dirname = path.dirname(import.meta.url).replace('file://', '');

var generateManifest = function (whichBrowser) {
    var version = packageJson.version;
    var manifest = {
        "version": version,
        "manifest_version": 3,
        "author": "Priyank Parashar",
        "default_locale": "en",
        "name": "__MSG_Extension_Name__",
        "description": "__MSG_Extension_Description__",
        "homepage_url": "https://github.com/webextensions/live-css-editor",

        "icons": {
            "16": "icons/icon-16.png",
            "24": "icons/icon-24.png",
            "32": "icons/icon-32.png",
            "40": "icons/icon-40.png",
            "48": "icons/icon-48.png",
            "128": "icons/icon-128.png",
            "256": "icons/icon-256.png"
        },
        // https://developer.chrome.com/docs/extensions/mv3/permission_warnings/#permissions_with_warnings
        // https://developer.chrome.com/docs/extensions/mv3/permission_warnings/#view_warnings
        "permissions": (function () {
            var permissions = [
                "activeTab",
                "storage",
                "unlimitedStorage",
                "scripting",
                "offscreen"
            ];
            if (whichBrowser === "firefox") {
                permissions.push("webNavigation");
                // permissions.push("<all_urls>");
            } else if (whichBrowser === "puppeteer") {
                // permissions.push("<all_urls>");
            }
            return permissions;
        }()),

        // "host_permissions": (function () {
        //     var host_permissions = [];
        //     host_permissions.push("*://*/*");
        //     return host_permissions;
        // }()),

        "optional_permissions": (function () {
            var optional_permissions = [];
            if (whichBrowser !== "firefox") {
                optional_permissions.push("webNavigation");
                // optional_permissions.push("<all_urls>");
            }
            return optional_permissions;
        }()),

        "optional_host_permissions": (function () {
            var optional_host_permissions = [];
            optional_host_permissions.push("*://*/*");
            return optional_host_permissions;
        }()),

        // "browser_action": {
        //     "default_icon": {
        //         "16": "icons/icon-16.png",
        //         "24": "icons/icon-24.png",
        //         "32": "icons/icon-32.png",
        //         "40": "icons/icon-40.png",
        //         "48": "icons/icon-48.png",
        //         "128": "icons/icon-128.png",
        //         "256": "icons/icon-256.png"
        //     }
        // },
        "action": {
            "default_icon": {
                "16": "icons/icon-16.png",
                "24": "icons/icon-24.png",
                "32": "icons/icon-32.png",
                "40": "icons/icon-40.png",
                "48": "icons/icon-48.png",
                "128": "icons/icon-128.png",
                "256": "icons/icon-256.png"
            },
            "default_title": "Launch Magic CSS editor for this page"
        },
        "background": (function () {
            // const background = {
            //     "page": "background-magicss.html"
            // };
            // if (whichBrowser === "puppeteer") {
            //     background.persistent = true;
            // } else if (whichBrowser !== "firefox") {
            //     background.persistent = false;
            // }
            // return background;

            const background = {
                "service_worker": "dist/background-magicss.bundle.js"
                // "service_worker": "background-magicss.js"
            };
            return background;
        }()),
        "commands": {
            "_execute_action": {
                "suggested_key": {
                    "default": "Alt+Shift+C"
                }
            }
        },
        "options_ui": {
            "open_in_tab": true,
            "page": "options.html"
        }
        /*
        // "web_accessible_resources" might be required on some platforms (but currently we are using data-uri for images, so no need yet)

        "web_accessible_resources": [
            "ui-images/*.*"
        ]
        /* */
    };

    if (whichBrowser !== "puppeteer") {
        // manifest["content_security_policy"] = "script-src 'unsafe-eval' 'self' https://cdnjs.cloudflare.com https://ssl.google-analytics.com; object-src 'self'";
        manifest["content_security_policy"] = {
            // "extension_pages": "script-src 'unsafe-eval' 'self' https://cdnjs.cloudflare.com https://ssl.google-analytics.com; object-src 'self'"
            "extension_pages": "script-src 'self'; object-src 'self'"
        };
    }

    if (whichBrowser === "puppeteer") {
        manifest["__custom__"] = {
            "hideRateUsHeaderIcon": true
        };
    }

    if (whichBrowser !== "firefox") {
        manifest["offline_enabled"] = true;
    }

    if (whichBrowser === "firefox") {
        manifest["applications"] = {
            "gecko": {
                "id": "{a42eb16c-2fab-4c06-b1f3-5f15adebb0e3}",
                "strict_min_version": "48.0"
            }
        };
    }

    if (whichBrowser === "chrome") {
        // https://github.com/w3c/webextensions/issues/119#issuecomment-1146576788
        manifest["minimum_chrome_version"] = "102";
    }

    var targetFileName;
    switch (whichBrowser) {
        case "chrome":    targetFileName = "manifest-chrome.json";    break;
        case "edge":      targetFileName = "manifest-edge.json";      break;
        case "firefox":   targetFileName = "manifest-firefox.json";   break;
        case "opera":     targetFileName = "manifest-opera.json";     break;
        case "puppeteer": targetFileName = "manifest-puppeteer.json"; break;
        default:          targetFileName = "manifest.json";           break;
    }
    process.stdout.write("Generating " + targetFileName + " : ");
    jsonfile.writeFileSync(path.join(__dirname, targetFileName), manifest, {spaces: 4});
    process.stdout.write(chalk.green(" ✓") + "\n");
};

generateManifest("default");
generateManifest("chrome");
generateManifest("edge");
generateManifest("firefox");
generateManifest("opera");
generateManifest("puppeteer");

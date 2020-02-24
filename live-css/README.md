# live-css server

live-css is a Node JS based development server for use with the browser extension **Live editor for CSS, Less & Sass - Magic CSS**.  

<!--
    Reference: https://stackoverflow.com/questions/13808020/include-an-svg-hosted-on-github-in-markdown/16462143#16462143
-->

> <img width="32" alt="Google Chrome Logo" src="https://raw.githubusercontent.com/webextensions/live-css-editor/HEAD/extension/ui-images/logo-google-chrome.svg?sanitize=true"> &nbsp; https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol  

For availability of the latest version of Magic CSS extension on Microsoft Edge, Mozilla Firefox and Opera, follow:
> https://github.com/webextensions/live-css-editor

## Installation and Usage

There are two ways to install live-css server: globally and locally.

### Global installation and usage
```sh
$ npm install --global @webextensions/live-css
```

```sh
$ live-css
```

### Local installation and usage (for Node JS based projects)
```sh
$ npm install --save-dev @webextensions/live-css
```

```js
var express = require('express');
var app = express();
var httpServer = app.listen(3000, function () {
    console.log('Server started');
});

if (codeIsRunningInDevelopmentMode) {
    var liveCssServer = require('@webextensions/live-css');

    // Start live-css server
    liveCssServer({
        // Optional - If provided, the live-css server will reuse your current HTTP server port.
        //            Otherwise, live-css server would run on a separate port.
        httpServer: httpServer,

        // Optional - If provided, routes for '/live-css/' requests would be setup appropriately
        expressApp: app,

        // Optional - Use it along with "expressApp" if the "live-css" server runs on a different port
        runningOnSeparatePort: false,

        // Optional - Useful for providing some common configuration options.
        //            This example assumes that the path of the config file is same as that of
        //            server code file initiating live-css server
        configFilePath: require('path').resolve(__dirname, '.live-css.config.js')
    });
}
```

## How to use
* Install the Magic CSS browser extension from the link mentioned above
* Open the web page you are developing
* Click on the Magic CSS icon to launch the floating CSS editor
* In top bar of the floating CSS editor, under the reload icon, click on the option "Watch CSS files to apply changes automatically"
* A dialog would open, which would guide you how to connect this live-css server with the Magic CSS extension
* Once the connection is setup, you can edit and save the CSS files in your favorite code editor and they would automatically get reloaded in the web page

## Command line options
* To get the full list of options:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --help```
* To generate the configuration file:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --init```
* To run live-css server on a custom port:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --port <custom-port-number>```
* To list the files being watched:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --list-files```
* To allow symlinks:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --allow-symlinks```
* To specify the HTTP server's root folder:  
  &nbsp; &nbsp; &nbsp; &nbsp;```$ live-css --root <http-server-root-folder>```

## Configuration file
The configuration file can be generated using ```$ live-css --init```  

*_Note:_* Configuration options are described in the [configuration file](https://github.com/webextensions/live-css-editor/blob/master/live-css/default.live-css.config.js)

## TODO
* Ability to auto-connect live-css server without launching the browser extension
* Ability to integrate webpage front-end and live-css server without the browser extension

## Author
* Priyank Parashar - [GitHub](https://github.com/paras20xx) | [Twitter](https://twitter.com/paras20xx) | [LinkedIn](https://linkedin.com/in/ParasharPriyank/)

## Connect to us
* https://webextensions.org/
* [GitHub](https://github.com/webextensions/live-css-editor)
* [Twitter](https://twitter.com/webextensions)

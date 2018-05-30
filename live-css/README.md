# live-css server

This is a development server for use with the browser extension **Live editor for CSS, Less & Sass - Magic CSS**.  

> <img width="32" alt="Google Chrome Logo" src="https://cdn.rawgit.com/webextensions/live-css-editor/master/extension/ui-images/logo-google-chrome.svg"> &nbsp; https://chrome.google.com/webstore/detail/ifhikkcafabcgolfjegfcgloomalapol  

For availability of the latest version of Magic CSS extension on Microsoft Edge, Mozilla Firefox and Opera, follow:
> https://github.com/webextensions/live-css-editor

## Global Installation and Usage
```
$ npm install --global live-css
```

```
$ live-css
```

## How to use
* Install the Magic CSS browser extension from the link mentioned above
* Open the web page you are developing
* Click on the Magic CSS icon to launch the floating CSS editor
* Under the reload icon, click on the option "Watch CSS files to apply changes automatically"
* A pop-up would open up which would guide you how to connect this live-css server with the Magic CSS extension
* Once the connection is setup, you can edit and save the CSS files in your favorite code editor and they would automatically get reloaded in the web page

## Command line
* To get full list of options:  
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
* Ability to edit files within the extension "Live editor for CSS, Less & Sass - Magic CSS"
* Ability to auto-connect live-css server without launching the browser extension
* Ability to integrate with live-css server without the browser extension
* Ability to integrate live-css server into a Node JS based project

## Created by
* Priyank Parashar

## Connect to us at
* https://webextensions.org/
* [GitHub](https://github.com/webextensions/live-css-editor)
* [Twitter](https://twitter.com/webextensions)
* [LinkedIn - Priyank Parashar](https://linkedin.com/in/ParasharPriyank/)

# Steps
* Go to https://en.wikipedia.org/wiki/Less_(stylesheet_language)
* Run the extension
* Open browser DevTools
* Set device type as "Responsive"
* Set page dimensions as: 640 x 400
* Apply the CSS / JS code from the following sections to ensure the position & dimension of the editor and also the styling of the page
* "Capture screenshot" (640 x 400)
* Note: If scrollbar is included in the screenshot, then increase the above dimensions by 16px each and crop out the scrollbar from the screenshot so that the final size is 640 x 400

## Editor position:
```css
#MagiCSS-bookmarklet {
    top: 178px;
    left: 21px;
}
```

```js
localStorage['__amplify__MagiCSS-bookmarklet-ui-position-top']  = "{\"data\":178,\"expires\":null}";
localStorage['__amplify__MagiCSS-bookmarklet-ui-position-left'] = "{\"data\":21, \"expires\":null}";
```

## Editor dimensions:
```css
.CodeMirror {
    width: 350px;
    height: 162px;
}
```

```js
localStorage['__amplify__MagiCSS-bookmarklet-ui-size-width']    = "{\"data\":350,\"expires\":null}";
localStorage['__amplify__MagiCSS-bookmarklet-ui-size-height']   = "{\"data\":162,\"expires\":null}";
```

## CSS code
```css

@grayBG:   #484848;
@grayText: #aaa;

body {
    background-color: @grayBG;

    .contents p {
        color: @grayText;
    }
}





.vector-body p {
    color: @grayText;
}

@linkColor: #181818;
.vector-body p {
    a {
        color: @linkColor;
    }
}

.mw-body {
    color: #888;

    .infobox a {
        color: #fff;
    }
}

#mw-panel .mw-portlet {
    display: none;
}

#mw-head,
#mw-panel,
#content {
    background-color: @grayBG;
}

.vector-menu-tabs a {
    display: none !important;
}

.vector-menu-tabs {
    display: none !important;
}

.firstHeading {
    color: #ccc;
}

#mw-page-base {
    background-image: none;
    background-color: @grayBG;
}

.vector-menu-content-list a {
    color: #bbb;
}

#pt-anonuserpage {
    display: none;
}

#searchInput {
    -width: 500px;
}
#searchInput::placeholder {
    color: @grayBG !important;
}

#simpleSearch {
    margin-top: -7px;
    width: 152px;
    -width: 238px;
}

.infobox {
    background-color: #777;
}

.mw-body {
    border-color: #bbb;
}

.infobox-title {
    color: #bbb;
}

.infobox-data {
    color: #222;
}

.infobox a {
    color: #222 !important;
}

.infobox-label,
.infobox-label a {
    color: #282828 !important;
}

p {
    visibility: hidden;
}
```

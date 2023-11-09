import './loading-magic-css.js';
import './3rdparty/css.escape.js';

import './3rdparty/codemirror/codemirror.css';
import './3rdparty/codemirror/theme/ambiance.css';
import './3rdparty-custom-fixes/codemirror/magicss-codemirror.css';

import './3rdparty-custom-fixes/codemirror/codemirror-as-global.js';

import './3rdparty/codemirror/mode/css.js';
import './3rdparty/codemirror/addons/display/placeholder.js';
import './3rdparty/codemirror/addons/selection/active-line.js';
import './3rdparty/codemirror/addons/edit/closebrackets.js';
import './3rdparty/codemirror/addons/edit/matchbrackets.js';

// This is required for some cases in multi-selection (using Ctrl+D)
import './3rdparty/codemirror/addons/search/searchcursor.js';

import './3rdparty/codemirror/addons/comment/comment.js';

import './3rdparty/csslint/csslint.js';
import './3rdparty-custom-fixes/csslint/ignore-some-rules.js';
import './3rdparty/codemirror/addons/lint/lint.css';
import './3rdparty-custom-fixes/codemirror/addons/lint/tooltip.css';
import './3rdparty/codemirror/addons/lint/lint.js';
import './3rdparty/codemirror/addons/lint/css-lint_customized.js';

import './3rdparty/codemirror/addons/hint/show-hint.css';
import './3rdparty/codemirror/addons/hint/show-hint_customized.js';
import './3rdparty/codemirror/addons/hint/css-hint_customized.js';

// https://github.com/easylogic/codemirror-colorpicker
import './3rdparty/codemirror/addons/colorpicker/colorpicker.css';
import './3rdparty/codemirror/addons/colorpicker/colorview_customized.js';
import './3rdparty/codemirror/addons/colorpicker/colorpicker.js';

import './3rdparty/codemirror/addons/emmet/emmet-codemirror-plugin.js';

import './3rdparty/codemirror/keymap/sublime.js';

import './3rdparty-custom-fixes/jquery/jquery-as-global.js';

import './3rdparty/jquery-ui_customized.css';
import './3rdparty/jquery-ui.js';
import './3rdparty/jquery.ui.touch-punch_customized.js';

import './3rdparty-custom-fixes/socket.io/socket.io-as-global.js';

import './3rdparty/amplify-store.js';
import './migrate-storage.js';

import './3rdparty/tooltipster/tooltipster.css';
import './3rdparty/tooltipster/jquery.tooltipster.js';
import './3rdparty/tooltipster/tooltipster-scrollableTip.js';

import './3rdparty/toastr/toastr.css';
import './3rdparty/toastr/toastr_customized.js';

import './3rdparty/magicsuggest/magicsuggest.css';
import './3rdparty/magicsuggest/magicsuggest.js';

import './3rdparty-custom-fixes/csspretty/pre-csspretty.js';
import './3rdparty/csspretty/csspretty.js';
// Alternatively, use cssbeautify & Yahoo's CSS Min libraries
// import './3rdparty/cssbeautify/cssbeautify.js';
// import './3rdparty/yui-cssmin/cssmin.js';

// http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.5/less.js
// import './3rdparty/less.js';
// // TODO: Remove this piece of commented out code. Now loading 'less' dynamically via `loadIfNotAvailable`
// import './3rdparty/basic-less-with-sourcemap-support.browserified.js';

// Commented out so that Opera users can use Sass the way it is loaded in Chrome (when installed from Chrome Web Store)
// {
//     src: import './3rdparty/sass/sass.sync.min.js';
//     skip: (runningInBrowserExtension && isOpera) ? false : true
// },

// http://www.miyconst.com/Blog/View/14/conver-css-to-less-with-css2less-js
// import './3rdparty/css2less/linq.js';
// import './3rdparty/css2less/css2less.js';

import './magicss/editor/editor.css';
import './magicss/editor/editor.js';

import './magicss/magicss.css';

import './magicss/generate-selector.js';

import './magicss/magicss.js';

import '../commonAppUtils/updateConfigFromRemoteForNextLoad.js';

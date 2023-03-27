import { myWin } from './scripts/appUtils/myWin.js';

(function () {
    try {
        const
            urlParams = new URLSearchParams(window.location.search),
            tabTitle = urlParams.get('tabTitle');
        if (tabTitle) {
            document.title = 'Magic CSS: ' + tabTitle;
        } else {
            document.title = 'Magic CSS';
        }
    } catch (e) {
        // do nothing
    }

    myWin.flagEditorInExternalWindow = true;
    myWin.treatAsNormalWebpage = true;
})();

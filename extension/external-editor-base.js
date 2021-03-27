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

    window.flagEditorInExternalWindow = true;
    window.treatAsNormalWebpage = true;
})();

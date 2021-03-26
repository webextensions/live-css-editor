(function () {
    try {
        // TODO: Read "tabTitle" query parameter in standard way
        const tabTitle = decodeURIComponent(window.location.search.split('&tabTitle=')[1]);
        document.title = 'Magic CSS: ' + tabTitle;
    } catch (e) {
        // do nothing
    }

    window.flagEditorInExternalWindow = true;
    window.treatAsNormalWebpage = true;
})();

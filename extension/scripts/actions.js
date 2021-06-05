(function() {
    try {
        // https://developer.chrome.com/docs/extensions/mv2/tut_analytics/
        // https://developer.chrome.com/docs/extensions/mv3/tut_analytics/

        window._gaq = window._gaq || [];
        var _gaq = window._gaq;
        _gaq.push(['_setAccount', 'UA-198813835-1']);
        _gaq.push(['_gat._forceSSL']); // https://stackoverflow.com/questions/37799578/google-analytics-force-https-to-prevent-307-internal-redirect/37799579#37799579
        _gaq.push(['_trackPageview']);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        const getRandomIntInclusive = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
        };

        setTimeout(
            function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = 'https://ssl.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            },
            // Load with a delay since this network request is not required for showing the UI of the extension
            getRandomIntInclusive(40 * 1000, 400 * 1000)
        );
    } catch (e) {
        // do nothing
    }
})();

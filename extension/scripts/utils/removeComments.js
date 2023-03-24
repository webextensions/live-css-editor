// NOTE: This file is not being used as of now. It is being kept here for future reference.

// http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
const removeComments = function (str) {
    var uid = '_' + (+new Date()),
        primatives = [],
        primIndex = 0;

    return (
        str
            /* Remove strings */
            .replace(/(['"])(\\\1|.)+?\1/g, function(match){
                primatives[primIndex] = match;
                return (uid + '') + primIndex++;
            })

            /* Remove Regexes */
            .replace(/([^/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
                primatives[primIndex] = $2;
                return $1 + (uid + '') + primIndex++;
            })

            /*
            - Remove single-line comments that contain would-be multi-line delimiters
                E.g. // Comment /* <--
            - Remove multi-line comments that contain would be single-line delimiters
                E.g. /* // <--
           */
            .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')

            /*
            Remove single and multi-line comments,
            no consideration of inner-contents
           */
            .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')

            /*
            Remove multi-line comments that have a replaced ending (string/regex)
            Greedy, so no inner strings/regexes will stop it.
           */
            .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')

            /* Bring back strings & regexes */
            .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
                return primatives[n];
            })
    );
};

export { removeComments };

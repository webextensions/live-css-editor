const isValidUuidV4 = function (str) {
    const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (v4Regex.test(str)) {
        return true;
    } else {
        return false;
    }
};

export { isValidUuidV4 };

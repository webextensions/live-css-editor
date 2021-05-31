/* Copy the format of this file (./sample-secrets.js) with appropriate changes in secret values and save that at ./secrets.js */

const secrets = {
    nounProjectApiIncorrectAccessKeyAndSecret: {
        accessKey: '12345678901234567890123456789012',
        secret: '12345678901234567890123456789012'
    },
    nounProjectApiCorrectAccessKeyIncorrectSecret: {
        accessKey: '<correct-access-key-goes-here>',
        secret: '12345678901234567890123456789012'
    },
    nounProjectApi: {
        accessKey: '<correct-access-key-goes-here>',
        secret: '<correct-secret-key-goes-here>'
    }
};

module.exports = secrets;

const path = require('node:path');

let notifier;
try {
    notifier = require('node-notifier');
} catch (e) {
    console.log(
        'Could not load module "node-notifier".' +
        '\nWe need to run "$ npm install node-notifier" to be able to see desktop notifications.' +
        '\n'
    );
}

let muteNotifications = false;

const notify = function (options) {
    if (!muteNotifications) {
        if (notifier) {
            notifier.notify(options);
        }
    }
};

module.exports = {
    info: function (title, message) {
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'info.png')
        });
    },
    warn: function (title, message) {
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'warn.png')
        });
    },
    error: function (title, message) {
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'error.png')
        });
    },
    mute: function (flag) {
        muteNotifications = flag;
    }
};

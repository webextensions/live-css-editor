const
    notifier = require('../../../utils/notifications/notifications.js');

const notifyCompletionStatus = (stats) => {
    const jsonStats = stats.toJson();

    let overallStatus = 'info';

    let statusMsg = '';
    const whitespaceChar = ' '; // A normal space character is trimmed in notifications. This character (U+2000) is not trimmed in notification.
    if (stats.hasErrors()) {
        statusMsg += `${whitespaceChar}\nWebpack build failed.`;
    } else {
        statusMsg += `${whitespaceChar}\nWebpack build completed.`;
    }

    if (stats.hasErrors()) {
        overallStatus = 'error';

        if (jsonStats.errors.length) {
            statusMsg += `\n${whitespaceChar}\n${jsonStats.errors.length} error(s) occurred.`;
        } else {
            statusMsg += `\n${whitespaceChar}\nSome error(s) occurred. Analyze webpack stats of compilation.children for further details.`;
        }
    }
    if (stats.hasWarnings()) {
        overallStatus = 'warn';

        if (jsonStats.warnings.length) {
            statusMsg += `\n${whitespaceChar}\n${jsonStats.warnings.length} warning(s) occurred.`;
        } else {
            statusMsg += `\n${whitespaceChar}\nSome warning(s) occurred. Analyze webpack stats of compilation.children for further details.`;
        }
    }

    const currentTime = (function () {
        const d = new Date();

        return (
            new Date(
                d.getTime() -
                d.getTimezoneOffset() * 60 * 1000
            )
        ).toISOString().substring(11, 19);
    }());
    const title = `${require('../../../package.json').name} @ ${currentTime} (in ${stats.endTime - stats.startTime}ms)`;

    if (overallStatus === 'error') {
        notifier.error(title, statusMsg);
    } else if (overallStatus === 'warn') {
        notifier.warn(title, statusMsg);
    } else {
        notifier.info(title, statusMsg);
    }
};

module.exports = notifyCompletionStatus;

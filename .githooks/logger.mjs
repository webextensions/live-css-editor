var chalk;
try {
    chalk = (await import('chalk')).default;
} catch (e) {
    // do nothing
}

var boxen;
try {
    boxen = (await import('boxen')).default;
} catch (e) {
    // do nothing
}

var stripAnsi;
try {
    stripAnsi = (await import('strip-ansi')).default;
} catch (e) {
    // do nothing
}

var logger = {
    chalkProxy: function (fnName, msg) {
        if (chalk && chalk[fnName]) {
            return chalk[fnName](msg);
        } else {
            return msg;
        }
    },
    stripAnsi: function (msg) {
        if (stripAnsi) {
            return stripAnsi(msg);
        } else {
            return msg;
        }
    },
    boxen: function (msg, options) {
        if (boxen) {
            return boxen(msg, options);
        } else {
            return msg;
        }
    },
    log: function (msg) {
        console.log(msg);
    },
    info: function (msg) {
        if (chalk) {
            msg = chalk.blue(msg);
        }
        console.log(msg);
    },
    warn: function (msg) {
        if (chalk) {
            msg = chalk.yellow(msg);
        }
        console.log(msg);
    },
    error: function (msg) {
        if (chalk) {
            msg = chalk.red(msg);
        }
        console.log(msg);
    },
    success: function (msg) {
        if (chalk) {
            msg = chalk.green(msg);
        }
        console.log(msg);
    }
};

export default logger;

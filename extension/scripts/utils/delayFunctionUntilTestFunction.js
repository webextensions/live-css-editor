const delayFunctionUntilTestFunction = async function(config) {
    var fnSuccess = config.fnSuccess,
        fnTest = config.fnTest,
        fnFirstFailure = config.fnFirstFailure,
        fnEachFailure = config.fnEachFailure,
        fnFailure = config.fnFailure,
        tryLimit = typeof config.tryLimit === 'undefined' ? 120 : config.tryLimit;

    config['tryLimit-Running-Cycle-Number'] = typeof config['tryLimit-Running-Cycle-Number'] === 'undefined' ? 0 : config['tryLimit-Running-Cycle-Number']+1;

    var tryLimitRunningCycleNumber = config['tryLimit-Running-Cycle-Number'],
        waitFor = config.waitFor || 750;

    if(fnTest()) {
        return (await fnSuccess()) === false ? false : true;
    } else {
        if(tryLimitRunningCycleNumber === 0 && typeof fnFirstFailure === 'function') {
            fnFirstFailure();
        }

        if(typeof fnEachFailure === 'function') {
            fnEachFailure();
        }

        if(tryLimitRunningCycleNumber < (tryLimit-1)) {
            window.setTimeout((async function(){
                await delayFunctionUntilTestFunction(config);
            }),waitFor);
        } else {
            if (typeof fnFailure === 'function') {
                fnFailure();
            }
        }
        return false;
    }
};

export { delayFunctionUntilTestFunction };

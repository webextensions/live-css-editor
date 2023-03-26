const basisNumberFromUuid = function (uuid) {
    const uuidWithoutHyphen = uuid.replace(/-/g, '');
    let basisString = BigInt(`0x${uuidWithoutHyphen}`).toString();
    basisString = basisString.slice(basisString.length - 4);
    const basisNumber = parseInt(basisString) + 1;
    return basisNumber;
};

export { basisNumberFromUuid };

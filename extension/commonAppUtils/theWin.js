let theWin;

if (typeof window !== 'undefined') {
    theWin = window;
} else {
    theWin = {};
}

export { theWin };

/*
const theWin = {};

export { theWin };
*/

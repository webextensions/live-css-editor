let myWin;

if (typeof window !== 'undefined') {
    myWin = window;
} else {
    myWin = {};
}

export { myWin };

/*
const myWin = {};

export { myWin };
*/

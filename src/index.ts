"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {

    solve_dec_10_pt1();
    //  solve_dec_10_pt2();
};

module.exports = {
    start
};

const solve_dec_10_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_10_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




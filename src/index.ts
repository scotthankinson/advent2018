"use strict";
// tslint:disable
import fs = require('fs');
import * as Collections from 'typescript-collections';
import { createLessThan } from 'typescript';

const start = (): void => {

    // solve_dec_9_pt1();
    solve_dec_9_pt1();
};

module.exports = {
    start
};

const solve_dec_9_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const lines = data.split('\n');
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_9_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const lines = data.split('\n');
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




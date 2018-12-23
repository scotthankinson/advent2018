"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    solve_dec_17_pt1();
};

module.exports = {
    start
};

const solve_dec_17_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec19.txt', 'utf8');
        const lines = data.split('\n');

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_17_pt2 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




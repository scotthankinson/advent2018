"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';
import { unescapeLeadingUnderscores } from 'typescript';

const start = (): void => {
    const data = fs.readFileSync('src/test.dec5.txt', 'utf8');
    // const data = 'dabAcCaCBAcCcaDA';        
    // const lines = data.split('\n');

    //  console.log(solve_dec_5_pt1(data));
    solve_dec_5_pt2(data);
};

module.exports = {
    start
};

const input = ''


const solve_dec_5_pt1 = (input) => {
    try {
        let letters = input.split('');
        let remapped = letters.map(a => toNumber(a));

        let startingLength = 0;
        while (remapped.length != startingLength) {
            startingLength = remapped.length;
            // console.log(remapped.map(a => fromNumber(a)).join(''));
            for (let i = 0; i < remapped.length - 1; i++) {
                if (remapped[i] + remapped[i + 1] === 0) {
                    remapped.splice(i, 2);
                    continue;
                }
            }
        }

        return remapped.map(a => fromNumber(a)).join('').length;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const toNumber = (a) => {
    return a.charCodeAt(0) > 96 ? a.charCodeAt(0) - 96 : (a.charCodeAt(0) - 64) * -1;
}
const fromNumber = (a) => {
    return a > 0 ? String.fromCharCode(a + 96) : String.fromCharCode((-1 * a) + 64);
}

const solve_dec_5_pt2 = (input) => {
    try {
        console.log('Base Case - ' + solve_dec_5_pt1(input));
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        for (let i = 0; i < letters.length; i++) {
            const filteredInput = input.split('').filter(x => x !== letters[i] && x !== letters[i].toUpperCase()).join('');
            console.log(letters[i].toUpperCase() + ' - ' + solve_dec_5_pt1(filteredInput));
        }
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();




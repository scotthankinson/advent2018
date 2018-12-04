"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';

const start = (): void => {

    console.log(solve_dec_2_pt2());
    /*
    console.log(solve_dec_2_pt1("bababc"));
    console.log(solve_dec_2_pt1("abbcde"));
    console.log(solve_dec_2_pt1("abcccd"));
    console.log(solve_dec_2_pt1("aabcdd"));
    console.log(solve_dec_2_pt1("abcdee"));
    console.log(solve_dec_2_pt1("ababab"));
    */

    /*
    console.log(solve_dec_1_pt2(test_2_1));
    console.log(solve_dec_1_pt2(test_2_2));
    console.log(solve_dec_1_pt2(test_2_3));
    console.log(solve_dec_1_pt2(test_2_4));
    console.log(solve_dec_1_pt2(input));
    */
};

module.exports = {
    start
};



const solve_dec_2_pt1 = (input: any) => {
    try {
        const data = fs.readFileSync('src/test.dec2.txt', 'utf8');
        const lines = data.split('\n');
        let checksum_2_count = 0;
        let checksum_3_count = 0;
        for (let i = 0; i < lines.length; i++) {
            let has2 = false;
            let has3 = false;
            let letters = lines[i].split('');
            let counts = {};
            for (let j = 0; j < letters.length; j++) {
                if (counts[letters[j]]) {
                    counts[letters[j]] = counts[letters[j]] + 1;
                } else {
                    counts[letters[j]] = 1;
                }
            }
            console.log(counts);
            for (let key in counts) {
                console.log(key + ': ' + counts[key]);
                if (counts[key] === 2) {
                    has2 = true;
                }
                if (counts[key] === 3) {
                    has3 = true;
                }
            }
            if (has2) checksum_2_count += 1;
            if (has3) checksum_3_count += 1;
        }
        console.log("2 Count: " + checksum_2_count + "; 3 Count: " + checksum_3_count);
        return checksum_2_count * checksum_3_count;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



const solve_dec_2_pt2 = () => {
    // Find two strings which differ by only a single character
    try {
        const data = fs.readFileSync('src/test.dec2.txt', 'utf8');
        const lines = data.split('\n');
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines.length; j++) {
                if (lines[i] !== lines[j]) {
                    const comp = compare_candidates(lines[i], lines[j]);
                    if (comp <= 1) {
                        console.log(lines[i]);
                        console.log(lines[j]);
                        console.log('Comparing ' + lines[i] + ' ' + lines[j] + '; drift by ' + comp);
                    }
                }
            }
        }
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const compare_strings = (input1, input2) => {
    let diff = 0;
    for (let key in input1) {
        if (input2[key]) {
            diff = diff + (input1[key] - input2[key]);
        } else {
            diff = diff + input1[key];
        }
    }
    for (let key in input2) {
        if (input1[key]) {
            // already covered
        } else {
            diff = diff + input2[key];
        }
    }
    return diff;
}

const compare_candidates = (input1, input2) => {
    let diff = 0;
    const letters1 = input1.split('');
    const letters2 = input2.split('');
    for (let i = 0; i < letters1.length; i++) {
        if (letters1[i] !== letters2[i]) diff += 1;
    }
    return diff;
}

start();




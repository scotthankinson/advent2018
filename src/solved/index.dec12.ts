"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {

    solve_dec_12_pt1();
    //  solve_dec_12_pt2();
};

module.exports = {
    start
};

const solve_dec_12_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec12.txt', 'utf8');
        const lines = data.split('\n');
        let input = '#..#####.#.#.##....####..##.#.#.##.##.#####..####.#.##.....#..#.#.#...###..#..###.##.#..##.#.#.....#';
        const rules = lines.filter(o => o.trim().endsWith('#')).map(o => o.substring(0, 5));
        console.log(rules);
        let zeroPoint = 0;
        for (let i = 0; i < 50000000000; i++) {
            if (i % 1000 === 0) {
                console.log("Length " + input.length + ", ZeroIndex " + zeroPoint);
            }
            let sum = 0;
            for (let i = 0; i < input.split('').length; i++) {
                if (input[i] === '#') sum += (i - zeroPoint);
            }

            console.log("GENERATION: " + (i + 1) + '; Previous Generation Result: ' + sum);
            let result = runGeneration(input, zeroPoint, rules);
            zeroPoint = result.zeroPoint;
            input = result.output;

        }

        let sum = 0;
        for (let i = 0; i < input.split('').length; i++) {
            if (input[i] === '#') sum += (i - zeroPoint);
        }
        console.log(sum);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const runGeneration = (input, zeroPoint, rules) => {
    // console.log("IN: " + input);
    // console.log("Length " + input.length + ", ZeroIndex " + zeroPoint);
    const startingLength = input.length;
    zeroPoint += 4;
    input = '....' + input + '....';
    let output = '..';
    for (let i = 0; i < input.length - 4; i++) {
        let test = input.substring(i, i + 5);
        if (rules.filter(o => o === test).length > 0) {
            output += "#";
        } else {
            output += ".";
        }
    }
    while (zeroPoint >= 0 && output.startsWith('.')) {
        output = output.slice(1);
        zeroPoint -= 1;
    }
    while (output.length >= (startingLength + zeroPoint) && output.endsWith('.')) {
        output = output.slice(0, -1);
    }
    // console.log('OUT: ' + output);
    return {
        'output': output,
        'zeroPoint': zeroPoint
    }
}


const solve_dec_12_pt2 = () => {
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




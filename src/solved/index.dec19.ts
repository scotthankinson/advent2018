"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    // 217 Too Low  -- Setting Register 1 to 100 to speed it up
    // Setting Register 1 to 1000 -- 2340 -- changes the answer
    // incrementing 2 & 4 ends way too fast
    // 10551398 (Register 1 value + 1) after incrementing 2 at hyperspeed, skipping something important
    // 
    //solve_dec_19_pt1();
    // and the tip-off is in - 1,2,11,13,22,26,79,143,158,286,467,869,934,1027,1738,2054,5137,6071,10274,11297,12142,22594,36893,66781,73786,133562,405823,479609,811646,959218,5275699,10551398
    console.log(calculate(10551398));
};

module.exports = {
    start
};

// Sum of Factors
const calculate = (num) => {

    var half = Math.floor(num / 2), // Ensures a whole number <= num.
        str = '1', // 1 will be a part of every solution.
        i, j;

    // Determine our increment value for the loop and starting point.
    num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);

    for (i; i <= half; i += j) {
        num % i === 0 ? str += ',' + i : false;
    }

    str += ',' + num; // Always include the original number.
    return str;
}


const solve_dec_19_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec19.txt', 'utf8');
        const lines = data.split('\n');
        let instructionRegister = 5;
        let instructionPointer = 0;
        let registers = [1, 0, 0, 0, 0, 0];
        // let registers = [0, 10551398, 7000001, 0, 10478261, 5]
        let counter = 0;
        let validInstructions = true;
        let history: any = {};
        for (let i = 0; i < lines.length; i++) {
            history[i] = 0;
        }
        while (validInstructions) {
            // if (counter > 100000) break;
            counter += 1;
            registers[instructionRegister] = instructionPointer;
            history[instructionPointer] += 1;
            if (instructionPointer >= lines.length) break;
            let raw = lines[instructionPointer].split(' ');
            let operation = raw.shift();
            let instructions = raw.map(o => parseInt(o));
            if (counter % 1000000 === 0) {
                console.log('Executing ' + instructionPointer + ' of ' + lines.length);
                console.log('IP: ' + instructionPointer + ', ' + operation + ' ' + JSON.stringify(instructions) + '; ' + JSON.stringify(registers));
                console.log(history);
            }
            // Insert a 0 to maintain placement from Day 16
            instructions.unshift(0);
            if (operation === 'addr') {
                addr(registers, instructions);
            } else if (operation === 'addi') {

                // Add faster dammit
                if (registers[1] === 10551398 && instructionPointer == 8) {
                    if (registers[instructions[3]] < 10500000) {
                        instructions[2] = 1000000;
                    } else if (registers[instructions[3]] < 10550000) {
                        instructions[2] = 50000;
                    } else if (registers[instructions[3]] < 10551000) {
                        instructions[2] = 100;
                    }
                }

                // Manipulate 12?
                addi(registers, instructions);
            } else if (operation === 'mulr') {
                mulr(registers, instructions);
            } else if (operation === 'muli') {
                muli(registers, instructions);
            } else if (operation === 'banr') {
                banr(registers, instructions);
            } else if (operation === 'bani') {
                bani(registers, instructions);
            } else if (operation === 'borr') {
                borr(registers, instructions);
            } else if (operation === 'bori') {
                bori(registers, instructions);
            } else if (operation === 'setr') {
                setr(registers, instructions);
            } else if (operation === 'seti') {
                seti(registers, instructions);
            } else if (operation === 'gtir') {
                gtir(registers, instructions);
            } else if (operation === 'gtri') {
                gtri(registers, instructions);
            } else if (operation === 'gtrr') {
                gtrr(registers, instructions);
            } else if (operation === 'eqir') {
                eqir(registers, instructions);
            } else if (operation === 'eqri') {
                eqri(registers, instructions);
            } else if (operation === 'eqrr') {
                eqrr(registers, instructions);
            }
            instructionPointer = registers[instructionRegister] + 1;

            // console.log('IP: ' + instructionPointer + ', ' + JSON.stringify(registers));
        }

        console.log(registers);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_19_pt2 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const addr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] + pre[instr[2]];
}
const addi = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] + instr[2];
}
const mulr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] * pre[instr[2]];
}
const muli = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] * instr[2];
}
const banr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] & pre[instr[2]];
}
const bani = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] & instr[2];
}
const borr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] | pre[instr[2]];
}
const bori = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] | instr[2];
}
const setr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]];
}
const seti = (pre, instr) => {
    pre[instr[3]] = instr[1];
}
const gtir = (pre, instr) => {
    pre[instr[3]] = instr[1] > pre[instr[2]] ? 1 : 0;
}
const gtri = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] > instr[2] ? 1 : 0;
}
const gtrr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] > pre[instr[2]] ? 1 : 0;
}
const eqir = (pre, instr) => {
    pre[instr[3]] = instr[1] === pre[instr[2]] ? 1 : 0;
}
const eqri = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] === instr[2] ? 1 : 0;
}
const eqrr = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] === pre[instr[2]] ? 1 : 0;
}

start();




"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel } from 'typescript';

const start = (): void => {

    // solve_dec_16_pt1();
    solve_dec_16_pt2();
};

module.exports = {
    start
};

const solve_dec_16_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec16.txt', 'utf8');
        const lines = data.split('\n');
        let pre = [];
        let post = [];
        let instr = [];
        let results = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().length === 0) {
                pre = [];
                post = [];
                instr = [];
            } else if (lines[i].startsWith('Before')) {
                let line = lines[i].replace('Before: ', '');
                pre = JSON.parse(line);
            } else if (lines[i].startsWith('After')) {
                let line = lines[i].replace('After: ', '');
                post = JSON.parse(line);
                results.push(evaluate(pre, post, instr));
            } else {
                instr = lines[i].split(' ').map(o => parseInt(o));
            }
        }
        console.log(results);
        console.log(results.filter(o => o > 2).length);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const evaluate = (pre, post, instr) => {
    console.log(pre);
    console.log(post);
    console.log(instr);
    let valid = 0;
    if (addr(pre, post, instr)) valid += 1;
    if (addi(pre, post, instr)) valid += 1;
    if (multr(pre, post, instr)) valid += 1;
    if (multi(pre, post, instr)) valid += 1;
    if (banr(pre, post, instr)) valid += 1;
    if (bani(pre, post, instr)) valid += 1;
    if (borr(pre, post, instr)) valid += 1;
    if (bori(pre, post, instr)) valid += 1;
    if (setr(pre, post, instr)) valid += 1;
    if (seti(pre, post, instr)) valid += 1;
    if (gtir(pre, post, instr)) valid += 1;
    if (gtri(pre, post, instr)) valid += 1;
    if (gtrr(pre, post, instr)) valid += 1;
    if (eqir(pre, post, instr)) valid += 1;
    if (eqri(pre, post, instr)) valid += 1;
    if (eqrr(pre, post, instr)) valid += 1;
    return valid;
}

// addr (add register) stores into register C the result of adding register A and register B.
const addr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] + pre[instr[2]];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const addrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] + pre[instr[2]];
}
// addi (add immediate) stores into register C the result of adding register A and value B.
const addi = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] + instr[2];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const addiFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] + instr[2];
}
// mulr (multiply register) stores into register C the result of multiplying register A and register B.
const multr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] * pre[instr[2]];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const multrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] * pre[instr[2]];
}
// muli (multiply immediate) stores into register C the result of multiplying register A and value B.
const multi = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] * instr[2];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const multiFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] * instr[2];
}
// banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
const banr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] & pre[instr[2]];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const banrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] & pre[instr[2]];
}
// bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
const bani = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] & instr[2];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const baniFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] & instr[2];
}
// borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
const borr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] | pre[instr[2]];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const borrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] | pre[instr[2]];
}
// bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
const bori = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] | instr[2];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const boriFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] | instr[2];
}
// setr (set register) copies the contents of register A into register C. (Input B is ignored.)
const setr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const setrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]];
}
// seti (set immediate) stores value A into register C. (Input B is ignored.)
const seti = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = instr[1];
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const setiFunc = (pre, instr) => {
    pre[instr[3]] = instr[1];
}
// gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
const gtir = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = instr[1] > pre[instr[2]] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const gtirFunc = (pre, instr) => {
    pre[instr[3]] = instr[1] > pre[instr[2]] ? 1 : 0;
}
// gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
const gtri = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] > instr[2] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const gtriFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] > instr[2] ? 1 : 0;
}
// gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
const gtrr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] > pre[instr[2]] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const gtrrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] > pre[instr[2]] ? 1 : 0;
}
// eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
const eqir = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = instr[1] === pre[instr[2]] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const eqirFunc = (pre, instr) => {
    pre[instr[3]] = instr[1] === pre[instr[2]] ? 1 : 0;
}
// eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
const eqri = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] === instr[2] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const eqriFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] === instr[2] ? 1 : 0;
}
// eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
const eqrr = (pre, post, instr): boolean => {
    let preCopy = JSON.parse(JSON.stringify(pre));
    preCopy[instr[3]] = pre[instr[1]] === pre[instr[2]] ? 1 : 0;
    let possible = true;
    for (let i = 0; i < post.length; i++) {
        possible = preCopy[i] === post[i];
        if (!possible) break;
    }
    return possible;
}
const eqrrFunc = (pre, instr) => {
    pre[instr[3]] = pre[instr[1]] === pre[instr[2]] ? 1 : 0;
}

const evaluateAndSolve = (pre, post, instr, predictions) => {
    let valid = 0;
    let possible = [];
    if (!predictions.find(o => o === 'addr') && addr(pre, post, instr)) {
        possible.push('addr');
    }
    if (!predictions.find(o => o === 'addi') && addi(pre, post, instr)) {
        possible.push('addi');
    }
    if (!predictions.find(o => o === 'multr') && multr(pre, post, instr)) {
        possible.push('multr');
    }
    if (!predictions.find(o => o === 'multi') && multi(pre, post, instr)) {
        possible.push('multi');
    }
    if (!predictions.find(o => o === 'banr') && banr(pre, post, instr)) {
        possible.push('banr');
    }
    if (!predictions.find(o => o === 'bani') && bani(pre, post, instr)) {
        possible.push('bani');
    }
    if (!predictions.find(o => o === 'borr') && borr(pre, post, instr)) {
        possible.push('borr');
    }
    if (!predictions.find(o => o === 'bori') && bori(pre, post, instr)) {
        possible.push('bori');
    }
    if (!predictions.find(o => o === 'setr') && setr(pre, post, instr)) {
        possible.push('setr');
    }
    if (!predictions.find(o => o === 'seti') && seti(pre, post, instr)) {
        possible.push('seti');
    }
    if (!predictions.find(o => o === 'gtir') && gtir(pre, post, instr)) {
        possible.push('gtir');
    }
    if (!predictions.find(o => o === 'gtri') && gtri(pre, post, instr)) {
        possible.push('gtri');
    }
    if (!predictions.find(o => o === 'gtrr') && gtrr(pre, post, instr)) {
        possible.push('gtrr');
    }
    if (!predictions.find(o => o === 'eqir') && eqir(pre, post, instr)) {
        possible.push('eqir');
    }
    if (!predictions.find(o => o === 'eqri') && eqri(pre, post, instr)) {
        possible.push('eqri');
    }
    if (!predictions.find(o => o === 'eqrr') && eqrr(pre, post, instr)) {
        possible.push('eqrr');
    }
    if (possible.length === 1) {
        predictions[instr[0]] = possible[0];
    }
    return valid;
}

const solve_dec_16_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec16.txt', 'utf8');
        const lines = data.split('\n');
        let pre = [];
        let post = [];
        let instr = [];
        let predictions: string[] = [];
        for (let i = 0; i < 16; i++) {
            predictions.push('');
        }
        while (predictions.filter(o => o === '').length > 0) {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().length === 0) {
                    pre = [];
                    post = [];
                    instr = [];
                } else if (lines[i].startsWith('Before')) {
                    let line = lines[i].replace('Before: ', '');
                    pre = JSON.parse(line);
                } else if (lines[i].startsWith('After')) {
                    let line = lines[i].replace('After: ', '');
                    post = JSON.parse(line);
                    evaluateAndSolve(pre, post, instr, predictions);
                } else {
                    instr = lines[i].split(' ').map(o => parseInt(o));
                }
            }
        }
        console.log(predictions);
        let programData = fs.readFileSync('src/test.dec16.part2.txt', 'utf8');
        const programLines = programData.split('\n');
        let registers = [0, 0, 0, 0];
        for (let i = 0; i < programLines.length; i++) {
            let instr = programLines[i].split(' ').map(o => parseInt(o));
            if (predictions[instr[0]] === 'addr') addrFunc(registers, instr);
            if (predictions[instr[0]] === 'addi') addiFunc(registers, instr);
            if (predictions[instr[0]] === 'multr') multrFunc(registers, instr);
            if (predictions[instr[0]] === 'multi') multiFunc(registers, instr);
            if (predictions[instr[0]] === 'banr') banrFunc(registers, instr);
            if (predictions[instr[0]] === 'bani') baniFunc(registers, instr);
            if (predictions[instr[0]] === 'borr') borrFunc(registers, instr);
            if (predictions[instr[0]] === 'bori') boriFunc(registers, instr);
            if (predictions[instr[0]] === 'setr') setrFunc(registers, instr);
            if (predictions[instr[0]] === 'seti') setiFunc(registers, instr);
            if (predictions[instr[0]] === 'gtir') gtirFunc(registers, instr);
            if (predictions[instr[0]] === 'gtri') gtriFunc(registers, instr);
            if (predictions[instr[0]] === 'gtrr') gtrrFunc(registers, instr);
            if (predictions[instr[0]] === 'eqir') eqirFunc(registers, instr);
            if (predictions[instr[0]] === 'eqri') eqriFunc(registers, instr);
            if (predictions[instr[0]] === 'eqrr') eqrrFunc(registers, instr);
        }
        console.log(registers);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




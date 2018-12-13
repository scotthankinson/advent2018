"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel } from 'typescript';

const start = (): void => {

    solve_dec_13_pt1();
    solve_dec_13_pt2();
};

module.exports = {
    start
};

const solve_dec_13_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let carts = [];
        for (let i = 0; i < lines.length; i++) {
            while (lines[i].indexOf('>') > -1) {
                let index = lines[i].indexOf('>');
                carts.push({ 'xPos': lines[i].indexOf('>'), 'yPos': i, 'lastTurn': 'right', 'symbol': '>' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '-';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('<') > -1) {
                let index = lines[i].indexOf('<');
                carts.push({ 'xPos': lines[i].indexOf('<'), 'yPos': i, 'lastTurn': 'right', 'symbol': '<' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '-';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('^') > -1) {
                let index = lines[i].indexOf('^');
                carts.push({ 'xPos': lines[i].indexOf('^'), 'yPos': i, 'lastTurn': 'right', 'symbol': '^' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '|';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('v') > -1) {
                let index = lines[i].indexOf('v');
                carts.push({ 'xPos': lines[i].indexOf('v'), 'yPos': i, 'lastTurn': 'right', 'symbol': 'v' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '|';
                lines[i] = cleanLine.join('');
            }
        }
        for (let t = 0; t < 10000000; t++) {
            let collision = false;
            carts = carts.sort((a, b) => {
                if (a.yPos < b.yPos) return -1;
                if (a.yPos > b.yPos) return 1;
                if (a.xPos < b.xPos) return -1;
                if (a.xPos > b.xPos) return 1;
                return 0;
            });
            for (let i = 0; i < carts.length; i++) {
                moveCart(carts[i], lines);
                if (checkCollisions(carts)) {
                    collision = true;
                    console.log('Boom! ' + t);
                    break;
                }
            }
            if (collision) break;
        }
        console.log(carts);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const checkCollisions = (carts): boolean => {
    for (let i = 0; i < carts.length; i++) {
        for (let j = 0; j < carts.length; j++) {
            if (i === j) continue;
            if (carts[i].xPos === carts[j].xPos && carts[i].yPos === carts[j].yPos) {
                carts[i].symbol = 'X';
                carts[j].symbol = 'X';
                return true;
            }
        }
    }
    return false;
}
const pruneCollisions = (carts) => {
    for (let i = 0; i < carts.length; i++) {
        for (let j = 0; j < carts.length; j++) {
            if (i === j) continue;
            if (carts[i].xPos === carts[j].xPos && carts[i].yPos === carts[j].yPos) {
                carts[i].symbol = 'X';
                carts[j].symbol = 'X';
            }
        }
    }
    return carts.filter(a => a.symbol !== 'X');
}

const moveCart = (cart, track) => {
    if (cart.symbol === 'X') return;
    let point = { 'xPos': cart.xPos, 'yPos': cart.yPos };
    if (cart.symbol === '>') point.xPos += 1;
    if (cart.symbol === '<') point.xPos -= 1;
    if (cart.symbol === '^') point.yPos -= 1;
    if (cart.symbol === 'v') point.yPos += 1;
    let trackPiece = track[point.yPos].split('')[point.xPos];
    cart.xPos = point.xPos;
    cart.yPos = point.yPos;
    if (trackPiece === '|' || trackPiece === '-') {
        // Nothing to do
    } else if (cart.symbol === '>') {
        if (trackPiece === '\\') cart.symbol = 'v';
        else if (trackPiece === '/') cart.symbol = '^';
        else {
            if (cart.lastTurn === 'right') {
                cart.symbol = '^';
                cart.lastTurn = 'left';
            } else if (cart.lastTurn === 'left') {
                cart.lastTurn = 'straight';
            } else if (cart.lastTurn === 'straight') {
                cart.symbol = 'v';
                cart.lastTurn = 'right';
            }
        }
    } else if (cart.symbol === '<') {
        if (trackPiece === '/') cart.symbol = 'v';
        else if (trackPiece === '\\') cart.symbol = '^';
        else {
            if (cart.lastTurn === 'right') {
                cart.symbol = 'v';
                cart.lastTurn = 'left';
            } else if (cart.lastTurn === 'left') {
                cart.lastTurn = 'straight';
            } else if (cart.lastTurn === 'straight') {
                cart.symbol = '^';
                cart.lastTurn = 'right';
            }
        }
    } else if (cart.symbol === '^') {
        if (trackPiece === '\\') cart.symbol = '<';
        else if (trackPiece === '/') cart.symbol = '>';
        else {
            if (cart.lastTurn === 'right') {
                cart.symbol = '<';
                cart.lastTurn = 'left';
            } else if (cart.lastTurn === 'left') {
                cart.lastTurn = 'straight';
            } else if (cart.lastTurn === 'straight') {
                cart.symbol = '>';
                cart.lastTurn = 'right';
            }
        }
    } else if (cart.symbol === 'v') {
        if (trackPiece === '/') cart.symbol = '<';
        else if (trackPiece === '\\') cart.symbol = '>';
        else {
            if (cart.lastTurn === 'right') {
                cart.symbol = '>';
                cart.lastTurn = 'left';
            } else if (cart.lastTurn === 'left') {
                cart.lastTurn = 'straight';
            } else if (cart.lastTurn === 'straight') {
                cart.symbol = '<';
                cart.lastTurn = 'right';
            }
        }
    }
}

const solve_dec_13_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let carts = [];
        for (let i = 0; i < lines.length; i++) {
            while (lines[i].indexOf('>') > -1) {
                let index = lines[i].indexOf('>');
                carts.push({ 'xPos': lines[i].indexOf('>'), 'yPos': i, 'lastTurn': 'right', 'symbol': '>' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '-';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('<') > -1) {
                let index = lines[i].indexOf('<');
                carts.push({ 'xPos': lines[i].indexOf('<'), 'yPos': i, 'lastTurn': 'right', 'symbol': '<' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '-';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('^') > -1) {
                let index = lines[i].indexOf('^');
                carts.push({ 'xPos': lines[i].indexOf('^'), 'yPos': i, 'lastTurn': 'right', 'symbol': '^' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '|';
                lines[i] = cleanLine.join('');
            }
            while (lines[i].indexOf('v') > -1) {
                let index = lines[i].indexOf('v');
                carts.push({ 'xPos': lines[i].indexOf('v'), 'yPos': i, 'lastTurn': 'right', 'symbol': 'v' });
                let cleanLine = lines[i].split('');
                cleanLine[index] = '|';
                lines[i] = cleanLine.join('');
            }
        }
        for (let t = 0; t < 10000000; t++) {
            carts = carts.sort((a, b) => {
                if (a.yPos < b.yPos) return -1;
                if (a.yPos > b.yPos) return 1;
                if (a.xPos < b.xPos) return -1;
                if (a.xPos > b.xPos) return 1;
                return 0;
            });
            for (let i = 0; i < carts.length; i++) {
                moveCart(carts[i], lines);
                if (checkCollisions(carts)) {
                    console.log('Boom! ' + t);
                }
            }
            carts = pruneCollisions(carts);
            console.log('Time = ' + t + ', ' + carts.length + ' still running');
            if (carts.length <= 1) {
                console.log("There can be only one!  " + t);
                console.log(carts);
                break;
            }
        }
        console.log(carts);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




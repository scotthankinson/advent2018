"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';

const start = (): void => {

    console.log(solve_dec_3_pt2());
};

module.exports = {
    start
};



const solve_dec_3_pt1 = () => {
    try {
        const data = fs.readFileSync('src/test.dec3.txt', 'utf8');
        const lines = data.split('\n');
        let map = {}; // Map of 1x1 squares
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split('@').join(',').split(':').join(',').split('x').join(',').split(',').map(value => value.trim());
            console.log("Claim " + parts[0] + "; X=" + parts[1] + ", Y=" + parts[2] + "; " + parts[3] + "x" + parts[4]);
            const claim = parts[0];
            const startX = parseInt(parts[1]);
            const startY = parseInt(parts[2]);
            const width = parseInt(parts[3]);
            const height = parseInt(parts[4]);
            for (let x = startX; x < startX + width; x++) {
                for (let y = startY; y < startY + height; y++) {
                    if (map[x + 'x' + y]) {
                        map[x + 'x' + y] = map[x + 'x' + y] + 1;
                    } else {
                        map[x + 'x' + y] = 1
                    }
                }
            }
        }
        let count = 0;
        for (let key in map) {
            if (map[key] > 1) {
                console.log(key);
                count = count + 1;
            }
        }
        return count;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_3_pt2 = () => {
    try {
        const data = fs.readFileSync('src/test.dec3.txt', 'utf8');
        const lines = data.split('\n');
        let map = {}; // Map of 1x1 squares
        let squares = [];
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split('@').join(',').split(':').join(',').split('x').join(',').split(',').map(value => value.trim());
            const claim = parts[0];
            const startX = parseInt(parts[1]);
            const startY = parseInt(parts[2]);
            const width = parseInt(parts[3]);
            const height = parseInt(parts[4]);
            squares.push({ claim, startX, startY, width, height });
            for (let x = startX; x < startX + width; x++) {
                for (let y = startY; y < startY + height; y++) {
                    if (map[x + 'x' + y]) {
                        map[x + 'x' + y] = map[x + 'x' + y] + 1;
                    } else {
                        map[x + 'x' + y] = 1
                    }
                }
            }
        }
        let winner = null;
        for (let i = 0; i < squares.length; i++) {
            if (check_square(map, squares[i])) {
                winner = squares[i];
                break;
            }
        }
        return winner;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const check_square = (map, square) => {
    console.log("Claim " + square.claim + "; X=" + square.startX + ", Y=" + square.startY + "; " + square.width + "x" + square.height);
    for (let x = square.startX; x < square.startX + square.width; x++) {
        for (let y = square.startY; y < square.startY + square.height; y++) {
            if (map[x + 'x' + y] > 1) {
                return false;
            }
        }
    }
    return true;
}

start();




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
        let data = fs.readFileSync('src/test.dec18.txt', 'utf8');
        const lines = data.split('\n');

        let map = [];
        for (let i = 0; i < lines.length; i++) {
            map.push(lines[i].split(''));
        }

        let results: any = {};
        for (let minutes = 1; minutes < 1000000001; minutes++) {
            let changes = [];
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    let current = map[y][x];
                    let neighbors = getNeighbors(map, x, y);
                    changes.push({ "xPos": x, "yPos": y, "symbol": current, "neighbors": neighbors });
                }
            }
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].symbol === '.') {
                    if (changes[i].neighbors.filter(o => o === "|").length >= 3) {
                        map[changes[i].yPos][changes[i].xPos] = "|";
                    }
                } else if (changes[i].symbol === '|') {
                    if (changes[i].neighbors.filter(o => o === "#").length >= 3) {
                        map[changes[i].yPos][changes[i].xPos] = "#";
                    }
                } else if (changes[i].symbol === '#') {
                    if (changes[i].neighbors.filter(o => o === "#").length >= 1
                        && changes[i].neighbors.filter(o => o === "|").length >= 1) {
                        map[changes[i].yPos][changes[i].xPos] = "#";
                    } else {
                        map[changes[i].yPos][changes[i].xPos] = ".";
                    }
                }
            }
            // for (let y = 0; y < map.length; y++) {
            //    console.log(map[y].join(''));
            //}


            let wood = 0;
            let lumberyard = 0;
            for (let i = 0; i < map.length; i++) {
                wood += map[i].filter(o => o === '|').length;
                lumberyard += map[i].filter(o => o === '#').length;
            }
            if (!results[wood * lumberyard]) results[wood * lumberyard] = [];
            results[wood * lumberyard].push(minutes);
            if (minutes % 1000 === 0) {
                console.log(minutes);
                // console.log(results)
            };
            if (minutes === 8000) {
                console.log("Minute 8000: " + (wood * lumberyard));
            }
            // console.log("Minute " + minutes);
            // console.log(wood * lumberyard);
        }
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getNeighbors = (map, xPos, yPos) => {
    // console.log("Eval (" + xPos + "," + yPos + ")");
    let neighbors = [];
    if (xPos - 1 >= 0 && yPos - 1 >= 0) {
        neighbors.push(map[yPos - 1][xPos - 1]);
        // console.log('1');
    }
    if (yPos - 1 >= 0) {
        neighbors.push(map[yPos - 1][xPos]);
        // console.log(2);
    }
    if (yPos - 1 >= 0 && xPos + 1 < map[0].length) {
        neighbors.push(map[yPos - 1][xPos + 1]);
        // console.log(3);
    }
    if (xPos - 1 >= 0) {
        neighbors.push(map[yPos][xPos - 1]);
        // console.log(4);
    }
    if (xPos + 1 < map[0].length) {
        neighbors.push(map[yPos][xPos + 1]);
        // console.log(5);
    }
    if (yPos + 1 < map.length && xPos - 1 >= 0) {
        neighbors.push(map[yPos + 1][xPos - 1]);
        // console.log(6);
    }
    if (yPos + 1 < map.length) {
        neighbors.push(map[yPos + 1][xPos]);
        // console.log(7);
    }
    if (yPos + 1 < map.length && xPos + 1 < map[0].length) {
        neighbors.push(map[yPos + 1][xPos + 1]);
        // console.log(8);
    }
    // console.log(neighbors);
    return neighbors;
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




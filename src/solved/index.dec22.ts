"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    // 972 --> Too Low
    solve_dec_22_pt2();
};

module.exports = {
    start
};
const caveDepth = 5913;
const xPosTarget = 8;
const yPosTarget = 701;
//const caveDepth = 510;
//const xPosTarget = 10;
//const yPosTarget = 10;
const bounds = Math.max(xPosTarget, yPosTarget) * 2;

const solve_dec_22_pt1 = () => {
    try {
        //let data = fs.readFileSync('src/test.dec19.txt', 'utf8');
        //const lines = data.split('\n');
        let map: any = {};
        map['0,0'] = getCoord(0, 0, map);
        map[xPosTarget + ',' + yPosTarget] = getCoord(xPosTarget, yPosTarget, map);
        for (let i = 1; i <= bounds; i++) {
            // console.log(map);
            for (let x = i; x <= bounds; x++) {
                map[x + ',' + (i - 1)] = getCoord(x, i - 1, map);
            }
            for (let y = i; y <= bounds; y++) {
                map[(i - 1) + ',' + y] = getCoord(i - 1, y, map);
            }
            if (i + ',' + i !== (xPosTarget + ',' + yPosTarget)) map[i + ',' + i] = getCoord(i, i, map);
        }

        let risk = 0;
        for (let y = 0; y <= yPosTarget; y++) {
            let row = [];
            for (let x = 0; x <= xPosTarget; x++) {
                row.push(map[x + ',' + y].symbol);
                let type = map[x + ',' + y].type;
                if (type === 'wet') risk += 1;
                if (type === 'narrow') risk += 2;
            }
            console.log(row.join(''));
        }
        console.log(risk);
        // console.log(map);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getCoord = (xPos, yPos, map) => {
    // console.log("Coords: " + xPos + "," + yPos);
    let geologicIndex = 0;
    let erosionLevel = 0;
    let symbol = '';
    let type = '';
    let equipment = [];
    if (xPos === 0 && yPos === 0) {
        symbol = 'M';
        erosionLevel = caveDepth % 20183;
    } else if (xPos === xPosTarget && yPos === yPosTarget) {
        symbol = 'T';
        erosionLevel = caveDepth % 20183;
    } else if (yPos === 0) {
        geologicIndex = xPos * 16807;
    } else if (xPos === 0) {
        geologicIndex = yPos * 48271;
    } else {
        let ero1 = map[(parseInt(xPos) - 1) + ',' + yPos].erosionLevel;
        let ero2 = map[xPos + ',' + (parseInt(yPos) - 1)].erosionLevel;
        geologicIndex = ero1 * ero2;
    }
    if (symbol !== 'T' && symbol !== 'M')
        erosionLevel = (geologicIndex + caveDepth) % 20183;
    if (erosionLevel % 3 === 0) {
        type = 'rocky';
        symbol = symbol === '' ? '.' : symbol;
        equipment = ['climbing gear', 'torch'];
    } else if (erosionLevel % 3 === 1) {
        type = 'wet';
        symbol = symbol === '' ? '=' : symbol;
        equipment = ['climbing gear', 'neither'];
    } else {
        type = 'narrow';
        symbol = symbol === '' ? '|' : symbol;
        equipment = ['torch', 'neither'];
    }
    return { symbol, type, erosionLevel, geologicIndex, equipment, 'distance': 0, xPos, yPos };
}

const solve_dec_22_pt2 = () => {
    try {
        let map: any = {};
        map['0,0'] = getCoord(0, 0, map);
        map[xPosTarget + ',' + yPosTarget] = getCoord(xPosTarget, yPosTarget, map);
        for (let i = 1; i <= bounds; i++) {
            for (let x = i; x <= bounds; x++) {
                map[x + ',' + (i - 1)] = getCoord(x, i - 1, map);
            }
            for (let y = i; y <= bounds; y++) {
                map[(i - 1) + ',' + y] = getCoord(i - 1, y, map);
            }
            if (i + ',' + i !== (xPosTarget + ',' + yPosTarget)) map[i + ',' + i] = getCoord(i, i, map);
        }

        printMap(map);
        let moveQueue = [{ xPos: 0, yPos: 0, 'equip': 'torch', 'distance': 0 }]
        let history = { '0,0,torch': 0 };
        let counter = 0;
        while (moveQueue.length > 0) {
            counter++;
            moveQueue.sort((a, b) => {
                return a.distance - b.distance;
            });
            let move = moveQueue.shift();
            if (counter % 1000 === 0) {
                console.log(counter + ': ' + JSON.stringify(move));
                console.log(moveQueue.length);
            }
            // List is getting too big & slow, can we prune known worse moves?
            let prune = [];
            for (let i = moveQueue.length - 1; i >= 0; i--) {
                if (moveQueue[i].xPos == move.xPos
                    && moveQueue[i].yPos == move.yPos
                    && moveQueue[i].equip == move.equip
                    && moveQueue[i].distance >= move.distance) {
                    prune.push(i);
                }
            }
            prune.forEach(index => moveQueue.splice(index, 1));

            if (history[move.xPos + ',' + move.yPos + ',' + move.equip]
                && history[move.xPos + ',' + move.yPos + ',' + move.equip] < move.distance) {
                continue;
            }
            history[move.xPos + ',' + move.yPos + ',' + move.equip] = move.distance;
            if (move.xPos === xPosTarget && move.yPos === yPosTarget && move.equip === 'torch') {
                console.log(move);
                break;
            }

            // North
            if (move.yPos - 1 > 0) {
                // Terrain matches equipment
                if (map[move.xPos + ',' + (move.yPos - 1)].equipment.filter(o => o === move.equip).length > 0) {
                    moveQueue.push({ xPos: move.xPos, yPos: move.yPos - 1, 'equip': move.equip, 'distance': move.distance + 1 });
                }
            }
            // South
            if (move.yPos + 1 <= bounds) {
                // Terrain matches equipment
                if (map[move.xPos + ',' + (move.yPos + 1)].equipment.filter(o => o === move.equip).length > 0) {
                    let dist = move.distance + 1;
                    moveQueue.push({ xPos: move.xPos, yPos: move.yPos + 1, 'equip': move.equip, 'distance': move.distance + 1 });
                }
            }
            // East
            if (move.xPos + 1 <= bounds) {
                // Terrain matches equipment
                if (map[(move.xPos + 1) + ',' + move.yPos].equipment.filter(o => o === move.equip).length > 0) {
                    let dist = move.distance + 1;
                    moveQueue.push({ xPos: move.xPos + 1, yPos: move.yPos, 'equip': move.equip, 'distance': move.distance + 1 });
                }
            }
            // West
            if (move.xPos - 1 > 0) {
                // Terrain matches equipment
                if (map[(move.xPos - 1) + ',' + move.yPos].equipment.filter(o => o === move.equip).length > 0) {
                    let dist = move.distance + 1;
                    moveQueue.push({ xPos: move.xPos - 1, yPos: move.yPos, 'equip': move.equip, 'distance': move.distance + 1 });
                }
            }
            // Try swapping in place
            let gear = ['neither', 'torch', 'climbing gear'].filter(o => o != move.equip);
            moveQueue.push({ xPos: move.xPos, yPos: move.yPos, 'equip': gear[0], 'distance': move.distance + 7 });
            moveQueue.push({ xPos: move.xPos, yPos: move.yPos, 'equip': gear[1], 'distance': move.distance + 7 });

        }
        // printMapped(map, history);
        // printMappedDist(map, history);
        console.log(history[xPosTarget + ',' + yPosTarget + ',torch']);
        // console.log(moveQueue);
        // console.log(history);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const printMap = (map) => {
    for (let y = 0; y <= bounds; y++) {
        let row = [];
        for (let x = 0; x <= bounds; x++) {
            row.push(map[x + ',' + y].symbol);
        }
        console.log(row.join(''));
    }
}
const printMapped = (map, history) => {
    for (let y = 0; y <= bounds; y++) {
        let row = [];
        for (let x = 0; x <= bounds; x++) {
            if (history[x + ',' + y + ',torch'] || history[x + ',' + y + ',neither'] || history[x + ',' + y + ',climbing gear'])
                row.push(map[x + ',' + y].symbol);
            else
                row.push(' ');
        }
        if (y === 0) row[0] = 'M';
        console.log(row.join(''));
    }
}

const printMappedDist = (map, history) => {
    for (let y = 0; y <= bounds; y++) {
        let row = [];
        for (let x = 0; x <= bounds; x++) {
            let dist = 10000;
            dist = history[x + ',' + y + ',torch'] && history[x + ',' + y + ',torch'] < dist ? history[x + ',' + y + ',torch'] : dist;
            dist = history[x + ',' + y + ',neither'] && history[x + ',' + y + ',neither'] < dist ? history[x + ',' + y + ',neither'] : dist;
            dist = history[x + ',' + y + ',climbing gear'] && history[x + ',' + y + ',climbing gear'] < dist ? history[x + ',' + y + ',climbing gear'] : dist;
            if (dist === 10000) dist = 0;
            if (dist > 9)
                row.push('[' + dist + ']');
            else if (dist > 0)
                row.push('[ ' + dist + ']');
            else
                row.push('[  ]');
        }
        if (y === 0) row[0] = '[ M]';
        console.log(row.join(''));
    }
}

start();




"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

const start = (): void => {
    // 9310 -- Too High
    solve_dec_20_pt1();
};

module.exports = {
    start
};

const solve_dec_20_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec20.txt', 'utf8');
        const lines = data.split('\n');
        let input = data.substring(1, data.length - 1);

        let letters = input.split('');
        let map: any = {};
        map["0,0"] = { 'symbol': 'X', 'distance': 0 };
        let savePoints = [{ 'xPos': 0, 'yPos': 0 }];
        let xPos = 0
        let yPos = 0;
        let maxX = 0;
        let maxY = 0;
        let minX = 0;
        let minY = 0;
        let distance = 0;
        let maxDistance = 0;
        for (let i = 0; i < letters.length; i++) {
            if (letters[i] === '(') {
                savePoints.push({ 'xPos': xPos, 'yPos': yPos });
            } else if (letters[i] === ')') {
                const point = savePoints.pop();
                xPos = point.xPos;
                yPos = point.yPos;
            } else if (letters[i] === '|') {
                const point = savePoints[savePoints.length - 1];
                xPos = point.xPos;
                yPos = point.yPos;
                distance = map[xPos + ',' + yPos].distance;
            } else {
                distance += 1;
                if (letters[i] === 'W') {
                    xPos -= 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '|' };

                    xPos -= 1;
                    if (!map[xPos + ',' + yPos]) {
                        map[xPos + ',' + yPos] = { 'symbol': '.', 'distance': distance };
                    } else {
                        if (map[xPos + ',' + yPos].distance > distance) {
                            map[xPos + ',' + yPos].distance = distance;
                        } else if (map[xPos + ',' + yPos].distance !== 0) {
                            distance = map[xPos + ',' + yPos].distance;
                        }
                    }
                } else if (letters[i] === 'E') {
                    xPos += 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '|' };

                    xPos += 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '.', 'distance': distance };
                    else {
                        if (map[xPos + ',' + yPos].distance > distance) {
                            map[xPos + ',' + yPos].distance = distance;
                        } else {
                            distance = map[xPos + ',' + yPos].distance;
                        }
                    }
                } else if (letters[i] === 'N') {
                    yPos -= 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '-' };

                    yPos -= 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '.', 'distance': distance };
                    else {
                        if (map[xPos + ',' + yPos].distance > distance) {
                            map[xPos + ',' + yPos].distance = distance;
                        } else {
                            distance = map[xPos + ',' + yPos].distance;
                        }
                    }

                } else {
                    yPos += 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '-' };

                    yPos += 1;
                    if (!map[xPos + ',' + yPos])
                        map[xPos + ',' + yPos] = { 'symbol': '.', 'distance': distance };
                    else {
                        if (map[xPos + ',' + yPos].distance > distance) {
                            map[xPos + ',' + yPos].distance = distance;
                        } else {
                            distance = map[xPos + ',' + yPos].distance;
                        }
                    }

                }
                maxX = xPos > maxX ? xPos : maxX;
                minX = xPos < minX ? xPos : minX;
                maxY = yPos > maxY ? yPos : maxY;
                minY = yPos < minY ? yPos : minY;
                maxDistance = maxDistance < distance ? distance : maxDistance;
            }
        }

        let thousandCount = 0;
        let arrayMap = [];
        for (let y = minY; y <= maxY; y++) {
            let row = [];
            for (let x = minX; x <= maxX; x++) {
                if (map[x + ',' + y]) {
                    row.push(map[x + ',' + y].symbol);
                    if (map[x + ',' + y].distance >= 1000) thousandCount++;
                } else
                    row.push('#');
            }
            arrayMap.push(row);
            console.log(row.join(''));
        }

        console.log(maxDistance);
        console.log(thousandCount);
        // console.log([minX, minY, maxX, maxY]);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_20_pt2 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec20.txt', 'utf8');
        const lines = data.split('\n');
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




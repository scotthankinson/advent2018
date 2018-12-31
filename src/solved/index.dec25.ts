"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    solve_dec_25_pt1();
};

module.exports = {
    start
};

const solve_dec_25_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec25.txt', 'utf8');
        const lines = data.split('\n');
        let points = [];
        for (let i = 0; i < lines.length; i++) {
            let values = lines[i].split(',').map(o => parseInt(o));
            points.push({ 'x': values[0], 'y': values[1], 'z': values[2], 't': values[3] });
        }
        let constellations = [];
        for (let i = 0; i < points.length; i++) {
            let added = new Set();
            for (let j = 0; j < constellations.length; j++) {

                // console.log(points[i]);
                // console.log(constellations[j]);
                constellations[j].forEach(conPoint => {
                    let dist = Math.abs(conPoint.x - points[i].x)
                        + Math.abs(conPoint.y - points[i].y)
                        + Math.abs(conPoint.z - points[i].z)
                        + Math.abs(conPoint.t - points[i].t);
                    if (dist <= 3) {
                        added.add(j);
                        constellations[j].add(points[i]);
                    }
                });
            }
            if (added.size === 0) {
                added.add(points[i]);
                constellations.push(added);
            } else if (added.size > 1) {
                let indexes = Array.from(added).sort((a, b) => b - a);
                let combo = Array.from(constellations.splice(indexes.shift(), 1)[0]);
                while (indexes.length > 0) {
                    combo = combo.concat(Array.from(constellations.splice(indexes.shift(), 1)[0]));
                }
                constellations.push(new Set(combo));
            }
        }
        // console.log(constellations);
        console.log(constellations.length);


        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_25_pt2 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec25.txt', 'utf8');
        const lines = data.split('\n');

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




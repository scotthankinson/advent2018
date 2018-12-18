"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    // Guesses:      2795 -- Too Low
    //              30371 -- Too Low
    //              30382 -- Too High
    solve_dec_17_pt1();
};

module.exports = {
    start
};

const solve_dec_17_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec17.txt', 'utf8');
        const lines = data.split('\n');
        let scan = [];
        let clayPoints = [];
        let bounds: any = { 'minX': 500, 'maxX': 500, 'minY': 0, 'maxY': 143 }
        for (let i = 0; i < lines.length; i++) {
            console.log(lines[i]);
            if (lines[i].startsWith('x=')) {
                // Vertical Clay
                let points = lines[i].split(',');
                console.log(points);
                console.log(points[1].trim().split('..')[0]);
                let xPos = parseInt(points[0].replace('x=', ''));
                let yMin = parseInt(points[1].trim().split('..')[0].replace('y=', ''));
                let yMax = parseInt(points[1].trim().split('..')[1]);
                console.log(yMin + '..' + yMax);
                for (let y = yMin; y <= yMax; y++) {
                    clayPoints.push({ 'xPos': xPos, 'yPos': y });
                    if (y < bounds.minY) bounds.minY = y;
                    if (y > bounds.maxY) bounds.maxY = y;

                }
                if (xPos < bounds.minX) bounds.minX = xPos;
                if (xPos > bounds.maxX) bounds.maxX = xPos;
            } else if (lines[i].startsWith('y=')) {
                // Horizontal Clay
                let points = lines[i].split(',');
                let yPos = parseInt(points[0].replace('y=', ''));
                let xMin = parseInt(points[1].trim().split('..')[0].replace('x=', ''));
                let xMax = parseInt(points[1].trim().split('..')[1]);
                for (let x = xMin; x <= xMax; x++) {
                    clayPoints.push({ 'xPos': x, 'yPos': yPos });
                    if (x < bounds.minX) bounds.minX = x;
                    if (x > bounds.maxX) bounds.maxX = x;
                }
                if (yPos < bounds.minY) bounds.minY = yPos;
                if (yPos > bounds.maxY) bounds.maxY = yPos;

            }
        }
        console.log(bounds);
        bounds.minX -= 1;
        bounds.maxX += 1;
        bounds.maxY += 1;
        let map = [];
        for (let y = 0; y <= (bounds.maxY - bounds.minY); y++) {
            let row = [];
            for (let x = 0; x <= (bounds.maxX - bounds.minX); x++) {
                row.push('.');
            }
            map.push(row);
        }
        map[0][500 - bounds.minX] = '+';
        bounds['waterX'] = 500 - bounds.minX;
        bounds['waterY'] = 0;
        for (let i = 0; i < clayPoints.length; i++) {
            clayPoints[i].xPos -= bounds.minX;
            clayPoints[i].yPos -= bounds.minY;
            // console.log('setting ' + JSON.stringify(clayPoints[i]));
            map[clayPoints[i].yPos][clayPoints[i].xPos] = '#';
        }
        for (let i = 0; i < 207; i++) {
            resolveDrop(map, bounds.waterX, bounds.waterY + 1, bounds.maxY);
            console.log(i + ":" + map[map.length - 1].filter(a => a === '|' || a === '~').length);
        }
        let count = 0;
        for (let y = 3; y < map.length - 1; y++) {
            // map[y].shift();
            // map[y].pop();
            count += map[y].filter(a => a === '~').length;
        }
        console.log(map);
        console.log(count);

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const resolveDrop = (map, xPos, yPos, maxY) => {
    // console.log("(" + xPos + "," + yPos + ")");
    while (map[yPos][xPos] === '.' || map[yPos][xPos] === '|') {
        map[yPos][xPos] = "|";
        yPos += 1;

        if (yPos > maxY) {
            return;
        };
    }
    resolveSpread(map, xPos, yPos - 1, maxY);
}

const resolveSpread = (map, xPos, yPos, maxY) => {
    // Spread Left
    while ((map[yPos + 1][xPos] === '#' || map[yPos + 1][xPos] === '~')
        && (map[yPos][xPos] === '.' || map[yPos][xPos] === '|')) {
        map[yPos][xPos] = "|";
        xPos -= 1;
    }
    let leftBoundary = map[yPos][xPos] === '#';
    let leftX = xPos;
    let leftY = yPos;
    let leftDrop = map[yPos + 1][xPos] === '#';
    // Spread Right
    xPos += 1;
    while ((map[yPos + 1][xPos] === '#' || map[yPos + 1][xPos] === '~')
        && (map[yPos][xPos] === '.' || map[yPos][xPos] === '|')) {
        map[yPos][xPos] = "|";
        xPos += 1;
    }
    let rightBoundary = map[yPos][xPos] === '#';
    let rightX = xPos;
    let rightY = yPos;
    if (leftBoundary && rightBoundary) {
        xPos -= 1;
        while ((map[yPos + 1][xPos] === '#' || map[yPos + 1][xPos] === '~')
            && (map[yPos][xPos] === '.' || map[yPos][xPos] === '|')) {
            map[yPos][xPos] = "~";
            xPos -= 1;
        }
    }
    if (!rightBoundary) {
        resolveDrop(map, rightX, rightY, maxY);
    }
    if (!leftBoundary) {
        resolveDrop(map, leftX, leftY, maxY);
    }

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




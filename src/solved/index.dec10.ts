"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {

    solve_dec_10_pt1();
    //  solve_dec_10_pt2();
};

module.exports = {
    start
};

const solve_dec_10_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');
        const points = [];
        for (let i = 0; i < lines.length; i++) {
            let base = lines[i];
            let point = { 'xPos': 0, 'yPos': 0, 'xVel': 0, 'yVel': 0 };
            base = base.slice(base.indexOf('<') + 1);
            point.xPos = parseInt(base.substring(0, base.indexOf(',')).trim());
            base = base.slice(base.indexOf(',') + 1);
            point.yPos = parseInt(base.substring(0, base.indexOf('>')).trim());
            base = base.slice(base.indexOf('>') + 1);

            base = base.slice(base.indexOf('<') + 1);
            point.xVel = parseInt(base.substring(0, base.indexOf(',')).trim());
            base = base.slice(base.indexOf(',') + 1);
            point.yVel = parseInt(base.substring(0, base.indexOf('>')).trim());
            points.push(point);
        }

        // console.log(points);
        let timeCounter = new Date().getTime();
        let currentTime = timeCounter;
        let ticked = new Set();
        let ticks = 0;
        while (currentTime - timeCounter < 120000) {
            if ((currentTime - timeCounter) % 2 === 0 && !ticked.has(currentTime - timeCounter)) {
                ticked.add(currentTime - timeCounter);
                ticks = ticks + 1;
                let size = drawGrid(points);
                if (size.height === 62 && size.width === 76) break;
                console.log(size);
                for (let i = 0; i < points.length; i++) {
                    points[i].xPos += points[i].xVel;
                    points[i].yPos += points[i].yVel;
                }
            }
            currentTime = new Date().getTime();
        }
        console.log(ticks);

        // drawGrid(points);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const drawGrid = (input) => {
    let maxX = -100, minX = 100;
    let maxY = -100, minY = 100;
    for (let i = 0; i < input.length; i++) {
        if (input[i].xPos > maxX) maxX = input[i].xPos;
        if (input[i].xPos < minX) minX = input[i].xPos;
        if (input[i].yPos > maxY) maxY = input[i].yPos;
        if (input[i].yPos < minY) minY = input[i].yPos;
    }
    let size = { 'width': maxX - minX, 'height': maxY - minY };
    /*
    if (size.width > 250 || size.height > 250) return size;
    for (let y = minY; y <= maxY; y++) {
        let line = "";
        for (let x = minX; x <= maxX; x++) {
            let point = input.filter(value => value.xPos === x && value.yPos === y);
            line += point.length > 0 ? "#" : ".";
        }
        console.log(line);
    }
    */
    return size;
}

const solve_dec_10_pt2 = () => {
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




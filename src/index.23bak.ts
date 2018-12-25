"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    solve_dec_23_pt2();
};

module.exports = {
    start
};

const solve_dec_23_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec23.txt', 'utf8');
        const lines = data.split('\n');
        let bots = [];
        let maxRadius = 0;
        let bestBot;
        for (let i = 0; i < lines.length; i++) {
            const startBracket = lines[i].indexOf('<');
            const endBracket = lines[i].indexOf('>');
            let pos = lines[i].substring(startBracket + 1, endBracket).split(',');
            let radius = parseInt(lines[i].split('=')[2]);
            let newBot = { 'xPos': pos[0], 'yPos': pos[1], 'zPos': pos[2], radius, 'strength': 0 };
            if (newBot.radius > maxRadius) {
                maxRadius = newBot.radius;
                bestBot = newBot;
            }
            bots.push(newBot);
        }
        let strength = 0;
        for (let i = 0; i < bots.length; i++) {
            const dist = Math.abs(bots[i].xPos - bestBot.xPos) + Math.abs(bots[i].yPos - bestBot.yPos) + Math.abs(bots[i].zPos - bestBot.zPos);
            if (dist <= bestBot.radius) {
                bestBot.strength++;
            }
        }

        console.log(bestBot);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_23_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec23.txt', 'utf8');
        const lines = data.split('\n');
        let bots = [];
        for (let i = 0; i < lines.length; i++) {
            const startBracket = lines[i].indexOf('<');
            const endBracket = lines[i].indexOf('>');
            let pos = lines[i].substring(startBracket + 1, endBracket).split(',');
            let radius = parseInt(lines[i].split('=')[2]);
            let newBot = { 'xPos': parseInt(pos[0]), 'yPos': parseInt(pos[1]), 'zPos': parseInt(pos[2]), radius, 'strength': 0 };
            bots.push(newBot);
        }
        // #1 Iterate all the coordinates from minX to maxX/minY to maxY/minZ to maxZ?  tooooo slooooow
        // #2 Only include coordinates that are in range of at least one nanobot?  tooooo slooooow
        // #3 TODO: Calculate the number of nanobots in range of each nanobot and hit the hot clusters?
        let pointSet = new Set();
        for (let i = 0; i < bots.length; i++) {
            console.log('Bot ' + i + ', Radius ' + bots[i].radius + ', Points PRE: ' + pointSet.size);
            addSphere(bots[i].xPos, bots[i].yPos, bots[i].zPos, bots[i].radius, pointSet);
            console.log('Bot ' + i + ', Radius ' + bots[i].radius + ', Points POST: ' + pointSet.size);
        }
        console.log(pointSet.size);
        const result = Array.from(pointSet);
        let maxInRange = 0;
        let maxInRangers = [];
        for (let i = 0; i < result.length; i++) {
            let inRange = 0;
            let point = result[i].split(',').map(o => parseInt(o));
            for (let j = 0; j < bots.length; j++) {
                const dist = Math.abs(point[0] - bots[j].xPos)
                    + Math.abs(point[1] - bots[j].yPos)
                    + Math.abs(point[2] - bots[j].zPos);
                if (dist <= bots[j].radius) inRange += 1;
            }
            if (inRange > maxInRange) {
                console.log("A new champion!");
                console.log(result[i]);
                maxInRange = inRange;
                maxInRangers = [result[i]];
            } else if (inRange === maxInRange) {
                maxInRangers.push(result[i]);
            }
        }
        console.log(maxInRange);
        console.log(maxInRangers);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const addSphere = (xPos, yPos, zPos, radius, set) => {
    for (let x = xPos - radius; x <= xPos + radius; x++) {
        for (let y = yPos - radius; y <= yPos + radius; y++) {
            for (let z = zPos - radius; z <= zPos + radius; z++) {
                const dist = Math.abs(xPos - x) + Math.abs(yPos - y) + Math.abs(zPos - z);
                if (dist <= radius) set.add(x + ',' + y + ',' + z);
            }
        }
    }
}

start();




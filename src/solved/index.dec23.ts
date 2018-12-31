"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    // solve_dec_23_pt1();
    // Check all X,Y,Z will take....forever?
    // Check only points in range of bots...gave up after 3
    // Condense the coordinates?
    //    114458465 --> Too Low, expand search ranges, use round instead of floor
    //    Blowing the stack with MaxInRangePoint[], just save the min/max
    // X-Range [-115683028, 270281798]  
    // Y-Range [-177182086, 124243889]
    // Z-Range [-64325967, 169358240]

    // Collapse by 1,000,000     
    // solve_dec_23_pt2(1000000, -115, 271, -177, 125, -64, 170);
    //--> Max 886, { minX: 49, maxX: 53, minY: 11, maxY: 17, minZ: 41, maxZ: 46 }

    // Collapse by 100,000 -->              480 to 540, 100 to 180, 400 to 470
    // solve_dec_23_pt2(100000, 480, 540, 100, 180, 400, 470);
    //--> Max 914, { minX: 522, maxX: 522, minY: 113, maxY: 175, minZ: 406, maxZ: 468 }

    // Collapse by 10,000 -->               5200 to 5240, 1120 to 1760, 4050 to 4690
    // solve_dec_23_pt2(10000, 5200, 5240, 1120, 1760, 4050, 4690);
    //--> Max 881 { minX: 5218, maxX: 5218, minY: 1288, maxY: 1753, minZ: 4217, maxZ: 4682 }

    // Collapse by 1,000 -->                52170 to 52190, 12830 to 17580, 42120 to 46870 
    //--> Max 888 { minX: 52170, maxX: 52177, minY: 12830, maxY: 17543, minZ: 42120, maxZ: 46828 }  
    // solve_dec_23_pt2(1000, 52140, 52180, 12800, 17550, 42100, 46840);
    //--> slide range, hit lower  X/Y/Z,
    //--> Max 888 { minX: 52177, maxX: 52177,  minY: 17543,  maxY: 17543,  minZ: 46828,  maxZ: 46828 } 116548

    // Collapse by 100 -->                  521760 to 521780, 175420 to 175440, 468270 to 468290
    // solve_dec_23_pt2(100, 521760, 521780, 175420, 175440, 468270, 468290);
    //-->945 { minX: 521761,  maxX: 521761,  minY: 175432,  maxY: 175432,  minZ: 468286,  maxZ: 468286 } 1165479

    // Collapse by 10 -->                   5217600 to 5217620, 1754310 to 1754330, 4682850 to 4682870
    // solve_dec_23_pt2(10, 5217600, 5217620, 1754310, 1754330, 4682850, 4682870);
    //-->968 { minX: 5217605,  maxX: 5217605,  minY: 1754322,  maxY: 1754322,  minZ: 4682867,  maxZ: 4682867 } 11654794

    // Collapse by nada                     52176040 to 52176060, 17543210 to 17543230, 46828660 to 46828680
    solve_dec_23_pt2(1, 52176040, 52176060, 17543210, 17543230, 46828660, 46828680);
    //--> 973 { minX: 52176047,  maxX: 52176047,  minY: 17543225,  maxY: 17543225,  minZ: 46828677,  maxZ: 46828677 } 116547949

};

module.exports = {
    start
};


const solve_dec_23_pt2 = (scrunch, minX, maxX, minY, maxY, minZ, maxZ) => {
    try {
        let data = fs.readFileSync('src/test.dec23.txt', 'utf8');
        const lines = data.split('\n');
        let bots = [];
        for (let i = 0; i < lines.length; i++) {
            const startBracket = lines[i].indexOf('<');
            const endBracket = lines[i].indexOf('>');
            let pos = lines[i].substring(startBracket + 1, endBracket).split(',');
            let radius = Math.round(parseInt(lines[i].split('=')[2]) / scrunch);
            let newBot = { 'xPos': Math.round(parseInt(pos[0]) / scrunch), 'yPos': Math.round(parseInt(pos[1]) / scrunch), 'zPos': Math.round(parseInt(pos[2]) / scrunch), radius, 'strength': 0 };
            bots.push(newBot);
        }
        // console.log([minX, maxX, minY, maxY, minZ, maxZ]);
        let maxInRange = 0;
        let maxInRangeDist = 0;
        let newSearch = null;
        for (let x = minX; x <= maxX; x++) {
            console.log("Processing x:" + x);
            for (let y = minY; y <= maxY; y++) {
                if (y % 100 === 0) console.log("Processing y:" + y);
                for (let z = minZ; z <= maxZ; z++) {
                    if (newSearch === null) {
                        newSearch = { minX: x, maxX: x, minY: y, maxY: y, minZ: z, maxZ: z };
                    }
                    let inRange = 0;
                    for (let i = 0; i < bots.length; i++) {
                        const dist = Math.abs(bots[i].xPos - x) + Math.abs(bots[i].yPos - y) + Math.abs(bots[i].zPos - z);
                        if (dist <= bots[i].radius) {
                            inRange += 1;
                        }
                    }
                    if (inRange > maxInRange) {
                        maxInRange = inRange;
                        newSearch = { minX: x, maxX: x, minY: y, maxY: y, minZ: z, maxZ: z };
                        maxInRangeDist = Math.abs(x) + Math.abs(y) + Math.abs(z);
                    } else if (inRange === maxInRange) {
                        let dist = Math.abs(x) + Math.abs(y) + Math.abs(z);
                        if (dist < maxInRangeDist)
                            newSearch = { minX: x, maxX: x, minY: y, maxY: y, minZ: z, maxZ: z };
                        else {
                            newSearch.minX = newSearch.minX > x ? x : newSearch.minX;
                            newSearch.maxX = newSearch.maxX < x ? x : newSearch.maxX;
                            newSearch.minY = newSearch.minY > y ? y : newSearch.minY;
                            newSearch.maxY = newSearch.maxY < y ? y : newSearch.maxY;
                            newSearch.minZ = newSearch.minZ > z ? z : newSearch.minZ;
                            newSearch.maxZ = newSearch.maxZ < z ? z : newSearch.maxZ;

                        }
                    }
                }
            }
        }
        console.log(maxInRange);
        // console.log(maxInRangePoint);
        console.log(maxInRangeDist);
        console.log(newSearch);
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


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

start();




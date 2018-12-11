"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {

    solve_dec_11_pt1();
    //  solve_dec_11_pt2();
};

module.exports = {
    start
};

const solve_dec_11_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');
        let map = {};
        for (let i = 1; i <= 300; i++) {
            for (let j = 1; j <= 300; j++) {
                map[i + ',' + j] = {
                    'xPos': i,
                    'yPos': j,
                    'value': getValue(i, j, 5719)
                }
            }
        }

        let maxGrid = 0;
        let maxGridSize = 0;
        let maxGridPoint = '';

        for (let point in map) {
            console.log("Calculating Point " + JSON.stringify(map[point]));
            setGrid(map, map[point]);
            if (map[point].gridTotal > maxGrid) {
                maxGrid = map[point].gridTotal;
                maxGridPoint = point;
                maxGridSize = map[point].maxSize;
            }
        }
        console.log("Max Grid " + maxGrid + ", Size " + maxGridSize + ", Point " + maxGridPoint);

        //setGrid(map, map['1,1']);
        //console.log(map);
        //console.log(map['1,1']);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
const getValue = (xPos, yPos, serialNumber) => {
    let rackId = xPos + 10;
    let powerLevel = rackId * yPos;
    powerLevel = powerLevel + serialNumber;
    powerLevel = powerLevel * rackId;
    powerLevel = Math.floor(powerLevel / 100) % 10;
    powerLevel = powerLevel - 5;
    return powerLevel;
}

const setGrid = (grid, point) => {
    point['gridTotal'] = -1;
    point['maxSize'] = -1;
    let lastSize = 0;
    for (let size = 1; size <= 300; size++) {
        // console.log("Calculating Size " + size);
        if (point.xPos + size > 300) continue;
        if (point.yPos + size > 300) continue;
        let gridTotal = lastSize;
        // Add next X val
        for (let j = 0; j < size - 1; j++) { // TODO: Fix This to add the right column
            // console.log("xAdd " + (point.xPos + size - 1) + ',' + (point.yPos + j));
            gridTotal += grid[(point.xPos + size - 1) + ',' + (point.yPos + j)].value;
        }
        // Add the next Y row
        for (let i = 0; i < size; i++) {
            // console.log("yAdd " + (point.xPos + i) + ',' + (point.yPos + size - 1));
            gridTotal += grid[(point.xPos + i) + ',' + (point.yPos + size - 1)].value;
        }

        if (gridTotal > point['gridTotal']) {
            point['gridTotal'] = gridTotal;
            point['maxSize'] = size;
        }
        // console.log("Last: " + lastSize);
        lastSize = gridTotal;
        // console.log("New: " + lastSize);
    }
}

const solve_dec_11_pt2 = () => {
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




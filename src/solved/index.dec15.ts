"use strict";
// tslint:disable
import fs = require('fs');
import { isConstructorTypeNode } from 'typescript';

const start = (): void => {

    solve_dec_15_pt1('src/test.dec15.6.txt');
};

module.exports = {
    start
};

const solve_dec_15_pt1 = (input) => {
    try {
        let data = fs.readFileSync(input, 'utf8');
        const lines = data.split('\n');
        for (let attackPower = 14; attackPower < 100; attackPower++) {
            let characters = [];
            let map = [];
            for (let y = 0; y < lines.length; y++) {
                let row = lines[y].split('');
                for (let x = 0; x < row.length; x++) {
                    if (row[x] === 'G' || row[x] === 'E') {
                        characters.push({ 'symbol': row[x], 'xPos': x, 'yPos': y, 'health': 200, 'attackPower': 3 })
                        row[x] = '.';
                    }
                }
                map.push(row);
            }
            for (let i = 0; i < characters.length; i++) {
                if (characters[i].symbol === 'E') characters[i].attackPower = attackPower;
            }
            let finalRounds = 1;
            let startingElves = characters.filter(o => o.symbol === 'E').length;
            let allElvesAlive = true;
            for (let round = 1; round < 100; round++) {
                console.log("@@@@@@ Start of Round " + round + ", " + attackPower + " Attack Power @@@@@@");
                // Fresh copy of the map
                for (let i = 0; i < characters.length; i++) {
                    characters[i]['map'] = JSON.parse(JSON.stringify(map));
                }

                processGameRound(characters, round);

                characters = characters.filter(o => o.health > 0).sort((a, b) => {
                    if (a.yPos < b.yPos) return -1;
                    if (a.yPos > b.yPos) return 1;
                    if (a.xPos < b.xPos) return -1;
                    if (a.xPos > b.xPos) return 1;
                    return 0;
                });

                let gnomes = characters.filter(o => o.symbol === 'G');
                let elves = characters.filter(o => o.symbol === 'E');
                if (elves.length < startingElves) {
                    console.log("Lost an elf in " + round);
                    allElvesAlive = false;
                    break;
                }
                if (gnomes.length === 0 || elves.length === 0) {
                    finalRounds = round;
                    break;
                }

                let printableMap = JSON.parse(JSON.stringify(map));
                for (let i = 0; i < characters.length; i++) {
                    printableMap[characters[i].yPos][characters[i].xPos] = characters[i].symbol;
                    printableMap[characters[i].yPos].push(' ');
                    printableMap[characters[i].yPos].push(characters[i].symbol);
                    printableMap[characters[i].yPos].push('-');
                    printableMap[characters[i].yPos].push("(" + characters[i].xPos + "," + characters[i].yPos + ")");
                    printableMap[characters[i].yPos].push('(');
                    printableMap[characters[i].yPos].push(characters[i].health);
                    printableMap[characters[i].yPos].push(')');
                }
                for (let i = 0; i < printableMap.length; i++) {
                    console.log(printableMap[i].join(''));
                }
            }
            if (allElvesAlive) {
                let healthTotal = 0;
                let victoryLap = false;
                for (let i = 0; i < characters.length; i++) {
                    console.log("Survivor: " + characters[i].symbol + " (" + characters[i].xPos + "," + characters[i].yPos + ") " + characters[i].health);
                    healthTotal += characters[i].health;
                    if (characters[i].victoryLap)
                        victoryLap = true;
                    // console.log(characters[i]);
                }
                if (victoryLap) finalRounds -= 1;
                console.log("Final Attack Power: " + attackPower);
                console.log("Final Rounds: " + finalRounds);
                console.log("Total Health: " + healthTotal);
                console.log(healthTotal * finalRounds);
                break;
            }
        }
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const processGameRound = (characters, gameRound) => {
    for (let i = 0; i < characters.length; i++) {
        console.log("Processing " + characters[i].symbol + "; (" + characters[i].xPos + "," + characters[i].yPos + "), " + characters[i].health + " health, round " + gameRound);
        let enemies = null;
        let allies = null;
        if (characters[i].symbol === 'G') {
            enemies = characters.filter(o => o.symbol === 'E').filter(o => o.health > 0);
            allies = characters.filter(o => o.symbol === 'G').filter(o => o.health > 0);
        } else {
            enemies = characters.filter(o => o.symbol === 'G').filter(o => o.health > 0);
            allies = characters.filter(o => o.symbol === 'E').filter(o => o.health > 0);
        }
        if (enemies.length === 0) {
            characters[i]['victoryLap'] = true;
        }
        for (let j = 0; j < allies.length; j++) {
            characters[i].map[allies[j].yPos][allies[j].xPos] = '#';
        }
        for (let j = 0; j < enemies.length; j++) {
            characters[i].map[enemies[j].yPos][enemies[j].xPos] = '*';
        }
        characters[i].map[characters[i].yPos][characters[i].xPos] = characters[i].symbol;
        fillMap(characters[i]);
        if (characters[i].health <= 0) continue;
        move(characters[i], enemies);
        // Whack after move
        let inRange = [];
        if (characters[i].map[characters[i].yPos - 1][characters[i].xPos] === '*') {
            inRange.push({ 'xPos': characters[i].xPos, 'yPos': characters[i].yPos - 1, 'rank': 1 });
        }
        if (characters[i].map[characters[i].yPos][characters[i].xPos - 1] === '*') {
            inRange.push({ 'xPos': characters[i].xPos - 1, 'yPos': characters[i].yPos, 'rank': 2 });
        }
        if (characters[i].map[characters[i].yPos][characters[i].xPos + 1] === '*') {
            inRange.push({ 'xPos': characters[i].xPos + 1, 'yPos': characters[i].yPos, 'rank': 3 });
        }
        if (characters[i].map[characters[i].yPos + 1][characters[i].xPos] === '*') {
            inRange.push({ 'xPos': characters[i].xPos, 'yPos': characters[i].yPos + 1, 'rank': 4 });
        }
        if (inRange.length > 0) {
            let inRangeDoobers = [];
            for (let j = 0; j < inRange.length; j++) {
                inRangeDoobers.push(enemies.filter(o => o.xPos === inRange[j].xPos && o.yPos === inRange[j].yPos)[0]);
            }
            // TODO: Sort by Health, reduce, sort by Y, reduce, sort by X, select
            // Round 11:  picking down instead of picking RIGHT for 
            // [ '(11,23)', '(12,22)' ]
            // Picked (11,23)
            let targetEnemy = inRangeDoobers.sort((a, b) => {
                if (a.health < b.health) return -1;
                if (a.health > b.health) return 1;
                return a.rank - b.rank;
            }).filter(a => a.health > 0)[0]
            // console.log(inRangeDoobers.length);
            // console.log(inRangeDoobers.map(a => "(" + a.xPos + "," + a.yPos + ")"));
            // console.log("Picked (" + targetEnemy.xPos + "," + targetEnemy.yPos + ")");
            // Whack!
            enemies.filter(a => a.xPos === targetEnemy.xPos && a.yPos === targetEnemy.yPos)[0].health -= characters[i].attackPower;
        }
        console.log(characters[i].symbol + " Health: " + characters[i].health + " (" + characters[i].xPos + "," + characters[i].yPos + ")");
    }

}

const fillMap = (character) => {
    for (let j = 0; j < character.map.length; j++) {
        // console.log(character.map[j].join(''));
    }

    // Short-circuit if next to an enemy
    if (character.map[character.yPos - 1][character.xPos] === '*') return;
    if (character.map[character.yPos + 1][character.xPos] === '*') return;
    if (character.map[character.yPos][character.xPos - 1] === '*') return;
    if (character.map[character.yPos][character.xPos + 1] === '*') return;

    let queue = [{ 'xPos': character.xPos, 'yPos': character.yPos }];
    while (queue.length > 0) {
        // console.log(queue.length);
        const point = queue.shift();
        let next = resolvePoint(character, point.xPos, point.yPos);
        queue = queue.concat(next);
    }
    for (let j = 0; j < character.map.length; j++) {
        // console.log(character.map[j].join(''));
    }
}

const validPath = (map, xPos, yPos, maxSteps, closestPoint) => {
    // console.log("Evaluating " + xPos + ", " + yPos);
    if (isNaN(Number(map[yPos][xPos]))) return -1;
    const value = '' + (Number(map[yPos][xPos]) + 1);
    let valid = false;
    if (map[yPos - 1][xPos] === '*') valid = true;
    if (map[yPos + 1][xPos] === '*') valid = true;
    if (map[yPos][xPos - 1] === '*') valid = true;
    if (map[yPos][xPos + 1] === '*') valid = true;
    if (valid && closestPoint.xPos === xPos && closestPoint.yPos === yPos) {
        return parseInt(value);
    } else if (valid) {
        // Not the shortest path
        return -1;
    }
    if (value > maxSteps) {
        // console.log('Exceeded Max Steps with ' + maxSteps);
        return -1;
    }

    let up = map[yPos - 1][xPos] === value ? validPath(map, xPos, yPos - 1, maxSteps, closestPoint) : -1;
    let down = map[yPos + 1][xPos] === value ? validPath(map, xPos, yPos + 1, maxSteps, closestPoint) : -1;
    let left = map[yPos][xPos - 1] === value ? validPath(map, xPos - 1, yPos, maxSteps, closestPoint) : -1;
    let right = map[yPos][xPos + 1] === value ? validPath(map, xPos + 1, yPos, maxSteps, closestPoint) : -1;
    const paths = [up, down, left, right].filter(o => o >= 0);
    if (paths.length > 0) return paths.sort((a, b) => a - b)[0];
    return -1;
}

const resolvePoint = (character, xPos, yPos) => {
    const value = character.map[yPos][xPos];
    let marker = 0;
    if (value === 'E' || value === 'G') {
        marker = 1;
    } else {
        marker = parseInt(value) + 1;
    }
    const next = [];
    const up = character.map[yPos - 1][xPos];
    const left = character.map[yPos][xPos - 1];
    const right = character.map[yPos][xPos + 1];
    const down = character.map[yPos + 1][xPos];
    if (up === '.') {
        next.push({ 'xPos': xPos, 'yPos': yPos - 1 });
        // if (character.map[yPos - 1][xPos] === '.') character.map[yPos - 1][xPos] = '' + marker;
        let compare = character.map[yPos - 1][xPos] === '.' ? 1000 : parseInt(character.map[yPos - 1][xPos]);
        character.map[yPos - 1][xPos] = marker < compare ? '' + marker : compare;
    }
    if (left === '.') {
        next.push({ 'xPos': xPos - 1, 'yPos': yPos });
        // if (character.map[yPos][xPos - 1] === '.') character.map[yPos][xPos - 1] = '' + marker;
        let compare = character.map[yPos][xPos - 1] === '.' ? 1000 : parseInt(character.map[yPos][xPos - 1]);
        character.map[yPos][xPos - 1] = marker < compare ? '' + marker : compare;
    }
    if (right === '.') {
        next.push({ 'xPos': xPos + 1, 'yPos': yPos });
        // if (character.map[yPos][xPos + 1] === '.') character.map[yPos][xPos + 1] = '' + marker;
        let compare = character.map[yPos][xPos + 1] === '.' ? 1000 : parseInt(character.map[yPos][xPos + 1]);
        character.map[yPos][xPos + 1] = marker < compare ? '' + marker : compare;
    }
    if (down === '.') {
        next.push({ 'xPos': xPos, 'yPos': yPos + 1 });
        // if (character.map[yPos + 1][xPos] === '.') character.map[yPos + 1][xPos] = '' + marker;
        let compare = character.map[yPos + 1][xPos] === '.' ? 1000 : parseInt(character.map[yPos + 1][xPos]);
        character.map[yPos + 1][xPos] = marker < compare ? '' + marker : compare;
    }
    return next;
}

const move = (character, enemies) => {
    let moves = [];
    // Already Adjacent?
    if (character.map[character.yPos - 1][character.xPos] === '*') {
        return;
    }
    if (character.map[character.yPos][character.xPos - 1] === '*') {
        return;
    }
    if (character.map[character.yPos][character.xPos + 1] === '*') {
        return;
    }
    if (character.map[character.yPos + 1][character.xPos] === '*') {
        return;
    }
    let closestSteps = 10000;
    let closestPoints = [];
    for (let i = 0; i < enemies.length; i++) {
        let up = character.map[enemies[i].yPos - 1][enemies[i].xPos];
        let left = character.map[enemies[i].yPos][enemies[i].xPos - 1];
        let right = character.map[enemies[i].yPos][enemies[i].xPos + 1];
        let down = character.map[enemies[i].yPos + 1][enemies[i].xPos];
        if (!isNaN(Number(up)) && Number(up) < closestSteps) {
            closestSteps = Number(up);
            closestPoints = [{ 'xPos': enemies[i].xPos, 'yPos': enemies[i].yPos - 1 }];
        } else if (!isNaN(Number(up)) && Number(up) === closestSteps) {
            closestPoints.push({ 'xPos': enemies[i].xPos, 'yPos': enemies[i].yPos - 1 });
        }
        if (!isNaN(Number(left)) && Number(left) < closestSteps) {
            closestSteps = Number(left);
            closestPoints = [{ 'xPos': enemies[i].xPos - 1, 'yPos': enemies[i].yPos }];
        } else if (!isNaN(Number(left)) && Number(left) === closestSteps) {
            closestPoints.push({ 'xPos': enemies[i].xPos - 1, 'yPos': enemies[i].yPos });
        }
        if (!isNaN(Number(right)) && Number(right) < closestSteps) {
            closestSteps = Number(right);
            closestPoints = [{ 'xPos': enemies[i].xPos + 1, 'yPos': enemies[i].yPos }];
        } else if (!isNaN(Number(right)) && Number(right) < closestSteps) {
            closestPoints.push({ 'xPos': enemies[i].xPos + 1, 'yPos': enemies[i].yPos });
        }
        if (!isNaN(Number(down)) && Number(down) < closestSteps) {
            closestSteps = Number(down);
            closestPoints = [{ 'xPos': enemies[i].xPos, 'yPos': enemies[i].yPos + 1 }];
        } else if (!isNaN(Number(down)) && Number(down) < closestSteps) {
            closestPoints.push({ 'xPos': enemies[i].xPos, 'yPos': enemies[i].yPos + 1 });
        }
    }
    // No one in range
    if (closestSteps === 10000) return;

    let closestPoint = closestPoints.sort((a, b) => {
        if (a.yPos < b.yPos) return -1;
        if (a.yPos > b.yPos) return 1;
        if (a.xPos < b.xPos) return -1;
        if (a.xPos > b.xPos) return 1;
    })[0];
    if (closestPoints.length > 1) {
        console.log(closestPoints);
        console.log("Chose " + JSON.stringify(closestPoint));
    }


    // Shortest Path?
    if (character.map[character.yPos - 1][character.xPos] === '1') {
        // console.log('evaluate UP');
        let steps = validPath(character.map, character.xPos, character.yPos - 1, closestSteps, closestPoint);
        if (steps >= 0) moves.push({ 'dir': 'up', 'steps': steps });
    }
    if (character.map[character.yPos][character.xPos - 1] === '1') {
        // console.log('evaluate LEFT');
        let steps = validPath(character.map, character.xPos - 1, character.yPos, closestSteps, closestPoint);
        if (steps >= 0) moves.push({ 'dir': 'left', 'steps': steps });
    }
    if (character.map[character.yPos][character.xPos + 1] === '1') {
        // console.log('evaluate RIGHT');
        let steps = validPath(character.map, character.xPos + 1, character.yPos, closestSteps, closestPoint);
        if (steps >= 0) moves.push({ 'dir': 'right', 'steps': steps });
    }
    if (character.map[character.yPos + 1][character.xPos] === '1') {
        // console.log('evaluate DOWN');
        let steps = validPath(character.map, character.xPos, character.yPos + 1, closestSteps, closestPoint);
        if (steps >= 0) moves.push({ 'dir': 'down', 'steps': steps });
    }

    if (moves.length > 0) {
        moves = moves.sort((a, b) => a.steps - b.steps);
        moves = moves.filter(a => a.steps === moves[0].steps);
        let move = '';
        if (moves.filter(a => a.dir === 'up').length > 0) {
            // console.log("selected UP");
            character.yPos -= 1;
            return;
        }
        if (moves.filter(a => a.dir === 'left').length > 0) {
            // console.log("selected LEFT");
            character.xPos -= 1;
            return;
        }
        if (moves.filter(a => a.dir === 'right').length > 0) {
            // console.log("selected RIGHT");
            character.xPos += 1;
            return;
        }
        if (moves.filter(a => a.dir === 'down').length > 0) {
            // console.log("selected DOWN");
            character.yPos += 1;
            return;
        }
    }
}

const solve_dec_14_pt2 = () => {
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




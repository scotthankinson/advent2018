"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel, isConstructorTypeNode, isForInStatement } from 'typescript';
import { print } from 'util';
import { resolve } from 'bluebird';

const start = (): void => {
    // Part 1
    // Guessed 22371 -- Too Low!  
    // Guessed 22871 -- Too High! fix typo w/ infected
    // Guessed 22677 -- Too High! fix problem with clearing target/targeted
    // Winner: 22676 -- had wrong sort on ties
    // solve_dec_24_pt1(0);

    // Part 2
    // solve_dec_24_pt1(5); -- 21701 Infection
    // solve_dec_24_pt1(500); -- 12212 Immune
    // solve_dec_24_pt1(250); -- 10430 immune
    // solve_dec_24_pt1(100); -- 8348 immune
    // solve_dec_24_pt1(50); -- 5614 immune
    // solve_dec_24_pt1(25); -- 5685 infection
    // solve_dec_24_pt1(37); -- infinite loop stalemate
    // solve_dec_24_pt1(38); -- 4510 immune
    //solve_dec_24_pt1(33); -- 412 infection
    //solve_dec_24_pt1(34); -- 386 infection
    //solve_dec_24_pt1(35); -- 366 infection
    // solve_dec_24_pt1(36); infinite loop stalemate
};

module.exports = {
    start
};

const solve_dec_24_pt1 = (boost) => {
    try {
        let data = fs.readFileSync('src/test.dec24.txt', 'utf8');
        const lines = data.split('\n');
        let armies = [];
        /*
        armies.push(buildArmy('immune', 1, 17, 5390, ['radiation', 'bludgeoning'], [], 4507, 'fire', 2));
        armies.push(buildArmy('immune', 2, 989, 1274, ['bludgeoning', 'slashing'], ['fire'], 25, 'slashing', 3));
        armies.push(buildArmy('infection', 1001, 801, 4706, ['radiation'], [], 116, 'bludgeoning', 1));
        armies.push(buildArmy('infection', 1002, 4485, 2961, ['fire', 'cold'], ['radiation'], 12, 'slashing', 4));
        */
        // 2086 11953 46 cold 13
        armies.push(buildArmy('immune', 1, 2086, 11953, [], [], 46 + boost, 'cold', 13));
        // 329 3402 weak[bludgeoning] 90 slashing 1
        armies.push(buildArmy('immune', 2, 329, 3402, ['bludgeoning'], [], 90 + boost, 'slashing', 1));
        //414 7103 weak[bludgeoning] immune[radiation] 170 radiation 4
        armies.push(buildArmy('immune', 3, 414, 7103, ['bludgeoning'], ['radiation'], 170 + boost, 'radiation', 4));
        //2205 7118 weak[fire] immune[cold] 26 radiation 18
        armies.push(buildArmy('immune', 4, 2205, 7118, ['fire'], ['cold'], 26 + boost, 'radiation', 18));
        //234 9284 weak[slashing] immune[cold, fire] 287 radiation 12
        armies.push(buildArmy('immune', 5, 234, 9284, ['slashing'], ['cold', 'fire'], 287 + boost, 'radiation', 12));
        //6460 10804 weak[fire] 15 slashing 11
        armies.push(buildArmy('immune', 6, 6460, 10804, ['fire'], [], 15 + boost, 'slashing', 11));
        //79 1935 244 radiation 8
        armies.push(buildArmy('immune', 7, 79, 1935, [], [], 244 + boost, 'radiation', 8));
        //919 2403 weak[fire] 22 slashing 2
        armies.push(buildArmy('immune', 8, 919, 2403, ['fire'], [], 22 + boost, 'slashing', 2));
        //172 1439 weak[slashing] immune[cold, fire] 69 slashing 3
        armies.push(buildArmy('immune', 9, 172, 1439, ['slashing'], ['cold', 'fire'], 69 + boost, 'slashing', 3));
        //1721 2792 weak[radiation,fire] 13 cold 16
        armies.push(buildArmy('immune', 10, 1721, 2792, ['radiation', 'fire'], [], 13 + boost, 'cold', 16));


        //1721 29925 weak[cold, radiation] immune[slashing] 34 radiation 5
        armies.push(buildArmy('infection', 1001, 1721, 29925, ['cold', 'radiation'], ['slashing'], 34, 'radiation', 5));
        //6351 21460 weak[cold] 6 slashing 15
        armies.push(buildArmy('infection', 1002, 6351, 21460, ['cold'], [], 6, 'slashing', 15));
        //958 48155 weak[bludgeoning] 93 radiation 7
        armies.push(buildArmy('infection', 1003, 958, 48155, ['bludgeoning'], [], 93, 'radiation', 7));
        //288 41029 weak[radiation] immune[bludgeoning] 279 cold 20
        armies.push(buildArmy('infection', 1004, 288, 41029, ['radiation'], ['bludgeoning'], 279, 'cold', 20));
        //3310 38913 21 radiation 19
        armies.push(buildArmy('infection', 1005, 3310, 38913, [], [], 21, 'radiation', 19));
        //3886 16567 immune[bludgeoning, cold] 7 cold 9
        armies.push(buildArmy('infection', 1006, 3886, 16567, [], ['bludgeoning', 'cold'], 7, 'cold', 9));
        //39 7078 300 bludgeoning 14
        armies.push(buildArmy('infection', 1007, 39, 7078, [], [], 300, 'bludgeoning', 14));
        //241 40635 weak[cold] 304 fire 6
        armies.push(buildArmy('infection', 1008, 241, 40635, ['cold'], [], 304, 'fire', 6));
        //7990 7747 immune[fire] radiation 10
        armies.push(buildArmy('infection', 1009, 7990, 7747, [], ['fire'], 1, 'radiation', 10));
        //80 30196 weak[fire] 702 bludgeoning 17
        armies.push(buildArmy('infection', 1010, 80, 30196, ['fire'], [], 702, 'bludgeoning', 17));

        let count = 0;
        while (true) {
            count += 1;
            console.log("New Round beginning: " + count);
            armies = armies.filter(o => o.units > 0).sort((a, b) => {
                if ((a.units * a.power) < (b.units * b.power)) return 1;
                if ((a.units * a.power) > (b.units * b.power)) return -1;
                return b.initiative - a.initiative;
            });
            let immune = armies.filter(o => o.army === 'immune');
            let infection = armies.filter(o => o.army === 'infection');
            if (immune.length === 0 || infection.length === 0) break;
            for (let i = 0; i < armies.length; i++) {
                if (armies[i].army === 'immune')
                    resolveTarget(armies[i], infection);
                else
                    resolveTarget(armies[i], immune);
            }
            armies = armies.sort((a, b) => b.initiative - a.initiative);
            for (let i = 0; i < armies.length; i++) {
                resolveFight(armies[i], armies);
            }
            for (let i = 0; i < armies.length; i++) {
                armies[i].target = '';
                armies[i].targetedBy = '';
            }
            // if (count > 355) break;
        }
        let survivors = 0;
        for (let i = 0; i < armies.length; i++) {
            survivors += armies[i].units;
        }
        console.log(survivors + ' ' + armies[0].army);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const resolveFight = (attacker, armies) => {
    if (attacker.units <= 0) console.log("Dead unit! " + attacker.id);
    if (attacker.units <= 0) return;
    // if (attacker.target === '') console.log("No target for " + attacker.id);
    if (attacker.target === '') return;
    let attackPower = attacker.power * attacker.units;
    let target = armies.filter(o => o.id === attacker.target)[0];
    if (!target) return;
    if (target.weakness.filter(o => o === attacker.type).length > 0) {
        attackPower *= 2;
    }
    let killed = Math.floor(attackPower / target.hp);
    // killed = killed > target.units ? target.units : killed;
    target.units -= killed;
    console.log('Attacker: ' + attacker.id + " killed " + killed + ' on ' + target.id);
}

const resolveTarget = (attacker, defenders) => {
    // Can't attack previously targeted units
    //console.log("Resolving Target for " + attacker.id)
    //console.log(defenders)
    defenders = defenders.filter(o => o.targetedBy === '');
    //console.log("Removing targeted ")
    //console.log(defenders)
    // Can't attack targets immune to your type
    defenders = defenders.filter(o => o.immunity.filter(j => j === attacker.type).length === 0);
    //console.log("Removing immunity")
    //console.log(defenders)

    let enemies = defenders.filter(o => o.weakness.filter(j => j === attacker.type).length > 0);
    if (enemies.length === 0)
        enemies = defenders.filter(o => o.weakness.filter(j => j === attacker.type).length === 0);
    if (enemies.length > 0) {
        enemies.sort((a, b) => {
            if ((a.units * a.power) < (b.units * b.power)) return 1;
            if ((a.units * a.power) > (b.units * b.power)) return -1;
            return b.initiative - a.initiative;
        });
        console.log("Selection: " + attacker.id + " will attack " + enemies[0].id);
        attacker.target = enemies[0].id;
        enemies[0].targetedBy = attacker.id;
    }
}
const buildArmy = (army, id, units, hp, weakness, immunity, power, type, initiative) => {
    return { army, id, units, hp, weakness, immunity, power, type, initiative, 'target': '', 'targetedBy': '' };
}

start();




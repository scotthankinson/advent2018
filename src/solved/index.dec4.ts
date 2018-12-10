"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';
import { unescapeLeadingUnderscores } from 'typescript';

const start = (): void => {

    // solve_dec_4_pt1();
    solve_dec_4_pt2();
};

module.exports = {
    start
};



const solve_dec_4_pt1 = () => {
    try {
        const data = fs.readFileSync('src/test.dec4.txt', 'utf8');
        const lines = data.split('\n').sort((a, b) => (a < b ? -1 : 1));
        let currentGuard = "";
        let guardLog = {};
        for (let i = 0; i < lines.length; i++) {
            const timestamp = lines[i].slice(0, 18);
            const event = lines[i].slice(18).trim();
            if (event.startsWith('Guard')) {
                const guard = event.split(' ')[1];
                currentGuard = guard;
                if (!guardLog[guard]) guardLog[guard] = { 'log': [], 'totalSleep': 0, 'sleepTracker': {} };
            }
            guardLog[currentGuard].log.push(lines[i]);
        }
        let mostAsleepGuard = null;
        for (let guard in guardLog) {
            if (mostAsleepGuard === null) mostAsleepGuard = guardLog[guard];

            evaluateGuard(guardLog[guard]);
            if (guardLog[guard].totalSleep > mostAsleepGuard.totalSleep) mostAsleepGuard = guardLog[guard];
        }
        // console.log(guardLog);
        // console.log(mostAsleepGuard);
        return guardLog;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const evaluateGuard = (guard) => {
    let startRange = '';
    let endRange = '';
    for (let i = 0; i < 60; i++) {
        guard.sleepTracker[i] = 0;
    }
    for (let i = 0; i < guard.log.length; i++) {
        const timestamp = guard.log[i].slice(0, 18);
        const event = guard.log[i].slice(18).trim();
        if (event.startsWith('Guard')) {
            continue;
        } else if (event.startsWith('falls')) {
            startRange = timestamp;
        } else if (event.startsWith('wakes')) {
            endRange = timestamp;
            const startRangeInt = parseInt(startRange.split(':')[1].slice(0, 2));
            const endRangeInt = parseInt(endRange.split(':')[1].slice(0, 2));
            guard.totalSleep = guard.totalSleep + (endRangeInt - startRangeInt);
            for (let t = startRangeInt; t < endRangeInt; t++) {
                guard.sleepTracker[t] += 1;
            }
            startRange = '';
            endRange = '';
        }
    }
}

const solve_dec_4_pt2 = () => {
    try {
        let guardLog = solve_dec_4_pt1();
        let numberOfMinutesSleeping = 0;
        let mostAsleepMinute = '0';
        let mostAsleepGuard = null;
        for (let guard in guardLog) {
            if (mostAsleepGuard === null) mostAsleepGuard = guardLog[guard];
            for (let minute in guardLog[guard].sleepTracker) {
                console.log("Checking " + guard + " minute " + minute);
                if (guardLog[guard].sleepTracker[minute] > numberOfMinutesSleeping) {
                    mostAsleepMinute = minute;
                    mostAsleepGuard = guardLog[guard];
                    numberOfMinutesSleeping = guardLog[guard].sleepTracker[minute];
                }
            }
        }
        console.log("Most Asleep Minute: " + mostAsleepMinute);
        console.log("Most Asleep Guard: ", mostAsleepGuard);
        console.log("Times Asleep: " + numberOfMinutesSleeping);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();




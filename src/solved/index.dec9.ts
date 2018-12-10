"use strict";
// tslint:disable
import fs = require('fs');
import * as Collections from 'typescript-collections';
import { createLessThan } from 'typescript';

const start = (): void => {

    // solve_dec_9_pt1();
    solve_dec_9_pt1();
};

module.exports = {
    start
};

const solve_dec_9_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const lines = data.split('\n');
        const players = 438;
        const maxMarbles = 7162600;
        let scores = {};
        let marbles = [0];
        let position = 0;
        let currentPlayer = 1;
        for (let i = 1; i <= players; i++) {
            scores[i] = { 'score': 0, 'played': [], 'scored': [] };
        }
        let timestamp = new Date().getTime();
        for (let i = 1; i <= maxMarbles; i++) {
            if (i % 10000 === 0) {
                console.log("Processing " + i + ", " + (new Date().getTime() - timestamp));
            }
            // scores[currentPlayer].played.push(i);
            if (marbles.length < 2) {
                marbles.push(i);
                position = i;
            } else if (i % 23 === 0) {
                // scores[currentPlayer].scored.push(i);
                scores[currentPlayer].score += i;
                position = position - 7;
                if (position < 0) position += marbles.length;
                const bonus = marbles.splice(position, 1)[0];
                //scores[currentPlayer].scored.push(bonus);
                scores[currentPlayer].score += bonus;
            } else {
                const left = (position + 2) % marbles.length;
                if (left === 0) {
                    marbles.push(i);
                    position = marbles.length - 1;
                } else {
                    marbles.splice(left, 0, i);
                    position = left;
                }
            }
            // console.log("[" + currentPlayer + "] " + position + "  " + JSON.stringify(marbles));
            currentPlayer += 1;
            if (currentPlayer > players) currentPlayer = 1;
        }
        let maxScore = 0;
        for (let i = 1; i <= players; i++) {
            if (scores[i].score > maxScore) maxScore = scores[i].score;
        }
        console.log(maxScore);

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_9_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const lines = data.split('\n');
        const players = 438;
        const maxMarbles = 7162600;
        let scores = {};
        let marbles = new Collections.LinkedList<number>();
        marbles.add(0);
        let position = 0;
        let currentPlayer = 1;
        for (let i = 1; i <= players; i++) {
            scores[i] = { 'score': 0 };
        }
        let timestamp = new Date().getTime();
        for (let i = 1; i <= maxMarbles; i++) {
            if (i % 10000 === 0) {
                console.log("Processing " + i + ", " + (new Date().getTime() - timestamp));
            }
            if (marbles.size() < 2) {
                marbles.add(i);
                position = i;
            } else if (i % 23 === 0) {
                scores[currentPlayer].score += i;
                position = position - 7;
                if (position < 0) position += marbles.size();
                // let date1 = new Date().getTime();
                const bonus = marbles.removeElementAtIndex(position);
                // console.log("Scoring Round - " + (new Date().getTime() - date1));
                scores[currentPlayer].score += bonus;
            } else {
                const left = (position + 2) % marbles.size();
                if (left === 0) {
                    // let date1 = new Date().getTime();
                    marbles.add(i);
                    // console.log("Append - " + (new Date().getTime() - date1));
                    position = marbles.size() - 1;
                } else {
                    // let date1 = new Date().getTime();
                    marbles.add(i, left);
                    // console.log("Insert - " + (new Date().getTime() - date1));
                    position = left;
                }
            }
            currentPlayer += 1;
            if (currentPlayer > players) currentPlayer = 1;
        }
        let maxScore = 0;
        for (let i = 1; i <= players; i++) {
            if (scores[i].score > maxScore) maxScore = scores[i].score;
        }
        console.log(maxScore);

        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




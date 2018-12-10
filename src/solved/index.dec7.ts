"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';
import { unescapeLeadingUnderscores } from 'typescript';
import { freemem } from 'os';

const start = (): void => {

    // solve_dec_7_pt1();
    solve_dec_7_pt2();
};

module.exports = {
    start
};

const input = ''


const solve_dec_7_pt1 = () => {
    try {
        const data = fs.readFileSync('src/test.dec7.txt', 'utf8');
        const lines = data.split('\n');
        let graph = {}
        for (let i = 0; i < lines.length; i++) {
            const letter = lines[i].split(' ')[7];
            const pre = lines[i].split(' ')[1];
            if (!graph[letter]) graph[letter] = { 'finished': false, 'requires': [] };
            if (!graph[pre]) graph[pre] = { 'finished': false, 'requires': [] };
            graph[letter].requires.push(pre);
        }
        let sortedGraph = {}
        Object.keys(graph).sort().forEach((key) => { sortedGraph[key] = graph[key]; });
        let solution = '';
        while (solution.length < Object.keys(graph).length) {
            let purged = '';
            console.log(sortedGraph);
            for (let letter in sortedGraph) {
                if (sortedGraph[letter].requires.length === 0 && sortedGraph[letter].finished === false) {
                    solution = solution + letter;
                    sortedGraph[letter].finished = true;
                    purged = letter;
                    break;
                }
            }
            for (let letter in sortedGraph) {
                if (sortedGraph[letter].requires.indexOf(purged) > -1) {
                    console.log("Removing  " + purged + " from " + JSON.stringify(sortedGraph[letter]));
                    sortedGraph[letter].requires.splice(sortedGraph[letter].requires.indexOf(purged), 1);
                }
            }
        }
        console.log(graph);
        console.log(solution);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_7_pt2 = () => {
    try {
        const data = fs.readFileSync('src/test.dec7.txt', 'utf8');
        const lines = data.split('\n');
        let graph = {};
        for (let i = 0; i < 26; i++) {
            graph[String.fromCharCode(i + 65)] = { 'finished': true, 'requires': [], 'timeRemaining': i + 61 }
        }

        let activeLetters = 0;
        for (let i = 0; i < lines.length; i++) {
            const letter = lines[i].split(' ')[7];
            const pre = lines[i].split(' ')[1];
            if (graph[letter].finished) {
                graph[letter].finished = false;
                activeLetters += 1;
            }
            if (graph[pre].finished) {
                graph[pre].finished = false;
                activeLetters += 1;
            }
            graph[letter].requires.push(pre);
        }
        let solution = '';
        let time = 0;
        while (solution.length < activeLetters) {
            console.log("Processing Time " + time);
            console.log(solution);
            let purged = '';
            let workerCount = 5;
            for (let letter in graph) {
                if (graph[letter].requires.length === 0
                    && graph[letter].finished === false
                    && graph[letter].timeRemaining === 0) {
                    solution = solution + letter;
                    graph[letter].finished = true;
                    if (purged !== '') console.log("@@@@@@@@@@@@@@@@@@@");
                    purged = letter;
                }
            }
            if (purged !== '') {
                for (let letter in graph) {
                    if (graph[letter].requires.indexOf(purged) > -1) {
                        console.log("Removing  " + purged + " from " + JSON.stringify(graph[letter]));
                        graph[letter].requires.splice(graph[letter].requires.indexOf(purged), 1);
                    }
                }
            }
            for (let letter in graph) {
                if (graph[letter].requires.length === 0
                    && graph[letter].finished === false
                    && graph[letter].timeRemaining > 0) {

                    if (workerCount == 0) break;
                    graph[letter].timeRemaining -= 1;
                    workerCount -= 1;
                }
            }
            time += 1;
        }
        console.log(graph);
        console.log(solution);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();




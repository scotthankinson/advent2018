"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';
import { unescapeLeadingUnderscores } from 'typescript';
import { freemem } from 'os';

const start = (): void => {

    // solve_dec_6_pt1();
    solve_dec_6_pt2();
};

module.exports = {
    start
};

const input = ''


const solve_dec_6_pt1 = () => {
    try {
        const data = fs.readFileSync('src/test.dec6.txt', 'utf8');
        const lines = data.split('\n');
        const points = [];
        let maxX = 0;
        let maxY = 0;
        for (let i = 0; i < lines.length; i++) {
            const point = { 'x': parseInt(lines[i].split(',')[0]), 'y': parseInt(lines[i].split(',')[1].trim()), 'count': 0 };
            if (point.x > maxX) maxX = point.x;
            if (point.y > maxY) maxY = point.y;
            points.push(point);
        }
        let map = {};
        for (let i = 0; i <= maxX + 1; i++) {
            for (let j = 0; j <= maxY + 1; j++) {
                let key = i + ',' + j;
                map[key] = { 'dist': 9999999999, 'nearest': '', 'point': false, 'count': 0, 'isInfinite': false };
            }
        }
        for (let i = 0; i < points.length; i++) {
            for (let coord in map) {
                let coordPoint = { 'x': coord.split(',')[0], 'y': coord.split(',')[1] };
                const distance = getDistance(points[i], coordPoint);
                if (distance === 0) map[coord].point = true;
                if (distance < map[coord].dist) {
                    map[coord].dist = distance;
                    map[coord].nearest = points[i].x + ',' + points[i].y;
                } else if (distance === map[coord].dist) {
                    map[coord].nearest = '.';
                }
            }
        }
        for (let coord in map) {
            if (!map[coord].point) continue;

            // Check to see if you can draw a staight line to any edge
            let coordPoint = { 'x': parseInt(coord.split(',')[0]), 'y': parseInt(coord.split(',')[1]) };
            let isInfinite = false;
            if (map['0,' + coordPoint.y].nearest === coord) isInfinite = true;
            if (map[coordPoint.x + ',0'].nearest === coord) isInfinite = true;
            if (map[(maxX + 1) + ',' + coordPoint.y].nearest === coord) isInfinite = true;
            if (map[coordPoint.x + ',' + (maxY + 1)].nearest === coord) isInfinite = true;
            map[coord].isInfinite = isInfinite;
            for (let checkCoord in map) {
                if (map[checkCoord].nearest === coord) {
                    map[coord].count += 1;
                }
            }
        }
        for (let coord in map) {
            if (!map[coord].point) delete map[coord];
            else if (map[coord].isInfinite) delete map[coord];
        }
        console.log(map);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getDistance = (start, end) => {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

const solve_dec_6_pt2 = () => {
    try {
        const data = fs.readFileSync('src/test.dec6.txt', 'utf8');
        const lines = data.split('\n');
        const points = [];
        let maxX = 0;
        let maxY = 0;
        for (let i = 0; i < lines.length; i++) {
            const point = { 'x': parseInt(lines[i].split(',')[0]), 'y': parseInt(lines[i].split(',')[1].trim()), 'count': 0 };
            if (point.x > maxX) maxX = point.x;
            if (point.y > maxY) maxY = point.y;
            points.push(point);
        }
        let map = {};
        for (let i = 0; i <= maxX + 1; i++) {
            for (let j = 0; j <= maxY + 1; j++) {
                let key = i + ',' + j;
                map[key] = { 'point': false, 'dist': 0 };
            }
        }
        for (let coord in map) {
            for (let i = 0; i < points.length; i++) {
                if (coord === (points[i].x + ',' + points[i].y)) map[coord].point = true;
                let coordPoint = { 'x': coord.split(',')[0], 'y': coord.split(',')[1] };
                const distance = getDistance(points[i], coordPoint);
                map[coord].dist += distance;
            }
        }
        let total = 0;
        for (let coord in map) {
            if (map[coord].dist > 9999) delete map[coord];
            else total += 1;
        }

        console.log(map);
        console.log(total);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();




"use strict";
// tslint:disable
import fs = require('fs');
import { print } from 'util';
import { unescapeLeadingUnderscores, isConstructorTypeNode } from 'typescript';
import { freemem } from 'os';

const start = (): void => {

    // solve_dec_8_pt1();
    solve_dec_8_pt2();
};

module.exports = {
    start
};

const input = ''


const solve_dec_8_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        // const lines = data.split('\n');
        let tree = getNode_1(data);
        //  console.log(JSON.stringify(tree.node));
        let sum = getMeta_1(tree.node);
        console.log("Sum: " + sum);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getNode_1 = (data): any => {
    console.log(data);
    let entries = data.split(' ');
    const details = entries.splice(0, 2);
    let newNode = { 'nodeId': details.join(',') };
    console.log(details);
    let childCount = parseInt(details[0]);
    const metaCount = parseInt(details[1]);

    // base case
    if (childCount === 0) {
        const metadata = entries.splice(0, metaCount);
        newNode['meta'] = metadata;
        newNode['children'] = [];
        newNode['childCount'] = childCount;
        return { 'node': newNode, 'data': entries };
    } else {
        newNode['children'] = [];
        newNode['childCount'] = childCount;
        while (childCount > 0) {
            console.log('processing child  ' + childCount);
            let child = getNode_1(entries.join(' '));
            newNode['children'].push(child.node);
            entries = child.data;
            childCount -= 1;
        }
        const metadata = entries.splice(0, metaCount);
        newNode['meta'] = metadata;
        return { 'node': newNode, 'data': entries };
    }
}

const getMeta_1 = (node) => {
    let sum = 0;
    for (let i = 0; i < node.meta.length; i++) {
        sum += parseInt(node.meta[i]);
    }
    for (let i = 0; i < node.children.length; i++) {
        sum += getMeta_1(node.children[i]);
    }
    return sum;
}

const solve_dec_8_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        // const lines = data.split('\n');
        let tree = getNode_2(data);
        // console.log(JSON.stringify(tree.node));
        console.log(tree.node.value);
        return '';
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const getNode_2 = (data): any => {
    console.log(data);
    let entries = data.split(' ');
    const details = entries.splice(0, 2);
    let newNode = { 'nodeId': details.join(',') };
    console.log(details);
    let childCount = parseInt(details[0]);
    const metaCount = parseInt(details[1]);

    // base case
    if (childCount === 0) {
        const metadata = entries.splice(0, metaCount);
        newNode['meta'] = metadata;
        newNode['children'] = [];
        newNode['childCount'] = childCount;
        newNode['value'] = 0;
        for (let i = 0; i < metadata.length; i++) {
            newNode['value'] += parseInt(metadata[i]);
        }
        return { 'node': newNode, 'data': entries };
    } else {
        newNode['children'] = [];
        newNode['childCount'] = childCount;
        while (childCount > 0) {
            console.log('processing child  ' + childCount);
            let child = getNode_2(entries.join(' '));
            newNode['children'].push(child.node);
            entries = child.data;
            childCount -= 1;
        }
        const metadata = entries.splice(0, metaCount);
        newNode['meta'] = metadata;
        newNode['value'] = 0;
        for (let i = 0; i < metadata.length; i++) {
            const metaEntry = parseInt(metadata[i]);
            if (metaEntry - 1 < newNode['children'].length) {
                newNode['value'] += newNode['children'][metaEntry - 1].value;
            }
        }
        return { 'node': newNode, 'data': entries };
    }
}

start();




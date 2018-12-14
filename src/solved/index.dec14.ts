"use strict";
// tslint:disable
import fs = require('fs');
import { createLabel } from 'typescript';
import { print } from 'util';

const start = (): void => {

    /*
    console.log(solve_dec_14_pt1(5)); // 0124515891
    console.log(solve_dec_14_pt1(18)); // 9251071085
    console.log(solve_dec_14_pt1(2018)); // 5941429882
    console.log(solve_dec_14_pt1(607331));
    */
    console.log(solve_dec_14_pt2('51589')); // 9
    console.log(solve_dec_14_pt2('01245')); // 5
    console.log(solve_dec_14_pt2('92510')); // 18
    console.log(solve_dec_14_pt2('59414')); // 2018
    console.log(solve_dec_14_pt2('607331')); // 
};

module.exports = {
    start
};

const solve_dec_14_pt1 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let recipes = [3, 7];
        let elf1 = 0;
        let elf2 = 1;
        while (recipes.length < input + 10) {
            let recipe = recipes[elf1] + recipes[elf2];
            if (recipe > 9) {
                recipes.push(1);
                recipes.push(recipe - 10);
            } else {
                recipes.push(recipe);
            }
            elf1 = (elf1 + recipes[elf1] + 1) % recipes.length;
            elf2 = (elf2 + recipes[elf2] + 1) % recipes.length;
            //console.log(recipes[elf1]);
            //console.log(recipes[elf2]);
            //console.log(recipes);
        }
        let result = "";
        for (let i = input; i < input + 10; i++) {
            result += recipes[i];
        }
        return result;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_dec_14_pt2 = (input) => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let recipes = [3, 7];
        let elf1 = 0;
        let elf2 = 1;
        while (recipes.length < 10000000000) {
            if (recipes.length % 1000 === 0) console.log(recipes.length);
            // console.log('Recipes: ' + recipes.length + ', Elf1: ' + elf1 + ', Elf2: ' + elf2);
            let recipe = recipes[elf1] + recipes[elf2];
            if (recipe > 9) {
                recipes.push(1);
                recipes.push(recipe - 10);
            } else {
                recipes.push(recipe);
            }
            elf1 = (elf1 + recipes[elf1] + 1) % recipes.length;
            elf2 = (elf2 + recipes[elf2] + 1) % recipes.length;
            let testRecipe = recipes.slice(-10).join('');
            if (testRecipe.indexOf(input) > -1) {
                return recipes.join('').indexOf(input);
            }

        }
        return -1;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();




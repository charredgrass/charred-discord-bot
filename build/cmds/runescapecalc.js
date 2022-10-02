"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chanceBelow = exports.howDry = void 0;
const statmath_1 = require("../lib/statmath");
let howDry = {
    name: "dry",
    run: (args, message) => {
        if (args[1] && args[1].match(/1\/\d+/)) {
            args[1] = args[1].slice(2);
        }
        let odds = Number(args[1]);
        let kc = Number(args[2]);
        if (isNaN(odds) || isNaN(kc)) {
            return message.channel.send("Invalid arguments. Syntax: !dry 1/[droprate] [kc]");
        }
        message.channel.send(`Chance of getting a 1/${odds} drop at or before ${kc} kc is ${(100 * (1 - (0, statmath_1.binompdf)(kc, 1 / odds, 0)))}%`);
    },
    select: (selector) => {
        return selector.rs;
    }
};
exports.howDry = howDry;
let chanceBelow = {
    name: "chance",
    run: (args, message) => {
        if (args[1] && args[1].match(/1\/\d+/)) {
            args[1] = args[1].slice(2);
        }
        let odds = Number(args[1]);
        let kc = Number(args[2]);
        let drops = Number(args[3]);
        if (isNaN(odds) || isNaN(kc) || isNaN(drops)) {
            return message.channel.send("Invalid arguments. Syntax: !chance 1/[droprate] [kc] [number of drops]");
        }
        let chance = 0;
        for (let i = 0; i < drops; i++) {
            console.log(chance);
            console.log((0, statmath_1.binompdf)(kc, 1 / odds, i));
            chance += (0, statmath_1.binompdf)(kc, 1 / odds, i);
        }
        message.channel.send(`Chance of getting ${drops} or more of a 1/${odds} drop at or before ${kc} kc is ${(100 * (1 - chance))}%`);
    },
    select: (selector) => {
        return selector.rs;
    }
};
exports.chanceBelow = chanceBelow;

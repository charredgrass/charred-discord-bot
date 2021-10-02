"use strict";
exports.__esModule = true;
exports.chanceBelow = exports.howDry = void 0;
var statmath_1 = require("../lib/statmath");
var howDry = {
    name: "dry",
    run: function (args, message) {
        if (args[1] && args[1].match(/1\/\d+/)) {
            args[1] = args[1].slice(2);
        }
        var odds = Number(args[1]);
        var kc = Number(args[2]);
        if (isNaN(odds) || isNaN(kc)) {
            return message.channel.send("Invalid arguments. Syntax: !dry 1/[droprate] [kc]");
        }
        message.channel.send("Chance of getting a 1/" + odds + " drop at or before " + kc + " kc is " + (100 * (1 - statmath_1.binompdf(kc, 1 / odds, 0))) + "%");
    },
    select: function (selector) {
        return selector.rs;
    }
};
exports.howDry = howDry;
var chanceBelow = {
    name: "chance",
    run: function (args, message) {
        if (args[1] && args[1].match(/1\/\d+/)) {
            args[1] = args[1].slice(2);
        }
        var odds = Number(args[1]);
        var kc = Number(args[2]);
        var drops = Number(args[3]);
        if (isNaN(odds) || isNaN(kc) || isNaN(drops)) {
            return message.channel.send("Invalid arguments. Syntax: !chance 1/[droprate] [kc] [number of drops]");
        }
        var chance = 0;
        for (var i = 0; i < drops; i++) {
            console.log(chance);
            console.log(statmath_1.binompdf(kc, 1 / odds, i));
            chance += statmath_1.binompdf(kc, 1 / odds, i);
        }
        message.channel.send("Chance of getting " + drops + " or more of a 1/" + odds + " drop at or before " + kc + " kc is " + (100 * (1 - chance)) + "%");
    },
    select: function (selector) {
        return selector.rs;
    }
};
exports.chanceBelow = chanceBelow;

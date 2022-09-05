"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = exports.cmds = void 0;
const rs = require("./runescape");
const rsc = require("./runescapecalc");
const tft = require("./tft");
let ping = {
    name: "ping",
    run: (args, message) => {
        message.channel.send("pong");
    },
    select: (selector) => {
        return true;
    }
};
let cmds = [ping, rs.getPrice, rsc.howDry, rsc.chanceBelow, tft.augprob];
exports.cmds = cmds;
let logData = {
    name: "logger",
    file: "./logs/chat.log",
    run: (message) => {
    },
    select: (selector) => {
        return selector.tst;
    }
};
let logs = [logData];
exports.logs = logs;

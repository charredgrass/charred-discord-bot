"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmds = void 0;
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
let oldcmds = [ping, rsc.howDry, rsc.chanceBelow, tft.augprob];
let cmds = [rs.getPrice];
exports.cmds = cmds;

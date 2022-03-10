"use strict";
exports.__esModule = true;
exports.logs = exports.cmds = void 0;
var rs = require("./runescape");
var rsc = require("./runescapecalc");
var tft = require("./tft");
var ping = {
    name: "ping",
    run: function (args, message) {
        message.channel.send("pong");
    },
    select: function (selector) {
        return true;
    }
};
var cmds = [ping, rs.getPrice, rsc.howDry, rsc.chanceBelow, tft.augprob];
exports.cmds = cmds;
var logData = {
    name: "logger",
    file: "./logs/chat.log",
    run: function (message) {
    },
    select: function (selector) {
        return selector.tst;
    }
};
var logs = [logData];
exports.logs = logs;

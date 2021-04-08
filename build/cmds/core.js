"use strict";
exports.__esModule = true;
exports.cmds = void 0;
var ping = {
    name: "ping",
    run: function (args, message) {
        message.channel.send("pong");
    }
};
var cmds = [ping];
exports.cmds = cmds;

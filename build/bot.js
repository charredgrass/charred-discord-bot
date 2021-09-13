"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var fs = require("fs");
var Commands = require("./cmds/core");
var intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES);
var client = new Discord.Client({ intents: intents });
var config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));
process.stdin.setEncoding("utf8");
var consoleCommands = {
    "reload": function () {
        return "Reloaded.";
    },
    "test": function () {
        return "";
    },
    "stop": function () {
        process.exit(0);
        return "Stopping";
    }
};
process.stdin.on("data", function (text) {
    text = text.replace(/[\n\r\t]/g, "").replace(/ {2+}/g, " ");
    var args = text.split(" ");
    var command = args[0].toLowerCase();
    var echoed;
    if (consoleCommands.hasOwnProperty(command) === true) {
        echoed = consoleCommands[command].apply(consoleCommands, args);
        console.log(echoed);
    }
    else {
        console.log("Unknown command. Type `help` for help.");
    }
});
function serverSelector(serverID) {
    var ret = {
        atg: false,
        frz: false,
        rao: false,
        dnd: false,
        dms: false,
        tst: false,
        rs: false
    };
    if (serverID === "167586953061990400") {
        ret.rao = true;
    }
    else if (serverID === "276220128822165505") {
        ret.atg = true;
    }
    else if (serverID === "234382619767341056") {
        ret.frz = true;
    }
    else if (serverID === "446813545049358336") {
        ret.dnd = true;
    }
    else if (serverID === "220039870410784768") {
        ret.dnd = true;
        ret.rs = true;
    }
    else if (serverID === "313169519545679872" || !serverID) {
        ret.atg = true;
        ret.frz = true;
        ret.rao = true;
        ret.dnd = true;
        ret.tst = true;
        ret.rs = true;
    }
    if (!serverID) {
        ret.dms = true;
    }
    return ret;
}
function argsplit(message) {
    message = message.toString();
    var p = message.search(/^\s*!(\w).*/);
    if (p < 0) {
        return null;
    }
    message = message.replace(/^\s*/, "").replace(/\s+/g, " ");
    var args = message.split(" ");
    return args;
}
var commands = [];
commands = Commands.cmds;
client.on("messageCreate", function (message) {
    if (message.author.bot === true)
        return;
    var loc = message.channel;
    var msg = message.content;
    var server, channelName;
    if (loc.hasOwnProperty("guild")) {
        var nloc = loc;
        server = nloc.guild.id;
        channelName = nloc.name;
    }
    var selector = serverSelector(server);
    var args = argsplit(msg);
    if (args) {
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var c = commands_1[_i];
            if (args[0] == "!" + c.name && c.select(selector)) {
                c.run(args, message);
            }
        }
    }
});
client.login(config.discord.key).then(function () {
    console.log("Successfully logged in.");
})["catch"](function (e) {
    console.log("Error logging in:");
    console.log(e);
});
client.on("ready", function () {
    console.log("Connected and initialized.");
});

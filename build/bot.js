"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const fs = require("fs");
const Commands = require("./cmds/core");
let intents = [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.DirectMessages];
const client = new Discord.Client({ intents });
let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));
process.stdin.setEncoding("utf8");
const consoleCommands = {
    "reload": () => {
        return "Reloaded.";
    },
    "test": () => {
        return "";
    },
    "stop": () => {
        process.exit(0);
        return "Stopping";
    }
};
process.stdin.on("data", (text) => {
    text = text.replace(/[\n\r\t]/g, "").replace(/ {2+}/g, " ");
    let args = text.split(" ");
    let command = args[0].toLowerCase();
    let echoed;
    if (consoleCommands.hasOwnProperty(command) === true) {
        echoed = consoleCommands[command](...args);
        console.log(echoed);
    }
    else {
        console.log("Unknown command. Type `help` for help.");
    }
});
function serverSelector(serverID) {
    let ret = {
        atg: false,
        frz: false,
        rao: false,
        dnd: false,
        dms: false,
        tst: false,
        rs: false,
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
        ret.dms = true;
    }
    if (!serverID) {
        ret.dms = true;
    }
    return ret;
}
function argsplit(message) {
    message = message.toString();
    let p = message.search(/^\s*!(\w).*/);
    if (p < 0) {
        return null;
    }
    message = message.replace(/^\s*/, "").replace(/\s+/g, " ");
    let args = message.split(" ");
    return args;
}
let commands = [];
commands = Commands.cmds;
client.on("messageCreate", (message) => {
    if (message.author.bot === true)
        return;
    let loc = message.channel;
    let msg = message.content;
    let server, channelName;
    if (loc.hasOwnProperty("guild")) {
        let nloc = loc;
        server = nloc.guild.id;
        channelName = nloc.name;
    }
    let selector = serverSelector(server);
    let args = argsplit(msg);
    if (args) {
        for (let c of commands) {
            if (args[0] == "!" + c.name && c.select(selector)) {
                c.run(args, message);
            }
        }
    }
});
client.login(config.discord.key).then(() => {
    console.log("Successfully logged in.");
}).catch((e) => {
    console.log("Error logging in:");
    console.log(e);
});
client.on("ready", () => {
    console.log("Connected and initialized.");
});

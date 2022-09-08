"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const rest_1 = require("@discordjs/rest");
const fs = require("fs");
const Commands = require("./cmds/core");
const intents = [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.DirectMessages];
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
    },
    "register": () => {
        registerCommands();
        return "Process completed.";
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
let guildCommandList = {};
const guilds = {
    NASS: "313169519545679872",
};
for (const key in guilds) {
    guildCommandList[guilds[key]] = [];
}
const clientid = config.discord.clientid;
const nassid = "313169519545679872";
const rest = new rest_1.REST({ version: '10' }).setToken(config.discord.key);
function registerCommands() {
    for (const cmd of commands) {
        if (cmd.flavor === "runescape") {
            guildCommandList[guilds.NASS].push(cmd.data.toJSON());
        }
    }
    for (const g in guildCommandList) {
        let toReg = guildCommandList[g];
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Started refreshing ${toReg.length} application (/) commands in guildid ${g}`);
                const data = yield rest.put(Discord.Routes.applicationGuildCommands(clientid, g), { body: toReg });
                console.log("Successfully reloaded commands!");
            }
            catch (err) {
                console.error(err);
            }
        }))();
    }
}
client.login(config.discord.key).then(() => {
    console.log("Successfully logged in.");
}).catch((e) => {
    console.log("Error logging in:");
    console.log(e);
});
client.on("ready", () => {
    console.log("Connected and initialized.");
});

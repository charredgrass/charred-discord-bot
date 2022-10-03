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
exports.cmds = void 0;
const rs = require("./runescape");
const rsc = require("./runescapecalc");
const tft = require("./tft");
const genshin = require("./genshincalc");
const discord_js_1 = require("discord.js");
let ping = {
    name: "ping",
    flavor: "test",
    data: new discord_js_1.SlashCommandBuilder().setName("ping").setDescription("test command"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply("pong");
        });
    }
};
let oldcmds = [, tft.augprob];
let scmds = [ping, rs.getPrice, genshin.chanceHit, rsc.howDry, rsc.chanceBelow];
let cmds = new discord_js_1.Collection();
exports.cmds = cmds;
for (let sc of scmds) {
    cmds.set(sc.name, sc);
}

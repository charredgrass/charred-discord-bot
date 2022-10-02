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
exports.chanceHit = void 0;
const discord_js_1 = require("discord.js");
const HARDPITY = 90;
function pullpmf(n, p) {
    let d = p * 10;
    if (n <= 0) {
        return 0;
    }
    else if (n <= 73) {
        return p * Math.pow(1 - p, n - 1);
    }
    else if (n <= 89) {
        let res = Math.pow(1 - p, 73) * (p + (n - 73) * d);
        for (let i = 1; i <= n - 74; i++) {
            res *= 1 - p - n * d;
        }
        return res;
    }
    else {
        return 0;
    }
}
function pullcmf(n, p) {
    if (n <= 0) {
        return 0;
    }
    else if (n <= 73) {
        return 1 - Math.pow(1 - p, n);
    }
    else if (n <= 89) {
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            sum += pullpmf(i, p);
        }
        return sum;
    }
}
let chanceIn = {
    name: "chancein",
    run: (args, message) => {
        let pulls = Number(args[1]);
        if (isNaN(pulls)) {
            return message.channel.send("Invalid arguments. Syntax: !chancein [kc]");
        }
        if (pulls >= HARDPITY * 2) {
            return message.channel.send("You are guaranteed.");
        }
    },
    select: (selector) => {
        return selector.dms;
    }
};
let chanceHit = {
    name: "chancehit",
    flavor: "genshin",
    data: new discord_js_1.SlashCommandBuilder().setName("chancehit").setDescription("Chance to hit your Genshin 5 star.")
        .addIntegerOption(option => option.setName("pulls")
        .setDescription("Number of pulls to attempt")
        .setRequired(true))
        .addIntegerOption(option => option.setName("currentpity")
        .setDescription("Current pity")
        .setRequired(false)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const pulls = Number(interaction.options.get("pulls").value);
            const pity = Number(interaction.options.get("currentpity").value || 0);
            return interaction.editReply(`${pulls} ${pity}`);
        });
    }
};
exports.chanceHit = chanceHit;

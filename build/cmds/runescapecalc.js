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
exports.chanceBelow = exports.howDry = void 0;
const statmath_1 = require("../lib/statmath");
const discord_js_1 = require("discord.js");
let howDry = {
    name: "dry",
    flavor: "runescape",
    data: new discord_js_1.SlashCommandBuilder().setName("dry").setDescription("Dry Calculator")
        .addIntegerOption(option => option.setName("droprate")
        .setDescription("The droprate 1/x of the item (just input x)")
        .setRequired(true))
        .addIntegerOption(option => option.setName("kc")
        .setDescription("Your killcount")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let odds = Number(interaction.options.get("droprate").value);
            let kc = Number(interaction.options.get("kc").value);
            let resp = (100 * (1 - (0, statmath_1.binompdf)(kc, 1 / odds, 0)));
            return interaction.editReply(`The chances of getting at least one 1/${odds} drop at ${kc} kc is ${resp}%.`);
        });
    }
};
exports.howDry = howDry;
let chanceBelow = {
    name: "chance",
    flavor: "runescape",
    data: new discord_js_1.SlashCommandBuilder().setName("chance").setDescription("Drops Calculator")
        .addIntegerOption(option => option.setName("droprate")
        .setDescription("The droprate 1/x of the item (just input x)")
        .setRequired(true))
        .addIntegerOption(option => option.setName("kc")
        .setDescription("Your killcount")
        .setRequired(true))
        .addIntegerOption(option => option.setName("drops")
        .setDescription("Drops received")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let odds = Number(interaction.options.get("droprate").value);
            let kc = Number(interaction.options.get("kc").value);
            let drops = Number(interaction.options.get("drops").value);
            let chance = 0;
            for (let i = 0; i < drops; i++) {
                chance += (0, statmath_1.binompdf)(kc, 1 / odds, i);
            }
            return interaction.editReply(`The chances of getting at ${drops} or more drops at a rate of 1/${odds} with ${kc} kc is ${(100 * (1 - chance))}%.`);
        });
    }
};
exports.chanceBelow = chanceBelow;

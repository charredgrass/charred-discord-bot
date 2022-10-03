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
exports.getPrice = void 0;
const request_1 = require("../lib/request");
const discord_js_1 = require("discord.js");
const RS_GE = "http://services.runescape.com/m=itemdb_oldschool";
let itemcache = {};
let idcache = null, pricecache = null;
const RS_WIKI_IDS = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES = "https://prices.runescape.wiki/api/v1/osrs/latest";
let idcacheTime = 0, pricecacheTime = 0;
const WAIT_TIME = 1000 * 60 * 60 * 6;
function wikiItem(name) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield prepCache();
        yield prepPriceCache();
        let item = searchCacheForItem(name);
        let ret = {
            price: pricecache[item["id"]],
            desc: item
        };
        resolve(ret);
    }));
}
function prepCache() {
    const promise = new Promise((resolve, reject) => {
        if (!idcache && idcacheTime + WAIT_TIME < Date.now()) {
            (0, request_1.callAPI)(RS_WIKI_IDS, (e, r, body) => {
                if (e) {
                    return reject(e);
                }
                let respjson = JSON.parse(body);
                idcache = respjson;
                resolve(idcache);
                idcacheTime = Date.now();
            }, (err) => {
                console.log(err);
                reject(err);
            });
        }
        else {
            resolve(idcache);
        }
    });
    return promise;
}
function prepPriceCache() {
    const promise = new Promise((resolve, reject) => {
        if (!pricecache && pricecacheTime + WAIT_TIME < Date.now()) {
            (0, request_1.callAPI)(RS_WIKI_PRICES, (e, r, body) => {
                if (e) {
                    return reject(e);
                }
                let respjson = JSON.parse(body).data;
                pricecache = respjson;
                resolve(pricecache);
                pricecacheTime = Date.now();
            }, (err) => {
                console.log(err);
                reject(err);
            });
        }
        else {
            resolve(pricecache);
        }
    });
    return promise;
}
function searchCacheForItem(name) {
    for (let item of idcache) {
        if (item["name"].toLowerCase() == name.toLowerCase()) {
            return item;
        }
    }
    return null;
}
function searchCacheForPartial(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield prepCache();
            yield prepPriceCache();
            const ret = [];
            if (name.length == 0)
                return resolve(ret);
            for (let item of idcache) {
                if (item["name"].toLowerCase().includes(name.toLowerCase()) == true) {
                    ret.push({ name: item["name"], value: item["name"] });
                }
                if (ret.length >= 24)
                    break;
            }
            return resolve(ret);
        }));
    });
}
function replaceSpaces(name) {
    return name.replace(/ /g, "_");
}
function formatNum(price) {
    return price.toLocaleString();
}
let getPrice = {
    name: "price",
    flavor: "runescape",
    data: new discord_js_1.SlashCommandBuilder().setName("price").setDescription("OSRS Price Checker")
        .addStringOption(option => option.setName("item")
        .setDescription("The in-game name of the item to price check.")
        .setRequired(true)
        .setAutocomplete(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const item = String(interaction.options.get("item").value);
            const result = (yield wikiItem(item));
            const price = result["price"], desc = result["desc"];
            if (price) {
                let embed = new discord_js_1.EmbedBuilder().setTitle(item).addFields({ name: "Buy price", value: `${formatNum(price["high"])} gp` }, { name: "Sell price", value: `${formatNum(price["low"])} gp` });
                if (desc["icon"]) {
                    embed = embed.setThumbnail(`https://oldschool.runescape.wiki/images/${replaceSpaces(desc["icon"])}`);
                }
                return interaction.editReply({ embeds: [embed] });
            }
            else {
                return interaction.editReply("Item not found.");
            }
        });
    },
    autocomplete(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = interaction.options.get("item").value;
            return interaction.respond(yield searchCacheForPartial(String(item)));
        });
    }
};
exports.getPrice = getPrice;

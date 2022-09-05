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
const RS_GE = "http://services.runescape.com/m=itemdb_oldschool";
let itemcache = {};
let idcache = null, pricecache = null;
const RS_WIKI_IDS = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES = "https://prices.runescape.wiki/api/v1/osrs/latest";
let idcacheTime = 0, pricecacheTime = 0;
const WAIT_TIME = 1000 * 60 * 60 * 6;
function wikiItem(name, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepCache();
        yield prepPriceCache();
        let id = searchCacheForId(name);
        cb(pricecache[id]);
    });
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
function searchCacheForId(name) {
    for (let item of idcache) {
        if (item.name.toLowerCase() == name.toLowerCase()) {
            return item.id;
        }
    }
    return null;
}
let getPrice = {
    name: "price",
    run: (args, message) => {
        wikiItem(args.slice(1).join(" "), (priceobj) => {
            if (priceobj) {
                message.channel.send("Price: " + priceobj["high"] + "gp");
            }
            else {
                message.channel.send("Item not found.");
            }
        });
    },
    select: (selector) => {
        return selector.rs;
    }
};
exports.getPrice = getPrice;

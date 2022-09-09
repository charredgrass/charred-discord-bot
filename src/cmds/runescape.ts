import {
	Command, 
	MessageLocation, 
	ChannelLocation,
	Selector,
	SCommand
} from "../types/types";

import {
	callAPI
} from "../lib/request";

import {SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js";

const RS_GE : String = "http://services.runescape.com/m=itemdb_oldschool";

let itemcache : Object = {};

let idcache = null, pricecache = null;
const RS_WIKI_IDS : String = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES : String = "https://prices.runescape.wiki/api/v1/osrs/latest";
let idcacheTime : number = 0, pricecacheTime : number = 0;
const WAIT_TIME : number = 1000 * 60 * 60 * 6; //6hr

function wikiItem(name : string) {
	return new Promise(async (resolve, reject) => {
		await prepCache();
		await prepPriceCache();
		let id = searchCacheForId(name);
		resolve(pricecache[id]);
	})
}

//TODO make this work with async and await. need to make promise version of request.ts
function prepCache() : Promise<Object> {
		const promise = new Promise((resolve, reject) => {
			if (!idcache && idcacheTime + WAIT_TIME < Date.now()) { //last updated + 6 hrs is BEFORE current time
				callAPI(RS_WIKI_IDS, (e, r, body)=>{
					if (e) {
						return reject(e);
					}
					let respjson : Object = JSON.parse(body); //TODO err handling
					idcache = respjson;
					resolve(idcache);
					idcacheTime = Date.now();
				}, (err) => {
					console.log(err);
					reject(err);
				});
			} else {
				resolve(idcache);
			}
		});
		return promise;
}

function prepPriceCache() : Promise<Object> {
		const promise = new Promise((resolve, reject) => {
			if (!pricecache && pricecacheTime + WAIT_TIME < Date.now()) { //todo check timestamp on cache
				callAPI(RS_WIKI_PRICES, (e, r, body)=>{
					if (e) {
						return reject(e);
					}
					let respjson : Object = JSON.parse(body).data; //TODO err handling
					pricecache = respjson;
					resolve(pricecache);
					pricecacheTime = Date.now();
				}, (err) => {
					console.log(err);
					reject(err);
				});
			} else {
				resolve(pricecache);
			}
		});
		return promise;
}

function searchCacheForId(name : string) : string {
	for (let item of idcache) {
		if (item.name.toLowerCase() == name.toLowerCase()) { //TODO make a better search function
			return item.id;
		}
	}
	return null;
}

let getPrice : SCommand = {
	name: "price",
	flavor: "runescape",
	data: new SlashCommandBuilder().setName("price").setDescription("OSRS Price Checker")
		.addStringOption(option => 
			option.setName("item")
			  .setDescription("The in-game name of the item to price check.")
			  .setRequired(true)),
	async execute(interaction : ChatInputCommandInteraction) {
		await interaction.deferReply();
		const item = interaction.options.get("item").value;
		const price : Object = await wikiItem(String(item));
		if (price) {
			interaction.editReply(`Price: ${price["high"]} gp`);
		} else {
			interaction.editReply("Item not found.");
		}
	}
}

export {getPrice};
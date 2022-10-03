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

import {
	SlashCommandBuilder, 
	ChatInputCommandInteraction, 
	AutocompleteInteraction,
	EmbedBuilder
} from "discord.js";

const RS_GE : String = "http://services.runescape.com/m=itemdb_oldschool";

let itemcache : Object = {};

let idcache : Object[] = null, pricecache : Object = null;
const RS_WIKI_IDS : String = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES : String = "https://prices.runescape.wiki/api/v1/osrs/latest";
let idcacheTime : number = 0, pricecacheTime : number = 0;
const WAIT_TIME : number = 1000 * 60 * 60 * 6; //6hr

function wikiItem(name : string) : Promise<Object>{
	return new Promise(async (resolve, reject) => {
		await prepCache();
		await prepPriceCache();
		let item = searchCacheForItem(name);
		let ret = {
			price: pricecache[item["id"]],
			desc: item
		}
		resolve(ret);
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
					let respjson : Object[] = JSON.parse(body); //TODO err handling
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

function searchCacheForItem(name : string) : Object {
	for (let item of idcache) {
		if (item["name"].toLowerCase() == name.toLowerCase()) { //TODO make a better search function
			return item;
		}
	}
	return null;
}

//this returns any so it can be cast into a Discord.ApplicationCommandOptionChoiceData<string | number>
//idk how to fix that lol
async function searchCacheForPartial(name : string) : Promise<any[]> {
	return new Promise(async (resolve, reject) => {
			await prepCache();
			await prepPriceCache();
			const ret : any[] = [];
			if (name.length == 0) return resolve(ret);
			for (let item of idcache) {
				if (item["name"].toLowerCase().substring(0,name.length) == name.toLowerCase()) {
					ret.push({name: item["name"], value: item["name"]});
				}
				if (ret.length >= 24) break; //capped size or API will throw err
			}
			return resolve(ret);
		});
}

function replaceSpaces(name : string) : string {
	return name.replace(/ /g, "_");
}

function formatNum(price: number) : string {
	//putting this in a function in case I want to set options
	return price.toLocaleString();
}

let getPrice : SCommand = {
	name: "price",
	flavor: "runescape",
	data: new SlashCommandBuilder().setName("price").setDescription("OSRS Price Checker")
		.addStringOption(option => 
			option.setName("item")
			  .setDescription("The in-game name of the item to price check.")
			  .setRequired(true)
			  .setAutocomplete(true)),
	async execute(interaction : ChatInputCommandInteraction) {
		await interaction.deferReply();
		const item : string = String(interaction.options.get("item").value);
		const result : Object = (await wikiItem(item));
		const price : Object = result["price"], desc : Object = result["desc"];
		if (price) {
			let embed : EmbedBuilder = new EmbedBuilder().setTitle(item).addFields(
					{name: "Buy price", value: `${formatNum(price["high"])} gp`},
					{name: "Sell price", value: `${formatNum(price["low"])} gp`}
				);
			if (desc["icon"]){
				embed = embed.setThumbnail(`https://oldschool.runescape.wiki/images/${replaceSpaces(desc["icon"])}`)
			}
			return interaction.editReply({embeds: [embed]});
		} else {
			return interaction.editReply("Item not found.");
		}
	},
	async autocomplete(interaction : AutocompleteInteraction) {
		const item = interaction.options.get("item").value;
		return interaction.respond(await searchCacheForPartial(String(item)));
	}
}

export {getPrice};
import {
	Command, 
	MessageLocation, 
	ChannelLocation,
	Selector
} from "../types/types";

import {
	callAPI
} from "../lib/request"

const RS_GE : String = "http://services.runescape.com/m=itemdb_oldschool";

let itemcache : Object = {};

let pingAPI : Command = {
	name: "pingapi",
	run: (args, message) => {
		callAPI(RS_GE + "/api/info.json", (e, r, body) => {
			let respjson;
			try {
				respjson = JSON.parse(body);
				message.channel.send("API last update Runedate=" + respjson.lastConfigUpdateRuneday);
			} catch (err) {
				message.channel.send("API Error: malformed response");
				return;
			}

		}, console.log);
		// message.channel.send("pongapi");
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
};

function scanGE(name, cb, letter, pnum) {
	console.log(`Scanning page ${pnum} for ${name}`)
	callAPI(RS_GE + "/api/catalogue/items.json?category=1&alpha=" + letter + "&page=" + pnum, (e, r, body) => {
		let respjson;
		try {
			respjson = JSON.parse(body);
			let {items} = respjson;
			if (items.length == 0) {
				cb(false, null);
				return;
			}
			for (let item of items) {
				if (item.name.toLowerCase() == name.toLowerCase()) {
					console.log("hit")
					cb(true, item);
					return;
				}
			}
			//try next page
			scanGE(name, cb, letter, pnum + 1);
		} catch (err) {
			console.log(err);
			return null;
		}
	}, console.log);
}

//callback: true if found, 
//TODO use axios to get out of callback hell
//theres something smart with await in here
function findItem(name : string, cb : Function) {

	let firstLetter = name.toLowerCase()[0];
	scanGE(name, cb, firstLetter, 1);
}

let idcache = null;
let pricecache = null;
const RS_WIKI_IDS : String = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES : String = "https://prices.runescape.wiki/api/v1/osrs/latest";



async function wikiItem(name: string, cb: Function) {
	await prepCache();
	await prepPriceCache();
	// console.log(idcache);
	// console.log(name);
	let id = searchCacheForId(name);
	// console.log(id);
	cb(pricecache[id]);

}

//TODO make this work with async and await. need to make promise version of request.ts
function prepCache() : Promise<Object> {
		const promise = new Promise((resolve, reject) => {
			if (!idcache) { //todo check timestamp on cache
				callAPI(RS_WIKI_IDS, (e, r, body)=>{
					if (e) {
						return reject(e);
					}
					let respjson : Object = JSON.parse(body); //TODO err handling
					idcache = respjson;
					resolve(idcache);
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
			if (!pricecache) { //todo check timestamp on cache
				callAPI(RS_WIKI_PRICES, (e, r, body)=>{
					if (e) {
						return reject(e);
					}
					let respjson : Object = JSON.parse(body).data; //TODO err handling
					pricecache = respjson;
					resolve(pricecache);
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

let getGEPrice : Command = {
	name: "price",
	run: (args, message) => {
		if (args.length == 1) {
			message.channel.send("Usage: `!price <item>`");
		} else {
			let itemName = args.slice(1).join(" ");
			message.channel.sendTyping();
			let item = findItem(itemName, (isFound : boolean, item : Object) => {
				if (isFound === true) {
					message.channel.send("Price: " + item["current"]["price"])
				} else {
					message.channel.send("Item not found.");
				}
			});
		}
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
}

let getWikiPrice : Command = {
	name: "price",
	run: (args, message) => {
		wikiItem(args.slice(1).join(" "), (priceobj : Object) => {
			if (priceobj) {
				message.channel.send("Price: " + priceobj["high"] + "gp"); //TODO add commas
			} else {
				message.channel.send("Item not found.");
			}
			
		});
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
}

export {pingAPI, getWikiPrice};
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
function findItem(name : String, cb : Function) {

	let firstLetter = name.toLowerCase()[0];
	scanGE(name, cb, firstLetter, 1);
}

let idcache = null;
const RS_WIKI_IDS : String = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const RS_WIKI_PRICES : String = "https://prices.runescape.wiki/api/v1/osrs/latest";

async function wikiItem(name : String, cb : Function) {
	if (!idcache) {
		await callAPI(RS_WIKI_IDS, (e, r, body)=>{
			let respjson : Object = JSON.parse(body);
			console.log(respjson);
		}, console.log);
	}
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
		wikiItem(null, null);
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
}

export {pingAPI, getWikiPrice};
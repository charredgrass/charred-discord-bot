import {
	Command, 
	MessageLocation, 
	ChannelLocation,
	Selector
} from "../types/types";

import {
	callAPI
} from "../lib/request"

let pingAPI : Command = {
	name: "pingapi",
	run: (args, message) => {
		callAPI("https://secure.runescape.com/m=itemdb_oldschool/api/info.json", (e, r, body) => {
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

let getGEPirce : Command = {
	name: "price",
	run: (args, message) => {

	},
	select: (selector : Selector) => {
		return selector.rs;
	}
}

export {pingAPI};
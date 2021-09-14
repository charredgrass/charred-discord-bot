import {
	Command, 
	Selector
} from "../types/types";

import {
	binompdf
} from "../lib/statmath";

let howDry : Command = {
	name: "dry",
	run: (args, message) => {
		if (args[1] && args[1].match(/1\/\d+/)) {
			args[1] = args[1].slice(2);
		}
		let odds = Number(args[1]);
		let kc = Number(args[2]);
		if (isNaN(odds) || isNaN(kc)) {
			return message.channel.send("invalid arguments");
		}
		message.channel.send(`Chance of getting a 1/${odds} drop at or before ${kc} kc is ${(100*(1 - binompdf(kc, 1/odds, 0)))}%`);
		// message.channel.send("pongapi");
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
};

export {howDry};
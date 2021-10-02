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
			return message.channel.send("Invalid arguments. Syntax: !dry 1/[droprate] [kc]");
		}
		message.channel.send(`Chance of getting a 1/${odds} drop at or before ${kc} kc is ${(100*(1 - binompdf(kc, 1/odds, 0)))}%`);
		// message.channel.send("pongapi");
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
};

let chanceBelow : Command = {
	name: "chance",
	run: (args, message) => {
		if (args[1] && args[1].match(/1\/\d+/)) {
			args[1] = args[1].slice(2);
		}
		let odds = Number(args[1]);
		let kc = Number(args[2]);
		let drops = Number(args[3]);
		if (isNaN(odds) || isNaN(kc) || isNaN(drops)) {
			return message.channel.send("Invalid arguments. Syntax: !chance 1/[droprate] [kc] [number of drops]");
		}
		let chance = 0;
		//chance = sum from i = 0 to drops-1 of binompdf(kc, 1/odds, i)
		for (let i = 0; i < drops; i++) {
			console.log(chance);
			console.log(binompdf(kc, 1/odds, i));
			chance += binompdf(kc, 1/odds, i);
		}
		message.channel.send(`Chance of getting ${drops} or more of a 1/${odds} drop at or before ${kc} kc is ${(100*(1 - chance))}%`);
		// message.channel.send("pongapi");
	},
	select: (selector : Selector) => {
		return selector.rs;
	}
};

export {howDry, chanceBelow};
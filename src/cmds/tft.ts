import {
	Command, 
	Selector
} from "../types/types";

const PROBS : [string, number][] = [
	["ssg", 30], ["sgg", 18], ["gsg", 12], ["ssp", 9], ["ggg", 7], ["sgp", 4],
	["ggp", 4], ["gsp", 4], ["sps", 3], ["pgg", 2], ["psg", 2], ["gpg", 2],
	["psp", 1], ["ppp", 1], ["spp", 1]
]

let augprob : Command = {
	"name": "augprob",
	run: (args, message) => {
		let auglist = args[1];
		let percentages = PROBS.filter(p => p[0].indexOf(auglist) === 0);
		if (percentages.length === 0) {
			return message.channel.send("invalid augment outcome")
		}
		return message.channel.send(percentages.toString());
	},
	select: (selector : Selector) => {
		return selector.dms;
	}
};

export {augprob};
import {
	Command, 
	Selector
} from "../types/types";

const PROBABILITIES : [string, number][] = [
	["ssg", 30], ["sgg", 18], ["gsg", 12], ["ssp", 9], ["ggg", 7], ["sgp", 4],
	["ggp", 4], ["gsp", 4], ["sps", 3], ["pgg", 2], ["psg", 2], ["gpg", 2],
	["psp", 1], ["ppp", 1], ["spp", 1]
]

let augprob : Command = {
	"name": "augprob",
	run: (args, message) => {
		return message.channel.send("100%");
	},
	select: (selector : Selector) => {
		return selector.dms;
	}
};

export {augprob};
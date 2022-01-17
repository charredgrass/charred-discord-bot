import {
	Command, 
	Selector
} from "../types/types";

import {
	binompdf
} from "../lib/statmath";

const HARDPITY = 90;

//probability mass function obtained from 
//https://www.reddit.com/r/Genshin_Impact/comments/rtqdl2/guide_how_many_wishes_you_should_save/
//Given a banner with Pr(any 5-star) = p, pmf is defined as Pr(getting the 5-star in exactly n)
function pullpmf(n , p ) {
	let d = p * 10; //soft pity value 
	if (n <= 0) {
		return 0; //pmf not defined 
	} else if (n <= 73) {
		return p * Math.pow(1 - p, n - 1);
		//Pr(n) = Pr(5 star this pull) * Pr(no 5-star on previous n-1 pulls)
	} else if (n <= 89) {
		let res = Math.pow(1 - p, 73) * (p + (n - 73)*d);
		for (let i = 1; i <= n - 74; i++) {
			res *= 1 - p - n*d;
		}
		//Pr(no 5-star on first 73 ∩ no 5-star on previous soft-pity increased pulls)
		return res;
	} else {
		return 0; //pmf not defined
	}
}

let chanceIn : Command = {
	name: "chancein",
	run: (args, message) => {
		let pulls = Number(args[1]);
		if (isNaN(pulls)) {
			return message.channel.send("Invalid arguments. Syntax: !chancein [kc]");
		}
		if (pulls >= HARDPITY * 2) {
			return message.channel.send("You are guaranteed.")
		}
	},
	select: (selector: Selector) => {
		return selector.dms;
	}
}
const fs = require('fs');

function readFile(file) {
	let x = JSON.parse(fs.readFileSync(file).toString("utf-8"));
	console.log(x);
}

class VoteManager {
	constructor(file, candidates, emoji) {
		this.votes = [];
		this.file = file;
		this.candidates = candidates;
		this.emoji = emoji;
		this.loadVotes();
	}

	loadVotes() {
		this.votes = JSON.parse(fs.readFileSync(this.file).toString("utf-8")).votes;
	}

	saveVotes() {
		fs.writeFileSync(this.file, JSON.stringify({
			"votes": this.votes
		}, null, 4));
	}

	//returns the handler function that will be passed into the Voter 
	getHandle() {
		let h = (data) => {
			let args = data.args;
			if (!args[1] && !args[2]) {
				data.send("Invalid syntax. Usage: !vote [candidate] [emoji]")
			} else {
				if (this.candidates.indexOf(args[1].toLowerCase()) >= 0) {
					if (this.emoji.indexOf(args[2]) >= 0) {
						this.votes.push({
							"id": data.message.author.id,
							"name": data.message.author.tag, //only gives the voter's tag at that time. use id for uniqueness, this may change.
							"vote": args[1],
							"emoji": args[2],
							"time": Date.now()
						});
						this.saveVotes();
						data.send("You voted " + args[2] + " for " + args[1] + ".");
					} else {
						data.send("Not a valid emoji. The choices are: " + this.emoji.join(", "))
					}
				} else {
					data.send("Not a valid option. The choices are: " + this.candidates.join(", "))
				}
			}
			// readFile(this.file);
		}
		return h;
	}

	//returns the Voter that is given to the main bot to check and handle commands.
	getVoter() {
		let voter = {
			handle: this.getHandle(),
			check: (args, selector, channelName) => {
				if (args[0] == "!vote" && selector.dms === true) {
					return true;
				}
			}
		}
		return voter;
	}
}

module.exports = {
	VoteManager
};
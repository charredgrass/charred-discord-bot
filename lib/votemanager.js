const fs = require('fs');

function readFile(file) {
	let x = JSON.parse(fs.readFileSync(file).toString("utf-8"));
	console.log(x);
}

function addVote() {

}

class VoteManager {
	constructor(file) {
		this.votes = [];
		this.file = file;
		this.candidates = ["a", "b", "c", "d"];
		this.loadVotes();
	}

	loadVotes() {
		this.votes = JSON.parse(fs.readFileSync(this.file).toString("utf-8")).votes;
	}

	saveVotes() {
		fs.writeFileSync(this.file, JSON.stringify({
			"votes": this.votes
		}));
	}

	//returns the handler function that will be passed into the Voter 
	getHandle() {
		let h = (data) => {
			let args = data.args;
			if (!args[1]) {
				data.send("Invalid syntax. Usage: !vote [candidate]")
			} else {
				if (this.candidates.indexOf(args[1]) >= 0) {
					this.votes.push({
						"id": data.message.author.id,
						"name": data.message.author.tag,
						"vote": args[1]
					});
					this.saveVotes();
					data.send("You voted for " + args[1] + ".");
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
const fs = require('fs');

function readFile(file) {
	let x = JSON.parse(fs.readFileSync(file).toString("utf-8"));
	console.log(x);
}

class VoteManager {
	constructor(file, candidates, emoji, count) {
		this.votes = [];
		this.file = file;
		this.candidates = candidates;
		this.emoji = emoji;
		this.count = count; //the amount each emoji counts for

		this.title = "Poll"
		this.description = "This is a test poll."
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

	getStartHandle() {
		let h = (data) => {
			if (data.isAdmin === true) {
				let embed = new data.Discord.MessageEmbed();
				embed.setColor('#b8caff').setTitle("Poll: " + this.title)
					.setDescription(this.description)
					.addFields({
						name: "Choices",
						value: "The choices are: " + this.candidates.join(", ")
					}, {
						name: "How to Vote",
						value: "Everyone has a :snowflake: vote and a :heart: vote. :heart: is worth 2.\n" +
							"Vote command is `!vote [choice] [emoji]`. Example: !vote A :heart:\n" +
							"You must DM this command to the bot.\n" +
							"If you vote with the same emoji multiple times, the most recent vote will be counted."
					});
				data.send(embed);
			} else {
				data.send("You must be an admin to use this command.");
			}
		}
		return h;
	}

	getVoteStarter() {
		let starter = {
			handle: this.getStartHandle(),
			check: (args, selector, channelName) => {
				if (args[0] == "!startvote") {
					return true;
				}
			}
		}
		return starter;
	}

	getCountHandle() {
		let h = (data) => {
			if (data.isAdmin === true) {
				//Start by sorting votes from oldest to newest (.time property increasing)
				this.votes.sort((a, b) => {
					return a.time - b.time; //b.time > a.time -> b happens after a -> return negative
				});

				//lets make a list of unique people who voted
				let peopleSet = new Set();
				for (let v of this.votes) {
					peopleSet.add(v.id);
				}
				let people = [...peopleSet]; //convert to array using spread operator

				let effectiveVotes = {}; //votes that count

				for (let person of people) {
					effectiveVotes[person] = [];
					let triggers = new Array(this.emoji.length).fill(0);
					let maxAmts = new Array(this.emoji.length).fill(1); //hardcoded for now - max 1 vote ea
					//idea: what if we stored votes by person instead of just as a fat list of votes?
					//yeah i'll implement this when i wake up tomorrow
					//i swear theres a mega smart hash functiony way to do this that im not seeing
					for (let j = 0; j < this.emoji.length; j++) { //for each emoji
						for (let i = this.votes.length - 1; i >= 0; i--) { //start from newest
							if (triggers[j] >= maxAmts[j]) break; //if we have reached the vote limit, finish emoji
							if (this.votes[i].id === person && this.votes[i].emoji === this.emoji[j]) {
								effectiveVotes[person].push(this.votes[i]);
								triggers[j]++;
							}
						}
					}
				}
				console.log(effectiveVotes);

			} else {
				data.send("You must be an admin to use this command.");
			}
		}
		return h;
	}

	getVoteCounter() {
		let counter = {
			handle: this.getCountHandle(),
			check: (args, selector, channelName) => {
				if (args[0] == "!countvotes") {
					return true;
				}
			}
		}
		return counter;
	}
}

module.exports = {
	VoteManager
};
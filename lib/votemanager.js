const fs = require('fs');

function readFile(file) {
	let x = JSON.parse(fs.readFileSync(file).toString("utf-8"));
	console.log(x);
}

class VoteManager {
	constructor(file, vipfile, candidates, emoji, count) {
		this.votes = {};
		this.file = file;
		this.candidates = candidates;
		this.emoji = emoji;
		this.count = count; //the amount each emoji counts for. Why did i not name this weights
		this.vips = {}
		this.vipfile = vipfile; //file of ppl who get extra vote treatment

		this.title = "Banner Contest Voting"
		this.description = "Vote for your favorite banner entries from the selection above. The design that receives the most votes will be used on the server."
		this.loadVotes();
		this.loadVips();
	}

	loadVotes() {
		this.votes = JSON.parse(fs.readFileSync(this.file).toString("utf-8")).votes;
	}

	saveVotes() {
		fs.writeFileSync(this.file, JSON.stringify({
			"votes": this.votes
		}, null, 4));
	}

	loadVips() {
		this.vips = JSON.parse(fs.readFileSync(this.vipfile).toString("utf-8")).vips;
	}

	invalidateVotes(author) {
		let ballot = this.votes[author];
		for (let vote of ballot) {
			vote.valid = false;
		}
	}

	validateVotes(author) {
		let ballot = this.votes[author]; //array of author's votes
		this.invalidateVotes(author);
		let votemaxes = new Array(this.emoji.length).fill(1); //VOTE_MAXES[i] == max number of this.emoji[i] votes.
		//votemaxes is the DEFAULT value of the max nr. of votes. overridden by this.vips
		//assert VOTE_MAXES.length == this.emoji.length
		ballot.sort((a, b) => { //order the votes from oldest to newest
			return a.time - b.time; //b.time > a.time -> b happens after a -> return negative
		});

		//for each emoji - look at each vote (newest -> oldest) until you get VOTE_MAXES[i] emoji
		for (let i = 0; i < this.emoji.length; i++) {
			let count = 0;
			let emojimax = votemaxes[i];
			//if user is a VIP, override it with their VIP thing
			if (this.vips[author] && this.vips[author].votes[i]) {
				emojimax = this.vips[author].votes[i];
			}
			for (let j = ballot.length - 1; j >= 0; j--) {
				let curr = ballot[j];
				if (curr.emoji == this.emoji[i]) {
					count++;
					curr.valid = true;
				}
				if (count >= emojimax) {
					break;
				}
			}
		}
	}

	//returns the handler function that will be passed into the Voter 
	getHandle() {
		let h = (data) => {
			let args = data.args;
			if (!args[1] && !args[2]) {
				data.send("Invalid syntax. Usage: !vote [emoji] [choice]")
			} else {
				if (this.candidates.indexOf(args[2].toLowerCase()) >= 0) {
					if (this.emoji.indexOf(args[1]) >= 0) {
						let author = data.message.author.id; //this is a string. i should use TypeScript
						if (!this.votes[author]) { //make the voter field if it DNE
							this.votes[author] = [];
						}
						this.votes[author].push({
							id: author, //this is redundant.
							name: data.message.author.tag, //voter's Discord username#numericDiscrim. CAN CHANGE
							vote: args[2], //vote data
							emoji: args[1],
							time: Date.now(), //timestamped
							valid: false //part of internal mechanism for checking vote
						});
						this.validateVotes(author);
						this.saveVotes();
						//TODO update this to display what the user votes are in a pretty embed
						data.send("You voted " + args[1] + " for " + args[2] + ".");
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
						value: "Everyone has one :snowflake: vote and one :heart: vote. :heart: is worth 2.\n" +
							"Regulars (green name) have an extra :snowflake: vote." + 
							"Vote command is `!vote [emoji] [choice]`. Example: !vote :heart: pepperoni\n" +
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
				//For each voter in votes, return the count of votes by weight.
				let tally = {};
				for (let cand of this.candidates) {
					tally[cand] = 0;
				}
				let weight = {};
				for (let i in this.emoji) {
					weight[this.emoji[i]] = this.count[i]; 
				}
				for (let voter in this.votes) {
					let ballot = this.votes[voter];
					for (let vote of ballot) {
						if (vote.valid === true) {
							tally[vote.vote] += weight[vote.emoji];
							//great variable name
						}
					}
				}
				// console.log(JSON.stringify(tally));
				data.send(JSON.stringify(tally));

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
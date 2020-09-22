let voter = {
	handle: (data) => {
		data.send("pong");
		//check db to see how many things user has left
	},
	check: (args, selector, channelName) => {
		if (args[0] == "!vote" && args[1] && selector.dms === true) {
			return true;
		}
	}
}
module.exports = voter;
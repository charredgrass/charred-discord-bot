

//return null if it isn't a command
function argsplit(message) {
	message = message.toString()
	let p = message.search(/^\s*!(\w).*/);
	if (p < 0) {
		return null;	
	}
	//now remove leading spaces and doublespaces
	message = message.replace(/^\s*/, "").replace(/\s+/g, " ");
	args = message.split(" ");
	return args;
}

module.exports = {
	argsplit
}
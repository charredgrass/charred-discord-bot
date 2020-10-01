var colors = require('colors/safe');

function zpad(text, length) {
	text = "" + text
	if (String(text).length >= length) {
		return text;
	} else {
		return "0"*(length - String(text).length) + text;
	}
}

function currTime() {
	let d = new Date();
	ret = "";
	ret += zpad(d.getHours(), 2) + ":" + zpad(d.getMinutes(), 2) + ":" +  zpad(d.getSeconds(), 2);
	return ret;
}

function log(message) {
	console.log(colors.white("[ERR]" + "[" + currTime() + "] " + message));
}

function warn(message) {
	console.log(colors.yellow("[ERR]" + "[" + currTime() + "] " + message));
}

function error(message) {
	console.log(colors.red("[ERR]" + "[" + currTime() + "] " + message));
}

module.exports = {
	log, warn, error
}
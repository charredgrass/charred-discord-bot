
let linalg = require("linalg.js");
let text = require("pretty.js");

function linalg_rref(args, cb) {
	let mat = text.textToMat(args);
	if (!mat) cb("Invalid format.");
	else {
		mat = linalg.rref(mat);
		let ret = text.matTxt(mat, "b", "\n", true);
		cb(ret); 
	}
}

module.exports = {
	linalg_rref
};
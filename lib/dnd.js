function dieAvg(die) {
	return Math.floor((die - 1) / 2);
}

function dieAvgC(die) {
	return Math.ceil((die - 1) / 2);
}

function getHP(hitdie, level, con) {
	return hitdie +
		(level - 1) * dieAvgC(hitdie) +
		(level * con);
}

module.exports = {
	getHP
};
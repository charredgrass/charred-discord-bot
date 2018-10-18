function dieAvg(die) {
  return Math.floor((die + 1) / 2);
}

function dieAvgC(die) {
  return Math.ceil((die + 1) / 2);
}

function getHP(hitdie, level, con) {
  return hitdie +
      (level - 1) * dieAvgC(hitdie) +
      (level * con);
}

function hpCommand(args, send, server) {
  if (server.dnd) {
    let level = Number(args[1]);
    let con = Number(args[2]);

    const classes =  ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin",
      "ranger", "rogue", "sorcerer", "warlock", "wizard"];
    const hitDice = [12, 8, 8, 8, 10, 8, 10, 10, 8, 6, 8, 6];
    if (classes.includes(args[0]) === true && isNaN(level) === false
        && isNaN(con) === false) {
      let hd = hitDice[classes.indexOf(args[0])];
      send(getHP(hd, level, con) + " HP");
    } else {
      send("!hp [class] [level] [con mod]");
    }
  }
}

module.exports = {
  hpCommand
};
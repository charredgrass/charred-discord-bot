const utils = require("./utils.js");

function dieAvg(die) {
  return Math.floor((die + 1) / 2);
}

function dieAvgC(die) {
  return Math.ceil((die + 1) / 2);
}

function getHP(hitdie, level, con, hillDwarf) {
  return hitdie +
      (level - 1) * dieAvgC(hitdie) +
      (level * con) + (hillDwarf ? level : 0);
}

function hpCommand(args, send, server) {
  if (server.dnd) {
    let level = Number(args[1]);
    let con = Number(args[2]);
    let isHillDwarf = (args[3] === "hdwarf" || args[3] === "hd" || args[3] === "hill");

    const classes =  ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin",
      "ranger", "rogue", "sorcerer", "warlock", "wizard"];
    const hitDice = [12, 8, 8, 8, 10, 8, 10, 10, 8, 6, 8, 6];
    if (classes.includes(args[0]) === true && isNaN(level) === false
        && isNaN(con) === false) {
      let hd = hitDice[classes.indexOf(args[0])];
      let topLine = "```", botLine = "";
      topLine += "base HP + levelup HP + CON bonus";
      botLine += utils.center("" + hd,8) + "+" + utils.center("" + ((level - 1) * dieAvgC(hd)),12)
        + "+" + utils.center("" + (level * con), 10) + "";
      if (isHillDwarf === true) {
        topLine += " + Hill Dwarf";
        botLine += " +" + utils.center("" + level, 11);
      }
      let finalResult = "\t= " + getHP(hd, level, con, isHillDwarf) + " HP```";



      send(topLine + "\n" + botLine + "\n" + finalResult);
    } else {
      send("!hp [class] [level] [con mod]");
    }
  }
}

module.exports = {
  hpCommand
};
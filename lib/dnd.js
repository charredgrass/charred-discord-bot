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
      (level * con) +
      (hillDwarf ? level : 0);
}


/**
 * @param {String[]} classes
 * @param {Number[]} hitdice
 * @param {Number[]} levels
 * @param {Number} con
 * @param {boolean} hillDwarf
 * @returns ?Object
 */
function getHPMulticlass(classes, hitdice, levels, con, hillDwarf) {
  if (hitdice.length !== levels.length || hitdice.length === 0) {
    return null;
  }
  let totalHP = 0, level = 0;
  let log = [];
  totalHP += hitdice[0] + dieAvgC(hitdice[0]) * (levels[0] - 1);
  log.push(["Base HP", hitdice[0]]);
  level += levels[0];
  if (levels[0] >= 1) {
    log.push([classes[0] + " HP", dieAvgC(hitdice[0]) * (levels[0] - 1)]);
  }
  for (let i = 1; i < hitdice.length; i++) {
    let currHD = Number(hitdice[i]);
    let currLv = Number(levels[i]);
    if (isNaN(currHD) === true || isNaN(currLv) === true) {
      return null;
    }
    totalHP += dieAvgC(currHD) * currLv;
    log.push([classes[i] + " HP", dieAvgC(currHD) * currLv]);
    level += currLv;
  }
  totalHP += level * con;
  log.push(["CON bonus", level * con]);
  totalHP += (hillDwarf ? level : 0);
  if (hillDwarf === true) log.push(["Hill Dwarf", level]);
  return {
    hp: totalHP,
    log
  };
}

function hpCommandAdvanced(args, send, server) {
  if (server.dnd) {
    const classes =  ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin",
      "ranger", "rogue", "sorcerer", "warlock", "wizard"];
    const hitDice = [12, 8, 8, 8, 10, 8, 10, 10, 8, 6, 8, 6];

    let prevClass = null;
    let playerHD = [], playerLv = [], playerClasses = [];
    let con;
    for (let i = 0; i < args.length; i++) {
      if (classes.includes(args[i]) === true) {
        prevClass = args[i];
      } else if (prevClass) {
        let cArg = Number(args[i]);
        if (isNaN(cArg) === true) {
          send("Incorrect syntax.");
          return;
        } else {
          playerClasses.push(prevClass);
          playerLv.push(cArg);
          playerHD.push(hitDice[classes.indexOf(prevClass)]);
          prevClass = null;
        }
      } else {
        if (!con) {
          con = Number(args[i]);
        }
      }
    }
    let ret = getHPMulticlass(playerClasses, playerHD, playerLv, con, false);
    if (ret) {
      let topLine = "```";
      let botLine = "";

      //for each item in log
      //get the longer text length, center both on that number
      //push to text display

      for (let i = 0; i < ret.log.length; i++) {
        let top = String(ret.log[i][0]);
        let bot = String(ret.log[i][1]);
        let biggerLength = (top.length > bot.length ? top.length : bot.length);
        topLine += utils.center(top, biggerLength);
        botLine += utils.center(bot, biggerLength);
        if (i !== ret.log.length - 1) {
          topLine += " + ";
          botLine += " + ";
        }
      }
      let lastLine = "\t= " + ret.hp + " HP";
      send(topLine + "\n" + botLine + "\n" + lastLine + "```");
    } else {
      send("!hp [class] [level] [CON modifier]\nExamples:\n!hp wizard 3 3 \n!hp rogue 2 fighter 2 3");
    }
  }
}

function hpCommand(args, send, server) {
  if (server.dnd) {
    let level = Number(args[1]);
    let con = Number(args[2]);
    let isHillDwarf = (args[3] === "hdwarf" || args[3] === "hd" || args[3] === "hill");
    //i'll probably need to add something to parse this properly when i have lots of stray args
    //by lots i mean more than 1, like that feat thing

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
  hpCommand,
  hpCommandAdvanced
};
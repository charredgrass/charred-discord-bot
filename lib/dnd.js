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
 * @param {boolean} tough
 * @returns ?Object
 */
function getHPMulticlass(classes, hitdice, levels, con, hillDwarf, tough) {
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
  if (hillDwarf === true) {
    totalHP += level;
    log.push(["Hill Dwarf", level]);
  }
  if (tough === true) {
    totalHP += level * 2;
    log.push(["Tough", level * 2]);
  }
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
    let isHillDwarf = false, isTough = false;
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
        if (args[i] === "hd" || args[i] === "hilldwarf") {
          isHillDwarf = true;
        } else if (args[i] === "tough") {
          isTough = true;
        } else if (!con) {
          con = Number(args[i]);
          if (isNaN(con) === true) {
            send("Incorrect syntax.");
            return;
          }
        }
      }
    }
    let ret = getHPMulticlass(playerClasses, playerHD, playerLv, con, isHillDwarf, isTough);
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

function coinsToWeight(args, send, server) {
  if (!server.dnd) return;
  //ok so now parse the args in a smart way
  let text = args.join();
  //its regex time
  //will_smith.jpg
  let coinsRegs = [];
  //cp sp gp ep pp
  const COINVALS = [1, 10, 100, 50, 1000];
  coinsRegs.push(text.match(/(\d+)cp/));
  coinsRegs.push(text.match(/(\d+)sp/));
  coinsRegs.push(text.match(/(\d+)gp/));
  coinsRegs.push(text.match(/(\d+)ep/));
  coinsRegs.push(text.match(/(\d+)pp/));
  let coinsAmts = [];
  let coins = 0;
  let money = 0;
  for (let i = 0; i < coinsRegs.length; i++) {
    if (coinsRegs[i]) {
      let amt = parseInt(coinsRegs[i][1]);
      coinsAmts.push(amt);
      coins += amt;
      money += parseInt(amt * COINVALS[i]);
    } else {
      coinsAmts.push(null);
    }
  }
  console.log(coinsAmts);
  console.log(money);
  send("That is worth about " + (money/100) +
      " gp, but Javascript rounding sucks so that's probably a weird floating point number that I'll fix later.\n" +
      "It weighs about " + (coins/50) + " pounds depending on what rules you use.");
}
module.exports = {
  hpCommandAdvanced,
  coinsToWeight
};
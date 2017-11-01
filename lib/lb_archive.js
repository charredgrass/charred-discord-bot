var table = require('./table.js').table;

const fs = require("fs")

function LBArchive(loc, seasons) {
  this.seasons = seasons;
  this.loc = loc;
}

LBArchive.prototype.getPastGDObject = function(season) {
  return JSON.parse(fs.readFileSync(this.loc + "season" + season + ".json"));
};

LBArchive.prototype.getLeaderFromGD = function(gd, len, tnam) {
  let ret = [];
  let temp = [];
  //I know this will fail if there is nothing in gd.players but I don't care.
  for (let i = 0; i < gd.players.length; i++) {
    temp.push(gd.players[i]);
  }
  while (temp.length > 0) {
    let highest = 0;
    for (let i = 1; i < temp.length; i++) {
      if (temp[i].credits > temp[highest].credits) highest = i;
    }
    ret.push(temp.splice(highest, 1)[0]);
  }
  let toPass = [];
  for (let i = 0; i < ret.length && i < len; i++) {
    toPass.push([i + 1, ret[i].name, ret[i].credits]);
  }
  //"The leaderboard will reset on Wednesday, November 1st, and several balance changes will be added to the game. When the reset occurs, the high scores will be recorded for bragging rights and glory.\n
  return "```" + table(tnam, ["#", "Player", "Credits"], toPass, {
    title: 33,
    headers: [2, 20, 9]
  }) + "```";
};

LBArchive.prototype.seasonLB = function(snumber) {
  if (snumber > seasons || snumber <= 0) snumber = 1;
  return this.getLeaderFromGD(this.getPastGDObject(1), 10, "Season " + parseInt(snumber));
};

module.exports = {
  LBArchive
};
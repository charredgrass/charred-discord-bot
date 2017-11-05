var dutils = require("./deck.js");
var slots = require("./slots.js");
var table = require("./table.js").table;

var Deck = dutils.Deck;
var dealerAction = dutils.dealerAction;
// var totalValue = dutils.totalValue;
var allPossibleValues = dutils.allPossibleValues;
var bestOfValues = dutils.bestOfValues;

function CurrentGame(type, bet, payout, gd) {
  this.type = type;
  this.bet = bet;
  this.scoredata = {};
  this.person = payout;
  this.gd = gd;
  this.finished = false;
}

CurrentGame.prototype.start = function(cb) {
  if (this.type == "blackjack") {
    this.scoredata.deck = new Deck();
    this.scoredata.dealer_hand = [this.scoredata.deck.top(), this.scoredata.deck.top()];
    this.scoredata.player_hand = [this.scoredata.deck.top(), this.scoredata.deck.top()];
    if (bestOfValues(allPossibleValues(this.scoredata.player_hand)) == 21) {
      this.finish(cb);
      return;
    }
    cb("Dealer Hand: " + this.scoredata.dealer_hand[0] + ",??\nYour Hand: " + this.scoredata.player_hand.join(","));
  }
  return this.scoredata;
};

CurrentGame.prototype.run = function(params, cb) {
  if (this.finished === true) {
    return;
  }
  if (this.type == "blackjack") {
    if (params[0] == "hit") {
      this.scoredata.player_hand.push(this.scoredata.deck.top());
      let pbest = bestOfValues(allPossibleValues(this.scoredata.player_hand));
      if (pbest == 21) {
        this.finish(cb);
        return;
      }
      if (pbest > 21) { //this calculation is false somehow
        this.finish(cb);
      } else {
        cb("Your hand is " + this.scoredata.player_hand.join(",") + ".");
      }
    } else if (params[0] == "stand") {
      this.finish(cb);
    }
  }
};

// function betterNonBust(hand) {
//   let x = totalValue(hand, true);
//   let y = totalValue(hand, false);
//   if (x > 21) return y;
//   else return x;
// }

CurrentGame.prototype.finish = function(cb) {
  this.finished = true;
  if (this.type == "blackjack") {
    let dealer_going = dealerAction(this.scoredata.dealer_hand);
    while (dealer_going) {
      this.scoredata.dealer_hand.push(this.scoredata.deck.top());
      dealer_going = dealerAction(this.scoredata.dealer_hand);
    }
    let dbest = bestOfValues(allPossibleValues(this.scoredata.dealer_hand));
    let pbest = bestOfValues(allPossibleValues(this.scoredata.player_hand));
    // let dbj = totalValue(this.scoredata.dealer_hand, true) == 21 || totalValue(this.scoredata.dealer_hand, false) === 21;
    // let pbj = totalValue(this.scoredata.player_hand, true) == 21 || totalValue(this.scoredata.player_hand, false) === 21; //lol pbj
    let dbj = dbest == 21;
    let pbj = pbest == 21;
    if (dbj && pbj) {
      cb("It's a tie! Both blackjack.\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet * 1.1);
      return;
    }
    if (pbj) {
      cb("Blackjack!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, parseInt(this.bet * 3.5));
      return;
    }
    if (dbj) {
      cb("You lose!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.addKarma(this.person, this.bet);
      return;
    }
    if (pbest > 21) {
      cb("You busted! Idiot!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.addKarma(this.person, this.bet);
      return;
    }
    if (dbest > 21) {
      cb("Dealer busted, you win!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet * 2.5);
      return;
    }
    if (dbest == pbest) {
      cb("It's a tie!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet);
      return;
    }
    if (dbest > pbest) {
      cb("Dealer wins!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      return;
    } else {
      cb("You win!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet * 2.5);
    }
  }
};

// GameData class
// Contains data object of all players

function GameData(gamedata) {
  this.data = gamedata;
}

GameData.prototype.newPlayer = function(id, name) {
  let player = {
    id, //Unique Discord ID
    credits: 100,
    last: 0, //last time they used !game free, in terms of Date.now()
    name, //Discord username at time of creation
    currgame: null, //current game of blackjack, etc.
    karma: 0, //pity points
    lcard: 0, //last time they drew a card (not yet implemented),
    throttler: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
  this.data.players.push(player);
};

/* ACCESSORS/MUTATORS */
//id is the Discord ID of the user to access

GameData.prototype.getBalOf = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      return this.data.players[i].credits;
    }
  }
  return "Not Found";
};

GameData.prototype.setBalOf = function(id, credits) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      this.data.players[i].credits = parseInt(credits);
    }
  }
};

GameData.prototype.pay = function(id, credits) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      this.data.players[i].credits += parseInt(credits);
    }
  }
};

GameData.prototype.playerExists = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      return true;
    }
  }
  return false;
};

GameData.prototype.addKarma = function(id, karma) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].karma) {
        this.data.players[i].karma += karma;
      } else {
        this.data.players[i].karma = karma;
      }
    }
  }
};

GameData.prototype.resetKarma = function(id, karma) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      this.data.players[i].karma = 0;
    }
  }
};

GameData.prototype.halfKarma = function(id, karma) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].karma) {
        this.data.players[i].karma /= 2;
      } else {
        this.data.players[i].karma = 0;
      }
    }
  }
};

GameData.prototype.getKarma = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].karma) {
        return this.data.players[i].karma;
      } else {
        return 0;
      }
    }
  }
};

/* DISPLAY METHODS */

GameData.prototype.getLeaderboard = function(l) {
  let ret = [];
  let temp = [];
  //I know this will fail if there is nothing in this.data.players but I don't care.
  for (let i = 0; i < this.data.players.length; i++) {
    temp.push(this.data.players[i]);
  }
  while (temp.length > 0) {
    let highest = 0;
    for (let i = 1; i < temp.length; i++) {
      if (temp[i].credits > temp[highest].credits) highest = i;
    }
    ret.push(temp.splice(highest, 1)[0]);
  }
  let toPass = [];
  for (let i = 0; i < ret.length && i < l; i++) {
    toPass.push([i + 1, ret[i].name, ret[i].credits]);
  }
  //"The leaderboard will reset on Wednesday, November 1st, and several balance changes will be added to the game. When the reset occurs, the high scores will be recorded for bragging rights and glory.\n
  return "```" + table("Leaderboard", ["#", "Player", "Credits"], toPass, {
    title: 33,
    headers: [2, 20, 9]
  }) + "```";
};

GameData.prototype.getLoserboard = function(l) {
  let ret = [];
  let temp = [];
  //I know this will fail if there is nothing in this.data.players but I don't care.
  for (let i = 0; i < this.data.players.length; i++) {
    temp.push(this.data.players[i]);
  }
  while (temp.length > 0) {
    let highest = 0;
    for (let i = 1; i < temp.length; i++) {
      if (temp[i].credits > temp[highest].credits) highest = i;
    }
    ret.push(temp.splice(highest, 1)[0]);
  }
  let toPass = [];
  for (let i = 0; i < ret.length; i++) {
    if (i > ret.length - 10) toPass.push([i + 1, ret[i].name, ret[i].credits]);
  }
  toPass = toPass.reverse();
  return "```" + table("Loserboard", ["#", "Player", "Credits"], toPass, {
    title: 33,
    headers: [2, 20, 9]
  }) + "```";
};

GameData.prototype.getUserData = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      return this.data.players[i].name + " - " + this.data.players[i].id + "\nBalance: " + this.data.players[i].credits + "\nKarma: " + this.data.players[i].karma;
    }
  }
  return "Not found.";
};

/*SAVE*/

GameData.prototype.dataToSave = function() {
  let tdata = {
    players: []
  };
  for (let i = 0; i < this.data.players.length; i++) {
    tdata.players.push({
      id: this.data.players[i].id,
      credits: this.data.players[i].credits,
      last: this.data.players[i].last,
      name: this.data.players[i].name
    });
  }
  return JSON.stringify(tdata);
};

/*GAME ACCESS*/

GameData.prototype.startGame = function(id, type, bet, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id && this.data.players[i].credits >= bet) {
      this.data.players[i].credits -= bet;
      this.data.players[i].currgame = new CurrentGame(type, bet, this.data.players[i].id, this);
      this.data.players[i].currgame.start((x) => {
        cb(this.data.players[i].name + "'s Game:\n" + x);
      });
    }
  }
};

GameData.prototype.moveGame = function(id, params, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id && this.data.players[i].currgame) {
      this.data.players[i].currgame.run(params, (x) => {
        cb(this.data.players[i].name + "'s Game:\n" + x);
      });
    }
  }
};

GameData.prototype.slots = function(id, bet, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].credits >= bet) {
        this.data.players[i].credits -= bet;
        let reso = slots.fullSpin(bet, this.data.players[i].name);
        cb(reso.str);
        this.data.players[i].credits += Math.floor(reso.val);
        if (reso.val == 0) {
          this.addKarma(id, bet);
        }
      }
    }
  }
}

/*UTIL*/

GameData.prototype.send = function(id, target, amt, cb) {
  let sender = -1;
  let reciever = -1;
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      sender = i;
    } else if (this.data.players[i].id == target) {
      reciever = i;
    }
  }
  if (sender >= 0 && reciever >= 0) {
    if (this.data.players[sender].credits >= amt) {
      this.data.players[sender].credits -= amt;
      this.data.players[reciever].credits += amt;
      cb(this.data.players[sender].name + " sent " + amt + " credits to " + this.data.players[reciever].name + ".");
    } else {
      cb("Not enough credits available.");
    }
  } else {
    cb("Failed to send credits. Does the target exist?");
  }
};

function getRandomInt(min, max) { //[min, max)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// function getRandomFromList(list) {
//   return list[getRandomInt(0, list.length)];
// }

function millisToMinutes(t) {
  return parseInt(t / 1000 / 60);
}

function getRefillAmount(mod) { //mod is a number from [0,100]
  //Thresholds:
  //40: 0
  //50: 25
  //60: 50
  //80: 75
  //100: 100
  //120: 125
  //140: 150
  //160: 175
  let roll = getRandomInt(0, 100) + mod + 1;
  if (roll > 175) {
    return 160;
  } else if (roll > 150) {
    return 140;
  } else if (roll > 125) {
    return 120;
  } else if (roll > 100) {
    return 100;
  } else if (roll > 75) {
    return 80;
  } else if (roll > 50) {
    return 60;
  } else if (roll > 25) {
    return 50;
  } else {
    return 40;
  }
}

function getModFromKarma(karma) {
  if (!karma) {
    return 0;
  }
  let ret;
  ret = karma / 13;
  return Math.floor(ret > 200 ? 200 : ret);
}

GameData.prototype.refill = function(id, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].last + (1000 * 60 * 60 * 3) > Date.now()) {
        cb("Cannot refill now, try again later. You need to wait 180 minutes between refills. " + (180 - millisToMinutes(Date.now() - this.data.players[i].last)) + " minutes to go, you greedy bastard.");
      } else {
        //redo this
        let x = getRefillAmount(getModFromKarma(this.getKarma(id))); //TODO add arg
        cb("You just got a refill of " + x + " credits");
        this.data.players[i].credits += x;
        if (x >= 80) {
          this.resetKarma(id);
        } else {
          this.halfKarma(id);
        }
        //end redo
        this.data.players[i].last = Date.now();
      }
    }
  }
};

GameData.prototype.freefill = function(id, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      this.data.players[i].last = 0;
    }
  }
};

/*Throttler*/

GameData.prototype.getThrottler = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].throttler) {
        return this.data.players[i].throttler;
      } else {
        this.data.players[i].throttler = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return this.data.players[i].throttler;
      }
    }
  }
  return [];
};

GameData.prototype.canMessAgain = function(id) {
  let thr = this.getThrottler(id);
  return (arr[9] + 10000 < Date.now());
};

GameData.prototype.newMess = function(id) {
  let thr = this.getThrottler(id);
  thr.pop();
  thr.unshift(Date.now());
};

module.exports = {
  GameData
};
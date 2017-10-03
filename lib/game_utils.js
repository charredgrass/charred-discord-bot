var dutils = require('./deck.js');

var Deck = dutils.Deck;
var dealerAction = dutils.dealerAction;
var totalValue = dutils.totalValue;

function CurrentGame(type, bet, payout, gd) {
  this.type = type;
  this.bet = bet;
  this.scoredata = {};
  this.person = payout;
  this.gd = gd;
}

CurrentGame.prototype.start = function(cb) {
  if (this.type == "blackjack") {
    this.scoredata.deck = new Deck();
    this.scoredata.dealer_hand = [this.scoredata.deck.top(), this.scoredata.deck.top()];
    this.scoredata.player_hand = [this.scoredata.deck.top(), this.scoredata.deck.top()];
    cb("Dealer Hand: " + this.scoredata.dealer_hand[0] + ",??\nYour Hand: " + this.scoredata.player_hand.join(","));
  }
  return this.scoredata;
};

CurrentGame.prototype.run = function(params, cb) {
  if (this.type == "blackjack") {
    if (params[0] == "hit") {
      this.scoredata.player_hand.push(this.scoredata.deck.top());
      if (totalValue(this.scoredata.player_hand, false) > 21) { //this calculation is false somehow
        this.finish((x) => {
          cb("Your hand is " + this.scoredata.player_hand.join(",") + " so you busted." + "\n" + x);
        });
      } else {
        cb("Your hand is " + this.scoredata.player_hand.join(",") + ".");
      }
    } else if (params[0] == "stand") {
      this.finish(cb);
    }
  }
};

function betterNonBust(hand) {
  let x = totalValue(hand, true);
  let y = totalValue(hand, false);
  if (x > 21) return y;
  else return x;
}

CurrentGame.prototype.finish = function(cb) {
  if (this.type == "blackjack") {
    let dealer_going = dealerAction(this.scoredata.dealer_hand);
    while (dealer_going) {
      this.scoredata.dealer_hand.push(this.scoredata.deck.top());
      dealer_going = dealerAction(this.scoredata.dealer_hand);
    }
    let dbj = totalValue(this.scoredata.dealer_hand, true) == 21 || totalValue(this.scoredata.dealer_hand, false) === 21;
    let pbj = totalValue(this.scoredata.player_hand, true) == 21 || totalValue(this.scoredata.player_hand, false) === 21; //lol pbj
    if (dbj && pbj) {
      cb("It's a tie! Both blackjack.\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet);
      return;
    }
    if (pbj) {
      cb("Blackjack!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, parseInt(this.bet * 2.5));
      return;
    }
    if (dbj) {
      cb("You lose!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      return;
    }
    if (totalValue(this.scoredata.player_hand, false) > 21) {
      cb("You busted! Idiot!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      return;
    }
    if (totalValue(this.scoredata.dealer_hand, false) > 21) {
      cb("Dealer busted, you win!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet * 2);
      return;
    }
    if (betterNonBust(this.scoredata.dealer_hand) == betterNonBust(this.scoredata.player_hand)) {
      cb("It's a tie!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet);
      return;
    }
    if (betterNonBust(this.scoredata.dealer_hand) > betterNonBust(this.scoredata.player_hand)) {
      cb("Dealer wins!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      return;
    } else {
      cb("You win!\nDealer Hand: " + this.scoredata.dealer_hand.join(",") + "\nYour Hand: " + this.scoredata.player_hand.join(","));
      this.gd.pay(this.person, this.bet * 2);
    }
  }
};

function GameData(gamedata) {
  this.data = gamedata;
}

GameData.prototype.newPlayer = function(id, name) {
  let player = {
    id,
    credits: 100,
    last: Date.now(),
    name,
    currgame: null
  };
  this.data.players.push(player);
};

GameData.prototype.getBalOf = function(id) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      return this.data.players[i].credits;
    }
  }
  return -1;
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

GameData.prototype.getLeaderboard = function(leaderlength) {
  let ret = [this.data.players[0]];
  //I know this will fail if there is nothing in this.data.players but I don't care.
  for (let i = 1; i < this.data.players.length; i++) {
    for (let j = 0; j < ret.length; j++) {
      if (this.data.players[i].credits > ret[j].credits) {
        ret.splice(j, 0, this.data.players[i]);
        break;
      }
    }
  }
  let retar = "Leaderboard: \n";
  for (let i = 0; i < leaderlength; i++) {
    if (i >= ret.length) {
      break;
    }
    retar = retar + (i + 1) + ") " + ret[i].name + " " + ret[i].credits + " points" + "\n";
  }
  return retar;
};

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
    })
  }
  return JSON.stringify(tdata);
};

GameData.prototype.startGame = function(id, type, bet, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id && this.data.players[i].credits > bet) {
      this.data.players[i].credits -= parseInt(bet + 0.9);
      this.data.players[i].currgame = new CurrentGame(type, bet, this.data.players[i].id, this);
      this.data.players[i].currgame.start((x) => {
        cb(this.data.players[i].name + "'s Game:\n" + x)
      });
    }
  }
};

GameData.prototype.moveGame = function(id, params, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id && this.data.players[i].currgame) {
      this.data.players[i].currgame.run(params, (x) => {
        cb(this.data.players[i].name + "'s Game:\n" + x)
      });
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFromList(list) {
  return list[getRandomInt(0, list.length)];
}

GameData.prototype.refill = function(id, cb) {
  for (let i = 0; i < this.data.players.length; i++) {
    if (this.data.players[i].id == id) {
      if (this.data.players[i].last + (1000 * 60 * 60 * 4) > Date.now()) {
        cb("Cannot refill now, try again later. You need to wait 4 hours between refills.");
      } else {
        if (this.data.players[i].credits > 500) {
          cb("You don't need a refill now. Go coinflip it all away.");
        } else {
          let x = getRandomFromList([10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 40, 40, 80, 160]);
          cb("You just got a refill of " + x + "credits");
          this.data.players[i].credits += x;
          this.data.players[i].last = Date.now();
        }
      }
    }
  }
}

module.exports = {
  GameData
};
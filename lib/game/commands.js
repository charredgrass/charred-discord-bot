const Blackjack = require("./blackjack.js");
const slots = require("./slots.js");

/**Takes a turn of Blackjack, or creates a game.
 * @param {Array} args
 * @param {Function} send
 * @param {Player} player
 */
function playBlackjack(args, send, player) {
  if (player.currgame) {
    if (player.currgame.gameName === "Blackjack") {
      //check if they're asking to hit, etc.
      //TODO add double down
      if (args[1] === "h" || args[1] === "hit") {
        player.currgame.turn("hit", send);
        player.cleanupGame();
      } else if (args[1] === "s" || args[1] === "stand") {
        player.currgame.turn("stand", send);
        player.cleanupGame();
      } else {
        send("Unrecognized command.");
      }
    } else {
      send("You aren't playing blackjack right now.");
    }
  } else {
    let bet = Number(args[1]);
    if (isNaN(bet) === true) {
      send("!game bj [bet]");
    } else {
      bet = Math.floor(bet);
      if (player.credits >= bet) {
        player.currgame = new Blackjack(player.name, bet, (a) => {
          player.addCredits(a);
        });
        player.removeCredits(bet);
        player.currgame.status(send);
        player.cleanupGame();
      } else {
        send("Not enough credits.");
      }
    }
  }
}

/**Creates and instantly resolves a game of slots.
 * @param {Array} args
 * @param {Function} send
 * @param {Player} player
 */
function playSlots(args, send, player) {
  let bet = Number(args[1]);
  if (isNaN(bet) === true) {
    send("!game slots [bet]");
  } else {
    bet = Math.floor(bet);
    if (player.credits >= bet) {
      player.removeCredits(bet);
      let spinResults = slots.play(bet, player.name);
      send(spinResults.text);
      player.addCredits(spinResults.prize);
    } else {
      send("Not enough credits.");
    }
  }
}

/**
 * @param {Game} game
 * **/
function gameCommandCreator(game) {
  return (args, send, server, user) => {
    let player = game.getPlayer(user.id);
    if (!player) {
      game.newPlayer(user.id, user.username, 100, 0);
      send("Welcome to !game. You've been given 100 credits to start with.\n" +
          "See detailed documentation of commands here: https://github.com/charredgrass/charred-discord-bot/wiki/!game"); //TODO add welcome message
      return;
    }
    switch (args[0]) {
      case "balance":
      case "b":
        send(game.getBalOf(user.id));
        break;
      case "bj":
        playBlackjack(args, send, player);
        break;
      case "slots":
        playSlots(args, send, player);
        break;
      case "free":
        game.giveFree(user.id, send);
        break;
      case "help":
        send("https://github.com/charredgrass/charred-discord-bot/blob/master/docs/game.md");
        break;
      case "leaderboard":
      case "lb":
        send(game.getLeaderboard(() => {
          return true;
        }, 10));
        break;
    }
  }
}


module.exports = {
  gameCommandCreator
};
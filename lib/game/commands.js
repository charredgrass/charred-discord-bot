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
      switch(args[1]) {
        case "h":
        case "hit":
          player.currgame.turn("hit", send);
          player.cleanupGame();
          break;
        case "s":
        case "stand":
          player.currgame.turn("stand", send);
          player.cleanupGame();
          break;
        case "dd":
        case "doubledown":
          if (player.credits >= player.currgame.bet) {
            player.removeCredits(player.currgame.bet);
            player.currgame.turn("double", send);
            player.cleanupGame();
          } else {
            send("Not enough credits.");
          }
          break;
        case "bj":
          send("Game already in progress.");
          break;
        default:
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

function balance(game, user, mentions, send) {
  if (mentions.length > 0) {
    let amt = game.getBalOf(mentions[0].id);
    send((amt === -1 ? "Player not found." : amt));
  } else {
    send(game.getBalOf(user.id));
  }
}

function give(game, user, mentions, args, send) {
  if (mentions.length > 0) {
    let recipient = mentions[0];
    let amt = Number(args[2]);
    if (isNaN(amt) === true) {
      send("Invalid amount. !game give [person] [amt]");
    } else {
      game.give(user.id, recipient.id, amt, send);
    }
  } else {
    send("Player not found.");
  }
}

/**
 * @param {Game} game
 * **/
function gameCommandCreator(game) {
  return (args, send, server, user, sendImg, m) => {
    let player = game.getPlayer(user.id);
    /**@type Snowflake[]**/
    let mentions = m.users.array();
    if (!player) {
      game.newPlayer(user.id, user.username, 100, 0);
      send("Welcome to !game. You've been given 100 credits to start with.\n" +
          "See detailed documentation of commands here: https://github.com/charredgrass/charred-discord-bot/wiki/!game");
      return;
    }
    switch (args[0]) {
      case "balance":
      case "b":
        balance(game, user, mentions, send);
        break;
      case "bj":
        playBlackjack(args, send, player);
        break;
      case "h":
      case "s":
      case "dd":
        args[1] = args[0];
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
      case "give":
        //do some stuff
          give(game, user, mentions, args, send);
        break;
    }
  }
}


module.exports = {
  gameCommandCreator
};
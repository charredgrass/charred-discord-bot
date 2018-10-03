const Blackjack = require("./blackjack.js");

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
    if (args[0] === "balance" || args[0] === "b") {
      send(game.getBalOf(user.id));
    } else if (args[0] === "bj") {
      playBlackjack(args, send, player);
    } else if (args[0] === "help") {
      send("https://github.com/charredgrass/charred-discord-bot/blob/master/docs/game.md");
    }
  }
}


module.exports = {
  gameCommandCreator
};
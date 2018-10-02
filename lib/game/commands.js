const Blackjack = require("./blackjack.js");

function playBlackjack(args, send, player) {
  if (player.currgame) {
    //check if they're asking to hit, etc.
    //TODO do this
  } else {
    let bet = Number(args[1]);
    if (isNaN(bet) === true) {
      send("!game bj [bet]");
    } else {
      bet = Math.floor(bet);
      if (player.credits >= bet) {
        player.currgame = new Blackjack(player.name, bet, player.addCredits);
        player.removeCredits(bet);
        player.currgame.status(send);
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
      send("welcome u have 100 credits "); //TODO add welcome message
      return;
    }
    if (args[0] === "balance" || args[0] === "b") {
      send(game.getBalOf(user.id));
    } else if (args[0] === "bj") {
      playBlackjack(args, send, player);
    }
  }
}


module.exports = {
  gameCommandCreator
};
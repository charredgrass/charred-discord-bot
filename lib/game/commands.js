
/**
 * @param {Game} game
 * **/
function gameCommandCreator(game) {
  return (args, send, server, user) => {
    let player = game.getPlayer(user.id);
    if (!player) {
      game.newPlayer(user.id, user.username);
      send(100);
      return;
    }
    if (args[0] === "balance" || args[0] === "b") {
      send(game.getBalOf(user.id));
    }
  }
}

module.exports = {
  gameCommandCreator
};
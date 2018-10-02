/**An abstract class as a base for any singleplayer sorcery-speed game.
 *
 * **/
class SinglePlayerGame {
  /**Constructor for SinglePlayerGame.
   * @param {String} player The player's name.
   * @param {Number} bet The amount wagered.
   * @param {Function} payment Callback to add balance to player. Takes 1 arg
   */
  constructor(player, bet, payment) {
    this.bet = bet;
    this.player = player;
    this.payment = payment;
  }
  finish() {
    //To be overwritten.
  }
}

module.exports = SinglePlayerGame;
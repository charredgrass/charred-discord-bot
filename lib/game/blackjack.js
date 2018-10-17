const Deck = require("./deck.js");
const SinglePlayerGame = require("./singleplayergame.js");

/**Reports the value closest to 21, along with an indicator of whether or not
 * the value is soft (has an ace as an 11).
 *  @param {Array} hand The hand, as an array of strings.
 *  @return {{value: number, soft: boolean}} An object with two keys, value,
 *   containing the value, and soft, a boolean showing if there is an Ace acting
 *   as an 11.
 * **/
function bestPossibleValue(hand) {
  let possibles = [{value: 0, soft: false}];
  for (let card of hand) {
    if (card.rank === "A") {
      let toAdd = [];
      for (let i = 0; i < possibles.length; i++) {
        toAdd.push({
          value: possibles[i].value + 11,
          soft: true
        });
        possibles[i].value += 1;
      }
      for (let a of toAdd) possibles.push(a);
    } else {
      for (let i = 0; i < possibles.length; i++) {
        possibles[i].value += card.value;
      }
    }
  }
  let best = 0;
  for (let i = 1; i < possibles.length; i++) {
    let a = possibles[best].value;
    let b = possibles[i].value;
    if (a > 21 && b > 21) {
      //both bust, doesn't matter what best is
    } else if (a > 21 && b <= 21) {
      //a is bust, set b to best
      best = i;
    } else if (a <= 21 && b > 21) {
      //b is bust, keep best the same
    } else {
      //both are valid, greater one wins
      if (a > b) {
        //a is better, do nothing
      } else {
        //b is better
        best = i;
      }
    }
  }
  return possibles[best];
}

/**Determines whether or not the dealer will hit.
 * @param {Array} hand The dealer's hand
 * @returns {Boolean} whether or not the dealer hits, true if hit.
 * **/
function doesDealerHit(hand) {
  const value = bestPossibleValue(hand);
  if (value.value >= 18) //stand if 18+
    return false;
  else if (value.value <= 16)
    return true;
  else  //hit on soft 17, stand on hard
    return value.soft;
}

/**Converts an array of cards to a String
 * @param {Array} hand
 * @returns {String}
 */
function handToString(hand) {
  let ret = "";
  for (let i = 0; i < hand.length; i++) {
    ret += hand[i].toString;
    if (i !== hand.length - 1) ret += ", ";
  }
  return ret;
}

/**A constant to keep track of blackjack game-end states.
 * @type {{TIE: number, PLAYER_WIN: number, PLAYER_BJ: number, DEALER_WIN: number, DEALER_BJ: number}}
 */
const BLACKJACK_STATES = {
  TIE: 0,            //push
  PLAYER_WIN: 1,     //player score is greater
  PLAYER_NO_BUST: 2, //opponent busted
  PLAYER_BJ: 3,      //player got 21 and won
  DEALER_WIN: -1,    //dealer score is greater
  DEALER_NO_BUST: -2,//player busted
  DEALER_BJ: -3      //dealer got 21 and won
};

const WIN_RATIOS = {
  TIE: 1,
  PLAYER_WIN: 2,
  PLAYER_NO_BUST: 2,
  PLAYER_BJ: 2.7,
  DEALER_WIN: 0,
  DEALER_NO_BUST: 0,
  DEALER_BJ: 0
};

/**Determines the winner of a game of blackjack.
 * @param {Array} playerHand
 * @param {Array} dealerHand
 * @return {Number}
 */
function chooseWinner(playerHand, dealerHand) {
  let dScore = bestPossibleValue(dealerHand).value;
  let pScore = bestPossibleValue(playerHand).value;
  let pSize = playerHand.length;
  let dSize = dealerHand.length;
  if (dScore === 21 && pScore === 21) { //case: both blackjack
    if ((pSize === 2) === (dSize === 2)) { //pSize === 2 XNOR dSize === 2
      //both natural blackjack, or both not natural
      return BLACKJACK_STATES.TIE;
    } else {
      //one is natural, win goes to natural 21
      return (pSize === 2 ? BLACKJACK_STATES.PLAYER_BJ
          : BLACKJACK_STATES.DEALER_BJ);
    }
  } else if (dScore === 21) { //case: dealer 21 only
    if (pScore > 21) return BLACKJACK_STATES.DEALER_NO_BUST;
    return BLACKJACK_STATES.DEALER_BJ;
  } else if (pScore === 21) { //case: player 21 only
    return BLACKJACK_STATES.PLAYER_BJ;
  } else { //case: neither 21
    //start checking for bust
    if (pScore > 21) //player bust -> immediate dealer win
      return BLACKJACK_STATES.DEALER_NO_BUST;
    else if (dScore > 21) //dealer bust, player no bust, player wins
      return BLACKJACK_STATES.PLAYER_NO_BUST;
    else {
      //final case: neither bust, neither blackjack
      //winner is whoever is greater
      if (pScore === dScore) return BLACKJACK_STATES.TIE;
      return (pScore > dScore ? BLACKJACK_STATES.PLAYER_WIN
          : BLACKJACK_STATES.DEALER_WIN);
    }
  }
}

class BlackjackGame extends SinglePlayerGame {
  /**Constructor for BlackjackGame.
   * @param {String} player
   * @param {Number} bet
   * @param {Function} payment
   */
  constructor(player, bet, payment) {
    super(player, bet, payment, "Blackjack");
    this.deck = new Deck();
    this.dealerHand = [this.deck.draw(), this.deck.draw()];
    this.playerHand = [this.deck.draw(), this.deck.draw()];
  }

  /**Reports the status of the game to the callback. Pass it the chat
   * function.
   * @param {Function} callback
   */
  status(callback) {
    let ret = this.player + "'s game, " + this.bet + " bet \n";
    ret += "Dealer's Hand " + this.dealerHand[0].toString + ",  ??\n";
    ret += "Your Hand " + handToString(this.playerHand) + "";
    callback(ret);
  }

  /**The player takes their turn.
   * @param {String} action Can be "hit" or "stand"
   * @param {Function} callback Where to announce the results.
   */
  turn(action, callback) {
    if (action === "hit") {
      this.playerHand.push(this.deck.draw());
      if (bestPossibleValue(this.playerHand).value >= 21) {
        this.finish(callback);
      } else {
        this.status(callback);
      }
    } else if (action === "double") {
      this.bet *= 2;
      this.playerHand.push(this.deck.draw());
      this.finish(callback);
    } else {
      this.finish(callback);
    }
  }

  /**Finishes the game. The dealer takes their turn, and the winner is determined.
   *
   * @param {Function} callback
   */
  finish(callback) {
    while (doesDealerHit(this.dealerHand)) {
      this.dealerHand.push(this.deck.draw());
    }
    let ret = this.player + "'s game, " + this.bet + " bet \n";
    ret += "Dealer's Hand " + handToString(this.dealerHand) + "\n";
    ret += "Your Hand " + handToString(this.playerHand) + "";
    let winner = chooseWinner(this.playerHand, this.dealerHand);
    switch (winner) {
      case BLACKJACK_STATES.DEALER_BJ:
        ret += "Dealer has blackjack.";
        break;
      case BLACKJACK_STATES.DEALER_NO_BUST:
        ret += "You busted! Idiot!";
        break;
      case BLACKJACK_STATES.DEALER_WIN:
        ret += "Dealer wins.";
        break;
      case BLACKJACK_STATES.PLAYER_BJ:
        ret += "Blackjack! You win!";
        this.payment(this.bet * WIN_RATIOS.PLAYER_BJ);
        break;
      case BLACKJACK_STATES.PLAYER_NO_BUST:
        ret += "Dealer busted, you win.";
        this.payment(this.bet * WIN_RATIOS.PLAYER_NO_BUST);
        break;
      case BLACKJACK_STATES.PLAYER_WIN:
        ret += "You win.";
        this.payment(this.bet * WIN_RATIOS.PLAYER_WIN);
        break;
      case BLACKJACK_STATES.TIE:
        ret += "It's a tie.";
        this.payment(this.bet * WIN_RATIOS.TIE);
    }
    this.hasFinished = true;
    callback(ret);
  }
}

module.exports = BlackjackGame;
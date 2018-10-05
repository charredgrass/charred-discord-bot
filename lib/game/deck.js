function shuffle(array) {
  let currentIndex = array.length,
      temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class Card {
  /**Constructor for Card
   * @param {String} rank
   * @param {String} suit
   * **/
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }
  get value() {
    if (["10", "K", "J", "Q"].includes(this.rank))
      return 10;
    else if ("A" === this.rank)
      return 1;
    else
      return Number(this.rank);
  }
  get toString() {
    return (this.rank.length === 1 ? " " + this.rank : this.rank) + this.suit;
  }
}

class Deck {
  constructor() {
    this.suits = ["♠", "♥", "♦", "♣"];
    this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    this.deck = [];
    for (let s of this.suits) {
      for (let r of this.ranks) {
        this.deck.push(new Card(r, s));
      }
    }
    this.discard = [];
    this.deck = shuffle(this.deck);
  }
  /**Draws a card.
   * @returns {Card}
   * **/
  draw() {
    let card = this.deck.shift();
    this.discard.push(card);
    return card;
  }
}

module.exports = Deck;
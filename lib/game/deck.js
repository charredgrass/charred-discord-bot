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

class Deck {
  constructor() {
    this.suits = ["♠", "♥", "♦", "♣"];
    this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K"];
    this.deck = [];
    for (let s of this.suits) {
      for (let r of this.ranks) {
        this.deck.push(s + r);
      }
    }
    this.discard = [];
    this.deck = shuffle(this.deck);
  }

  draw() {
    let card = this.deck.shift();
    this.discard.push(card);
    return card;
  }
}

module.exports = {

};
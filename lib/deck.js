function Deck() {
    this.suits = ["♠", "♥", "♦", "♣"];
    this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K"];
    this.deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            this.deck.push(ranks[j] + suits[i]);
        }
    }
    this.discard = [];
    this.deck = shuffle(this.deck);
}

Deck.prototype.top = function() {
    let card = this.deck.shift();
    discard.push(card);
    return card;
};

function totalValue(hand, acesbig) {
    let ret = 0; //just like their dps lol
    for (let i = 0; i < hand.length; i++) {
        let ccardrank = hand[i][0];
        if (ccardrank == "A" || ccardrank == "K" || ccardrank == "Q" || ccardrank == "J") {
            if (ccardrank == "A") ret += (acesbig ? 11 : 1);
            else ret += 10;
        } else {
            ret += Number(ccardrank);
        }
    }
}

function dealerAction(hand) {
    if (totalValue(hand, true) == 21 || totalValue(hand, false) == 21) {
        return false;
    }
    if (totalValue(hand, true) < 17 || totalValue(hand, false) < 17) {
        return true;
    } else {
        return false;
    }
}

function shuffle(array) {
    var currentIndex = array.length,
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

module.exports = {
    Deck,
    dealerAction,
    totalValue
};
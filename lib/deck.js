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


function Deck() {
    this.suits = ["♠", "♥", "♦", "♣"];
    this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K"];
    this.deck = [];
    for (let i = 0; i < this.suits.length; i++) {
        for (let j = 0; j < this.ranks.length; j++) {
            this.deck.push(this.ranks[j] + this.suits[i]);
        }
    }
    this.discard = [];
    this.deck = shuffle(this.deck);
}

Deck.prototype.top = function() {
    let card = this.deck.shift();
    this.discard.push(card);
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
    return ret;
}

function allPossibleValues(hand) {
    let ret = [0];
    for (let i = 0; i < hand.length; i++) {
        let ccardrank = hand[i][0];
        if (ccardrank == "A") {
            let extra_cards = [];
            for (let j = 0; j < ret.length; j++) {
                extra_cards.push(ret[j] + 11);
                ret[j] += 1;
            }
            ret = ret.concat(extra_cards);
        } else if (ccardrank == "K" || ccardrank == "Q" || ccardrank == "J") {
            for (let j = 0; j < ret.length; j++) {
                ret[j] += 10;
            }
        } else {
            for (let j = 0; j < ret.length; j++) {
                ret[j] += Number(ccardrank);
            }
        }
    }
    return ret;
}

function bestOfValues(hand) {
    let ret = hand[0]; //Please don't pass an empty array.
    if (ret == 21) return 21;
    for (let i = 1; i < hand.length; i++) {
        if (hand[i] == 21) return 21;
        if (ret > 21) {
            if (hand[i] < 21) {
                ret = hand[i];
            }
        } else {
            if (hand[i] < 21) {
                ret = Math.max(hand[i], ret);
            }
        }
    }
    return ret;
}

function dealerAction(hand) {
    if (totalValue(hand, true) == 21 || totalValue(hand, false) == 21) {
        return false;
    }
    //Hit on soft 17
    if (totalValue(hand, false) == 17) {
        return true;
    }
    //Stand on soft 18-21
    if (totalValue(hand, false) > 17) {
        return false;
    }
    //Hit if below 17 or hard 17
    if (totalValue(hand, true) <= 17 || totalValue(hand, false) < 17) {
        return true;
    } else { //Stand on hard 18-21
        return false;
    }
}


module.exports = {
    Deck,
    dealerAction,
    totalValue,
    allPossibleValues,
    bestOfValues
};
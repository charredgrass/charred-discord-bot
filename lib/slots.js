const slotEmojiC = [":apple:", ":tangerine:", ":cherries:", ":pear:"];
const slotEmojiE = [":gift:", ":large_blue_circle:", ":blue_heart:"];
const slotEmojiL = [":gem:", ":cancer:", ":b:"];

function getRandomInt(min, max) { //does not include max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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

function pickNumFromList(list, num) { //make sure num < list.length
    let picked = [];
    while (picked.length < num) {
        let rand = getRandomInt(0, list.length);
        if (picked.includes(rand) === false) {
            picked.push(rand);
        }
    }
    let ret = [];
    for (let i = 0; i < picked.length; i++) {
        ret.push(list[picked[i]]);
    }
    return ret;
}

function generateStrip() {
    let ret = [];
    // let coinflip = (getRandomInt(0, 2) == 1 ? true : false);
    ret = ret.concat(slotEmojiC).concat(slotEmojiC).concat(slotEmojiE).concat(slotEmojiL);
    //8, 3, 3
    ret = shuffle(ret);
    return ret;
}

function spin() {
    let ret = {
        row1: generateStrip(),
        row2: generateStrip(),
        row3: generateStrip(),
        pos1: getRandomInt(0, 11),
        pos2: getRandomInt(0, 11),
        pos3: getRandomInt(0, 11)
    };
    return ret;
}

function getMiddleRow(spin) {
    return [spin.row1[spin.pos1], spin.row2[spin.pos2], spin.row3[spin.pos3]];
}

function countRow(row) {
    let ret = {
        c: 0,
        e: 0,
        l: 0,
        sc: 0,
        se: 0,
        sl: 0
    };
    for (let i = 0; i < row.length; i++) {
        if (slotEmojiC.includes(row[i])) ret.c++;
        if (slotEmojiE.includes(row[i])) ret.e++;
        if (slotEmojiL.includes(row[i])) ret.l++;
    }
    for (let i = 0; i < slotEmojiC.length; i++) {
        let temp = 0;
        for (let j = 0; j < row.length; j++) {
            if (slotEmojiC[i] == row[j]) {
                temp++;
            }
        }
        if (temp > ret.sc) ret.sc = temp;
    }
    for (let i = 0; i < slotEmojiE.length; i++) {
        let temp = 0;
        for (let j = 0; j < row.length; j++) {
            if (slotEmojiE[i] == row[j]) {
                temp++;
            }
        }
        if (temp > ret.se) ret.se = temp;
    }
    for (let i = 0; i < slotEmojiL.length; i++) {
        let temp = 0;
        for (let j = 0; j < row.length; j++) {
            if (slotEmojiL[i] == row[j]) {
                temp++;
            }
        }
        if (temp > ret.sl) ret.sl = temp;
    }
    return ret;
}



function isBetter(current, future, text) {
    if (future > current.mult) {
        current.mult = future;
        current.reason = text;
    }
}

function getWinData(spin) {
    let ret = {
        mult: 0,
        reason: "No Match"
    };
    let row = getMiddleRow(spin);
    let cts = countRow(row);
    //sorry in advance, there's a lot of data to tweak
    switch (cts.sl) {
        case 3:
            isBetter(ret, 70, "3 of the same " + slotEmojiL.join());
            break;
        case 2:
            isBetter(ret, 7, "2 of the same " + slotEmojiL.join());
            break;
    }
    switch (cts.se) {
        case 3:
            isBetter(ret, 69, "3 of the same " + slotEmojiE.join());
            break;
        case 2:
            isBetter(ret, 3, "2 of the same " + slotEmojiE.join());
    }
    switch (cts.sc) {
        case 3:
            isBetter(ret, 14, "3 of the same " + slotEmojiC.join());
            break;
        case 2:
            isBetter(ret, 2, "2 of the same " + slotEmojiC.join());
    }
    switch (cts.l) {
        case 3:
            isBetter(ret, 8, "3 of any " + slotEmojiL.join());
            break;
        case 2:
            isBetter(ret, 1, "2 of any " + slotEmojiL.join());
    }
    switch (cts.e) {
        case 3:
            isBetter(ret, 5, "3 of any " + slotEmojiE.join());
            // case 2:
            //     isBetter(ret, 1, "2E");
    }
    switch (cts.c) {
        case 3:
            isBetter(ret, 1.3, "3 of any " + slotEmojiC.join());
    }
    return ret;
}



function test() {
    let hold = 0;
    let hold2 = 0;

    const TRIALS = 1000000;
    // const TRIALS = 10;
    let wins = 0;

    for (let i = 0; i < TRIALS; i++) {
        let x = getWinData(spin()).mult;
        if (x > 0) {
            wins++;
        }
        if (x < 50) {
            hold2 += x;
        }
        hold += x;
    }

    console.log("Avg PO: " + hold / TRIALS);
    console.log("Wins: " + wins);
    console.log("Avg Win:  " + hold / wins);
    console.log("Avg PO adj.: " + hold2 / TRIALS);
    // console.log(" " + wins);
    console.log("Avg Win adj.: " + hold2 / wins);
}

function getVisRow(row, ind) {
    let ret = [];
    for (let i = -1; i <= 1; i++) {
        if (ind + i >= row.length) {
            ret.push(row[ind + i - row.length]);
        } else if (ind + i < 0) {
            ret.push(row[ind + i + row.length]);
        } else {
            ret.push(row[ind + i]);
        }
    }
    return ret;
}

function fullSpin(bet, name) {
    let h = spin();
    bet = Math.floor(bet);
    let wdat = getWinData(h);
    let t = Object.assign(h, {
        vrw1: getVisRow(h.row1, h.pos1),
        vrw2: getVisRow(h.row2, h.pos2),
        vrw3: getVisRow(h.row3, h.pos3),
        win: parseInt(bet * wdat.mult),
        reas: wdat.reason
    });
    let ret = "Slots! " + name + "'s Machine\n---------------\n";
    ret += t.vrw1[0] + " " + t.vrw2[0] + " " + t.vrw3[0] + "\n";
    ret += t.vrw1[1] + " " + t.vrw2[1] + " " + t.vrw3[1] + " <---\n";
    ret += t.vrw1[2] + " " + t.vrw2[2] + " " + t.vrw3[2] + "\n";
    ret += "---------------\n";
    ret += t.reas;
    ret += "You Win: " + t.win;
    let retur = {
        str: ret,
        val: t.win
    };
    return retur;
}

// console.log(fullSpin(10));

module.exports = {
    slotEmojiC,
    slotEmojiL,
    slotEmojiE,
    spin,
    getMiddleRow,
    getWinData,
    fullSpin
};
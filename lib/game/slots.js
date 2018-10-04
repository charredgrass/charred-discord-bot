const slotEmoji = [
  [":apple:", ":tangerine:", ":cherries:", ":pear:"],
  [":gift:", ":yellow_heart:", ":upside_down:"],
  [":large_blue_circle:", ":blue_heart:", ":regional_indicator_f:"],
  [":b:", ":moneybag:", ":gem:"]
];
/**The frequency of each row from slotEmoji on the slot machine strips.
 * frequency[n] represents the frequency of emoji in slotEmoji[n].
 * **/
const frequency = [3, 2, 1, 1];

//frequency.length === slotEmoji.length
//slotEmoji.length === rewardsNoMatch.length
// === rewardsMatch.length

/**In place shuffle
 * @param {Array} array
 * @returns {Array} the shuffled array
 */
function shuffle(array) {
  let currentIndex = array.length;
  while (0 !== currentIndex) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    let temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function generateStrip() {
  let ret = [];
  for (let i = 0; i < slotEmoji.length; i++) {
    for (let j = 0; j < frequency[i]; j++) {
      ret = ret.concat(slotEmoji[i]);
    }
  }
  return shuffle(ret);
}

function spin() {
  return [generateStrip(), generateStrip(), generateStrip()];
}

function getRow(spinResult, offset) {
  let ret = [];
  for (let c of spinResult) {
    ret.push(c[offset % c.length]);
  }
  return ret;
}

function countOccur(list, thing) {
  let ret = 0;
  for (let i of list) {
    if (thing === i) ret++;
  }
  return ret;
}

function isBetter(current, future, text, tag) {
  if (future > current.multiplier) {
    current.multiplier = future;
    current.reason = text;
    current.tag = tag;
  }
}

/**From the spin(), gets the win multiplier.
 * @param {{rows: Array, positions: Array}} spinResult
 */
function getSpinMultiplier(spinResult) {
  let midRow = getRow(spinResult, 1);
  let nonMatching = [0, 0, 0, 0];
  let matching = [0, 0, 0, 0];
  for (let selected of midRow) {
    for (let i = 0; i < slotEmoji.length; i++) {
      let tier = slotEmoji[i];
      if (tier.includes(selected)) nonMatching[i]++;
    }
  }
  for (let i = 0; i < slotEmoji.length; i++) {
    let tier = slotEmoji[i];
    let max = 0, maxCount = countOccur(midRow, tier[0]);
    for (let j = 1; j < tier.length; j++) {
      let curr = countOccur(midRow, tier[j]);
      if (curr > max) {
        max = j;
        maxCount = curr;
      }
    }
    matching[i] = max;
  }
  let ret = {
    multiplier: 0,
    reason: "No Match",
    tag: "00"
  };
  switch (matching[3]) {
    case 3:
      isBetter(ret, 1000, "3 of the same " + slotEmoji[3], "3t3m");
      console.log("AAA");
      break;
    case 2:
      isBetter(ret, 500, "2 of the same " + slotEmoji[3], "2t3m");
      break;
  }
  switch (matching[2]) {
    case 3:
      isBetter(ret, 100, "3 of the same " + slotEmoji[2], "3t2m");
      break;
    case 2:
      isBetter(ret, 51, "2 of the same " + slotEmoji[2], "2t2m");
      break;
  }
  switch (matching[1]) {
    case 3:
      isBetter(ret, 50, "3 of the same " + slotEmoji[1], "3t1m");
      break;
    case 2:
      isBetter(ret, 30, "2 of the same " + slotEmoji[1], "2t1m");
      break;
  }
  switch (matching[0]) {
    case 3:
      isBetter(ret, 10, "3 of the same " + slotEmoji[0], "3t0m");
      break;
  }
  switch (nonMatching[3]) {
    case 3:
      isBetter(ret, 100, "3 of the same " + slotEmoji[3], "3t3");
      break;
    case 2:
      isBetter(ret, 20, "2 of the same " + slotEmoji[3], "2t3");
      break;
  }
  switch (nonMatching[2]) {
    case 3:
      isBetter(ret, 50, "3 of the same " + slotEmoji[2], "3t2");
      break;
    case 2:
      isBetter(ret, 15, "2 of the same " + slotEmoji[2], "2t2");
      break;
  }
  switch (nonMatching[1]) {
    case 3:
      isBetter(ret, 20, "3 of the same " + slotEmoji[1], "3t1");
      break;
  }
  switch (nonMatching[0]) {
    case 3:
      isBetter(ret, 8, "3 of the same " + slotEmoji[0], "3t0");
      break;
  }
  return ret;
}

// let s = spin();
// let b = getSpinMultiplier(s);
// console.log(getRow(s, 1));
// console.log(JSON.stringify(b));
// console.log(JSON.stringify(s));

function play(bet, name) {
  let s = spin();
  let result = getSpinMultiplier(s);

  let prize = Math.floor(bet * result.mult);

  let visibleRows = [getRow(s, 0), getRow(s, 1), getRow(s, 2)];
  let text = "Slots: " + name + "'s Machine\n";
  text += "---------------\n";
  for (let i = 0; i < visibleRows.length; i++) {
    text += visibleRows[i].join(" ");
    if (i === 1) {
      text += " <---\n";
    } else {
      text += "\n";
    }
  }
  text += "---------------\n";
  text += result.reason + "\n";
  text += "You Win: " + prize;
  return {
    prize,
    text
  };
}

// testAFuckTon();

function testAFuckTon() {
  const NUM_TESTS = 10000000;
  let data = {};
  let bal = 0;
  for (let i = 0; i < NUM_TESTS; i++) {
    let s = getSpinMultiplier(spin());
    if (s.tag === "3t3m") console.log("AAA");
    if (data[s.tag]) {
      data[s.tag]++;
    } else {
      data[s.tag] = 1;
    }
    bal += s.multiplier;
  }
  for (let x in data) {
    if (data.hasOwnProperty(x)) {
      data[x] = 1 / (data[x] / NUM_TESTS);
    }
  }
  console.log(JSON.stringify(data));
  console.log(bal);
}

module.exports = {
  play
};
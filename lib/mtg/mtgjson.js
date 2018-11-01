const http = require("../http.js");
const fs = require("fs");

const CARDS = JSON.parse(fs.readFileSync("AllCards.json").toString());
const NAMES = Object.keys(CARDS);

/**Special strcmp. Ignores case.
 * @param a
 * @param b
 */
function compare(a, b) {
  let aL = a.toLowerCase();
  let bL = b.toLowerCase();
  return (aL < bL ? -1 : (aL > bL ? 1 : 0));
}

/**Binary searches the NAMES array.
 * @param {String} name
 * @param {Number} start
 * @param {Number} end
 * @returns {Number} index of the name, or the thing closest to it
 */
function searchForCard(name, start, end) {

}
/** Load the lines of text from a file into an array.
 * @param {String|Buffer} file The loaded file from fs.readFileSync()
 * @returns {Array}
 * **/
function loadWords(file) {
  return file.toString("utf-8").split(/\r?\n/);
}

/** Filter the array to only the objects that match the regex.
 * @param {RegExp} reg
 * @param {Array} source
 * @returns {Array}
 * **/
function filter(reg, source) {
  let ret = [];
  for (let word of source) {
    if (reg.test(word) === true) {
      ret.push(word);
    }
  }
  return ret;
}

/** Returns a function that returns a random item for !finally.
 * @param {Array} words
 * **/

function finallyCreator(words) {
  let finallyWords = filter(/^p[a-z]{4,}[io][aeiou]?n$/, words);
  return (args, send, server) => {
    if (server.atg) {
      let rand = Math.floor(Math.random() * finallyWords.length);
      send(finallyWords[rand]);
    }
  }
}

function binallyCreator(f) {
  return (args, send, server) => {
    f(args, (text) => {
      let bText = ":b:" + text.substring(1);
      send(bText);
    }, server);
  }
}

module.exports = {
  loadWords,
  filter,
  finallyCreator,
  binallyCreator
};
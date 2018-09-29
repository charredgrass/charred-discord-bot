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



module.exports = {
  loadWords,
  filter
};
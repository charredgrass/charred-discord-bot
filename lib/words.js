//file FileBuffer loaded with fs.readFile or readFileSync
//returns a huge ass array of strings
function loadWords(file) {
  return file.toString("utf-8").split("\n");
}

//reg a RegExp 
//source a huge ass array of strings to be filtered
//returns the items in the array that match the RegExp
//please dont pass an array of shit other than strings
//this is one of those times I wish I was using TypeScript
function filter(reg, source) {
  let ret = [];
  for (let i = 0; i < source.length; i++) {
    if (reg.test(source[i]) === true) {
      ret.push(source[i]);
    }
  }
  return ret;
}

module.exports = {
  loadWords,
  filter
};
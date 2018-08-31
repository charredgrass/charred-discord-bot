const STYLE_OPT = ["b", "B", "p", "v", "V", ""];
const STYLE_BEG = ["[", "{", "(", "|", "||", ""];
const STYLE_END = ["]", "}", ")", "|", "||", ""];

//Matrices represented by 2d arrays where the inner arrays represent rows

//Returns true if mat is a matrix (is an array containing arrays)
//Does not check that the contents of subarrays are numbers.
function isMatrix(mat) {
  if (Array.isArray(mat) === false) return false;
  for (let i = 0; i < mat.length; i++) {
    if (Array.isArray(mat[i]) === false) {
      return false;
    }
    if (mat[i].length !== mat[0].length) return false;
  }
  return true;
}

//Pads a string to the length with spaces.
function padStr(toPad, length) {
  let numSpaces = length - toPad.length;
  if (numSpaces < 0) numSpaces = 0;
  return " ".repeat(numSpaces) + toPad;
}

//Returns the matrix in LaTeX
//stylemod determines if it has brackets, braces, parens, etc.
//stylemod can be any of the following: b, B, p, v, V, small, or emptystring. Defaults to b.
function matLaT(mat, stylemod) {
  if (!stylemod) stylemod = "b";
  let ret = "$\n\\begin{" + stylemod + "matrix}\n";
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      ret += "" + mat[i][j] + (j === mat[i].length - 1 ? "" : "& ");
    }
    ret += "\\\\\n";
  }
  ret += "\\end{" + stylemod + "matrix}\n$";
  return ret;
}

//Returns the matrix in plaintext
//stylemod is the setting for what the matrix will be surrounded by. Can be b, B, p, v, V, or emptystring. Default b
//delim is the matrix delimiter. Default: emptystring
//pad is whether or not to pad the numbers with spaces. Default: true
function matTxt(mat, stylemod, delim, pad) {
  if (!stylemod) stylemod = "";
  if (!delim) delim = "";
  if (!pad) pad = true;
  let mlength = 0;
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      let curr = String(mat[i][j]).length;
      if (curr > mlength) mlength = curr;
    }
  }
  let ret = "";
  //TODO make stylemod choose the groupers
  let groupers = ["[","]"];
  for (let i = 0; i < mat.length; i++) {
    ret += groupers[0];
    for (let j = 0; j < mat[i].length; j++) {
      ret += padStr(String(mat[i][j]), mlength);
      if (j != mat[i].length) ret += " ";
    }
    ret += groupers[1];
    ret += "\n";
  }
  return ret;
}

//Converts a text matrix delimited by commas where the inner arrays are rows into a matrix object where the inner arrays are rows.
//If the text is not a valid matrix, return null. 
function textToMat(text) {
  text = text.replace(/\(/, "[").replace(/\)/, "]");
  let ret = JSON.parse(text);
  if (isMatrix(ret) === true) return ret;
  else return null;
}

module.exports = {
  matLaT,
  matTxt,
  textToMat
};
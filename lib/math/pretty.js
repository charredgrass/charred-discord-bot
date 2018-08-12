const STYLE_OPT = ["b", "B", "p", "v", "V", ""];
const STYLE_BEG = ["[", "{", "(", "|", "||", ""];
const STYLE_END = ["]", "}", ")", "|", "||", ""];

//Matrices represented by 2d arrays where the inner arrays represent rows

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

//Returms the matrix in plaintext
//stylemod is the setting for what the matrix will be surrounded by. Can be b, B, p, v, V, or emptystring. Default b
//delim is the matrix delimiter. Default: emptystring
//pad is whether or not to pad the numbers with spaces. Default: true
function matTxt(mat, stylemod, delim, pad) {
  if (!stylemod) stylemod = "";
  if (!delim) delim = "";
  if (!pad) pad = true;
  let stringmat = [];
  let mlengths = [];
  for (let i = 0; i < mat.length; i++) {
    let longest = 0;
    let toPush = [];
    for (let j = 0; j < mat[i].length; j++) {
      let curr = String(mat[i][j]);
      if (curr.length > longest) longest = curr.length;
      toPush.push(curr);
    }
    stringmat.push(toPush);
    mlengths.push(longest);
  }
}
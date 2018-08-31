//matrix modification functions

//scale(mat, row, scal) 
//Scales each value in the matrix's rows by the given scalar.
//  mat is the target matrix
//  row is the index of the row to be scaled, 0<=row<mat.length
//  scal is the scalar to apply to the row
function scale(mat, row, scal) {
  for (let i = 0; i < mat[row].length; i++) {
    mat[row][i] *= scal;
  }
}

//swap(mat, row1, row2)
//Swaps the rows of the matrix.
//  mat is the target matrix
//  row1 and row2 are indexes of the rows to be swapped, 0<=row1,row2<mat.length
function swap(mat, row1, row2) {
  let temp = mat[row1];
  mat[row1] = mat[row2];
  mat[row2] = temp;
}

//elim(mat, from, target, scal)
//Performs an elimination operation on the matrix.
//  mat is the target matrix
//  from and target are the indexes of rows to perform the operation on, 0<=from,target<mat.length
//  scal is the scalar to multiply from by to eliminate, scal != 0
function elim(mat, from, target, scal) {
  for (let i = 0; i < mat[from].length; i++) {
    mat[target][i] += mat[from][i] * scal;
  }
}


//helper functions for rref

//ref(mat)
//Turns mat into its reduced echelon form.
//  mat is the target matrix, as an array containing arrays representing the rows of the matrix
function ref(mat) {
  let currcol = 0; //current column we're making pivoty
  let pivs = 0; //number of previous pivot columns
  while (currcol < mat[0].length) {
    //scan from currcol in all rows to find first one with thing (scan by column though)
    let toswap = -1; //the row to be swapped into the pivs position
    let pivcol = mat[0].length; //the first column with a nonzero entry
    for (let i = pivs; i < mat.length; i++) { //loop through the rows, ignoring pivot rows
      for (let j = currcol; j < mat[0].length; j++) { //you could change this to j < pivcol for efficiency
        if (mat[i][j] != 0) {
          if (j < pivcol) { //if current col is earlier than earliest known column
            toswap = i;
            pivcol = j;
          }
        }
      }
    }

    //if only zero rows remain, exit
    if (toswap == -1) {
      return; //could return pivs to show number of pivot columns
    }

    //swap that row into the pivs position
    swap(mat, pivs, toswap);

    //scale to equal 1
    scale(mat, pivs, 1 / (mat[pivs][pivcol])); //no need to check for div by zero because piv will always be a nonzero by definition

    //elim on each row below it
    for (let i = pivs + 1; i < mat.length; i++) {
      elim(mat, pivs, i, -1 * mat[i][pivcol]);
    }

    //increment pivs, set currcol to the pivot col + 1
    pivs++;
    currcol = pivcol + 1;
  }
}

//backpass(mat)
//Given a REF of a matrix, produces the RREF.
//  mat is the target matrix.
function backpass(mat) {
  for (let i = mat.length - 1; i > 0; i--) { //loop through all rows but first, starting from bottom
    let nonzpos = -1; //index of first nonzero entry (pivcol)
    for (let j = 0; j < mat[i].length; j++) { //find the pivot column in this row
      if (mat[i][j] !== 0) { //if backpass is called in rref, should always be ==1 if !=0
        nonzpos = j;
        break;
      }
    }
    if (nonzpos !== -1) { //if row isn't a zero row, elim all above rows
      for (let k = i - 1; k >= 0; k--) {
        elim(mat, i, k, -1 * mat[k][nonzpos]);
      }
    }
  }
}

//rref(mat)
//Converts the matrix into its reduced row echelon form.
// mat is a 2d array, mat[i].length == mat[j].length for all 0<=i,j<mat.length
//  the arrays in mat are the rows of the matrix to reduce
function rref(mat) {
  ref(mat);
  backpass(mat);
  return mat;
}


//dot(v1, v2)
//Dots the two vectors
//  v1 and v2 are vectors
//  pre: v1.length == v2.length
function dot(v1, v2) {
  let ret = 0;
  for (let i = 0; i < v1.length; i++) {
    ret += v1[i] * v2[i];
  }
  return ret;
}

//getcol(mat, col)
//Retrives the colth column of the matrix.
function getcol(mat, col) {
  let ret = [];
  for (let i = 0; i < mat.length; i++) {
    ret.push(mat[i][col]);
  }
  return ret;
}

//getrow(mat, row)
//Retrieves the rowth column of the matrix.
function getrow(mat, row) {
  return mat[row];
}

//mmult(left, right)
//Multiplies two matrices.
// left and right are the matrices to be multiplied
// pres: left and right are 2d arrays where the inner arrays are rows
// neither arrays can be empty arrays
// left[0].length == right.length
function mmult(left, right) {
  let ret = [];
  for (let i = 0; i < left.length; i++) {
    ret.push(new Array(right[0].length));
  }
  for (let i = 0; i < ret.length; i++) {
    for (let j = 0; j < ret[0].length; j++) {
      ret[i][j] = dot(getrow(left, i), getcol(right, j));
    }
  }
  return ret;
}

//submatrix(mat, i, j)
//Returns the matrix with the ith row and jth column removed.
function submatrix(mat, i, j) {
  let ret = [];
  for (let row = 0; row < mat.length; row++) {
    if (row !== i) {
      let crow = []; //current row
      for (let col = 0; col < mat[row].length; col++) {
        if (col !== j) {
          crow.push(mat[row][col]);
        }
      }
      ret.push(crow);
    }
  }
  return ret;
}

//cfsign(i, j)
//Calculates (-1)^(i+j).
function cfsign(i, j) {
  return ((i + j) % 2 === 0 ? 1 : -1);
}

//detR(mat)
//Calculates the determinant of the n by n matrix recursively using cofactor expansion.
//Uses cofactors of the matrix's first rows.
// mat is a 2d array where the inner arrays are rows
// mat.length == mat[n].length for all 0<=n<mat.length
function detR(mat) {
  if (mat.length == 1) return mat[0][0]; //base case: 1x1 matrix
  if (mat.length == 0) return 1; //horrendous base case: 0x0 matrix
  let ret = 0;
  for (let i = 0; i < mat[0].length; i++) { //iterate across first row
    ret += mat[0][i] * cfsign(0, i) * detR(submatrix(mat, 0, i));
  }
  return ret;
}


module.exports = {
  scale,
  swap,
  elim,
  ref,
  rref,
  mmult,
  detR
};
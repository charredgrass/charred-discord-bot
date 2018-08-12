const linalg = require("./linalg.js");

// const A = [[1,2,3],[1,3,4],[1,2,4]];
// const B = [[1,0,0],[0,1,0],[0,1,0]];
// const C = [[1,1,1,1],[1,2,2,4],[1,1,2,2],[2,5,3,9]];
// const D = [[1,1,1,1,1],[1,2,1,2,1],[1,1,2,2,1],[1,1,1,1,2]];
// const E = [[1,1,1],[1,1,1],[1,2,1],[1,3,1]];
// const mats = [A, B, C, D, E];

// for (let i = 0; i < mats.length; i++) {
// 	linalg.ref(mats[i]);
// 	console.log(mats[i]);
// }

// const I = [[1,0,0],[0,1,0],[0,0,1]];

// console.log(linalg.mmult(I,A));

const A = [[1,2,1,2],[2,4,5,1],[3,8,5,2],[2,3,4,0]];
console.log(linalg.detR(A));
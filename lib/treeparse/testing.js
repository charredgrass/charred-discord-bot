const CTreeObjects = require("./CTreeObjects.js");

let ft = CTreeObjects.FunctionTree.makeTreeFromStrings([5, "+", 5, "*", 3, "+", 10]);

console.log(ft.evaluate());
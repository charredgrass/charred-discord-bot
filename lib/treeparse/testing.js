const CTreeObjects = require("CTreeObjects.js");

let ft = CTreeObjects.FunctionTree.makeTreeFromStrings([5, "+", 5]);

console.log(ft.evaluate());
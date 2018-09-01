let fs = require("fs");
let words = require("./lib/words.js");

let dict = words.loadWords(fs.readFileSync("./texts/wiktionary.txt"));
let f1 = words.filter(/^p[a-z]{4,}[io][aeiou]?n$/,dict);
console.log(f1.join(" "));
console.log(f1.length);
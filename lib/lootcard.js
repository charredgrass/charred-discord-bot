var text = require("./utils.js");
var fs = require("fs");

//I wish I could use the Deck class.
//Fucking abstraction, always need to plan ahead.
//Actually I just thought of a way to do it but it takes actual effort.

function generateCard(lines) {
  let ret = "+----------------+\n";
  ret += "|                |\n";
  ret += "|" + text.center(lines[0], 16) + "|\n"; //title
  ret += "|" + text.center(lines[1], 16) + "|\n"; //sub-title
  ret += "|                |\n"; //spacer
  ret += "|" + text.center(lines[2], 16) + "|\n"; //lines of text
  ret += "|" + text.center(lines[3], 16) + "|\n";
  ret += "|" + text.center(lines[4], 16) + "|\n";
  ret += "|" + text.center(lines[5], 16) + "|\n";
  ret += "|" + text.center(lines[6], 16) + "|\n";
  ret += "|                |\n"; //final space
  ret += "+----------------+\n";
  return ret;
}

function giveLoot(id, gd, cb) {
  let ret = {};

  let card = {};

}
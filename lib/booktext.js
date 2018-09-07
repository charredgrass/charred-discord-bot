const fs = require("fs");

//input file is of the format:

const TEST_INPUT = [{
  title: "Page 1 Text",
  subtitle: "The First Page",
  text: "asfdsadfasdfasdfadsfasf",
  sort: ["aug", "1"]
}, {
  title: "Page 2",
  subtitle: "Second",
  text: "asdf",
  sort: ["aug", "0"]
}, {
  title: "3",
  subtitle: "3",
  text: "3",
  sort: ["aff", "2"]
}];

//config: sort order
const SORTORDER = ["int", "aug", "aff", "0", "1", "2", "3"];

//sorting stuff

function strcmp(str1, str2) {
  return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
}

//loading

function loadBook(path) {
  let book = JSON.parse(fs.readFileSync(path).toString("utf-8"));
  //assert book.isArray();
  //this is where I would put my assert statement. IF I HAD ONE
  return book;
}

//object

function Book(loadPath, sorter) {
  this.book = loadBook(loadPath);
  this.sorter = sorter;
  this.sortEntryOrders();
  this.book.sort(this.comparePage);
}

//.compareTo functions for symbols and pages in Book

//compares two symbols using the list of symbols in this.sorter
//if s1 comes before s2, return -1
//if s1 == s2, return 0
//if s2 comes before s1, return 1
Book.prototype.compareSymbol = function(s1, s2) { 
  if (s1 === s2) return 0;
  for (let i = 0; i < SORTORDER.length; i++) {
    let curr = SORTORDER[i];
    if (s1 === curr) return -1;
    if (s2 === curr) return 1;
  }
  return null; //ya fucked up
};

function compareSymbol(s1, s2) {
  if (s1 === s2) return 0;
  for (let i = 0; i < SORTORDER.length; i++) {
    let curr = SORTORDER[i];
    if (s1 === curr) return -1;
    if (s2 === curr) return 1;
  }
  return null; //ya fucked up
};

//Assumes the symbols in p1.sort and p2.sort are in order specified by this.sorter
Book.prototype.comparePage = function(p1, p2) {
  for (let i = 0; i < p1.sort.length && i < p2.sort.length; i++) {
    let compval = compareSymbol(p1.sort[i], p2.sort[i]);
    if (compval !== 0) return compval;
  }
  if (p1.sort.length == p2.sort.length) {//they are the same
    return strcmp(p1.title, p2.title);
  }
  else return (p1.sort.length < p2.sort.length ? -1 : 1);
};

//Go through every page in the book and make sure its .sort is in the correct order.
Book.prototype.sortEntryOrders = function() {
  for (let i = 0; i < this.book.length; i++) {
    this.book[i].sort.sort(this.compareSymbol);
  }
};

Book.prototype.getPageByNum = function(num) {
  return this.book[num - 1];
};

Book.prototype.getPageByName = function(name) {
  for (let i = 0; i < this.book.length; i++) {
    if (this.book[i].title.toLowerCase() === name.toLowerCase()) {
      return this.book[i];
    }
  }
  return null;
};

//display

Book.prototype.pageToPretty = function(page) {
  let ret = "\n";
  ret += "**" + page.title + "**\n";
  if (page.subtitle !== "") ret += "*" + page.subtitle + "*\n";
  ret += page.text;
  ret += "";
  return ret;
};

function pad(toPad, bigNum) {
  let length = Math.floor(Math.log10(bigNum) + 1);
  let plen = Math.floor(Math.log10(toPad) + 1);
  return " ".repeat(length - plen) + toPad;
}

function tocabbrev(sorter) {
  return sorter[0].toUpperCase() + sorter[1];
}

Book.prototype.tableofcontents = function() {
  let ret = "**Table of Contents**\n```"
  for (let i = 0; i < this.book.length; i++) {
    ret += "" + pad(i + 1, this.book.length) + " " + tocabbrev(this.book[i].sort) + " "+ this.book[i].title + "\n";
  }
  ret += "```";
  return ret;
};

module.exports = {
  Book
};
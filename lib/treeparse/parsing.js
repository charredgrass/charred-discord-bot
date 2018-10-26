const CTreeObjects = require("./CTreeObjects.js");
const FunctionTree = CTreeObjects.FunctionTree;
const OperationNode = CTreeObjects.OperationNode;
const ValueNode = CTreeObjects.ValueNode;

const TOKEN_TYPES = {
  NUMBER: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  OPERATOR: ["*", "/", "+", "-"]
};

/**
 * @param {String} msg
 */
function evalMessage(msg) {
  let curr = "";
  let currType = ""; //i could totally use a number here
  //at least i'm only wasting O(1) memory
  let stack = [];
  for (let i = 0; i < msg.length; i++) {
    //check the type of the current character token
    //if it differs from currType, push curr onto stack
    //set curr = this token, set currType = type of this token
    //but also like if it's a d and the current type is number, swap to dice
    //fuck
    //also if there are parentheses, you need to somehow partition it
    
  }
}




module.exports = {

};
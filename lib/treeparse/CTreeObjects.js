/**
 * Represents a node in a tree.
 */
class Node {
  /** Constructor for Node
   * @param {Node} left
   * @param {Node} right
   * @param {*} value
   */
  constructor(left, right, value) {
    this.left = left;
    this.right = right;
    this.value = value;
  }

  /**Evaluates the node.
   * @returns {Number} a value.
   */
  evaluate() {
    //To be overriden
    throw new Error("Node.evaluate() is abstract");
  }
}

/**
 * Represents a node that performs an operation.
 */
class OperationNode extends Node {
  /**Constructor for OperationNode
   * @param {Node} left
   * @param {Node} right
   * @param {*} value
   */
  constructor(left, right, value) {
    super(left, right, value);
  }

  /**Evaluates the operation by evaluating its children.
   * @returns {Number} value
   */
  evaluate() {
    switch (this.value) {
      case "+":
        return this.left.evaluate() + this.right.evaluate();
      case "-":
        return this.left.evaluate() - this.right.evaluate();
      case "*":
        return this.left.evaluate() * this.right.evaluate();
      case "/":
        return this.left.evaluate() / this.right.evaluate();
      default:
        return this.left.evaluate() + this.right.evaluate();
    }
  }
}

/**
 * Represents a node that contains a constant value. Has no children.
 */
class ValueNode extends Node {
  /**
   * @param {*} value
   */
  constructor(value) {
    super(null, null, value)
  }

  /**Returns the value stored in the node.
   * @returns {Number} value
   */
  evaluate() {
    return this.value;
  }
}

class DieValueNode extends ValueNode {
  constructor(size) {
    super("d" + size);
  }

  /**
   * @returns {number}
   */
  evaluate() {
    return Math.floor(Math.random() * size) + 1
  }
}

class FunctionTree {
  /**
   * @param {Node} head
   */
  constructor(head) {
    this.head = head;
  }

  /**
   * @returns {Number}
   */
  evaluate() {
    return this.head.evaluate();
  }

  /**For testing only. Makes a tree from strings and ints.
   * @param {Array} a
   * @returns {FunctionTree}
   */
  static makeTreeFromStrings(a) {
    for (let i = 0; i < a.length; i++) {
      if (["*", "/", "+","-"].includes(a[i])) {
        a[i] = new OperationNode(null, null, a[i]);
      } else {
        a[i] = new ValueNode(a[i]);
      }
    }
    return this.makeTree(a);
  }

  /**Turns an array of Nodes into a tree.
   * Assumes the array can make a valid tree.
   * @param {Node[]} a, the array of nodes
   * @returns {FunctionTree} the new tree
   */
  static makeTree(a) {
    const ORDER = [["*", "/"], ["+", "-"]];
    for (let tier of ORDER) {
      for (let i = 1; i < a.length - 1; i++) {
        //loop through a, find any that matches tier, and bind adjacents
        if (tier.includes(a[i].value)) {
          //Assumes each thing appears in ORDER only once, otherwise it will
          //  override previous assignments and you'll lose stuff.
          a[i].left = a[i-1];
          a[i].right = a[i+1];
          //Remove the elements a[i-1] and a[i+1] from the array. They're assigned now.
          a = a.slice(0, i-1).concat([a[i]]).concat(a.slice(i+2));
          i--;
        }
      }
    }
    return new FunctionTree(a[0]);
  }
}

module.exports = {
  FunctionTree,
  OperationNode,
  ValueNode,
  DieValueNode
};
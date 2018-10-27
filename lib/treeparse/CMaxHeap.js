

class MaxHeap {

  constructor() {
    this.contents = [null]; //starts with null to be rooted at A[1]
  }

  get size() {
    return this.contents.length - 1;
  }
  /**Given the subtree rooted at A[i], where A[i] is possibly out of order,
   * correct the ordering of that tree.
   * @param {number} i
   * @pre 1 <= i < this.size
   */
  sink(i) {
    //base case: a tree with one node is always a valid max heap
    if (this.isLeaf(i) === true) return;
    //if the node is already correct
    if (this.contents[i] > this.contents[left(i)] &&
        this.contents[i] > this.contents[right(i)]) return;
    //if the node is less than both its children, bring up the greater one
    if (this.contents[i] < this.contents[left(i)] &&
        this.contents[i] < this.contents[right(i)]) {
      if (this.contents[left(i)] > this.contents[right(i)]) {
        let temp = this.contents[i];
        this.contents[i] = this.contents[left(i)];
        this.contents[left(i)] = temp;
        return this.sink(left(i));
      } else {
        let temp = this.contents[i];
        this.contents[i] = this.contents[right(i)];
        this.contents[right(i)] = temp;
        return this.sink(right(i));
      }
    }
    //either left or right is bigger than the root, so swap with that
    else if (this.contents[left(i)] > this.contents[i]) {
      let temp = this.contents[i];
      this.contents[i] = this.contents[left(i)];
      this.contents[left(i)] = temp;
      return this.sink(left(i));
    } else {
      let temp = this.contents[i];
      this.contents[i] = this.contents[right(i)];
      this.contents[right(i)] = temp;
      return this.sink(right(i));
    }
  }


  /**
   * @param {number} i
   * @returns {number}
   */
  static parent(i) {
    return Math.floor(i/2);
  }
  /**
   * @param {number} i
   * @returns {number}
   */
  static left(i) {
    return i * 2;
  }
  /**
   * @param {number} i
   * @returns {number}
   */
  static right(i) {
    return i * 2 + 1;
  }

  isLeaf(i) {
    //if i*2 is outside the array, then it is a leaf
    return i * 2 > this.size;
  }
}
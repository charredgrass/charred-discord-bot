/** A class representing an individual player.
 * **/
class Player {
  /**Player constructor.
   * @param {Snowflake} id The player's Discord ID.
   * @param {String} name The player's username at time of creation.
   * @param {Number} credits
   * @param {Number} last
   * **/
  constructor(id, name, credits, last) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.last = last;      //last time dispenser was used, Unix timestamp
    this.currgame = null;
  }

  /**
   * @param num
   * @returns {number}
   */
  addCredits(num) {
    this.credits = Math.floor(this.credits + num);
    return this.credits;
  }

  /**
   * @param num
   * @returns {number}
   */
  removeCredits(num) {
    if (this.credits < num) return -1;
    this.credits = Math.floor(this.credits - num);
    return this.credits;
  }

  /**If the game has finished, remove it from memory.
   * @returns {boolean} true if game cleaned up.
   */
  cleanupGame() {
    if (!this.currgame) return false;
    if (this.currgame.hasFinished === true) {
      this.currgame = null;
      return true;
    }
    return false;
  }
}


class Game {
  /**Game constructor.
   * @param {Object} data The saved game data.
   * @param {Function} write A function to write data to file.
   * **/
  constructor(data, write) {
    this.data = {players:[]};
    for (let p of data.players) {
      this.data.players.push(new Player(p.id, p.name, p.credits, p.last));
    }
    this.write = write;
  }

  //Data Management

  /**Creates a new Player and stores their data.
   * @param {Snowflake} id
   * @param {String} name
   * @param {Number} credits
   * @param {Number} last
   * **/
  newPlayer(id, name, credits, last) {
    this.data.players.push(new Player(id, name, credits, last));
  }

  /**Returns a data object that can be saved.
   * @returns {Object} The saved game data.
   * **/
  saveableData() {
    let ret = {players:[]};
    for (let p of this.data.players) {
      ret.players.push(
          {
            id: p.id,
            name: p.name,
            credits: p.credits,
            last: p.last
          }
      );
    }
    return ret;
  }

  save() {
    this.write(this.saveableData());
  }

  //Value Management

  /**Returns the Player object for the specified ID.
   * @param {Snowflake} id
   * @returns {Player|null} The player object with the corresponding ID, or null.
   * **/
  getPlayer(id) {
    for (let p of this.data.players) {
      if (p.id === id) return p;
    }
    return null;
  }

  /**Returns the balance of the player with the specified ID.
   * @param {Snowflake} id
   * @returns {Number} That player's balance, or -1 if that player does not exist.
   * **/
  getBalOf(id) {
    let p = this.getPlayer(id);
    return (p ? p.credits : -1);
  }

  /**Adds credits to the player's balance and returns the new balance.
   * @param {Snowflake} id
   * @param {Number} num
   * @returns {Number} The player's new balance, or -1 if the player does not exist.
   * **/
  addCredits(id, num) {
    let p = this.getPlayer(id);
    if (p) {
      return p.addCredits(num);
    }
    return -1;
  }

  /**Removes credits from the player's balance and returns the new balance.
   * @param {Snowflake} id
   * @param {Number} num
   * @returns {Number} The player's new balance, or -1 if the player does not exist
   *  or doesn't have enough credits.
   * **/
  removeCredits(id, num) {
    let p = this.getPlayer(id);
    if (p) {
      return p.removeCredits(num);
    }
    return -1;
  }

}

module.exports = Game;
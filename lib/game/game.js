/** A class representing an individual player.
 * **/
class Player {
  /**Player constructor.
   * @param {Snowflake} id The player's Discord ID.
   * @param {String} name The player's username at time of creation.
   * **/
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.credits = 100;
    this.last = 0;      //last time dispenser was used, Unix timestamp
    this.currgame = null;
  }
  addCredits(num) {
    this.credits = Math.floor(this.credits + num);
    return this.credits;
  }
  removeCredits(num) {
    if (this.credits < num) return -1;
    this.credits = Math.floor(this.credits + num);
    return this.credits;
  }
}


class Game {
  /**Game constructor.
   * @param {Object} data The saved game data.
   * @param {Function} write A function to write data to file.
   * **/
  constructor(data, write) {
    this.data = data;
    this.write = write;
  }

  //Data Management

  /**Creates a new Player and stores their data.
   * @param {Snowflake} id
   * @param {String} name
   * **/
  newPlayer(id, name) {
    this.data.players.push(new Player(id, name));
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
      )
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
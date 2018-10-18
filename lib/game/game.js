const table = require("../table.js").table;

const REFILL_COOLDOWN = 1000 * 60 * 60 * 3;

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

  /**Returns the amount of milliseconds since the dispenser was used.
   * @returns {number}
   */
  timeSinceLast() {
    return Date.now() - this.last;
  }

  resetLast() {
    this.last = Date.now();
  }
}

class Game {
  /**Game constructor.
   * @param {Object} data The saved game data.
   * @param {Function} write A function to write data to file.
   * **/
  constructor(data, write) {
    /**
     * @type {{players: Player[]}}
     */
    this.data = {players: []};
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
    let ret = {players: []};
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
   * @returns {?Player} The player object with the corresponding ID, or null.
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

  /**Generates a leaderboard text block.
   * @param {function} filter A filter to remove unwanted names. The function
   *  should return true for the ones to keep.
   * @param {number} size The length of the leaderboard.
   */
  getLeaderboard(filter, size) {
    let playerClones = []; //deep copy this.data.players only $, name
    for (let i = 0; i < this.data.players.length; i++) {
      /** @type {Player} */
      let p = this.data.players[i];
      if (filter(p) === true) {
        playerClones.push({
          "credits": p.credits,
          "name": p.name
        });
      }
    }
    //Array.sort by highest
    playerClones.sort((a, b) => {
      return b.credits - a.credits;
    });
    let toPass = [];
    for (let i = 0; i < size && i < playerClones.length; i++) {
      toPass.push([i + 1, playerClones[i].name, playerClones[i].credits]);
    }
    //display data
    return "```" + table("Leaderboard", ["#", "Player", "Credits"], toPass, {
      title: 33,
      headers: [2, 20, 9]
    }) + "```";
  }

  /**
   * @param {Snowflake} id
   * @param {function} cb
   * @returns {number}
   */
  giveFree(id, cb) {
    let p = this.getPlayer(id);
    if (p) {
      if (p.timeSinceLast() > REFILL_COOLDOWN) {
        let base = [2, 2, 3, 4, 5, 6];
        let mult = [1, 1, 1, 10, 10, 50];
        let amt = base[Math.floor(Math.random() * base.length)]
            * mult[Math.floor(Math.random() * mult.length)];
        p.addCredits(amt);
        p.resetLast();
        cb("You just got a refill of " + (amt) + " credits.");
        return amt;
      } else {
        let minutesToGo = (REFILL_COOLDOWN - p.timeSinceLast())
            / (1000 * 60);
        cb("" + Math.floor(minutesToGo) + " minutes until you can refill again.");
        return -2;
      }
    }
    return -1; //Player Not Found
  }
}


module.exports = Game;
function GameData(gamedata) {
    this.data = gamedata;
}


GameData.prototype.newPlayer = function(id, name) {
    let player = {
        id,
        credits: 100,
        last: Date.now(),
        name
    };
    this.data.players.push(player);
};

GameData.prototype.getBalOf = function(id) {
    for (let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            return this.data.players[i].credits;
        }
    }
    return -1;
};

GameData.prototype.setBalOf = function(id, credits) {
    for (let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            this.data.players[i].credits = parseInt(credits);
        }
    }
};

GameData.prototype.playerExists = function(id) {
    for (let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            return true;
        }
    }
    return false;
};

GameData.prototype.getLeaderboard = function() {
    let ret = [this.data.players[0]];
    //I know this will fail if there is nothing in this.data.players but I don't care.
    for (let i = 1; i < this.data.players.length; i++) {
        for (let j = 0; j < ret.length; j++) {
            if (this.data.players[i].credits > ret[j].credits) {
                ret.splice(j, 0, this.data.players[i]);
                break;
            }
        }
    }
    const leaderlength = 5;
    let retar = "Leaderboard: ";
    for (let i = 0; i < leaderlength; i++) {
        if (i >= ret.length) {
            break;
        }
        retar = retar + (i + 1) + ") " + ret[i].name + " " + ret[i].credits + " points" + "\n"
    }
    return retar;
};

GameData.prototype.dataToSave = function() {
    return JSON.stringify(this.data);
};


module.exports = {
    GameData
};
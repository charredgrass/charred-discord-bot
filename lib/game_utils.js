function GameData(gamedata) {
    this.data = gamedata;
}


GameData.prototype.newPlayer = function (id) {
    let player = {id, credits:100};
    this.data.players.push(player);
}

GameData.prototype.getBalOf = function (id) {
    for (let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            return this.data.players[i].credits; 
        }
    }
    return -1;
}

GameData.prototype.setBalOf = function (id, credits) {
    for(let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            this.data.players[i].credits = parseInt(credits);
        }
    }
}

GameData.prototype.playerExists = function (id) {
    for (let i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].id == id) {
            return true;
        }
    }
    return false;
}

GameData.prototype.dataToSave = function() {
    return JSON.stringify(this.data);
}


module.exports = {
    GameData
}
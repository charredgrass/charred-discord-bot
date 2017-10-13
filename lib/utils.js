function getEmoji(msg, emojiname) {
  let guildEmoji = msg.guild.emojis.array();
  for (let i = 0; i < guildEmoji.length; i++) {
    if (guildEmoji[i].name == emojiname) {
      return guildEmoji[i].toString;
    }
  }
  return "";
}

function getAllEmoji(guild) {
  let ret = {};
  let gem = guild.emojis.array();
  for (let i = 0; i < gem.length; i++) {
    ret[gem[i].name] = gem[i];
  }
  return ret;
}

module.exports = {
  getEmoji,
  getAllEmoji
}
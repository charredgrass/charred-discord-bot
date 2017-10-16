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

function hascmd(msg, cmd) {
  console.log(msg.substring(0, "!" + cmd + " ".length).toLowerCase());
  console.log("!" + cmd + " ");
  return msg.substring(0, "!" + cmd + " ".length).toLowerCase() === "!" + cmd + " ";
}

module.exports = {
  getEmoji,
  getAllEmoji,
  hascmd
}
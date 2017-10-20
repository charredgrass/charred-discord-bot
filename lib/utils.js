const center = require('./table.js').center

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
  return msg.substring(0, ("!" + cmd + " ").length).toLowerCase() === "!" + cmd + " ";
}

function clearEmptyArgs(list) {
  let args = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i] === "") {
      //kill space
    } else {
      args.push(list[i]);
    }
  }
  return args;
}

function argify(msg, cmd) {
  let preargs = msg.substring(("!" + cmd + " ").length).split(" ");
  args = clearEmptyArgs(preargs);
  return args;
}

function generateGrave(name, line1, line2, line3, line4, line5) {
  ret += "        ______________\n       /              \\\n      /                \\\n     /" + center(name,18) + "\\\n     |                  |\n     |";
  ret += center(line1,18)+"|\n     |" + center(line2, 18) + "|\n     |" + center(line3, 18) + "|\n     |" + center(line4, 18) + "|\n     |" + center(line5, 18) + "|\n"
  ret += "     |                  |\n     |                  |\n     |                  |\n-------------------------------"
  return ret;
}

module.exports = {
  getEmoji,
  getAllEmoji,
  hascmd,
  argify,
  clearEmptyArgs,
  generateGrave
}
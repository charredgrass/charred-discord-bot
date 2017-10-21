function center(text, space) {
  if (text.length > space) return text.substring(0, space);
  let empty = space - text.length;
  return " ".repeat(Math.floor(empty / 2)) + text + " ".repeat(Math.ceil(empty / 2));
}

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

function generateGrave(name, subn, lines) {
  let ret = "```        ______________\n";
  ret += "       /              \\\n";
  ret += "      /                \\\n";
  ret += "     /" + center(name, 18) + "\\\n";
  ret += "     |" + center(subn, 18) + "|\n";
  ret += "     |                  |\n";
  ret += "     |" + center(lines[0], 18) + "|\n";
  ret += "     |" + center(lines[1], 18) + "|\n";
  ret += "     |" + center(lines[2], 18) + "|\n";
  ret += "     |" + center(lines[3], 18) + "|\n";
  ret += "     |" + center(lines[4], 18) + "|\n";
  ret += "     |                  |\n";
  ret += "     |                  |\n";
  ret += "-------------------------------```";
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
//text modifiers

function center(text, space) {
  if (text.length > space) return text.substring(0, space);
  let empty = space - text.length;
  return " ".repeat(Math.floor(empty / 2)) + text + " ".repeat(Math.ceil(empty / 2));
}

function generateGrave(name, subn, lines) {
  let ret = "```        ________________\n";
  ret += "       /              \\ \\\n";
  ret += "      /                \\ \\\n";
  ret += "     /" + center(name, 18) + "\\ \\\n";
  ret += "     |" + center(subn, 18) + "| |\n";
  ret += "     |                  | |\n";
  ret += "     |" + center(lines[0], 18) + "| |\n";
  ret += "     |" + center(lines[1], 18) + "| |\n";
  ret += "     |" + center(lines[2], 18) + "| |\n";
  ret += "     |" + center(lines[3], 18) + "| |\n";
  ret += "     |" + center(lines[4], 18) + "| |\n";
  ret += "     |                  | |\n";
  ret += "     |                  | |\n";
  ret += "-------------------------------```";
  return ret;
}

function getTotalLineLength(line) {
  // let ret = 0;
  // for (let i = 0; i < line.length; i++) {
  //   ret += line[i].length;
  // }
  // ret += (line.length == 0 ? 0 : line.length - 1);
  // return ret;
  return line.join(" ").length; //fucking retard
}

function balanceText(text, lines, maxlen) {
  //Start from bottom
  let ret = Array(lines);
  for (let i = 0; i < ret.length; i++) ret[i] = [];
  let words = text.split(" ");
  let currWord = words.length - 1; //place cursor on back
  let currLine = ret.length - 1;
  while (currWord >= 0 && currLine >= 0) {
    let currLL = getTotalLineLength(ret[currLine]);
    if (currLL + 1 + words[currWord].length <= maxlen && words[currWord] == "\n") { //TODO make this work with strings longer than maxlen
      ret[currLine].unshift(words[currWord]);
      currWord--;
    } else {
      currLine--;
    }
  }
  while (ret[0].length == 0) {
    ret.shift();
    ret.push([]);
  }
  return ret;
}

//emoji grabbers

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

//arg splicers

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
  let args = clearEmptyArgs(preargs);
  return args;
}

function getNextRaidTime() {
  let now = new Date();
  let currentDay = now.getDay(); //2 = tuesday, 3 = wednesday
  //If it's a thursday through saturday (4, 5, 6), add 7 - (cDay-2) = 9-cDay to get to Tuesday.
  //If it's a Sunday or Monday add                                    2-cDay to get to Tuesday.
  //Alternatively for either, do targetDay-cDay and add 7 if the date is in the past.
  //Wait, actually, let's just do that. Add (9-cDay)%7 so it isn't bigger than 7.
  //Then do (10-cDay)%7 to get the Wednesday (mydudes) date.
  let nextTu = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (9 - currentDay) % 7, 18, 0, 0, 0);
  let nextWe = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (10 - currentDay) % 7, 18, 0, 0, 0);
  let ret;

  //If Tuesday is in the past, use Wednesday.
  //Otherwise, use Tuesday.
  if (nextTu.getTime() < now.getTime()) {
    ret = nextWe;
  } else {
    ret = nextTu;
  }

  //Debug: print the human readable strings in the local time zone
  // console.log(nextTu.toLocaleString());
  // console.log(nextWe.toLocaleString());

  return ret;
}

module.exports = {
  getEmoji,
  getAllEmoji,
  hascmd,
  argify,
  clearEmptyArgs,
  generateGrave,
  getNextRaidTime
};
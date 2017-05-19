const Discord = require('discord.js');
const client = new Discord.Client();

const SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();

const fs = require('fs');

var whoppl = {
  "yuna": "a rich guy who watches hentai",
  "kairu": "the traplord",
  "aesoa": "the boss",
  "charred": "my dad",
  "dank": "the best",
  "danknissan": "the best",
  "problemen": "some guy",
  "imp": "a degenerate weeb but still pretty cool",
  "wings": "some loser",
  "danker": "gay",
  "clam": "knif stealer",
  "ghast": "a loser",
  "danker": "the inferior dank",
  "kansaurous": "a grammar nazi but the good kind",
  "kuri2k": "a profile genius"
}


function whois(person) {
  for (var key in whoppl) {
    if (person.toLowerCase() === key) {
      // console.log(key)
      return person + " is " + whoppl[key]
    }
  }
}



client.on('ready', () => {
  console.log('Connected and initialized.');
});

function formatPrice(i) {
  return i.market_hash_name + " costs $" + (i.price / 100)
}

function removeAll(str, rep) {
  while (str.includes(rep) === true) {
    str = str.replace(rep, "")
  }
  return str
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFromList(list) {
  return list[getRandomInt(0, list.length)]
}

var lastsent = Date.now()

client.on('message', message => {

  // console.log("yep")

  if (message.author.bot === true) {
    return;
  }

  var loc = message.channel;
  var msg = removeAll(message.content, "?");

  var send = function(msg, opts) {
    if (lastsent + 1000 < Date.now()) {
      lastsent = Date.now()
      loc.send(msg, opts);
    } else {

    }
  }

  if (msg.includes("trap")) {
    send('Traps? Ask Kairu about our Grade A Traps today!');
  }
  if (msg.toLowerCase() === "who am i") {
    send("None of your business.")
  }
  if (msg.toLowerCase() === "who are you" || msg.toLowerCase() === "who is charredbot") {
    send("You're fucking retarded.")
    return;
  }
  if (msg.substring(0, "who is ".length).toLowerCase() === "who is ") {
    // console.log(msg.substring("who is ".length))
    send(whois(msg.substring("who is ".length)))
  }

  if (msg.substring(0, "!priceof ".length).toLowerCase() === "!priceof ") {
    var item = (msg.substring("!priceof ".length))
    community.marketSearch({
      query: item,
      appid: 730
    }, (err, items) => {
      if (err) {
        send(err.message);
      } else {
        send(formatPrice(items[0]));
      }
    })
  }
  if (msg.substring(0, "!imgof ".length).toLowerCase() === "!imgof ") {
    var item = (msg.substring("!imgof ".length))
      // console.log(item)
    if (item.toLowerCase() == "kairu") {
      send("", {
        embed: new Discord.RichEmbed().setImage("http://vignette1.wikia.nocookie.net/powerlisting/images/a/ad/Trap-image.png/revision/latest?cb=20160113212524")
      })
      return;
    }
    community.marketSearch({
      query: item,
      appid: 730
    }, (err, items) => {
      if (err) {
        send(err.message);
      } else {
        send(items[0].market_hash_name, {
          embed: new Discord.RichEmbed().setImage(items[0].image)
        });
      }
    })
  }
  if (msg.substring(0, "!magic8 ".length).toLowerCase() === "!magic8 ") {
    var answers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"]
    send(getRandomFromList(answers))
  }
  if (msg.substring(0, "!help ".length).toLowerCase() === "!help ") {
    console.log("yep")
    var args = (msg.substring("!help ".length).split(" "))
    if (args.length == 0) {
      send("Valid commands: !help, !priceof [CSGO item], !imgof [CSGO item], who is [person], !magic8 [question]\nType \"!help help\" for more help.")
    } else if (args.length == 1) {
      if (args[1] === "help") {
        send("Type \"!help\" for a general list of commands, or \"!help [commandname]\" for specific command documentation.")
      }
    } else {
      send("Unknown command. Type \"!help\" for help.")
    }
  }
});

client.login(fs.readFileSync('./key.txt').toString("utf-8"));
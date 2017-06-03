const Discord = require('discord.js');
const client = new Discord.Client();

const SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();

const fs = require('fs');

var whoppl = JSON.parse(fs.readFileSync('./texts/whois.json').toString("utf-8"));
var helpdocs = JSON.parse(fs.readFileSync('./texts/helpdocs.json').toString("utf-8"));

process.stdin.setEncoding('utf8');
var commands = {
  "UNKNOWN_COMMAND": function() {
    return "Unknown command. Type `help` for help.";
  },
  "reload": function() {
    whoppl = JSON.parse(fs.readFileSync('./texts/whois.json').toString("utf-8"));
    return "Reloaded.";
  }
};

process.stdin.on('data', (text) => {
  var stuff;
  while (text.indexOf('\n') !== -1 || text.indexOf('\r') !== -1 || text.indexOf('  ') !== -1) {
    text = text.replace(/\n|\r|\t/, '').replace(/  /, ' ');
  }
  var args = text.split(' ');
  //call a function with args. Maybe make a function list or something?
  var command = args[0].toLowerCase();
  var trip = false;
  for (var key in commands) {
    if (key === command) {
      trip = true;
      stuff = commands[key](args[1], args[2], args[3]);
      if (Array.isArray(stuff)) {
        // stuff.forEach(log);
      } else {
        console.log(stuff);
      }
    }
  }
  if (!trip) {
    stuff = commands.UNKNOWN_COMMAND();
    if (Array.isArray(stuff)) {
      for (var i = 0; i < stuff.length; i++) {
        console.log(stuff[i]);
      }
    } else {
      console.log(stuff);
    }
  }
});

function whois(person) {
  for (var key in whoppl) {
    if (person.toLowerCase() === key) {
      // console.log(key)
      return person + " is " + whoppl[key];
    }
  }
}



client.on('ready', () => {
  console.log('Connected and initialized.');
});

function formatPrice(prices) {
  ret = "";
  for (var i = 0; i < (prices.length < 5 ? prices.length : 5); i++) {
    ret += prices[i].market_hash_name + " costs $" + (prices[i].price / 100) + "\n";
  }
  return ret;
}

function removeAll(str, rep) {
  while (str.includes(rep) === true) {
    str = str.replace(rep, "");
  }
  return str;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFromList(list) {
  return list[getRandomInt(0, list.length)];
}

var lastsent = Date.now();

client.on('message', message => {

  // console.log("yep")

  if (message.author.bot === true) {
    return;
  }

  var loc = message.channel;
  var msg = removeAll(message.content, "?");

  var send = function(msg, opts) {
    if (lastsent + 1000 < Date.now()) {
      lastsent = Date.now();
      loc.send(msg, opts);
    } else {

    }
  };

  if (msg.includes("trap")) {
    send('Traps? Ask Kairu about our Grade A Traps today!');
  }
  if (msg.toLowerCase() === "who am i") {
    send("None of your business.");
  }
  if (msg.toLowerCase() === "who are you" || msg.toLowerCase() === "who is bot charred") {
    send("You're fucking retarded.");
    return;
  }
  if (msg.toLowerCase() === "who is 为什么" || msg.toLowerCase() === "who is weishenme") {
    send("\"为什么\"是小孩子");
    return;
  }
  if (msg.substring(0, "who is ".length).toLowerCase() === "who is ") {
    // console.log(msg.substring("who is ".length))
    send(whois(msg.substring("who is ".length)));
  }

  if (msg.substring(0, "!priceof ".length).toLowerCase() === "!priceof ") {
    item = (msg.substring("!priceof ".length));
    community.marketSearch({
      query: item,
      appid: 730
    }, (err, items) => {
      if (err) {
        send(err.message);
      } else {
        send(formatPrice(items));
      }
    });
  }
  if (msg.substring(0, "!imgof ".length).toLowerCase() === "!imgof ") {
    item = (msg.substring("!imgof ".length));
      // console.log(item)
    if (item.toLowerCase() == "kairu") {
      send("", {
        embed: new Discord.RichEmbed().setImage("http://vignette1.wikia.nocookie.net/powerlisting/images/a/ad/Trap-image.png/revision/latest?cb=20160113212524")
      });
      return;
    } else if (item.toLowerCase() == "livid") {
      send("", {
        embed: new Discord.RichEmbed().setImage("https://s.thestreet.com/files/tsc/v2008/photos/contrib/uploads/transoceanrig_600x400.jpg")
      });
      return;
    } else if (item.toLowerCase() == "dank") {
      send("", {
        embed: new Discord.RichEmbed().setImage("http://st.motortrend.com/uploads/sites/10/2015/11/2015-nissan-juke-sl-suv-angular-front.png?interpolation=lanczos-none&fit=around|300;199")
      });
      return;
    } else if (item.toLowerCase() == "yuna") {
      send("", {
        embed: new Discord.RichEmbed().setImage("http://i.imgur.com/5vDmod7.png")
      });
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
    });
  }
  if (msg.substring(0, "!magic8 ".length).toLowerCase() === "!magic8 ") {
    var answers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    send(getRandomFromList(answers));
  }
  if (msg.substring(0, "!help".length).toLowerCase() === "!help") {
    var preargs = (msg.substring("!help".length).split(" "));
    args = [];
    for (var i = 0; i < preargs.length; i++) {
      if (preargs[i] === "") {
        //kill space
      } else {
        args.push(preargs[i]);
      }
    }
    // console.log(args)
    if (args.length === 0) {
      send("Valid commands: !help, !priceof, !imgof, who is [person], !magic8\nType \"!help help\" for more specific help.");
    } else if (args.length == 1) {
      // console.log([args[0]])
      if (helpdocs[args[0]]) {
        send(helpdocs[args[0]]);
      }
    } else {
      send("Unknown command. Type \"!help\" for help.");
    }
  }
});

client.login(fs.readFileSync('./key.txt').toString("utf-8"));
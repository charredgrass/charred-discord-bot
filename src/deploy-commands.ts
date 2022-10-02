import * as Discord from 'discord.js';
import { REST } from '@discordjs/rest';
const fs = require("fs");

let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));
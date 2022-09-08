"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));

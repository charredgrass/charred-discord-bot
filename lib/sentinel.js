const TRADING_CHANNEL = "trading";
const VOID_URLS = ["drakemoon.com/promo-code/"];
const ALLOW_MODS_VOID_URLS = false;


function msgCheck(message) {
    //Placeholders for text and shit so we don't have to keep referencing it
    let mtext = message.content;
    let mloc = message.channel;
    let mroles = message.member.roles.array();

    //Check if message contains specific things based on RegExps.
    let ret = {
        tradelink: (mtext.match(/steamcommunity\.com\/tradeoffer\/new\/(?:\?partner=[\d]+)?(?:&token=[a-zA-Z\-]+)/) ? true : false),
        roles: [],
        forbiddenurl: false,
        isMod: false,
        channel: mloc.name
    };

    for (let i = 0; i < VOID_URLS.length; i++) {
        if (mtext.match(VOID_URLS[i])) {
            ret.forbiddenurl = true;
            break; //Doesn't actually matter all that much, this is just there because it makes me feel better efficiency-wise.
        }
    }

    //Stores role names from user.
    for (let i = 0; i < mroles.length; i++) {
        ret.roles.push(mroles[i].name);
        if (mroles[i].name.includes("Mod")) {
            ret.isMod = true;
        }
    }

    return ret;
}

function msgDelete(message, rep) {
    if (rep) {
        message.channel.send(rep).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 1000 * 5);
        });
    }
    message.delete();
}


//BY MESSAGE BE PURGED
function msgCleanse(message) {
    let mdata = msgCheck(message);
    if (mdata.forbiddenurl === true) {
        if (mdata.isMod === true && ALLOW_MODS_VOID_URLS === true) {
            //Bypassing due to mod status.
        } else {
            msgDelete("Your message contains a forbidden URL.");
        }
    }
    if (mdata.channel !== TRADING_CHANNEL && mdata.tradelink === true) {
        msgDelete("Your message contains a trade link outside of #" + TRADING_CHANNEL + ".");
    }
}

module.exports = {
    msgCleanse
};
function mathify(inp) {
    while (inp.indexOf("\n") !== -1 || inp.indexOf("\r") !== -1 || inp.indexOf(" ") !== -1) {
        inp = inp.replace(/\n|\r|\t/, '').replace(/ /, "");
    }

}

function splice(text) {
    let symbols = ["+","-","*","/","%"];
    let numlits = ["1","2","3","4","5","6","7","8","9","0"];
    // let currencylits = ["$","CAD"]
    let ret = [];
    for (let i = 0; i < text.length; i++) {

    }
}

module.exports = {
    mathify
}
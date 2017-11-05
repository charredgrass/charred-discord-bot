function center(text, space) {
    if (text.length > space) return text.substring(0, space);
    let empty = space - text.length;
    return " ".repeat(Math.floor(empty / 2)) + text + " ".repeat(Math.ceil(empty / 2));
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
        if (words[currWord] == "\\n" || words[currWord] == "\n") {
            currLine--;
            currWord--;
        } else {
            if (ret[currLine].length == 0 && words[currWord].length > maxlen) {
                ret[currLine].unshift(words[currWord]);
                currWord--;
                currLine--;
            }
            if (currLL + 1 + words[currWord].length <= maxlen) { //TODO make this work with strings longer than maxlen
                ret[currLine].unshift(words[currWord]);
                currWord--;
            } else {
                currLine--;
            }
        }
    }
    while (ret[0].length == 0) {
        ret.shift();
        ret.push([]);
    }
    return ret;
}

function generateCard(lines) {
    let ret = "+----------------+</br>";
    ret += "|                |</br>";
    ret += "|" + center(lines[0], 16) + "|</br>"; //title
    ret += "|" + center(lines[1], 16) + "|</br>"; //sub-title
    ret += "|                |</br>" //spacer
    ret += "|" + center(lines[2], 16) + "|</br>"; //lines of text
    ret += "|" + center(lines[3], 16) + "|</br>";
    ret += "|" + center(lines[4], 16) + "|</br>";
    ret += "|" + center(lines[5], 16) + "|</br>";
    ret += "|" + center(lines[6], 16) + "|</br>";
    ret += "|                |</br>"; //final space
    ret += "+----------------+</br>";
    return ret;
}

function generateGrave(name, subn, lines) {
    let ret = "        ________________</br>";
    ret += "       /              \\ \\</br>";
    ret += "      /                \\ \\</br>";
    ret += "     /" + center(name, 18) + "\\ \\</br>";
    ret += "     |" + center(subn, 18) + "| |</br>";
    ret += "     |                  | |</br>";
    ret += "     |" + center(lines[0], 18) + "| |</br>";
    ret += "     |" + center(lines[1], 18) + "| |</br>";
    ret += "     |" + center(lines[2], 18) + "| |</br>";
    ret += "     |" + center(lines[3], 18) + "| |</br>";
    ret += "     |" + center(lines[4], 18) + "| |</br>";
    ret += "     |                  | |</br>";
    ret += "     |                  | |</br>";
    ret += "-------------------------------";
    return ret;
}

function load() {
    document.getElementById("grave").innerHTML = generateGrave(document.getElementById("title").value, document.getElementById("stitle").value, [document.getElementById("line1").value, document.getElementById("line2").value, document.getElementById("line3").value, document.getElementById("line4").value, document.getElementById("line5").value]);
    document.getElementById("gravejson").innerHTML = JSON.stringify({
        names: [document.getElementById("title").value.toLowerCase()],
        epit: [document.getElementById("line1").value, document.getElementById("line2").value, document.getElementById("line3").value, document.getElementById("line4").value, document.getElementById("line5").value],
        grave_name: document.getElementById("title").value,
        nick: document.getElementById("stitle").value
    }, null, 4);
}

function load2() {
    let titles = balanceText(document.getElementById("title").value, 2, 16);
    let ctext = balanceText(document.getElementById("line1").value, 5, 16);
    document.getElementById("card").innerHTML = generateCard([titles[0].join(" "), titles[1].join(" "), ctext[0].join(" "), ctext[1].join(" "), ctext[2].join(" "), ctext[3].join(" "), ctext[4].join(" ")]);
    document.getElementById("cardjson").innerHTML = JSON.stringify({
        name: [titles[0].join(" "), titles[1].join(" ")],
        text: [ctext[0].join(" "), ctext[1].join(" "), ctext[2].join(" "), ctext[3].join(" "), ctext[4].join(" ")],
    }, null, 4);
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}


// window.onLoad = () => {
//     setInterval(load, 100);
//     setInterval(load2, 100);
// };
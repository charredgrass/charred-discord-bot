function center(text, space) {
    if (text.length > space) return text.substring(0, space);
    let empty = space - text.length;
    return " ".repeat(Math.floor(empty / 2)) + text + " ".repeat(Math.ceil(empty / 2));
}

function generateGrave(name, subn, lines) {
    ret = "        ______________</br>";
    ret += "       /              \\</br>";
    ret += "      /                \\</br>";
    ret += "     /" + center(name, 18) + "\\</br>";
    ret += "     |" + center(subn, 18) + "|</br>";
    ret += "     |                  |</br>";
    ret += "     |" + center(lines[0], 18) + "|</br>";
    ret += "     |" + center(lines[1], 18) + "|</br>";
    ret += "     |" + center(lines[2], 18) + "|</br>";
    ret += "     |" + center(lines[3], 18) + "|</br>";
    ret += "     |" + center(lines[4], 18) + "|</br>";
    ret += "     |                  |</br>";
    ret += "     |                  |</br>";
    ret += "-------------------------------";
    return ret;
}

function load() {
    document.getElementById("grave").innerHTML = generateGrave(document.getElementById("title").value, document.getElementById("stitle").value, [document.getElementById("line1").value, document.getElementById("line2").value, document.getElementById("line3").value, document.getElementById("line4").value, document.getElementById("line5").value])
    document.getElementById("gravejson").innerHTML = JSON.stringify({
        names: [document.getElementById("title").value],
        epit: [document.getElementById("line1").value, document.getElementById("line2").value, document.getElementById("line3").value, document.getElementById("line4").value, document.getElementById("line5").value],
        grave_name: document.getElementById("title").value,
        nick: document.getElementById("stitle").value
    }, null, 4)
}
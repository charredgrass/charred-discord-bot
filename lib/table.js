//center(String, int)

function center(text, space) {
  if (text.length > space) return text.substring(0, space);
  let empty = space - text.length;
  return " ".repeat(Math.floor(empty / 2)) + text + " ".repeat(Math.ceil(empty / 2));
}

function alignLeft(text, space) {
  if (text.length > space) return text.substring(0, space);
  return text + " ".repeat(space - text.length);
}

function alignRight(text, space) {
  if (text.length > space) return text.substring(0, space);
  return " ".repeat(space - text.length) + text;
}

/**
 * @param {String} title
 * @param {String[]} headers
 * @param {String[][]} data
 * @param {Object} widths
 * @returns {String}
 */

function table(title, headers, data, widths) {
  let ret = "";
  ret += center(title, widths.title) + "\n";
  ret += "-".repeat(widths.title) + "\n";
  for (let i = 0; i < headers.length; i++) {
    ret += center(headers[i], widths.headers[i]);
    if (i < headers.length - 1) ret += "|";
  }
  ret += "\n";
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      ret += center(String(data[i][j]), widths.headers[j]);
      if (j < data[i].length - 1) ret += "|";
    }
    if (i < data.length) ret += "\n";
  }
  return ret;
}

module.exports = {
  table
};
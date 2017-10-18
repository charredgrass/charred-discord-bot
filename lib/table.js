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

//table(String, String[], String[][], Object)
//    "Wait, this isn't Java.""
//A function to generate a neatly formatted table.
//Note: will only appear neat if you're using const width text.
//  title: string to put at the top of the table.
//  headers: array of strings heading each col
//  data: 2D arrays of data to put in table
//  widths: Widths of each component. Ex:
//    {title:20, headers: [15, 3]}

function table(title, headers, data, widths) {
  let ret = "";
  ret += center(title, widths.title) + "\n";
  ret += "-".repeat(widths.title) + "\n";
  for (let i = 0; i < headers.length; i++) {
    ret += center(headers[i], widths.headers[i])
    if (i < headers.length - 1) ret += "|";
  }
  ret += "\n"
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      ret += center(String(data[i][j]), widths.headers[j]);
      if (j < data[i].length - 1) ret += "|";
    }
    if (i < data.length) ret += "\n"
  }
  return ret;
}

module.exports = {
  table
}
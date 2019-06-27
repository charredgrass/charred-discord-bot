
function printPlaylist(args, send, server) {
  if (server.atg === true || server.dnd === true)
  send("https://open.spotify.com/playlist/0N9UUiJHx5egqR8DJMzkXF?si=bsqFr-mCRlK00J7Mh5hiDg");
}

function currPickCreator(storageObj) {
  return (args, send, server) => {
    if (server.atg === true || server.dnd === true) {
      // let time = storageObj.time; todo this
      //eventually i'll add a timestampy thing
      let text = storageObj.text;
      if (text) {
        send("The Brick Pick is: \n" + storageObj.text);
      } else {
        send("The Brick Pick has not been set yet.");
      }
    }
  }
}

function setPickCreator(storageObj) {
  return (args, send, server, author) => {
    if (author.id === "154826263628873728") {
      storageObj.text = args[0];
    }
  }
}

module.exports = {
  printPlaylist,
  currPickCreator,
  setPickCreator
};
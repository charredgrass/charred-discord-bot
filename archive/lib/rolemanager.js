function applyRole(data, rolename) {
  let roles = data.location.guild.roles.cache;
  let role = data.location.find(())
  for (let r of roles) {
    if (r.name == rolename) {
      role = r;
      break;
    }
  }
  if (role) {
    data.member.edit({
        roles: [role]
      }).then(() => {
        data.send("Role applied.")
      })
      .catch((e) => {
        data.send("Something went wrong: " + (e.message ? e.message : "No error provided"));
      });
  } else {
    data.send("Role not found.");
  }
}

let roler = {
  handle: (data) => {
    if (data.args[1] == "makingof") {
      if (data.location.guild && data.member) {
        applyRole(data, "makingof");
      } else {
        data.send("Need to be in a server.");
      }
    } else {
      data.send("Invalid arguments");
    }
  },
  check: (args, selector, channelName) => {
    if (args[0] == "!role" && selector.frz === true) {
      return true;
    } else {
      return false;
    }
  }
}


module.exports = roler;
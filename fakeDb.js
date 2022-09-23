const fs = require("fs");
const fsPromises = require("fs").promises;
const ExpressError = require("./newError");
global.items = [];

async function loadFile() {
  path = "dataBase.json";

  data = await fsPromises.readFile(path, "utf8").catch((err) => {
    console.log(`Couldn't Read ${path}:\n ${err}`);
    return [];
  });

  return JSON.parse(data);
}

function saveFile(itemData) {
  path = "dataBase.json";

  data = JSON.stringify(itemData);
  fs.writeFile(path, data, "utf8", (err) => {
    if (err) {
      console.log(`Couldn't write to ${path}:\n ${err}`);
    }
  });
}

module.exports = { loadFile, saveFile, items };

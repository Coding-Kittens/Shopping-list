const ExpressError = require("./newError");
const db = require("./fakeDb");

async function getItemsFromDb(req, res, next) {
  try {
    await db.loadFile().then((res) => {
      db.items = res;
    });
  } catch (e) {
    console.log(e);
  }

  return next();
}

module.exports = getItemsFromDb;

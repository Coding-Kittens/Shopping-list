const express = require("express");
const db = require("./fakeDb");
const router = new express.Router();
const ExpressError = require("./newError");

//get list of items
router.get("/", (req, res, next) => {
  let items = db.items;

  try {
    return res.json(items);
  } catch (e) {
    next(e);
  }
});

//get item by name
router.get("/:name", (req, res, next) => {
  let item = {};

  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === req.params.name) {
      item = db.items[i];
      break;
    }
  }

  try {
    if (Object.keys(item).length === 0) {
      throw new ExpressError(`Item ${req.params.name} not found!`, 404);
    }
  } catch (e) {
    next(e);
  }

  return res.json(item);
});

/// Add new item
router.post("/", (req, res, next) => {
  try {
    if (req.body.name && req.body.price) {
      for (let i = 0; i < db.items.length; i++) {
        if (db.items[i].name.toLowerCase() === req.body.name.toLowerCase()) {
          throw new ExpressError(
            `Name must be Unique, an Item with the name of "${req.body.name}" already exists!`,
            400
          );
        }
      }

      num = +req.body.qty;
      if (num <= 0) {
        num = 1;
      }

      let newItem = {
        name: req.body.name,
        price: +req.body.price,
        qty: num,
      };
      db.items.push(newItem);
      db.saveFile(db.items);
      return res.status(201).json({ added: newItem });
    } else {
      throw new ExpressError(
        "There must be a name and price for the item!",
        400
      );
    }
  } catch (e) {
    next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  let item = {};

  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === req.params.name) {
      item = db.items[i];
      break;
    }
  }

  try {
    if (Object.keys(item).length > 0) {
      req.body.name ? (item.name = req.body.name) : (item.name = item.name);
      req.body.price ? (item.price = +req.body.price) : (item.price = +item.price);
      req.body.qty ? (item.qty = +req.body.qty) : (item.qty = +item.qty);
      db.saveFile(db.items);
      return res.json({ updated: item });
    } else {
      throw new ExpressError(`Item ${req.params.name} not found!`, 404);
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  try {
    let itemId = null;

    for (let i = 0; i < db.items.length; i++) {
      if (db.items[i].name === req.params.name) {
        itemId = i;
        break;
      }
    }

    if (itemId === null) {
      throw new ExpressError(`Item ${req.params.name} not found!`, 404);
    } else {
      db.items.splice(itemId, 1);
      db.saveFile(db.items);
      return res.json({ msg: "deleted item" });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

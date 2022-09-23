const express = require("express");
const ExpressError = require("./newError");
const getItemsFromDb = require("./middleware");
const itemRoutes = require("./itemRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(getItemsFromDb);
app.use("/items", itemRoutes);

//shows 404 page
app.use((req, res, next) => {
  e = new ExpressError("page not found", 404);
  next(e);
});

///shows error page
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send(err.msg);
  }
  res.send(`Something went wrong! \n ${err}`);
});

module.exports = app;

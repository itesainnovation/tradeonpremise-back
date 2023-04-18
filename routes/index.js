const express = require("express");
const routes = express.Router();

const uploadImages = require("./upload");

routes.use("/upload", uploadImages);

routes.get("/", (req, res) => {
  res.send("server on");
});

module.exports = routes;

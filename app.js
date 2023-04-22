const express = require("express");
const app = express();
const cors = require("cors");
// const path = require("path");
// const logger = require("morgan");
const bp = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:9000",
      "https://trade-on-premise-dashboard.web.app"
    ],
  })
);

app.use(
  bp.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(bp.json({ limit: "50mb" }));

app.use("/api", routes);

console.log("Connected");
app.listen(8080, () => console.log("start"));

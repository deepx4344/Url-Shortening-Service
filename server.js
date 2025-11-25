const express = require("express");
const app = express();
const connectDB = require("./db");
const getShortUrl = require("./Controllers/getShortUrl");
const getLongUrl = require("./Controllers/getLongUrl");
require("dotenv").config();
const port = process.env.PORT || 3000;

// app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(express.static("static"));

app.get("/:id", getLongUrl);

app.post("/api/shortener", getShortUrl);

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server started at port", port);
  });
});

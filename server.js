const assert = require("assert");
const express = require("express");
const app = express();
const passport = require("passport");

// body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB setups
const MongoClient = require("mongodb").MongoClient;
const dbURL = require("./config/keys").mongoURL;
DB = null;
MongoClient.connect(
  dbURL,
  { useNewUrlParser: true },
  function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to Mongo server");
    DB = client.db("wppsocial");
  }
);

// Passport middleware
app.use(passport.initialize());

// Passport Config loads our JWT strategy
require("./config/passport")(passport);

// add routes

const users = require("./routes/api/users.js");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts.js");
const portfolio = require("./routes/api/portfolio.js");

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profiles", profiles);
app.use("/portfolio", portfolio);

// Setup port and listen
const port = process.env.port || 5000;

app.listen(port, () =>
  console.log(`MERN beast is waiting for you on port ${port}. Watch out!`)
);

const assert = require("assert");
const express = require("express");
const app = express();
const passport = require("passport");

// DB setup
const MongoClient = require("mongodb").MongoClient;
const dbURL = require("./config/keys").mongoURL;
DBprofiles = null;
DBusers = null;

DB = null;
MongoClient.connect(
  dbURL,
  { useNewUrlParser: true },
  function(err, client) {
    assert.equal(null, err);
    console.log("DEVCONNECT: Connected successfully to Mongo server");
    DB = client.db("wppsocial");

    DBprofiles = DB.collection("profiles");
    DBusers = DB.collection("users");
    assert.notEqual(null, DBusers);
  }
);

// body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config loads our JWT strategy
require("./config/passport")(passport);

console.log("DEVCONNECT: Middleware established");

// add routes
{
  const users = require("./routes/api/users.js");
  const profile = require("./routes/api/profile");
  const posts = require("./routes/api/posts.js");
  const portfolio = require("./routes/api/portfolio.js");

  app.use("/api/users", users);
  app.use("/api/posts", posts);
  app.use("/api/profile", profile);
  app.use("/portfolio", portfolio);
}

// Setup port and listen
const port = process.env.port || 5001;

app.listen(port, () =>
  console.log(`DEVCONNECT: waiting for you on port ${port}`)
);

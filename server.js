const assert = require('assert');
const express = require("express");
const app = express();

// DB setups
const MongoClient = require('mongodb').MongoClient;
const dbURL = require("./config/keys").mongoURL;
MongoClient.connect(dbURL, {useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to Mongo server");

  const db = client.db("wppsocial");
})

// add routes
app.get('/', (req, res) => res.send('Hi there'))

const users = require('./routes/api/users.js')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posts.js')

app.use('/api/users', users)
app.use('/api/posts', posts)
app.use('/api/profiles', profiles)

// Setup port and listen
const port = process.env.port || 5000;

app.listen(port, () =>
  console.log(`MERN beast is waiting for you on port ${port}. Watch out!`)
);

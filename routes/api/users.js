const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/test
// @desc    Tests users/auth route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users test working" }));
//router.get('/register', (req, res) => res.json({ msg: 'Users reg working' }))

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const users = DB.collection("users");
  users
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log.err);

  const avatar = gravatar.url(
    email,
    {
      //req.body.email, {
      s: "200", //size
      d: "mm",
      protocol: "https"
    },
    cb => console.log(avatar)
  );

  // create new user in DB
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    avatar, // or avatar: avatar
    password: req.body.password // gets replaced in bcrypt
  };

  // DJM this bcrypt isn't working now. needs debugging
  // magic stuff to convert pwd -> hashval
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
    });
  });
  users
    .insertOne(newUser)
    .then(user => res.json(user))
    .catch(err => console.log.err);
});

// @route   GET api/users/login
// @desc    Login user / Returns JWT token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;

  const users = DB.collection("users");
  users.findOne({ email }).then(user => {
    if (!user) {
      // NOT FOUND
      return res.status(404).json({ email: "User not found" });
    }
    console.log(user);
    //DJM for some reason the bcrypt isn't working now
    // bcrypt.compare(pwd, user.password).then(isMatch => {
    //   if (isMatch) {
    //DJM
    if (pwd == user.password) {
      // if pwd match...
      //DJM res.json({ msg: "Success" });
      const payload = {
        // ...build token..
        // This can be any package of information
        id: user.id,
        name: user.name,
        avatar: user.avatar
      };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }); // 3600 = 1 hour
      console.log(token);
    } else {
      return res.status(400).json({ password: "Password incorrect" });
    }
    //});
  });
});

// @route   GET api/users/current
// @desc    Return curr user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ User: req.user.name, Email: req.user.email });
  }
);
module.exports = router;

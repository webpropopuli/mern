const express = require('express')
const router = express.Router()
const gravatar= require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/users/test
// @desc    Tests users/auth route
// @access  Public
router.get('/test', (req, res)  => res.json({msg: 'Users test working'}))
//router.get('/register', (req, res) => res.json({ msg: 'Users reg working' }))

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  //console.log(req)
  //console.log(res)
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  users =  DB.collection('users')
  users.findOne({ email: req.body.email }) 
    .then(user => {
      if (user) {
        errors.email = 'Email already exists'
        return res.status(400).json(errors)
      }
      } )
    .catch(err => console.log.err)    

    const avatar = gravatar.url("webpropopuli@gmail.com" , {//req.body.email, {
        s: '200', //size
        d: 'mm',
        protocol: 'https'
      }, cb => console.log(avatar))
      
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,   // or avatar: avatar
        password: req.body.password   // gets replaced in bcrypt
      }

      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) 
            throw (err)
          newUser.password = hash
          
        })
      })
      users.insertOne(newUser)
        .then(user => res.json(user))
        .catch(err => console.log.err)

    })


module.exports = router;
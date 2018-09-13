const express = require('express')
const router = express.Router()
const gravatar= require('gravatar')
const bcrypt = require('bcryptjs')

const collection = db.collection('users');

// @route   GET api/uesrs/test
// @desc    Tests users/auth route
// @access  Public
router.get('/test', (req, res)  => res.json({msg: 'Users working'}))

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('register', (req, res) => {
  db.collection('users').findOne({ email: req.body.email}, )
  .then(user => {
    if(user) {
      return res.status(400).json({email: 'Email already exists'})
    } 
    else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        d: 'mm',   // default
        r: 'pg'   //rating
      })
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,   // or avatar: avatar
        password: req.body.password
      }

      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err
          newUser.password = hash
          
        })
      })
      db.collection('users').addOne(newUser)
        .then(user => res.json(user))
        .catch(err => console.log.err)

      }
    })
  })


module.exports = router;
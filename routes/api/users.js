const express = require('express')
const router = express.Router()

// @route   GET api/uesrs/test
// @desc    Tests users/auth route
// @access  Public
router.get('/test', (req, res)  => res.json({msg: 'Users working'}))

module.exports = router;
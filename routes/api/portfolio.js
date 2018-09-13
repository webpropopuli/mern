const express = require('express')
const router = express.Router()

// @route   GET portfolio/test
// @desc    Portfolio route
// @access  Private
router.get('/', (req, res) => res.json({ msg: 'Portfolio working' }))

module.exports = router;
const express = require('express')
const pool = require('../connect');
const router = express.Router();

const {signup, signin, isSignedIn} = require('../controllers/auth');

router.post('/signup', signup)
router.post('/authenticate', signin)

module.exports = router
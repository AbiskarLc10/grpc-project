const express = require('express');
const { SignUpAuthor } = require('../Controllers/author-controllers');
const router = express.Router();



router.route("/sign-up").post(SignUpAuthor);
router.route("/sign-in").post()



module.exports = router;